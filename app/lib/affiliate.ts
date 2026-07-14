export type AffiliateTool = {
  id: "deep-art-effects" | "photoai";
  name: string;
  tagline: string;
  url: string;
  bestFor: string;
};

// TODO: replace `url` with your real affiliate/referral links once approved.
export const AFFILIATE_TOOLS: Record<AffiliateTool["id"], AffiliateTool> = {
  "deep-art-effects": {
    id: "deep-art-effects",
    name: "Deep Art Effects",
    tagline: "Desktop & mobile AI painting filters, 100+ art styles",
    url: "https://deeparteffects.com/",
    bestFor: "Classic painting styles (Van Gogh, Monet, oil, watercolor) and batch photo processing",
  },
  photoai: {
    id: "photoai",
    name: "PhotoAI",
    tagline: "AI photo generator for stylized portraits & avatars",
    url: "https://photoai.com/",
    bestFor: "Turning selfies into stylized AI portraits and avatars",
  },
};
