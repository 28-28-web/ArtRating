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
// photo. Raised to 0.55, then to 0.65 per site owner request for stronger
// stylization — but 0.65 crossed into identity-loss territory: reported
// case of a male user's selfie producing a completely different woman.
// SD 1.5 has no face-lock/identity-preservation mechanism (no IP-Adapter,
// no InstantID, no ControlNet), so above ~0.5-0.55 the output is dominated
// by prompt+model priors rather than the input photo. Dialed back to 0.45
// — biases back toward identity preservation over stylization strength.
// If style transformation feels too weak at 0.45, raise cautiously and
// re-test identity retention each time, don't jump straight back to 0.65.
const HEADSHOT_STRENGTH = 0.45;
const HEADSHOT_STEPS = 20;
const HEADSHOT_IDENTITY_CLAUSE = "same person, preserve the subject's facial features, identity, and gender";
const HEADSHOT_NEGATIVE_PROMPT =
  "blur, distortion, cartoon, anime, low quality, watermark, text, different person, different face, face swap, wrong gender, altered identity";

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
  const stylePrompt = HEADSHOT_STYLE_PROMPTS[key] ?? HEADSHOT_STYLE_PROMPTS.corporate;
  return `${stylePrompt}, ${HEADSHOT_IDENTITY_CLAUSE}`;
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
