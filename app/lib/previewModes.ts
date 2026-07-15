import { AFFILIATE_TOOLS, type AffiliateTool } from "@/app/lib/affiliate";

export type PreviewMode = {
  apiEndpoint: string;
  fallbackStyle: string;
  disclaimer?: string;
  resultCaption: string;
  ctaTool: AffiliateTool;
  bottomToolsCaption: string;
  bottomTools: AffiliateTool[];
  chatMode: "art" | "headshot";
  chatTitle: string;
  chatSubtitle: string;
  chatGreeting: string;
  chatPlaceholder: string;
  styleKeywords: string[];
};

export const ART_STYLE_MODE: PreviewMode = {
  apiEndpoint: "/api/preview",
  fallbackStyle: "stylized painting",
  resultCaption: "This is just a preview! Get the full HD, watermark-free version →",
  ctaTool: AFFILIATE_TOOLS["deep-art-effects"],
  bottomToolsCaption: "Nice photo! Turn it into a painting with one of our recommended tools:",
  bottomTools: Object.values(AFFILIATE_TOOLS),
  chatMode: "art",
  chatTitle: "Art Style Advisor",
  chatSubtitle: "Powered by AI · tells you which tool fits your style",
  chatGreeting:
    "Hi! What art style do you want for your photo — Van Gogh, oil painting, watercolor, anime, or a stylized AI portrait?",
  chatPlaceholder: "e.g. Van Gogh style",
  styleKeywords: [
    "van gogh",
    "watercolor",
    "oil painting",
    "anime",
    "monet",
    "pop art",
    "portrait",
    "avatar",
  ],
};

export const HEADSHOT_MODE: PreviewMode = {
  apiEndpoint: "/api/headshot-preview",
  fallbackStyle: "corporate",
  disclaimer:
    "AI preview — may not perfectly match a real photoshoot. Best for casual profile use.",
  resultCaption:
    "This is an AI-generated preview, not a real photoshoot. Get a polished, watermark-free version →",
  ctaTool: AFFILIATE_TOOLS.photoai,
  bottomToolsCaption: "Want a polished headshot? Try our recommended AI photo tool:",
  bottomTools: [AFFILIATE_TOOLS.photoai],
  chatMode: "headshot",
  chatTitle: "Headshot Style Advisor",
  chatSubtitle: "Powered by AI · tells you which headshot look fits you",
  chatGreeting:
    "Hi! What kind of headshot look do you want — Corporate, LinkedIn, Studio Portrait, or Creative Professional?",
  chatPlaceholder: "e.g. Corporate style",
  styleKeywords: ["corporate", "linkedin", "studio portrait", "creative professional"],
};
