import sharp from "sharp";
import { writeFileSync } from "node:fs";

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0f0f0f"/>
  <circle cx="270" cy="315" r="90" fill="none" stroke="#378ADD" stroke-width="2" opacity="0.5"/>
  <circle cx="270" cy="255" r="26" fill="#378ADD" opacity="0.85"/>
  <circle cx="330" cy="285" r="26" fill="#378ADD" opacity="0.7"/>
  <circle cx="330" cy="345" r="26" fill="#378ADD" opacity="0.55"/>
  <circle cx="270" cy="375" r="26" fill="#378ADD" opacity="0.4"/>
  <circle cx="210" cy="345" r="26" fill="#378ADD" opacity="0.55"/>
  <circle cx="210" cy="285" r="26" fill="#378ADD" opacity="0.7"/>
  <circle cx="270" cy="315" r="22" fill="#378ADD"/>
  <text x="270" y="323" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">AI</text>
  <text x="440" y="300" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff">HeadshotMaker AI</text>
  <text x="440" y="350" font-family="Arial, sans-serif" font-size="30" font-weight="400" fill="#b8b8b8">Professional AI Headshots in Seconds</text>
</svg>
`;

const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
writeFileSync(new URL("../public/og-image.jpg", import.meta.url), buf);
console.log("Wrote public/og-image.jpg", buf.length, "bytes");
