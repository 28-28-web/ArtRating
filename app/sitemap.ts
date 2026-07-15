import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/best-photo-to-painting-ai-tools-2026",
    "/deep-art-effects-vs-photoai",
    "/van-gogh-style-ai-filter-top-tools",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
