// FLUX.1 Kontext [dev] via fal.ai — instruction-based identity-preserving
// image editing. Unlike SD1.5 img2img (noise-based), Kontext uses direct
// text instructions to edit the background/style while the model
// architecture preserves the subject's identity natively.
const FAL_API_URL = "https://fal.run/fal-ai/flux-kontext/dev";
const REQUEST_TIMEOUT_MS = 30000;
const FAL_COST_PER_IMAGE = 0.015; // approx USD, for spend logging

export async function generateHeadshotKontext({
  imageDataUrl,
  prompt,
  steps,
}: {
  imageDataUrl: string;
  prompt: string;
  steps: number;
}): Promise<{ image?: string; error?: string }> {
  const apiKey = process.env.FAL_AI_API_KEY;
  if (!apiKey) {
    console.error("[fal-kontext] FAL_AI_API_KEY is not set");
    return { error: "unavailable" };
  }

  if (!imageDataUrl.startsWith("data:image/")) {
    return { error: "Invalid image" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(FAL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageDataUrl,
        prompt,
        guidance_scale: 3.5,
        num_inference_steps: steps,
        output_format: "jpeg",
        sync_mode: true, // returns data URI directly — no second fetch needed
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[fal-kontext] API error:", res.status, errText);
      return { error: "unavailable" };
    }

    const data = await res.json();
    const imageUrl: string | undefined = data?.images?.[0]?.url;

    if (!imageUrl) {
      console.error("[fal-kontext] No image in response:", JSON.stringify(data).slice(0, 500));
      return { error: "unavailable" };
    }

    console.log(`[fal-kontext] generation complete — estimated cost: $${FAL_COST_PER_IMAGE.toFixed(4)}`);

    // sync_mode:true → data URI; otherwise CDN URL
    if (imageUrl.startsWith("data:")) {
      return { image: imageUrl };
    }

    // Fetch CDN URL and convert to data URI
    const imgRes = await fetch(imageUrl, { signal: controller.signal });
    if (!imgRes.ok) {
      console.error("[fal-kontext] Failed to fetch image from CDN:", imgRes.status);
      return { error: "unavailable" };
    }
    const arrayBuffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
    return { image: `data:${contentType};base64,${base64}` };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("[fal-kontext] Request timed out after", REQUEST_TIMEOUT_MS, "ms");
      return { error: "timeout" };
    }
    console.error("[fal-kontext] Unexpected error:", error);
    return { error: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
