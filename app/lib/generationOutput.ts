import { applyWatermark } from "@/app/lib/watermark";
import { uploadResultImage } from "@/app/lib/cloudinaryUpload";

const DEBUG_GENERATION = process.env.DEBUG_GENERATION === "true";

function dataUrlToBuffer(dataUrl: string): Buffer {
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
}

function bufferToPngDataUrl(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

// Thrown (never swallowed) if watermarking fails, so a broken composite step
// surfaces as a request failure the caller sees, instead of silently falling
// back to serving the raw, unwatermarked image as the "preview" — that
// fallback doesn't exist anywhere in this file on purpose. See the
// investigation notes in the commit that added this: the watermark logic
// itself was verified working (rendered against a real photo through this
// exact data path) but the reported "no visible watermark on photo-mix"
// couldn't be reproduced from the code, so this class of bug is closed off
// rather than left as a silent possibility.
export class WatermarkFailedError extends Error {}

// Watermarks the raw model output for on-screen display, and — only for
// logged-in generations, since anonymous-era results aren't downloadable
// later (see the option-(b) note on Generation.cleanImageUrl) — separately
// uploads the untouched clean version that /api/download will serve.
export async function processGenerationOutput(params: {
  rawDataUrl: string;
  toolId: string;
  storeClean: boolean;
}): Promise<{ previewUrl: string | null; previewDataUrl: string; cleanUrl: string | null }> {
  const { rawDataUrl, toolId, storeClean } = params;
  const rawBuffer = dataUrlToBuffer(rawDataUrl);

  let watermarkedBuffer: Buffer;
  try {
    watermarkedBuffer = await applyWatermark(rawBuffer);
  } catch (error) {
    console.error(`[generationOutput] watermarking failed for ${toolId}:`, error);
    throw new WatermarkFailedError(
      `Watermarking failed for ${toolId}; refusing to serve an unwatermarked preview.`
    );
  }
  const previewDataUrl = bufferToPngDataUrl(watermarkedBuffer);

  if (DEBUG_GENERATION) {
    console.log(`[generationOutput] watermarked preview ready for ${toolId}`, {
      rawBytes: rawBuffer.length,
      watermarkedBytes: watermarkedBuffer.length,
      storeClean,
    });
  }

  const [previewUrl, cleanUrl] = await Promise.all([
    uploadResultImage(previewDataUrl, `${toolId}/preview`),
    storeClean ? uploadResultImage(rawDataUrl, `${toolId}/clean`) : Promise.resolve(null),
  ]);

  return { previewUrl, previewDataUrl, cleanUrl };
}
