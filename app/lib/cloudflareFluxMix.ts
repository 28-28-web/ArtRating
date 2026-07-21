import sharp from "sharp";

// Separate from cloudflareImg2Img.ts — different model (multi-reference-image
// blend, not single-image img2img), different request shape (multipart form,
// not JSON), different Workers AI model, and genuinely slower: flux-2-dev
// blends two reference images instead of transforming one, so it needs a
// longer timeout than the single-image tools. 30s (copied from the
// schnell-based img2img helper) and then 60s were both still too short —
// server logs showed both the first attempt and the retry timing out at
// exactly 60s each. Raised to 120s. Worst case with the one retry below is
// now 240s total, which stays under the 300s Traefik proxy timeout with a
// 60s/20% margin. If 120s still isn't enough, raise the proxy timeout
// further (e.g. 450-600s) rather than pushing this closer to the proxy
// ceiling — a code timeout with no margin below the proxy limit just means
// the proxy kills the connection first instead, same failure either way.
const CLOUDFLARE_MODEL = "@cf/black-forest-labs/flux-2-dev";
const REQUEST_TIMEOUT_MS = 120000;
const MAX_DIMENSION = 512;

async function resizeToMax512(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .toBuffer();
}

async function requestFluxMix({
  accountId,
  apiToken,
  imageA,
  imageB,
  prompt,
}: {
  accountId: string;
  apiToken: string;
  imageA: Buffer;
  imageB: Buffer;
  prompt: string;
}): Promise<{ image?: string; error?: string; timedOut?: boolean }> {
  const formData = new FormData();
  formData.append("input_image_0", new Blob([new Uint8Array(imageA)]));
  formData.append("input_image_1", new Blob([new Uint8Array(imageB)]));
  formData.append("prompt", prompt);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_MODEL}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiToken}` },
        body: formData,
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Cloudflare Workers AI (flux-2-dev) error:", res.status, errText);
      return { error: "unavailable" };
    }

    const contentType = res.headers.get("content-type") ?? "";

    // Beta multi-image model: handle both raw binary and JSON-wrapped base64
    // response shapes, same defensive pattern as cloudflareImg2Img.ts.
    if (contentType.includes("application/json")) {
      const data = await res.json();
      const base64Out: string | undefined = data?.result?.image;
      if (!data?.success || !base64Out) {
        console.error("Cloudflare Workers AI (flux-2-dev): unexpected JSON response", data);
        return { error: "unavailable" };
      }
      return { image: `data:image/png;base64,${base64Out}` };
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      console.error("Cloudflare Workers AI (flux-2-dev): empty binary response");
      return { error: "unavailable" };
    }
    const outBase64 = Buffer.from(arrayBuffer).toString("base64");
    return { image: `data:image/png;base64,${outBase64}` };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Cloudflare Workers AI (flux-2-dev): request timed out");
      return { error: "unavailable", timedOut: true };
    }
    console.error(error);
    return { error: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

export async function generatePhotoMix({
  accountId,
  apiToken,
  imageA,
  imageB,
  prompt,
}: {
  accountId: string;
  apiToken: string;
  imageA: Buffer;
  imageB: Buffer;
  prompt: string;
}): Promise<{ image?: string; error?: string }> {
  const [resizedA, resizedB] = await Promise.all([resizeToMax512(imageA), resizeToMax512(imageB)]);

  const first = await requestFluxMix({ accountId, apiToken, imageA: resizedA, imageB: resizedB, prompt });
  if (first.image || !first.timedOut) {
    return { image: first.image, error: first.error };
  }

  console.error("Cloudflare Workers AI (flux-2-dev): retrying once after timeout");
  const retry = await requestFluxMix({ accountId, apiToken, imageA: resizedA, imageB: resizedB, prompt });
  return { image: retry.image, error: retry.error };
}
