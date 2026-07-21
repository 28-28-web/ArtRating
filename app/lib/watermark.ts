import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Pre-rendered PNG tile instead of rendering "PAINTIFY" text at request time
// via an SVG-to-raster composite. The SVG-text approach depended on
// fontconfig + an installed font being present in the runtime container —
// node:24-slim has neither, so sharp/librsvg silently drew zero glyphs
// ("Fontconfig error: Cannot load default config file" in the logs, byte
// count still went up from the alpha-channel structure sharp adds, which is
// why the bug looked like a successful-but-invisible watermark). Baking the
// text into a static asset at authoring time removes the runtime dependency
// on fonts entirely — tiling a raster image needs no font rendering at all.
// See public/watermark-tile.png (240x240, transparent, one rotated wordmark
// per tile — sharp's `tile: true` composite repeats it across the image).
const TILE_PATH = path.join(process.cwd(), "public", "watermark-tile.png");

let cachedTile: Buffer | null = null;

async function loadTile(): Promise<Buffer> {
  if (!cachedTile) {
    cachedTile = await readFile(TILE_PATH);
  }
  return cachedTile;
}

export async function applyWatermark(buffer: Buffer): Promise<Buffer> {
  const tile = await loadTile();
  return sharp(buffer)
    .composite([{ input: tile, tile: true, blend: "over" }])
    .png()
    .toBuffer();
}
