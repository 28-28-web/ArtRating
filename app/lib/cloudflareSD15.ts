// SD 1.5 img2img — identity-preserving headshot style transfer for anonymous
// free-tier generations. Runs on Cloudflare Workers AI (free within daily
// Neuron allowance). strength=0.45 was calibrated to preserve identity while
// allowing meaningful style change; above ~0.5 causes identity loss on SD1.5.
//
// Used only for anonymous (non-logged-in) users. Logged-in users get the
// fal.ai FLUX.1 Kontext [dev] path (falKontext.ts) which produces higher
// quality but costs ~$0.015/image.
const CLOUDFLARE_MODEL = "@cf/runwayml/stable-diffusion-v1-5-img2img";
const REQUEST_TIMEOUT_MS = 30000;
const STRENGTH = 0.45;
const NEGATIVE_PROMPT =
  "blur, distortion, cartoon, anime, low quality, watermark, text, different person, different face, face swap, wrong gender, altered identity, extra limbs, bad anatomy";
const IDENTITY_CLAUSE =
  "same person, preserve facial features and identity, professional portrait photography, high quality";

async function requestSD15({
  accountId,
  apiToken,
  imageDataUrl,
  prompt,
  steps,
}: {
  accountId: string;
  apiToken: string;
  imageDataUrl: string;
  prompt: string;
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
          negative_prompt: NEGATIVE_PROMPT,
          image: inputBytes,
          strength: STRENGTH,
          num_steps: steps,
        }),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[sd15] Cloudflare error:", res.status, errText);
      return { error: "unavailable" };
    }

    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      const base64Out: string | undefined = data?.result?.image;
      if (!data?.success || !base64Out) {
        console.error("[sd15] unexpected JSON response:", data);
        return { error: "unavailable" };
      }
      return { image: `data:image/png;base64,${base64Out}` };
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      console.error("[sd15] empty binary response");
      return { error: "unavailable" };
    }
    const outBase64 = Buffer.from(arrayBuffer).toString("base64");
    return { image: `data:image/png;base64,${outBase64}` };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("[sd15] request timed out");
      return { error: "unavailable", timedOut: true };
    }
    console.error("[sd15] error:", error);
    return { error: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateHeadshotSD15({
  accountId,
  apiToken,
  imageDataUrl,
  prompt,
  steps,
}: {
  accountId: string;
  apiToken: string;
  imageDataUrl: string;
  prompt: string;
  steps: number;
}): Promise<{ image?: string; error?: string }> {
  if (!imageDataUrl.startsWith("data:image/")) {
    return { error: "Invalid image" };
  }

  const fullPrompt = `${prompt}, ${IDENTITY_CLAUSE}`;

  const first = await requestSD15({ accountId, apiToken, imageDataUrl, prompt: fullPrompt, steps });
  if (first.image || !first.timedOut) {
    return { image: first.image, error: first.error };
  }

  console.error("[sd15] retrying once after timeout");
  return requestSD15({ accountId, apiToken, imageDataUrl, prompt: fullPrompt, steps });
}
