import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  configured = true;
}

// Returns null (rather than throwing) when Cloudinary isn't configured or the
// upload fails, so callers can fall back to serving the raw generated image.
export async function uploadResultImage(dataUrl: string, toolId: string): Promise<string | null> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return null;
  }

  ensureConfigured();

  try {
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: `photo-tools/results/${toolId}`,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
}

// Inserts Cloudinary's fl_attachment delivery flag so the browser downloads
// the file (Content-Disposition: attachment) instead of navigating to it —
// plain <a download> is ignored for cross-origin URLs like Cloudinary's, so
// this is what actually makes the download button behave like a download.
export function withAttachmentFlag(url: string): string {
  return url.replace("/upload/", "/upload/fl_attachment/");
}
