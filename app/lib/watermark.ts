import sharp from "sharp";

const WATERMARK_TEXT = "PAINTIFY";

// Tiled, rotated, semi-transparent text laid over the whole image — this is
// what makes the on-screen preview different from the paid download. Pure
// sharp (no extra deps): build an SVG of the tiled text, composite it over
// the source raster, flatten to PNG.
export async function applyWatermark(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const meta = await image.metadata();
  const width = meta.width ?? 800;
  const height = meta.height ?? 800;

  const overlay = Buffer.from(buildWatermarkSvg(width, height));

  return image.composite([{ input: overlay, top: 0, left: 0 }]).png().toBuffer();
}

function buildWatermarkSvg(width: number, height: number): string {
  const tileSize = Math.max(140, Math.round(Math.min(width, height) / 4));
  const fontSize = Math.round(tileSize * 0.16);
  const rows = Math.ceil(height / tileSize) + 2;
  const cols = Math.ceil(width / tileSize) + 2;

  let texts = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Offset every other row so the tiling reads as a diagonal pattern
      // rather than a rigid grid.
      const x = c * tileSize - tileSize / 2 + (r % 2 ? tileSize / 2 : 0);
      const y = r * tileSize - tileSize / 2;
      texts += `<text x="${x}" y="${y}" transform="rotate(-30 ${x} ${y})" font-family="sans-serif" font-weight="600" font-size="${fontSize}" fill="#ffffff" fill-opacity="0.32" stroke="#000000" stroke-opacity="0.12" stroke-width="1">${WATERMARK_TEXT}</text>`;
    }
  }

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${texts}</svg>`;
}
