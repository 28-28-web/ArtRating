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

// ── Identity preservation ────────────────────────────────────────────────────
// SD 1.5 img2img strength: controls identity vs. stylization tradeoff.
// 0.0 = return input unchanged. 1.0 = ignore input entirely (new person).
// 0.45 is the calibrated default; tune via HEADSHOT_STRENGTH env var without
// a code deploy. Above ~0.55-0.60 risks identity loss — test carefully.
const HEADSHOT_STRENGTH = parseFloat(process.env.HEADSHOT_STRENGTH ?? "0.45");
const HEADSHOT_NEGATIVE_PROMPT =
  "blur, distortion, cartoon, anime, low quality, watermark, text, different person, different face, face swap, wrong gender, altered identity, extra limbs, bad anatomy";

// ── Tier configurations ──────────────────────────────────────────────────────
// SD 1.5 img2img: max num_steps is 20. Free tier uses fewer steps for speed;
// paid/HD uses max for quality. No Neuron billing — SD 1.5 is fixed-cost.
const FREE_TIER_CONFIG = {
  steps: 15,
  estimatedNeurons: 0, // SD1.5 img2img is not Neuron-billed
} as const;

const PAID_TIER_CONFIG = {
  steps: 20, // SD1.5 img2img max
  estimatedNeurons: 0,
} as const;

// ── Neuron budget safety ─────────────────────────────────────────────────────
// SD1.5 doesn't use Neurons, so this threshold will never be reached.
// Keeping the infrastructure in place in case the model changes back.
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
// SD 1.5 img2img prompt format: keyword-rich positive prompt.
// Identity clause is appended by promptForStyle — don't add PRESERVE here.
const HEADSHOT_STYLE_PROMPTS: Record<string, string> = {
  // legacy ids kept for backward compat
  corporate: "professional corporate headshot, business suit, neutral grey studio background, professional studio lighting, LinkedIn profile photo",
  creative:  "creative professional headshot, modern colorful background, artistic lighting, portfolio photo",
  executive: "executive portrait, formal dark suit, dramatic lighting, prestigious office background, CEO portrait",
  casual:    "casual professional headshot, smart casual attire, natural background, friendly expression",

  // Social & Platform
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

  // By Profession
  speaker:    "keynote speaker portrait, dark stage background, professional attire, commanding confident pose",
  ceo:        "CEO executive portrait, dark premium background, power suit, commanding authoritative expression, dramatic studio lighting",
  author:     "author portrait, warm library bookshelf background, smart casual attire, intellectual thoughtful expression",
  doctor:     "doctor portrait, clinical white background, white coat, professional trustworthy expression",
  lawyer:     "lawyer portrait, dark wood-paneled office background, formal suit and tie, serious authoritative expression",
  teacher:    "teacher portrait, bright classroom background, smart casual attire, warm encouraging expression",
  student:    "student portrait, campus background, smart casual attire, bright approachable expression",

  // Special Purpose
  passport:         "passport photo, pure white background, neutral front-facing pose, no shadows, formal attire, official document photo",
  "corporate-team": "corporate team headshot, uniform neutral background, professional business attire, team photo aesthetic",
  farmer:           "farmer portrait, outdoor natural setting, practical work attire, warm natural lighting, approachable expression",
  "office-support": "office support staff headshot, bright clean office background, smart casual business attire, friendly approachable expression",
  "tea-boy":        "service staff portrait, casual warm background, neat uniform, warm approachable expression",
  foreman:          "foreman supervisor portrait, industrial office background, professional work attire, authoritative approachable expression",
};

const IDENTITY_CLAUSE = "same person, preserve facial features and identity, professional portrait photography, high quality";

function promptForStyle(style: string): string {
  const key = style.trim().toLowerCase();
  const base = HEADSHOT_STYLE_PROMPTS[key] ?? HEADSHOT_STYLE_PROMPTS.linkedin;
  return `${base}, ${IDENTITY_CLAUSE}`;
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

  const cfg = userId ? PAID_TIER_CONFIG : FREE_TIER_CONFIG;

  const prompt = promptForStyle(style);

  if (DEBUG_GENERATION) {
    console.log("[headshot] style:", style, "steps:", cfg.steps, "strength:", HEADSHOT_STRENGTH);
    console.log("[headshot] prompt:", prompt);
  }

  const result = await generateHeadshotFlux({
    accountId,
    apiToken,
    prompt,
    negativePrompt: HEADSHOT_NEGATIVE_PROMPT,
    imageDataUrl,
    strength: HEADSHOT_STRENGTH,
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
