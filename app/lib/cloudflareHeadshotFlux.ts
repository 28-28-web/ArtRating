import sharp from "sharp";

// Headshot-only — do NOT reuse this for other tools, and do NOT merge this
// into cloudflareImg2Img.ts. That file is shared by pet-to-human,
// toy-ification, and art-style (app/api/pet-human-preview,
// app/api/toy-preview, app/api/preview), all still on SD 1.5 img2img.
// Migrating headshot to flux-2-dev needs a different request shape
// (multipart, no "strength") that isn't compatible with those callers'
// existing signature — a prior attempt at editing cloudflareImg2Img.ts in
// place broke all three (tsc caught it immediately). Same model + same
// request shape as cloudflareFluxMix.ts (photo-mix), just one reference
// image instead of two.
const CLOUDFLARE_MODEL = "@cf/black-forest-labs/flux-2-dev";
// flux-2-dev is slow — 30s and 60s were both measured too short in
// production for cloudflareFluxMix.ts's identical request shape. Reusing
// that hard-won value rather than re-guessing.
const REQUEST_TIMEOUT_MS = 120000;
// input_image_0 must be smaller than 512x512 per Cloudflare's docs.
const MAX_DIMENSION = 512;

async function resizeToMax512(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .toBuffer();
}

async function requestHeadshotFlux({
  accountId,
  apiToken,
  imageBuffer,
  prompt,
  width,
  height,
  steps,
}: {
  accountId: string;
  apiToken: string;
  imageBuffer: Buffer;
  prompt: string;
  width: number;
  height: number;
  steps: number;
}): Promise<{ image?: string; error?: string; timedOut?: boolean }> {
  const formData = new FormData();
  formData.append("input_image_0", new Blob([new Uint8Array(imageBuffer)]));
  formData.append("prompt", prompt);
  // Explicit sizing is mandatory, not cosmetic — cloudflareFluxMix.ts omits
  // these and, per HeadshotDailyUsage/PhotoMixDailyUsage's schema comments,
  // ends up costing ~8,000-9,000 Neurons/call from whatever Cloudflare's
  // undocumented defaults resolve to. Pinning width/height/steps keeps the
  // cost predictable: at 512x512 + 15 steps, ~844 Neurons/generation.
  formData.append("width", String(width));
  formData.append("height", String(height));
  formData.append("steps", String(steps));
  // No "strength" param — flux-2-dev has none; identity preservation comes
  // from the prompt's own instruction language instead (see
  // HEADSHOT_STYLE_PROMPTS in headshot-preview/route.ts). No
  // "negative_prompt" either — undocumented for this model, dropped rather
  // than sent on spec.

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
      console.error("Cloudflare Workers AI (flux-2-dev headshot) error:", res.status, errText);
      return { error: "unavailable" };
    }

    const contentType = res.headers.get("content-type") ?? "";

    // Same defensive dual-shape handling as cloudflareFluxMix.ts — Cloudflare
    // has varied response shape (raw binary vs JSON-wrapped base64) across
    // model versions elsewhere in this codebase, so don't assume either.
    if (contentType.includes("application/json")) {
      const data = await res.json();
      const base64Out: string | undefined = data?.result?.image;
      if (!data?.success || !base64Out) {
        console.error("Cloudflare Workers AI (flux-2-dev headshot): unexpected JSON response", data);
        return { error: "unavailable" };
      }
      return { image: `data:image/png;base64,${base64Out}` };
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      console.error("Cloudflare Workers AI (flux-2-dev headshot): empty binary response");
      return { error: "unavailable" };
    }
    const outBase64 = Buffer.from(arrayBuffer).toString("base64");
    return { image: `data:image/png;base64,${outBase64}` };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Cloudflare Workers AI (flux-2-dev headshot): request timed out");
      return { error: "unavailable", timedOut: true };
    }
    console.error(error);
    return { error: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateHeadshotFlux({
  accountId,
  apiToken,
  prompt,
  imageDataUrl,
  width,
  height,
  steps,
}: {
  accountId: string;
  apiToken: string;
  prompt: string;
  imageDataUrl: string;
  width: number;
  height: number;
  steps: number;
}): Promise<{ image?: string; error?: string }> {
  if (!imageDataUrl.startsWith("data:image/")) {
    return { error: "Invalid image" };
  }

  const rawBuffer = Buffer.from(imageDataUrl.slice(imageDataUrl.indexOf(",") + 1), "base64");
  const resized = await resizeToMax512(rawBuffer);

  const first = await requestHeadshotFlux({ accountId, apiToken, imageBuffer: resized, prompt, width, height, steps });
  if (first.image || !first.timedOut) {
    return { image: first.image, error: first.error };
  }

  console.error("Cloudflare Workers AI (flux-2-dev headshot): retrying once after timeout");
  const retry = await requestHeadshotFlux({ accountId, apiToken, imageBuffer: resized, prompt, width, height, steps });
  return { image: retry.image, error: retry.error };
}
