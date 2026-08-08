import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/professional-headshot-generator", priority: 0.9, changeFrequency: "weekly" },
  { path: "/linkedin-headshot", priority: 0.8, changeFrequency: "monthly" },
  { path: "/author-headshot", priority: 0.8, changeFrequency: "monthly" },
  { path: "/credits", priority: 0.8, changeFrequency: "monthly" },
  { path: "/professional-headshots-vs-ai-headshots", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides/best-ai-inpainting-tools-2026", priority: 0.7, changeFrequency: "monthly" },
  { path: "/guides/ai-headshot-vs-photographer", priority: 0.7, changeFrequency: "monthly" },
  { path: "/guides/linkedin-premium-review", priority: 0.7, changeFrequency: "monthly" },
  { path: "/guides/best-resume-builders", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund", priority: 0.3, changeFrequency: "yearly" },
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
