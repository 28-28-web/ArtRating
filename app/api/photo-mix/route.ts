import { NextResponse } from "next/server";
import { generatePhotoMix } from "@/app/lib/cloudflareFluxMix";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { checkGenerationEligibility, recordSuccessfulGeneration } from "@/app/lib/generationGate";
import { processGenerationOutput } from "@/app/lib/generationOutput";
import { capReachedResponse } from "@/app/lib/capReachedResponse";

const TOOL_ID = "photo-mix";
const DEBUG_GENERATION = process.env.DEBUG_GENERATION === "true";

const PROMPT =
  "Place the person from image 0 together with the subject from image 1 in one warm, natural photo. " +
  "Match the lighting, perspective, and color grading so both look like they were photographed in the " +
  "same scene together. Photorealistic, sharp focus, high detail.";

function unavailable() {
  return NextResponse.json(
    { error: "Preview generation temporarily unavailable" },
    { status: 200 }
  );
}

function dataUrlToBuffer(dataUrl: string): Buffer | null {
  if (!dataUrl.startsWith("data:image/")) return null;
  const comma = dataUrl.indexOf(",");
  if (comma === -1) return null;
  return Buffer.from(dataUrl.slice(comma + 1), "base64");
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const anonId = await verifyAnonId(readCookie(request.headers.get("cookie"), ANON_ID_COOKIE));

  const gate = await checkGenerationEligibility({ anonId, userId });
  if (!gate.allowed) {
    return capReachedResponse(userId);
  }

  let imageAUrl: string;
  let imageBUrl: string;
  let consent: boolean;
  try {
    const body = await request.json();
    imageAUrl = typeof body?.imageA === "string" ? body.imageA : "";
    imageBUrl = typeof body?.imageB === "string" ? body.imageB : "";
    consent = body?.consent === true;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!imageAUrl || !imageBUrl) {
    return NextResponse.json({ error: "Upload both photos to continue" }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Please confirm you have the right to use the second photo" },
      { status: 400 }
    );
  }

  const imageA = dataUrlToBuffer(imageAUrl);
  const imageB = dataUrlToBuffer(imageBUrl);
  if (!imageA || !imageB) {
    return NextResponse.json({ error: "Invalid image" }, { status: 400 });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return unavailable();
  }

  const result = await generatePhotoMix({
    accountId,
    apiToken,
    imageA,
    imageB,
    prompt: PROMPT,
  });

  if (!result.image) {
    if (DEBUG_GENERATION) {
      console.log("[photo-mix] generation failed, quota NOT incremented (recordSuccessfulGeneration not called)");
    }
    return unavailable();
  }

  const output = await processGenerationOutput({
    rawDataUrl: result.image,
    toolId: TOOL_ID,
    storeClean: !!userId,
  });
  const { generationId } = await recordSuccessfulGeneration({
    toolId: TOOL_ID,
    imageUrl: output.previewUrl,
    cleanImageUrl: output.cleanUrl,
    userId,
    anonId,
  });

  return NextResponse.json({ image: output.previewUrl ?? output.previewDataUrl, generationId });
}
