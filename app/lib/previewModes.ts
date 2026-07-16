import { AFFILIATE_TOOLS, type AffiliateTool } from "@/app/lib/affiliate";

export type PreviewMode = {
  id?: string;
  apiEndpoint: string;
  fallbackStyle: string;
  disclaimer?: string;
  resultCaption: string;
  ctaTool: AffiliateTool | null;
  bottomToolsCaption?: string;
  bottomTools?: AffiliateTool[];
  bottomActions?: Array<"download" | "share">;
  chatMode: "art" | "headshot" | "pet-to-human" | "toy-ification";
  chatTitle: string;
  chatSubtitle: string;
  chatGreeting: string;
  chatPlaceholder: string;
  styleKeywords: string[];
  // Fixed prompt used instead of a per-style picker (single default look for v1).
  promptTemplate?: string;
  negativePrompt?: string;
  strength?: number;
};

export const ART_STYLE_MODE: PreviewMode = {
  apiEndpoint: "/api/preview",
  fallbackStyle: "stylized painting",
  resultCaption: "This is just a preview! Get a dedicated painting tool for even more styles →",
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
    "This is an AI-generated preview, not a real photoshoot. Get a dedicated headshot tool for a more polished result →",
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

export const PET_TO_HUMAN_MODE: PreviewMode = {
  id: "pet-to-human",
  apiEndpoint: "/api/pet-human-preview",
  fallbackStyle: "human",
  // High strength — full species transformation, not an identity-preserving retouch.
  strength: 0.7,
  promptTemplate:
    "Transform this pet photo into a professional studio portrait of a human. " +
    "Keep the same fur color as hair color, same eye color, and an expression that mirrors the pet's personality. " +
    "Reflect the breed's characteristic features in the human's facial structure and styling. " +
    "Photorealistic, sharp focus, high detail, soft studio lighting, warm color grading, portrait orientation.",
  negativePrompt: "cartoon, anime, deformed, extra limbs, blurry, low quality, watermark, text",
  disclaimer: "AI preview — a fun interpretation, not a real transformation. Results vary by photo.",
  resultCaption: "AI-generated preview, not a real photo.",
  ctaTool: null, // TODO: add once Deep Art Effects / PhotoAI.me approved
  bottomActions: ["download", "share"],
  chatMode: "pet-to-human",
  chatTitle: "Pet-to-Human Advisor",
  chatSubtitle: "Powered by AI · ask me about your pet's human look",
  chatGreeting: "Upload a photo of your pet — I'll show you what they might look like as a human!",
  chatPlaceholder: "e.g. What breed traits show up best?",
  styleKeywords: ["human", "person", "portrait"],
};

export const TOY_MODE: PreviewMode = {
  id: "toy-ification",
  apiEndpoint: "/api/toy-preview",
  fallbackStyle: "toy",
  // Moderate strength — keep recognizable likeness while stylizing heavily into toy form.
  strength: 0.55,
  promptTemplate:
    "Transform this person into a highly detailed collectible action figure, packaged in a clear plastic blister pack toy box. " +
    "Keep their hairstyle, hair color, and general likeness recognizable in figure form. " +
    "Toy box has a colorful cardboard backing with accessory icons, product-photography style, studio lighting, " +
    "shallow depth of field, realistic plastic material texture, professional toy-catalog photography, portrait orientation.",
  negativePrompt: "real human skin, blurry, low quality, watermark, text overlap, deformed proportions",
  disclaimer: "AI preview — a fun stylized version, not a real product photo.",
  resultCaption: "AI-generated preview, not a real photo.",
  ctaTool: null, // TODO: add once Deep Art Effects / PhotoAI.me approved
  bottomActions: ["download", "share"],
  chatMode: "toy-ification",
  chatTitle: "Toy-ification Advisor",
  chatSubtitle: "Powered by AI · ask me about your action figure",
  chatGreeting: "Upload your photo — see yourself as a collectible action figure!",
  chatPlaceholder: "e.g. What accessories would suit me?",
  styleKeywords: ["toy", "figure", "action figure"],
};
