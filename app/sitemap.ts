import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

// Remember: add every new route here when a new page ships.
const routes: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 }, // homepage — also the art-style tool itself, no separate route
  { path: "/professional-headshot-generator", priority: 0.9 },
  { path: "/pet-to-human", priority: 0.9 },
  { path: "/toy-ification", priority: 0.9 },
  { path: "/photo-mix", priority: 0.9 },
  { path: "/best-photo-to-painting-ai-tools-2026", priority: 0.8 },
  { path: "/deep-art-effects-vs-photoai", priority: 0.8 },
  { path: "/van-gogh-style-ai-filter-top-tools", priority: 0.8 },
  { path: "/credits", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  // /login and /admin/* intentionally excluded — not content pages, nothing to index.
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
