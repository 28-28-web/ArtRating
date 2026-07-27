import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

// Remember: add every new route here when a new page ships. Only real,
// directly-reachable pages belong here — /pet-to-human, /toy-ification, and
// /photo-mix are deliberately excluded because next.config.ts 308-redirects
// them to "/"; listing a redirecting URL in the sitemap just wastes crawl
// budget. /guides/* are excluded too until those pages actually exist (see
// SiteNav.tsx) — submitting known-404 URLs to search engines is worse than
// not listing them at all.
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/professional-headshot-generator", priority: 0.9, changeFrequency: "weekly" },
  { path: "/credits", priority: 0.8, changeFrequency: "monthly" },
  { path: "/best-photo-to-painting-ai-tools-2026", priority: 0.7, changeFrequency: "monthly" },
  { path: "/deep-art-effects-vs-photoai", priority: 0.7, changeFrequency: "monthly" },
  { path: "/van-gogh-style-ai-filter-top-tools", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund", priority: 0.3, changeFrequency: "yearly" },
  // /login and /admin/* intentionally excluded — not content pages, nothing to index.
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
