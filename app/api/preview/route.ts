import { NextResponse } from "next/server";

const CLOUDFLARE_MODEL = "@cf/runwayml/stable-diffusion-v1-5-img2img";
const IMG2IMG_STRENGTH = 0.6;
const REQUEST_TIMEOUT_MS = 25000;

const STYLE_PROMPTS: Record<string, string> = {
  "van gogh": "in the style of Van Gogh, swirling post-impressionist brushstrokes, vibrant blues and yellows",
  watercolor: "delicate watercolor painting, soft color bleeds, textured paper",
  anime: "anime style illustration, vibrant cel-shaded art, clean linework",
  "oil painting": "classic oil painting, thick brushstrokes, canvas texture",
  monet: "in the style of Monet, impressionist brushstrokes, soft light",
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
    if (!imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const inputBytes = Array.from(
    Buffer.from(imageDataUrl.slice(imageDataUrl.indexOf(",") + 1), "base64")
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptForStyle(style),
          image: inputBytes,
          strength: IMG2IMG_STRENGTH,
        }),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Cloudflare Workers AI error:", res.status, errText);
      return unavailable();
    }

    const contentType = res.headers.get("content-type") ?? "";

    // Beta img2img model: Cloudflare has changed response shape between raw
    // binary and JSON-wrapped base64 across model versions, so handle both.
    if (contentType.includes("application/json")) {
      const data = await res.json();
      const base64Out: string | undefined = data?.result?.image;
      if (!data?.success || !base64Out) {
        console.error("Cloudflare Workers AI: unexpected JSON response", data);
        return unavailable();
      }
      return NextResponse.json({ image: `data:image/png;base64,${base64Out}` });
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      console.error("Cloudflare Workers AI: empty binary response");
      return unavailable();
    }
    const outBase64 = Buffer.from(arrayBuffer).toString("base64");
    return NextResponse.json({ image: `data:image/png;base64,${outBase64}` });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Cloudflare Workers AI: request timed out");
    } else {
      console.error(error);
    }
    return unavailable();
  } finally {
    clearTimeout(timeout);
  }
}
