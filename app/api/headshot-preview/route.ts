import { NextResponse } from "next/server";
import { generateImg2Img } from "@/app/lib/cloudflareImg2Img";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { checkGenerationEligibility, recordSuccessfulGeneration } from "@/app/lib/generationGate";
import { processGenerationOutput } from "@/app/lib/generationOutput";
import { capReachedResponse } from "@/app/lib/capReachedResponse";

const TOOL_ID = "headshot";
const DEBUG_GENERATION = process.env.DEBUG_GENERATION === "true";

// 0.35 was too conservative — at that strength SD 1.5 img2img barely touched
// attire/background (large image regions get preserved heavily at low
// strength), so "Corporate style" looked almost identical to the source
// photo. Raised to 0.55 and the prompt now explicitly says "replace" instead
// of just describing the target look, since softer phrasing wasn't enough to
// override the source image at moderate strength either. Raised again to
// 0.65 per site owner request — this pushes further in the direction away
// from the original bug (more transformation, not less), but per the same
// logic that flagged 0.55 as a possible identity-drift risk, 0.65 raises
// that risk further still. Worth watching in practice; if faces stop being
// recognizable, dial back toward 0.55 rather than lower.
const HEADSHOT_STRENGTH = 0.65;
const HEADSHOT_STEPS = 20;
const HEADSHOT_NEGATIVE_PROMPT = "blur, distortion, cartoon, anime, low quality, watermark, text";

// Keys match TabbedUploadSection's tab ids exactly (see
// HEADSHOT_MODE.styleTabs in previewModes.ts) — direct lookup, not the old
// substring-match against free-text chat input, since tabs always send one
// of these four exact strings.
const HEADSHOT_STYLE_PROMPTS: Record<string, string> = {
  corporate:
    "professional corporate headshot, business suit, neutral grey background, studio lighting, LinkedIn profile photo",
  creative:
    "creative professional headshot, modern colorful background, artistic lighting, portfolio photo",
  executive:
    "executive portrait, formal dark suit, dramatic lighting, prestigious background, CEO photo",
  casual:
    "casual professional headshot, smart casual attire, natural background, friendly expression",
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
    console.log("[headshot-preview] strength:", HEADSHOT_STRENGTH);
  }

  const result = await generateImg2Img({
    accountId,
    apiToken,
    prompt,
    negativePrompt: HEADSHOT_NEGATIVE_PROMPT,
    imageDataUrl,
    strength: HEADSHOT_STRENGTH,
    numSteps: HEADSHOT_STEPS,
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

  return NextResponse.json({ image: output.previewUrl ?? output.previewDataUrl, generationId });
}
