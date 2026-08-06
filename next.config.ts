import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Hidden-tool routes (see SiteNav.tsx/HeroGallery.tsx/page.tsx) — page code
  // is untouched and still works if these are visited, but redirect them so
  // they're not independently reachable/indexable either. permanent: true
  // sends a 308 here, not a 301 — this Next version replaced 301/302 with
  // 308/307 specifically to preserve the original request method on
  // redirect (a 301 can get rewritten to GET by some clients even for a
  // non-GET request). For a plain page visit (GET) a 308 behaves exactly
  // like a 301: permanent, cached, passes SEO signal — this is Next's
  // built-in mechanism for exactly this. No /art-style route exists to
  // redirect — that tool lives on the homepage itself, not a separate page.
  async redirects() {
    return [
      // Catch-all for old tool URLs — 308 so backlinks/bookmarks land on homepage
      // rather than 404. /coloring-page-generator, /pet-to-human, etc. all redirect
      // here. :path* prevents redirecting *headshot* routes that start with these prefixes.
      { source: "/pet-to-human/:path*", destination: "/", permanent: true },
      { source: "/toy-ification/:path*", destination: "/", permanent: true },
      { source: "/photo-mix/:path*", destination: "/", permanent: true },
      { source: "/coloring-page-generator/:path*", destination: "/", permanent: true },
      { source: "/coloring-page-generator", destination: "/", permanent: true },
      { source: "/free-ai-coloring-page-generator/:path*", destination: "/", permanent: true },
      { source: "/free-ai-coloring-page-generator", destination: "/", permanent: true },
      { source: "/photo-to-coloring-page/:path*", destination: "/", permanent: true },
      { source: "/photo-to-coloring-page", destination: "/", permanent: true },
      { source: "/ai-coloring-book-generator/:path*", destination: "/", permanent: true },
      { source: "/ai-coloring-book-generator", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
