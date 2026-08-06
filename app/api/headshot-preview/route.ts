import { NextResponse } from "next/server";
import { generateHeadshotFlux } from "@/app/lib/cloudflareHeadshotFlux";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { checkGenerationEligibility, recordSuccessfulGeneration } from "@/app/lib/generationGate";
import { checkHeadshotDailyCap, recordHeadshotDailyUsage, headshotDailyCapResponse } from "@/app/lib/headshotDailyCap";
import { processGenerationOutput } from "@/app/lib/generationOutput";
import { capReachedResponse } from "@/app/lib/capReachedResponse";

const TOOL_ID = "headshot";
const DEBUG_GENERATION = process.env.DEBUG_GENERATION === "true";

// Migrated from SD 1.5 img2img's strength dial (which had no real
// identity-preservation mechanism — see git history for the 0.35 -> 0.55 ->
// 0.65 -> 0.45 tuning saga and the reported male-selfie-became-a-woman bug)
// to flux-2-dev's reference-image conditioning. No "strength" param exists
// for this model at all — identity comes from the prompt's own instruction
// language below, not a blend dial. 512x512 + 15 steps keeps Neuron cost
// predictable (~844/generation — see HeadshotDailyUsage's schema comment
// for the full cost table); never omit width/height/steps for this model,
// see cloudflareHeadshotFlux.ts's comment on why.
const HEADSHOT_WIDTH = 512;
const HEADSHOT_HEIGHT = 512;
const HEADSHOT_STEPS = 15;

const BASE = "Take the person in the reference image and restyle them as";
const PRESERVE = "Preserve their exact face, identity, and gender.";

const HEADSHOT_STYLE_PROMPTS: Record<string, string> = {
  // ── kept for backward compat (old tab ids still work) ────────────────────
  corporate: `${BASE} a professional corporate headshot: business suit, neutral grey studio background, professional studio lighting, LinkedIn profile photo. ${PRESERVE}`,
  creative:  `${BASE} a creative professional headshot: modern colorful background, artistic lighting, portfolio photo. ${PRESERVE}`,
  executive: `${BASE} an executive portrait: formal dark suit, dramatic lighting, prestigious background, CEO photo. ${PRESERVE}`,
  casual:    `${BASE} a casual professional headshot: smart casual attire, natural background, friendly expression. ${PRESERVE}`,

  // ── Social & Platform ────────────────────────────────────────────────────
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

  // ── By Profession ────────────────────────────────────────────────────────
  speaker:    `${BASE} a keynote speaker portrait: dark stage-like background, professional attire, commanding confident pose. ${PRESERVE}`,
  ceo:        `${BASE} a CEO executive portrait: dark premium background, power suit or formal attire, commanding authoritative expression, dramatic lighting. ${PRESERVE}`,
  author:     `${BASE} an author portrait: warm library or bookshelf background, smart casual attire, intellectual thoughtful expression. ${PRESERVE}`,
  doctor:     `${BASE} a doctor portrait: clinical white background, white coat, professional and trustworthy expression. ${PRESERVE}`,
  lawyer:     `${BASE} a lawyer portrait: dark wood-paneled office background, formal suit and tie, serious authoritative expression. ${PRESERVE}`,
  teacher:    `${BASE} a teacher portrait: bright classroom-style background, smart casual attire, warm encouraging expression. ${PRESERVE}`,
  student:    `${BASE} a student portrait: campus-style background, smart casual youthful attire, bright approachable expression. ${PRESERVE}`,

  // ── Special Purpose ──────────────────────────────────────────────────────
  passport:          `${BASE} a passport-style portrait: pure white background, neutral front-facing pose, no harsh shadows, formal attire. ${PRESERVE}`,
  "corporate-team":  `${BASE} a corporate team headshot: uniform neutral background, professional business attire, consistent team-photo aesthetic. ${PRESERVE}`,
  farmer:            `${BASE} a farmer portrait: outdoor natural setting, practical work attire, warm natural lighting, approachable expression. ${PRESERVE}`,
  "office-support":  `${BASE} an office support staff headshot: bright clean office background, smart casual or business attire, friendly approachable expression. ${PRESERVE}`,
  "tea-boy":         `${BASE} a service staff portrait: casual warm service-setting background, neat uniform or smart casual, warm approachable expression. ${PRESERVE}`,
  foreman:           `${BASE} a foreman or supervisor portrait: industrial or office background, safety-conscious professional attire, authoritative yet approachable expression. ${PRESERVE}`,
};

function promptForHeadshotStyle(style: string) {
  const key = style.trim().toLowerCase();
  return HEADSHOT_STYLE_PROMPTS[key] ?? HEADSHOT_STYLE_PROMPTS.corporate;
}

function unavailable() {
  return NextResponse.json(
    { error: "Preview generation temporarily unavailable" },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const anonId = await verifyAnonId(readCookie(request.headers.get("cookie"), ANON_ID_COOKIE));

  const gate = await checkGenerationEligibility({ anonId, userId });
  if (!gate.allowed) {
    return capReachedResponse(userId);
  }

  // Additional, headshot-specific cap — checked in addition to the shared
  // gate above, same pattern as photo-mix's PhotoMixDailyUsage check. Anon
  // visitors skip this entirely; they're already fully governed by the
  // shared 2-total cap just above. Hitting this does NOT unlock via
  // spending a credit — generation stays free either way, credits only
  // ever pay for the download.
  if (userId) {
    const dailyGate = await checkHeadshotDailyCap(userId);
    if (!dailyGate.allowed) {
      return headshotDailyCapResponse();
    }
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return unavailable();
  }

  let style: string;
  let imageDataUrl: string;
  try {
    const body = await request.json();
    style = typeof body?.style === "string" && body.style.trim() ? body.style : "corporate";
    imageDataUrl = typeof body?.image === "string" ? body.image : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const prompt = promptForHeadshotStyle(style);

  if (DEBUG_GENERATION) {
    console.log("[headshot-preview] requested style:", style);
    console.log("[headshot-preview] resolved prompt:", prompt);
    console.log("[headshot-preview] steps:", HEADSHOT_STEPS);
  }

  const result = await generateHeadshotFlux({
    accountId,
    apiToken,
    prompt,
    imageDataUrl,
    width: HEADSHOT_WIDTH,
    height: HEADSHOT_HEIGHT,
    steps: HEADSHOT_STEPS,
  });

  if (!result.image) {
    if (result.error === "Invalid image") {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
    return unavailable();
  }

  let output;
  try {
    output = await processGenerationOutput({
      rawDataUrl: result.image,
      toolId: TOOL_ID,
      storeClean: !!userId,
    });
  } catch (error) {
    console.error("[headshot-preview] processGenerationOutput failed:", error);
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
  }

  return NextResponse.json({ image: output.previewUrl ?? output.previewDataUrl, generationId });
}
