import { NextResponse } from "next/server";
import { generateImg2Img } from "@/app/lib/cloudflareImg2Img";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { checkGenerationEligibility, recordSuccessfulGeneration } from "@/app/lib/generationGate";
import { uploadResultImage } from "@/app/lib/cloudinaryUpload";

const TOOL_ID = "headshot";

// Kept low relative to the art-style preview's 0.6 so identity (face shape,
// proportions, skin tone) stays close to the source photo — only
// background/attire/lighting should shift. See PR notes for the 0.25/0.45
// tradeoff: lower drifts less from the source but also restyles less;
// this needs a real Cloudflare account to tune with actual output.
const HEADSHOT_STRENGTH = 0.35;

const HEADSHOT_STYLE_PROMPTS: Record<string, string> = {
  corporate:
    "professional business attire, neutral studio lighting, plain grey backdrop, corporate headshot photography",
  linkedin:
    "professional business attire, warm soft studio lighting, neutral blurred background, LinkedIn profile headshot photography",
  "studio portrait":
    "professional attire, clean studio lighting, seamless grey backdrop, classic studio portrait photography",
  "creative professional":
    "smart casual professional attire, soft directional lighting, softly blurred neutral background, creative industry headshot photography",
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
    return NextResponse.json({ reason: gate.reason }, { status: gate.reason === "needs-login" ? 401 : 402 });
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

  const result = await generateImg2Img({
    accountId,
    apiToken,
    prompt: promptForHeadshotStyle(style),
    imageDataUrl,
    strength: HEADSHOT_STRENGTH,
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
