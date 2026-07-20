import { applyWatermark } from "@/app/lib/watermark";
import { uploadResultImage } from "@/app/lib/cloudinaryUpload";

function dataUrlToBuffer(dataUrl: string): Buffer {
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
}

function bufferToPngDataUrl(buffer: Buffer): string {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

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

  const watermarkedBuffer = await applyWatermark(rawBuffer);
  const previewDataUrl = bufferToPngDataUrl(watermarkedBuffer);

  const [previewUrl, cleanUrl] = await Promise.all([
    uploadResultImage(previewDataUrl, `${toolId}/preview`),
    storeClean ? uploadResultImage(rawDataUrl, `${toolId}/clean`) : Promise.resolve(null),
  ]);

  return { previewUrl, previewDataUrl, cleanUrl };
}
