import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

// `lastModified` is the date that page's CONTENT last meaningfully changed —
// bump it by hand when you edit a page, the same way you already bump
// `dateModified` in a page's Article JSON-LD.
//
// Deliberately not derived from `git log`: commit 2be9933 touched all 16
// page.tsx files in one metadata refactor, which would have stamped every URL
// with an identical date and reproduced exactly the bug this replaced (every
// page claiming to change on every deploy). Git tracks file churn, not content
// change, so any site-wide lint or token pass would flatten these again.
//
// Where a page declares its own date — Article JSON-LD `dateModified`, or a
// visible "Last updated" line — these values match it, because Google
// cross-checks the two and a disagreement discredits both.
//
// TODO: these dates are duplicated between here, each page's JSON-LD
// `dateModified`, and the visible "Last updated" text. A shared
// app/lib/contentDates.ts consumed by all three would make them impossible to
// desync.
const routes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified: string;
}[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly", lastModified: "2026-08-08" },
  { path: "/professional-headshot-generator", priority: 0.9, changeFrequency: "weekly", lastModified: "2026-08-06" },
  { path: "/linkedin-headshot", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-07-29" },
  { path: "/author-headshot", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-07-29" },
  { path: "/credits", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-06" },
  { path: "/professional-headshots-vs-ai-headshots", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-08-08" },
  { path: "/guides", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-08-08" },
  { path: "/guides/best-ai-inpainting-tools-2026", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-08-08" },
  { path: "/guides/ai-headshot-vs-photographer", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-07-28" },
  { path: "/guides/linkedin-premium-review", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-07-28" },
  { path: "/guides/best-resume-builders", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-07-28" },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly", lastModified: "2026-07-27" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-08-08" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-08-08" },
  { path: "/refund", priority: 0.3, changeFrequency: "yearly", lastModified: "2026-07-28" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(`${route.lastModified}T00:00:00Z`),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
