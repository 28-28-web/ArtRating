const CLOUDFLARE_MODEL = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
const REQUEST_TIMEOUT_MS = 25000;

export async function generateText2Img({
  accountId,
  apiToken,
  prompt,
  negativePrompt,
  numSteps,
  height,
  width,
}: {
  accountId: string;
  apiToken: string;
  prompt: string;
  negativePrompt?: string;
  // Model default/max is 20 — only pass this to be explicit, not because
  // the default needs overriding.
  numSteps?: number;
  height?: number;
  width?: number;
}): Promise<{ image?: string; error?: string }> {
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
          ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
          ...(numSteps ? { num_steps: numSteps } : {}),
          ...(height ? { height } : {}),
          ...(width ? { width } : {}),
        }),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Cloudflare Workers AI error:", res.status, errText);
      return { error: "unavailable" };
    }

    const contentType = res.headers.get("content-type") ?? "";

    // Same dual-shape handling as cloudflareImg2Img.ts — Cloudflare varies
    // between raw binary and JSON-wrapped base64 across model versions.
    if (contentType.includes("application/json")) {
      const data = await res.json();
      const base64Out: string | undefined = data?.result?.image;
      if (!data?.success || !base64Out) {
        console.error("Cloudflare Workers AI: unexpected JSON response", data);
        return { error: "unavailable" };
      }
      return { image: `data:image/png;base64,${base64Out}` };
    }

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength === 0) {
      console.error("Cloudflare Workers AI: empty binary response");
      return { error: "unavailable" };
    }
    const outBase64 = Buffer.from(arrayBuffer).toString("base64");
    return { image: `data:image/png;base64,${outBase64}` };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Cloudflare Workers AI: request timed out");
    } else {
      console.error(error);
    }
    return { error: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
