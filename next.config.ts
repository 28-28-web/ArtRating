import type { NextConfig } from "next";

// Content-Security-Policy — deliberately permissive starting point.
// 'unsafe-inline' in script-src is required: Next.js emits inline <script>
// blocks for JSON-LD, theme init, and hydration. Tighten to nonce-based CSP
// once Next.js nonce support is wired into middleware.
// Cloudflare's `Server: cloudflare` header is set by Cloudflare itself and
// cannot be removed in application code — control it in CF Transform Rules.
const CSP = [
  "default-src 'self'",
  // Microsoft Clarity spans four hosts, and every one of them needs a grant or
  // the whole thing silently records nothing:
  //   www.clarity.ms/tag/<id>       script-src   bootstrap loader
  //   scripts.clarity.ms/<v>/...    script-src   the actual library
  //   r.clarity.ms/collect          connect-src  session data upload (XHR)
  //   c.clarity.ms/c.gif            img-src      tracking pixel
  // Only www.clarity.ms was allowed before, so the library never loaded and
  // the dashboard received zero sessions. r.clarity.ms in particular is
  // invisible until the library runs, so it cannot be found by reading source.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://www.google-analytics.com https://c.clarity.ms",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.clarity.ms https://c.clarity.ms https://r.clarity.ms",
  "font-src 'self'",
  "frame-src https://checkout.paddle.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: CSP },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
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
      // Legacy /art/* rating URLs from old platform — no pages exist, redirect home
      { source: "/art/:path*", destination: "/", permanent: true },
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
      // Paintify affiliate pages (added in dcdb860, missed by the headshot-only
      // cleanup in 8244d81). Off-topic art-filter content promoting third-party
      // tools — one of them, PhotoAI, is a direct competitor. Removed rather
      // than kept: they were absent from the sitemap and had no inbound links,
      // so they were never indexable anyway.
      { source: "/best-photo-to-painting-ai-tools-2026/:path*", destination: "/", permanent: true },
      { source: "/best-photo-to-painting-ai-tools-2026", destination: "/", permanent: true },
      { source: "/deep-art-effects-vs-photoai/:path*", destination: "/", permanent: true },
      { source: "/deep-art-effects-vs-photoai", destination: "/", permanent: true },
      { source: "/van-gogh-style-ai-filter-top-tools/:path*", destination: "/", permanent: true },
      { source: "/van-gogh-style-ai-filter-top-tools", destination: "/", permanent: true },
      // Cannibalization merge: this page and /guides/ai-headshot-vs-photographer
      // targeted the same intent with the same table, the same $150-$500 and
      // 1-3 week figures, and the same unsourced "90% of professionals" line.
      // GSC over 3 months: the guide had 1 click / 8 impressions, this had 0/0,
      // so the guide survives and its unique sections were merged in first.
      // Redirects to the survivor, not the homepage — the intent still matches.
      { source: "/professional-headshots-vs-ai-headshots/:path*", destination: "/guides/ai-headshot-vs-photographer", permanent: true },
      { source: "/professional-headshots-vs-ai-headshots", destination: "/guides/ai-headshot-vs-photographer", permanent: true },
    ];
  },
};

export default nextConfig;
