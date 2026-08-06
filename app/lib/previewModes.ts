import type { AffiliateTool } from "@/app/lib/affiliate";
import type { AccentName } from "@/app/lib/accent";
import { HEADSHOT_STYLES } from "@/app/lib/headshotStyles";

export type PreviewMode = {
  id?: string;
  accent: AccentName;
  apiEndpoint: string;
  fallbackStyle: string;
  disclaimer?: string;
  resultCaption: string;
  ctaTool: AffiliateTool | null;
  bottomToolsCaption?: string;
  bottomTools?: AffiliateTool[];
  bottomActions?: Array<"download" | "share">;
  styleKeywords: string[];
  negativePrompt?: string;
  styleTabs?: { id: string; label: string }[];
  cardTagline: string;
};

export const HEADSHOT_MODE: PreviewMode = {
  id: "headshot",
  accent: "teal-muted",
  cardTagline: "let's make it official",
  apiEndpoint: "/api/headshot-preview",
  fallbackStyle: "linkedin",
  disclaimer:
    "AI preview — may not perfectly match a real photoshoot. Best for casual profile use.",
  resultCaption:
    "AI-generated preview — watermarked. Unlock HD (no watermark) with 1 credit →",
  ctaTool: null,
  negativePrompt: "blur, distortion, cartoon, anime, low quality, watermark, text",
  styleTabs: HEADSHOT_STYLES.map(({ id, label }) => ({ id, label })),
  styleKeywords: ["corporate", "linkedin", "studio portrait", "creative professional"],
};

// Re-export ART_STYLE_MODE as an alias so any remaining import doesn't break
// during the transition — UploadBox still declares it as default prop.
export const ART_STYLE_MODE = HEADSHOT_MODE;
