import { NextResponse } from "next/server";
import { generateHeadshotKontext } from "@/app/lib/falKontext";
import { generateHeadshotSD15 } from "@/app/lib/cloudflareSD15";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { checkGenerationEligibility, recordSuccessfulGeneration, FREE_GENERATION_CAP } from "@/app/lib/generationGate";
import { checkHeadshotDailyCap, recordHeadshotDailyUsage, headshotDailyCapResponse } from "@/app/lib/headshotDailyCap";
import { processGenerationOutput } from "@/app/lib/generationOutput";
import { capReachedResponse } from "@/app/lib/capReachedResponse";
import { prisma } from "@/app/lib/prisma";

const TOOL_ID = "headshot";
const DEBUG_GENERATION = process.env.DEBUG_GENERATION === "true";

// ── Tier configurations ──────────────────────────────────────────────────────
// Anonymous → Cloudflare SD1.5 img2img (free within daily Neuron allowance).
//   15 steps calibrated for free tier speed; SD1.5 max is 20.
// Logged-in → fal.ai Kontext [dev] (billed ~$0.015/image).
//   28 steps = Kontext dev default, full quality for stored clean download.
const ANON_TIER_CONFIG = {
  steps: 15,   // SD1.5 img2img
  estimatedNeurons: 0,
} as const;

const PAID_TIER_CONFIG = {
  steps: 28,   // fal.ai Kontext dev
  estimatedNeurons: 0,
} as const;

// ── Neuron budget safety ─────────────────────────────────────────────────────
// fal.ai is billed per-image, not Cloudflare Neurons — estimatedNeurons=0 so
// this threshold is never reached. Kept in place for future model switches.
const DAILY_NEURON_THRESHOLD = 8_000;

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

async function checkNeuronBudget(): Promise<{ ok: boolean }> {
  const row = await prisma.dailyNeuronUsage.findUnique({ where: { usageDate: todayUtc() } });
  const used = row?.neuronCount ?? 0;
  if (used >= DAILY_NEURON_THRESHOLD) {
    console.warn(`[headshot] daily Neuron cap reached: ${used}/${DAILY_NEURON_THRESHOLD}`);
    return { ok: false };
  }
  return { ok: true };
}

async function recordNeuronUsage(neurons: number): Promise<void> {
  const usageDate = todayUtc();
  await prisma.dailyNeuronUsage.upsert({
    where: { usageDate },
    create: { usageDate, neuronCount: neurons },
    update: { neuronCount: { increment: neurons } },
  });
  if (DEBUG_GENERATION) console.log(`[headshot] recorded ${neurons} Neurons for ${usageDate}`);
}

// ── IP rate limiting ─────────────────────────────────────────────────────────
const IP_DAILY_FREE_CAP = 10; // max free generations per IP per day

function getClientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

async function checkIpDailyLimit(ip: string): Promise<{ allowed: boolean }> {
  if (ip === "unknown") return { allowed: true }; // can't identify, don't block
  const usageDate = todayUtc();
  const row = await prisma.ipDailyUsage.findUnique({ where: { ipAddress_usageDate: { ipAddress: ip, usageDate } } });
  if (!row || row.count < IP_DAILY_FREE_CAP) return { allowed: true };
  return { allowed: false };
}

async function incrementIpDailyUsage(ip: string): Promise<void> {
  if (ip === "unknown") return;
  const usageDate = todayUtc();
  await prisma.ipDailyUsage.upsert({
    where: { ipAddress_usageDate: { ipAddress: ip, usageDate } },
    create: { ipAddress: ip, usageDate, count: 1 },
    update: { count: { increment: 1 } },
  });
}

// ── Three-layer anonymous gating ─────────────────────────────────────────────
//
// Layer 1 — AnonymousUsage (cookie, checked FIRST above): user-facing free cap
//   at FREE_GENERATION_CAP=6. This is the only place "6 free generations" is
//   enforced. Cleared by clearing cookies — intentional, low-friction.
//
// Layer 2 — FreeGenerationLog (IP + fingerprint): abuse-only gate. Only fires
//   when someone clears cookies repeatedly. Threshold is 2× the free cap so
//   normal users never hit it — only serial cookie-clearers do.
//
// Layer 3 — IpDailyUsage (IP only): hard per-IP daily cap. Catches VPN/proxy
//   abuse where fingerprint changes. Cap=10 per day, resets at UTC midnight.
//
const FINGERPRINT_ABUSE_CAP = FREE_GENERATION_CAP * 2; // 12 — abuse-only, not user-facing

