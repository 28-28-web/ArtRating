import { NextResponse } from "next/server";
import { generateImg2Img } from "@/app/lib/cloudflareImg2Img";
import { PET_TO_HUMAN_MODE } from "@/app/lib/previewModes";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { checkGenerationEligibility, recordSuccessfulGeneration } from "@/app/lib/generationGate";
import { uploadResultImage } from "@/app/lib/cloudinaryUpload";

const TOOL_ID = "pet-to-human";

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
    return NextResponse.json({ reason: gate.reason }, { status: gate.reason === "needs-login" ? 401 : 402 });
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return unavailable();
  }

  let imageDataUrl: string;
  try {
    const body = await request.json();
    imageDataUrl = typeof body?.image === "string" ? body.image : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = await generateImg2Img({
    accountId,
    apiToken,
    prompt: PET_TO_HUMAN_MODE.promptTemplate!,
    negativePrompt: PET_TO_HUMAN_MODE.negativePrompt,
    imageDataUrl,
    strength: PET_TO_HUMAN_MODE.strength!,
  });

  if (!result.image) {
    if (result.error === "Invalid image") {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
    return unavailable();
  }

  const hostedUrl = await uploadResultImage(result.image, TOOL_ID);
  await recordSuccessfulGeneration({
    toolId: TOOL_ID,
    imageUrl: hostedUrl,
    userId,
    anonId,
    deductCredit: gate.deductCredit,
  });

  return NextResponse.json({ image: hostedUrl ?? result.image });
}
