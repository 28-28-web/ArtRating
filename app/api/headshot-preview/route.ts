import { NextResponse } from "next/server";
import { generateHeadshotKontext } from "@/app/lib/falKontext";
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
// fal.ai Kontext [dev]: num_inference_steps default is 28 (paid).
// Free tier uses 20 steps for cost control; paid/HD uses full 28.
// Billing is per-image on fal.ai (~$0.015/image), not Cloudflare Neurons.
const FREE_TIER_CONFIG = {
  steps: 20,
  estimatedNeurons: 0,
} as const;

const PAID_TIER_CONFIG = {
  steps: 28,
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
// Kontext [dev] uses direct editing instructions, not descriptive keywords.
// Pattern: "Change the background to X. Keep the person's face, identity,
// gender, and features exactly the same — do not change who they are. [attire/lighting]"
const HEADSHOT_STYLE_PROMPTS: Record<string, string> = {
  // legacy ids kept for backward compat
  corporate: "Change the background to a neutral grey studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add professional studio lighting and business suit attire if not already wearing one.",
  creative:  "Change the background to a modern colorful artistic backdrop. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be artistic and flattering.",
  executive: "Change the background to a dark premium executive office background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add dramatic studio lighting and make the attire look like a formal power suit.",
  casual:    "Change the background to a natural, warm lifestyle setting. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The attire should look smart casual and the expression friendly.",

  // Social & Platform
  linkedin:
    "Change the background to a clean neutral grey studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add professional studio lighting and make the clothing look like business casual attire if not already.",
  cv:
    "Change the background to a plain white or light grey background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be sharp and professional. Make the attire look formal business if not already.",
  freelancer:
    "Change the background to a tasteful blurred home office or modern workspace. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The attire should look smart casual and relaxed.",
  fiverr:
    "Change the background to a bright, colorful, energetic backdrop. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The overall look should feel approachable and energetic, suitable for a freelance gig profile.",
  upwork:
    "Change the background to a clean white or light neutral background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be warm and approachable. The attire should look professional casual.",
  github:
    "Change the background to a dark, muted, tech-friendly background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The look should be relaxed and confident, suitable for a developer profile.",
  youtube:
    "Change the background to a vibrant, bright, creator-style backdrop. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The styling should feel casual and energetic, suitable for a YouTube channel profile.",
  facebook:
    "Change the background to a warm natural outdoor or lifestyle setting. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be warm and natural. The attire should look casual and friendly.",
  instagram:
    "Change the background to an aesthetic lifestyle backdrop with soft bokeh and warm tones. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The look should feel stylish and confident.",
  twitter:
    "Change the background to a minimal clean white or light grey background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be clean and modern. The attire should look smart casual.",

  // By Profession
  speaker:
    "Change the background to a dark stage or auditorium background with dramatic rim lighting. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The attire should look professional and commanding.",
  ceo:
    "Change the background to a dark premium studio background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add dramatic studio lighting to convey authority. The attire should look like a power suit or executive business wear.",
  author:
    "Change the background to a warm library or bookshelf setting. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be warm and intellectual. The attire should look smart casual or academic.",
  doctor:
    "Change the background to a clean clinical white or light blue background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. Add a white lab coat if not already wearing one. The expression should look professional and trustworthy.",
  lawyer:
    "Change the background to a dark wood-paneled office or law library background. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The attire should look like a formal suit, appropriate for a legal professional.",
  teacher:
    "Change the background to a bright classroom or educational setting. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be warm and encouraging. The attire should look smart casual.",
  student:
    "Change the background to a university campus, library, or bright classroom setting. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be bright and youthful. The attire should look casual student wear.",

  // Special Purpose
  passport:
    "Change the background to a plain white background with absolutely no shadows, patterns, or textures. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting must be flat, even, and shadowless with the face centered and front-facing. This should look exactly like an official passport or ID photo.",
  "corporate-team":
    "Change the background to a uniform neutral grey or white studio background suitable for a corporate team photo set. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be clean and professional. The attire should look like formal business wear.",
  farmer:
    "Change the background to an outdoor natural farm or open field setting with natural sunlight. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should feel like warm natural daylight. The attire can be practical outdoor or farming clothing.",
  "office-support":
    "Change the background to a bright modern office environment. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be clean office lighting. The attire should look like smart casual business wear.",
  "tea-boy":
    "Change the background to a warm, welcoming hospitality or service environment. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The look should be neat and approachable, with clean professional service attire.",
  foreman:
    "Change the background to an industrial workshop or construction site office environment. Keep the person's face, identity, gender, and features exactly the same — do not change who they are. The lighting should be practical and realistic. The attire should look like professional supervisor or foreman work wear.",
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

  if (!process.env.FAL_AI_API_KEY) return unavailable();

  const cfg = userId ? PAID_TIER_CONFIG : FREE_TIER_CONFIG;

  const prompt = promptForStyle(style);

  if (DEBUG_GENERATION) {
    console.log("[headshot] style:", style, "steps:", cfg.steps, "provider: fal-kontext");
    console.log("[headshot] prompt:", prompt);
  }

  const result = await generateHeadshotKontext({
    imageDataUrl,
    prompt,
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
