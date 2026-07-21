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
// override the source image at moderate strength either. If identity drifts
// too much at 0.55, dial back toward 0.45 rather than lower — going back to
// 0.35 reproduces the original bug.
const HEADSHOT_STRENGTH = 0.55;

const HEADSHOT_STYLE_PROMPTS: Record<string, string> = {
  corporate:
    "replace the person's outfit with a dark business suit or blazer over a collared shirt, replace the background entirely with a plain neutral grey studio backdrop, even studio lighting, corporate headshot photography",
  linkedin:
    "replace the person's outfit with smart business attire such as a blazer or button-down shirt, replace the background entirely with a softly blurred neutral backdrop, warm soft studio lighting, LinkedIn profile headshot photography",
  "studio portrait":
    "replace the person's outfit with formal studio attire, replace the background entirely with a seamless grey studio backdrop, clean directional studio lighting, classic studio portrait photography",
  "creative professional":
    "replace the person's outfit with smart-casual professional attire such as an open-collar shirt or stylish blazer with no tie, replace the background entirely with a softly blurred neutral or muted-color backdrop, soft directional lighting, creative industry headshot photography",
};

function promptForHeadshotStyle(style: string) {
  const key = style.trim().toLowerCase();
  const match = Object.entries(HEADSHOT_STYLE_PROMPTS).find(([k]) => key.includes(k));
  const styleText = match ? match[1] : HEADSHOT_STYLE_PROMPTS.corporate;
  return `Professional corporate headshot photo of the same person, ${styleText}, sharp focus, high detail, natural skin tone, photorealistic, no distortion`;
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
    imageDataUrl,
    strength: HEADSHOT_STRENGTH,
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
