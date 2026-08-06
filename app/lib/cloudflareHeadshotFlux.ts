// SD 1.5 img2img — identity-preserving headshot style transfer.
//
// flux-2-dev was tried but is text-to-image with loose style reference only:
// it produces an entirely different person instead of restyling the uploaded
// selfie. SD 1.5 img2img with strength=0.45 is the correct tool here — the
// `strength` parameter controls how much the input photo is retained
// (1.0 = ignore input entirely, 0.0 = return input unchanged). 0.45 was
// calibrated to preserve identity while still allowing meaningful style
// change; see the commit history on headshot-preview/route.ts for why
// values above ~0.5 cause identity loss on SD 1.5.
const CLOUDFLARE_MODEL = "@cf/runwayml/stable-diffusion-v1-5-img2img";
const REQUEST_TIMEOUT_MS = 30000;

async function requestHeadshotImg2Img({
  accountId,
  apiToken,
  imageDataUrl,
  prompt,
  negativePrompt,
  strength,
  steps,
}: {
  accountId: string;
  apiToken: string;
  imageDataUrl: string;
  prompt: string;
  negativePrompt: string;
  strength: number;
  steps: number;
}): Promise<{ image?: string; error?: string; timedOut?: boolean }> {
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
          prompt,
          negative_prompt: negativePrompt,
          image: inputBytes,
          strength,
          num_steps: steps,
        }),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[headshot] SD1.5 img2img error:", res.status, errText);
      return { error: "unavailable" };
    }

    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      const base64Out: string | undefined = data?.result?.image;
      if (!data?.success || !base64Out) {
        console.error("[headshot] SD1.5 img2img unexpected JSON response:", data);
        return { error: "unavailable" };
      }
      return { image: `data:image/png;base64,${base64Out}` };
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      console.error("[headshot] SD1.5 img2img empty binary response");
      return { error: "unavailable" };
    }
    const outBase64 = Buffer.from(arrayBuffer).toString("base64");
    return { image: `data:image/png;base64,${outBase64}` };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("[headshot] SD1.5 img2img request timed out");
      return { error: "unavailable", timedOut: true };
    }
    console.error("[headshot] SD1.5 img2img error:", error);
    return { error: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateHeadshotFlux({
  accountId,
  apiToken,
  prompt,
  negativePrompt = "",
  imageDataUrl,
  strength = 0.45,
  steps,
}: {
  accountId: string;
  apiToken: string;
  prompt: string;
  negativePrompt?: string;
  imageDataUrl: string;
  strength?: number;
  steps: number;
  // width and height unused — SD1.5 img2img uses input image dimensions
  width?: number;
  height?: number;
}): Promise<{ image?: string; error?: string }> {
  if (!imageDataUrl.startsWith("data:image/")) {
    return { error: "Invalid image" };
  }

  const first = await requestHeadshotImg2Img({
    accountId, apiToken, imageDataUrl, prompt, negativePrompt, strength, steps,
  });
  if (first.image || !first.timedOut) {
    return { image: first.image, error: first.error };
  }

  console.error("[headshot] SD1.5 img2img retrying once after timeout");
  return requestHeadshotImg2Img({
    accountId, apiToken, imageDataUrl, prompt, negativePrompt, strength, steps,
  });
}
