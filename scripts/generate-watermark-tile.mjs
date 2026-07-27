// Regenerates public/watermark-tile.png with the correct brand name.
// Same technique as the original (baked-at-authoring-time PNG, not
// request-time SVG-to-raster) — see the comment in app/lib/watermark.ts for
// why: live text rendering via sharp/librsvg silently drew zero glyphs in
// production (missing fontconfig/fonts on that container), which is exactly
// the bug this pre-bake approach avoids. This sandbox can render fonts fine,
// so generating the static asset here and committing it is safe; only
// request-time rendering was ever the problem.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SIZE = 260;
const svg = `
<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <text
    x="${SIZE / 2}"
    y="${SIZE / 2}"
    font-family="Arial, sans-serif"
    font-size="26"
    font-weight="700"
    letter-spacing="1"
    fill="rgba(255,255,255,0.35)"
    text-anchor="middle"
    dominant-baseline="middle"
    transform="rotate(-30 ${SIZE / 2} ${SIZE / 2})"
  >HeadshotMaker AI</text>
</svg>
`;

const buf = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(new URL("../public/watermark-tile.png", import.meta.url), buf);
console.log("Wrote public/watermark-tile.png", buf.length, "bytes");