async function checkFingerprintCap(ip: string, fingerprintHash: string): Promise<{ allowed: boolean }> {
  if (!fingerprintHash) return { allowed: true };
  const row = await prisma.freeGenerationLog.findUnique({
    where: { ipAddress_fingerprintHash: { ipAddress: ip, fingerprintHash } },
  });
  if (!row || row.count < FINGERPRINT_ABUSE_CAP) return { allowed: true };
  return { allowed: false };
}

async function incrementFingerprintCount(ip: string, fingerprintHash: string): Promise<void> {
  if (!fingerprintHash) return;
  await prisma.freeGenerationLog.upsert({
    where: { ipAddress_fingerprintHash: { ipAddress: ip, fingerprintHash } },
    create: { ipAddress: ip, fingerprintHash, count: 1 },
    update: { count: { increment: 1 }, lastSeen: new Date() },
  });
}

// ── Style prompts — SD1.5 (anonymous free tier) ──────────────────────────────
// SD1.5 img2img uses keyword-rich descriptive prompts. Identity clause is
// appended automatically in cloudflareSD15.ts — don't add it here.
const STYLE_PROMPTS_SD15: Record<string, string> = {
  corporate: "professional corporate headshot, business suit, neutral grey studio background, professional studio lighting, LinkedIn profile photo",
  creative:  "creative professional headshot, modern colorful background, artistic lighting, portfolio photo",
  executive: "executive portrait, formal dark suit, dramatic lighting, prestigious office background, CEO portrait",
  casual:    "casual professional headshot, smart casual attire, natural background, friendly expression",
  linkedin:   "LinkedIn profile headshot, business casual attire, clean neutral background, confident approachable smile, professional studio lighting",
  cv:         "CV resume headshot, formal business suit, plain white background, front-facing portrait, sharp studio lighting",
  freelancer: "freelancer profile photo, smart casual attire, home office background, relaxed confident expression",
  fiverr:     "Fiverr gig profile photo, bright colorful background, casual professional, energetic approachable expression",
  upwork:     "Upwork profile headshot, clean white background, professional casual attire, warm approachable smile",
  github:     "GitHub developer profile photo, casual tech attire, dark muted background, relaxed confident look",
  youtube:    "YouTube channel profile photo, vibrant bright background, content-creator energy, casual stylish attire",
  facebook:   "Facebook profile photo, warm natural background, casual friendly attire, genuine warm smile",
  instagram:  "Instagram profile photo, aesthetic lifestyle background, fashion-forward casual attire, confident stylish look",
  twitter:    "Twitter X profile photo, minimal clean background, smart casual attire, confident thought-leader expression",
  speaker:    "keynote speaker portrait, dark stage background, professional attire, commanding confident pose",
  ceo:        "CEO executive portrait, dark premium background, power suit, commanding authoritative expression, dramatic studio lighting",
  author:     "author portrait, warm library bookshelf background, smart casual attire, intellectual thoughtful expression",
  doctor:     "doctor portrait, clinical white background, white coat, professional trustworthy expression",
  lawyer:     "lawyer portrait, dark wood-paneled office background, formal suit and tie, serious authoritative expression",
  teacher:    "teacher portrait, bright classroom background, smart casual attire, warm encouraging expression",
  student:    "student portrait, campus background, smart casual attire, bright approachable expression",
  passport:         "passport photo, pure white background, neutral front-facing pose, no shadows, formal attire, official document photo",
  "corporate-team": "corporate team headshot, uniform neutral background, professional business attire, team photo aesthetic",
  farmer:           "farmer portrait, outdoor natural setting, practical work attire, warm natural lighting, approachable expression",
  "office-support": "office support staff headshot, bright clean office background, smart casual business attire, friendly approachable expression",
  "tea-boy":        "service staff portrait, casual warm background, neat uniform, warm approachable expression",
  foreman:          "foreman supervisor portrait, industrial office background, professional work attire, authoritative approachable expression",
};

