import { NextResponse } from "next/server";
import { generateHeadshotFlux } from "@/app/lib/cloudflareHeadshotFlux";
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
// flux-2-dev input_image_0 must be < 512x512 (per Cloudflare docs) — that
// constrains the practical max output too. Free tier uses fewer steps to
// keep Neuron cost predictable; paid/HD uses more steps for better quality.
const FREE_TIER_CONFIG = {
  width: 512,
  height: 512,
  steps: 15,
  estimatedNeurons: 844, // ~844 Neurons at 512x512 + 15 steps
} as const;

const PAID_TIER_CONFIG = {
  width: 512,
  height: 512,
  steps: 28,
  estimatedNeurons: 1600, // higher step count, same resolution limit
} as const;

// ── Neuron budget safety ─────────────────────────────────────────────────────
// If today's free-tier Neuron spend exceeds this threshold, stop serving free
// generations for the rest of the UTC day. Paid generations are never blocked.
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

// ── Fingerprint + IP combined tracking ──────────────────────────────────────
const FINGERPRINT_FREE_CAP = FREE_GENERATION_CAP; // same 6-generation limit

async function checkFingerprintCap(ip: string, fingerprintHash: string): Promise<{ allowed: boolean }> {
  if (!fingerprintHash) return { allowed: true };
  const row = await prisma.freeGenerationLog.findUnique({
    where: { ipAddress_fingerprintHash: { ipAddress: ip, fingerprintHash } },
  });
  if (!row || row.count < FINGERPRINT_FREE_CAP) return { allowed: true };
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

// ── Style prompts ────────────────────────────────────────────────────────────
const BASE = "Take the person in the reference image and restyle them as";
const PRESERVE = "Preserve their exact face, identity, and gender.";

const HEADSHOT_STYLE_PROMPTS: Record<string, string> = {
  // legacy ids kept for backward compat
  corporate: `${BASE} a professional corporate headshot: business suit, neutral grey studio background, professional studio lighting, LinkedIn profile photo. ${PRESERVE}`,
  creative:  `${BASE} a creative professional headshot: modern colorful background, artistic lighting, portfolio photo. ${PRESERVE}`,
  executive: `${BASE} an executive portrait: formal dark suit, dramatic lighting, prestigious background, CEO photo. ${PRESERVE}`,
  casual:    `${BASE} a casual professional headshot: smart casual attire, natural background, friendly expression. ${PRESERVE}`,

  // Social & Platform
  linkedin:   `${BASE} a LinkedIn profile headshot: business casual attire, clean neutral background, confident approachable smile, professional studio lighting. ${PRESERVE}`,
  cv:         `${BASE} a formal CV / resume headshot: formal business suit, plain white or light grey background, front-facing, sharp studio lighting. ${PRESERVE}`,
  freelancer: `${BASE} a freelancer profile photo: smart casual attire, gradient or home-office background, relaxed confident expression. ${PRESERVE}`,
  fiverr:     `${BASE} a Fiverr gig profile photo: bright colorful background, casual professional, energetic and approachable expression. ${PRESERVE}`,
  upwork:     `${BASE} an Upwork profile headshot: clean white background, professional casual attire, warm approachable smile. ${PRESERVE}`,
  github:     `${BASE} a GitHub developer profile photo: casual tech-style attire, dark or muted tech-toned background, relaxed confident look. ${PRESERVE}`,
  youtube:    `${BASE} a YouTube channel profile photo: vibrant bright background, expressive content-creator energy, casual stylish attire. ${PRESERVE}`,
  facebook:   `${BASE} a Facebook profile photo: warm natural background, casual friendly attire, genuine warm smile. ${PRESERVE}`,
  instagram:  `${BASE} an Instagram profile photo: aesthetic lifestyle background, fashion-forward casual attire, confident stylish look. ${PRESERVE}`,
  twitter:    `${BASE} an X / Twitter profile photo: minimal clean background, smart casual attire, confident thought-leader expression. ${PRESERVE}`,

  // By Profession
  speaker:    `${BASE} a keynote speaker portrait: dark stage-like background, professional attire, commanding confident pose. ${PRESERVE}`,
  ceo:        `${BASE} a CEO executive portrait: dark premium background, power suit or formal attire, commanding authoritative expression, dramatic lighting. ${PRESERVE}`,
  author:     `${BASE} an author portrait: warm library or bookshelf background, smart casual attire, intellectual thoughtful expression. ${PRESERVE}`,
  doctor:     `${BASE} a doctor portrait: clinical white background, white coat, professional and trustworthy expression. ${PRESERVE}`,
  lawyer:     `${BASE} a lawyer portrait: dark wood-paneled office background, formal suit and tie, serious authoritative expression. ${PRESERVE}`,
  teacher:    `${BASE} a teacher portrait: bright classroom-style background, smart casual attire, warm encouraging expression. ${PRESERVE}`,
  student:    `${BASE} a student portrait: campus-style background, smart casual youthful attire, bright approachable expression. ${PRESERVE}`,

  // Special Purpose
  passport:          `${BASE} a passport-style portrait: pure white background, neutral front-facing pose, no harsh shadows, formal attire. ${PRESERVE}`,
  "corporate-team":  `${BASE} a corporate team headshot: uniform neutral background, professional business attire, consistent team-photo aesthetic. ${PRESERVE}`,
  farmer:            `${BASE} a farmer portrait: outdoor natural setting, practical work attire, warm natural lighting, approachable expression. ${PRESERVE}`,
  "office-support":  `${BASE} an office support staff headshot: bright clean office background, smart casual or business attire, friendly approachable expression. ${PRESERVE}`,
  "tea-boy":         `${BASE} a service staff portrait: casual warm service-setting background, neat uniform or smart casual, warm approachable expression. ${PRESERVE}`,
  foreman:           `${BASE} a foreman or supervisor portrait: industrial or office background, safety-conscious professional attire, authoritative yet approachable expression. ${PRESERVE}`,
};

function promptForStyle(style: string): string {
  const key = style.trim().toLowerCase();
  return HEADSHOT_STYLE_PROMPTS[key] ?? HEADSHOT_STYLE_PROMPTS.linkedin;
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

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return unavailable();

  const cfg = FREE_TIER_CONFIG; // paid HD tier wired in download route, not here

  if (DEBUG_GENERATION) {
    console.log("[headshot] style:", style, "steps:", cfg.steps, "size:", cfg.width);
  }

  const result = await generateHeadshotFlux({
    accountId,
    apiToken,
    prompt: promptForStyle(style),
    imageDataUrl,
    width: cfg.width,
    height: cfg.height,
    steps: cfg.steps,
  });

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
      recordNeuronUsage(cfg.estimatedNeurons),
    ]);
  }

  return NextResponse.json({ image: output.previewUrl ?? output.previewDataUrl, generationId });
}
