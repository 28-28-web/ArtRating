import { NextResponse } from "next/server";
import { generateImg2Img } from "@/app/lib/cloudflareImg2Img";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { checkGenerationEligibility, recordSuccessfulGeneration } from "@/app/lib/generationGate";
import { uploadResultImage } from "@/app/lib/cloudinaryUpload";

const TOOL_ID = "art-style";
const IMG2IMG_STRENGTH = 0.6;

const STYLE_PROMPTS: Record<string, string> = {
  "van gogh": "in the style of Van Gogh, swirling post-impressionist brushstrokes, vibrant blues and yellows",
  watercolor: "delicate watercolor painting, soft color bleeds, textured paper",
  anime: "anime style illustration, vibrant cel-shaded art, clean linework",
  "oil painting": "classic oil painting, thick brushstrokes, canvas texture",
  monet: "in the style of Monet, impressionist brushstrokes, soft light",
  "pop art": "vibrant Pop Art style, bold flat colors, comic-book outlines, Warhol-inspired",
  portrait: "stylized AI portrait, digital art, dramatic lighting",
  avatar: "stylized AI avatar, digital art, dramatic lighting",
};

function promptForStyle(style: string) {
  const key = style.trim().toLowerCase();
  const match = Object.entries(STYLE_PROMPTS).find(([k]) => key.includes(k));
  const styleText = match ? match[1] : "artistic painting style, vibrant colors";
  return `A painting of the same photo, ${styleText}, high detail`;
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
    style = typeof body?.style === "string" && body.style.trim() ? body.style : "stylized painting";
    imageDataUrl = typeof body?.image === "string" ? body.image : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = await generateImg2Img({
    accountId,
    apiToken,
    prompt: promptForStyle(style),
    imageDataUrl,
    strength: IMG2IMG_STRENGTH,
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