// ── Style prompts — Kontext dev (logged-in paid tier) ────────────────────────
// Kontext [dev] uses direct editing instructions. Explicit removal phrasing
// is required for light/white targets that could match an outdoor sky/water.
const STYLE_PROMPTS_KONTEXT: Record<string, string> = {
  corporate: "Completely replace the existing background with a neutral grey professional studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add professional studio lighting and business suit attire if not already wearing one.",
  creative:  "Completely replace the existing background with a modern colorful artistic backdrop. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be artistic and flattering.",
  executive: "Completely replace the existing background with a dark premium executive office interior. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add dramatic studio lighting and make the attire look like a formal power suit.",
  casual:    "Replace the existing background with a warm natural park or garden setting with soft greenery. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The attire should look smart casual and the expression friendly.",
  linkedin:
    "Completely replace the existing background with a clean neutral grey professional studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add professional studio lighting and make the clothing look like business casual attire if not already.",
  cv:
    "Completely replace the existing background — remove any outdoor scenery, sky, water, or natural elements entirely — with a plain white or light grey studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be sharp and professional. Make the attire look formal business if not already.",
  freelancer:
    "Completely replace the existing background with a tasteful blurred home office or modern workspace interior. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The attire should look smart casual and relaxed.",
  fiverr:
    "Completely replace the existing background with a bright bold solid-color or gradient backdrop — vivid and energetic. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The overall look should feel approachable and energetic, suitable for a freelance gig profile.",
  upwork:
    "Completely replace the existing background — remove any outdoor scenery, sky, water, or natural elements entirely — with a clean white studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be warm and approachable. The attire should look professional casual.",
  github:
    "Completely replace the existing background with a dark muted tech-style studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The look should be relaxed and confident, suitable for a developer profile.",
  youtube:
    "Completely replace the existing background with a vibrant creator-style colored backdrop. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The styling should feel casual and energetic, suitable for a YouTube channel profile.",
  facebook:
    "Replace the existing background with a different warm natural outdoor park or garden setting with trees and soft sunlight. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be warm and natural. The attire should look casual and friendly.",
  instagram:
    "Completely replace the existing background with an aesthetic soft-bokeh studio backdrop with warm blurred tones. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The look should feel stylish and confident.",
  twitter:
    "Completely replace the existing background — remove any outdoor scenery, sky, water, or natural elements entirely — with a minimal clean white or light grey studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be clean and modern. The attire should look smart casual.",
  speaker:
    "Completely replace the existing background with a dark stage or auditorium background with dramatic rim lighting. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The attire should look professional and commanding.",
  ceo:
    "Completely replace the existing background with a dark premium studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add dramatic studio lighting to convey authority. The attire should look like a power suit or executive business wear.",
  author:
    "Completely replace the existing background with a warm bookshelf or library interior. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be warm and intellectual. The attire should look smart casual or academic.",
  doctor:
    "Completely replace the existing background — remove any outdoor scenery, sky, water, boats, or natural elements entirely — with a solid clean white clinical hospital background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add a white medical coat over their clothing. The expression should look professional and trustworthy.",
  lawyer:
    "Completely replace the existing background with a dark wood-paneled law office interior. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The attire should look like a formal suit, appropriate for a legal professional.",
  teacher:
    "Completely replace the existing background with a bright classroom interior with a chalkboard or whiteboard visible. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be warm and encouraging. The attire should look smart casual.",
  student:
    "Completely replace the existing background with a university library interior or bright classroom setting. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be bright and youthful. The attire should look casual student wear.",
  passport:
    "Completely replace the existing background — remove any outdoor scenery, sky, water, boats, or natural elements entirely — with a perfectly flat plain white background with no shadows, patterns, or textures whatsoever. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting must be flat, even, and shadowless with the face centered and front-facing. This should look exactly like an official passport or ID photo.",
  "corporate-team":
    "Completely replace the existing background with a uniform neutral grey studio background suitable for a corporate team photo set. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be clean and professional. The attire should look like formal business wear.",
  farmer:
    "Replace the existing background with an outdoor farm or agricultural field setting — crops, soil, or farmland visible — with warm natural sunlight. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should feel like warm natural daylight. The attire can be practical outdoor or farming clothing.",
  "office-support":
    "Completely replace the existing background with a bright modern office interior with desks or equipment visible. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be clean office lighting. The attire should look like smart casual business wear.",
  "tea-boy":
    "Completely replace the existing background with a warm café or hospitality service interior. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The look should be neat and approachable, with clean professional service attire.",
  foreman:
    "Completely replace the existing background with an industrial workshop interior or construction site office. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be practical and realistic. The attire should look like professional supervisor or foreman work wear.",
};

function promptSD15(style: string): string {
  const key = style.trim().toLowerCase();
  return STYLE_PROMPTS_SD15[key] ?? STYLE_PROMPTS_SD15.linkedin;
}

function promptKontext(style: string): string {
  const key = style.trim().toLowerCase();
  return STYLE_PROMPTS_KONTEXT[key] ?? STYLE_PROMPTS_KONTEXT.linkedin;
}

