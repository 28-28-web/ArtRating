const CLOUDFLARE_MODEL = "@cf/runwayml/stable-diffusion-v1-5-img2img";
const REQUEST_TIMEOUT_MS = 25000;

export async function generateImg2Img({
  accountId,
  apiToken,
  prompt,
  imageDataUrl,
  strength,
}: {
  accountId: string;
  apiToken: string;
  prompt: string;
  imageDataUrl: string;
  strength: number;
}): Promise<{ image?: string; error?: string }> {
  if (!imageDataUrl.startsWith("data:image/")) {
    return { error: "Invalid image" };
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
        body: JSON.stringify({ prompt, image: inputBytes, strength }),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Cloudflare Workers AI error:", res.status, errText);
      return { error: "unavailable" };
    }

    const contentType = res.headers.get("content-type") ?? "";

    // Beta img2img model: Cloudflare has changed response shape between raw
    // binary and JSON-wrapped base64 across model versions, so handle both.
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
