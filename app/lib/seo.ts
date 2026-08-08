import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

// Next.js merges metadata between segments *shallowly*: a page that declares
// `openGraph` replaces the layout's entire `openGraph` object rather than
// merging into it (same for `twitter`). So every field a page needs has to be
// present here — omitting `images` or `siteName` would drop og:image and
// og:site_name from the page instead of inheriting them from the root layout.
//
// This helper exists so canonical and og:url are derived from one `path`
// argument and cannot drift apart. Before it, no page declared `openGraph` at
// all, so all 16 routes emitted the homepage's og:title/og:description/og:url
// alongside their own correct canonical.

const OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

type BuildMetadataArgs = {
  /** Shown in the tab, the SERP, and the social card. Aim for <= 60 chars. */
  title: string;
  /** Meta + og + twitter description. Aim for 150-160 chars on ranking pages. */
  description: string;
  /** Route path with a leading slash and no trailing slash; "/" for the homepage. */
  path: string;
  /** og:type — "article" for the guides and comparison posts, "website" otherwise. */
  type?: "website" | "article";
  /**
   * Keep the page out of the index. For utility routes with no ranking value —
   * login, admin. Overrides the root layout's `robots: { index: true }`, which
   * every page otherwise inherits.
   */
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  noindex = false,
}: BuildMetadataArgs): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [OG_IMAGE],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