function unavailable() {
  return NextResponse.json({ error: "Preview generation temporarily unavailable" }, { status: 200 });
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const anonId = await verifyAnonId(readCookie(request.headers.get("cookie"), ANON_ID_COOKIE));
  const ip = getClientIp(request);

  // ── Cookie-based cap (primary gate) ────────────────────────────────────────
  const gate = await checkGenerationEligibility({ anonId, userId });
  if (!gate.allowed) {
    return capReachedResponse(userId);
  }

  // ── Logged-in users: daily headshot cap to control Neuron cost ─────────────
  if (userId) {
    const dailyGate = await checkHeadshotDailyCap(userId);
    if (!dailyGate.allowed) return headshotDailyCapResponse();
  }

  // ── Anonymous users: layered abuse checks ──────────────────────────────────
  let fingerprintHash = "";
  let style = "linkedin";
  let imageDataUrl = "";

  try {
    const body = await request.json();
    style = typeof body?.style === "string" && body.style.trim() ? body.style : "linkedin";
    imageDataUrl = typeof body?.image === "string" ? body.image : "";
    fingerprintHash = typeof body?.fp === "string" ? body.fp.slice(0, 64) : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!userId) {
    // IP daily limit — catches fingerprint-spoofing at the network level
    const ipGate = await checkIpDailyLimit(ip);
    if (!ipGate.allowed) {
      return NextResponse.json(
        { error: "cap-reached", message: `Too many free previews from this network today. Sign in to continue.` },
        { status: 429 }
      );
    }

    // Fingerprint + IP combined cap
    if (fingerprintHash) {
      const fpGate = await checkFingerprintCap(ip, fingerprintHash);
      if (!fpGate.allowed) {
        return NextResponse.json(
          { error: "cap-reached", message: `You've used all ${FREE_GENERATION_CAP} free previews — sign in to continue.` },
          { status: 429 }
        );
      }
    }

    // Neuron budget safety — free tier only
    const budget = await checkNeuronBudget();
    if (!budget.ok) {
      return NextResponse.json(
        {
          error: "budget-reached",
          message: "Free previews are fully booked for today — check back tomorrow, or sign in for HD access.",
        },
        { status: 503 }
      );
    }
  }

  // ── Provider branch: Cloudflare SD1.5 (anon) vs fal.ai Kontext (logged-in) ─
  let result: { image?: string; error?: string };

  if (userId) {
    // Logged-in: fal.ai Kontext dev — high quality, stored as clean version for HD download
    if (!process.env.FAL_AI_API_KEY) return unavailable();
    const prompt = promptKontext(style);
    if (DEBUG_GENERATION) {
      console.log("[headshot] provider: fal-kontext | style:", style, "| steps:", PAID_TIER_CONFIG.steps);
      console.log("[headshot] prompt:", prompt);
    }
    result = await generateHeadshotKontext({ imageDataUrl, prompt, steps: PAID_TIER_CONFIG.steps });
  } else {
    // Anonymous: Cloudflare SD1.5 img2img — free within daily Neuron allowance
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!accountId || !apiToken) return unavailable();
    const prompt = promptSD15(style);
    if (DEBUG_GENERATION) {
      console.log("[headshot] provider: cloudflare-sd15 | style:", style, "| steps:", ANON_TIER_CONFIG.steps);
      console.log("[headshot] prompt:", prompt);
    }
    result = await generateHeadshotSD15({ accountId, apiToken, imageDataUrl, prompt, steps: ANON_TIER_CONFIG.steps });
  }

  if (!result.image) {
    if (result.error === "Invalid image") return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    return unavailable();
  }

  let output;
  try {
    output = await processGenerationOutput({ rawDataUrl: result.image, toolId: TOOL_ID, storeClean: !!userId });
  } catch (err) {
    console.error("[headshot] processGenerationOutput failed:", err);
    return unavailable();
  }

  const { generationId } = await recordSuccessfulGeneration({
    toolId: TOOL_ID,
    imageUrl: output.previewUrl,
    cleanImageUrl: output.cleanUrl,
    userId,
    anonId,
  });

  if (userId) {
    await recordHeadshotDailyUsage(userId);
  } else {
    // Increment IP and fingerprint counters for anonymous user
    await Promise.all([
      incrementIpDailyUsage(ip),
      fingerprintHash ? incrementFingerprintCount(ip, fingerprintHash) : Promise.resolve(),
      recordNeuronUsage(ANON_TIER_CONFIG.estimatedNeurons),
    ]);
  }

  return NextResponse.json({ image: output.previewUrl ?? output.previewDataUrl, generationId });
}
