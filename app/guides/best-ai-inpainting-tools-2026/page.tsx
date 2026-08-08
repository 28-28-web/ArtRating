import type { Metadata } from "next";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Best AI Inpainting Tools 2026 — Ranked After Testing Each One",
  description:
    "The best AI inpainting tools in 2026, ranked by quality, speed, and value. Covers background replacement, object removal, and professional headshot transformation.",
  alternates: { canonical: "/guides/best-ai-inpainting-tools-2026" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best AI Inpainting Tools 2026 — Ranked After Testing Each One",
  description:
    "The best AI inpainting tools in 2026, ranked by quality, speed, and value. Covers background replacement, object removal, and professional headshot transformation.",
  datePublished: "2026-08-08",
  dateModified: "2026-08-08",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME },
  mainEntityOfPage: `${SITE_URL}/guides/best-ai-inpainting-tools-2026`,
};

const TOOLS = [
  {
    rank: "1",
    name: "HeadshotMaker AI — Best for Professional Portraits",
    price: "Free preview · paid download from ~$5",
    url: "/professional-headshot-generator",
    external: false,
    body: "HeadshotMaker AI uses instruction-based image editing (FLUX.1 Kontext for logged-in users) to replace backgrounds and transform portrait photos into professional headshots. Unlike general-purpose inpainting tools, it's purpose-built for people — identity is preserved, results are consistent, and 22+ professional styles are a single click away. The free tier gives you 6 watermarked previews with no signup.",
    pro: "Identity-preserving, purpose-built for portraits, genuinely fast",
    con: "Focused on headshots — not a general-purpose inpainting tool",
  },
  {
    rank: "2",
    name: "Adobe Firefly — Best for Creative Professionals",
    price: "Included in Creative Cloud ($55/month) · limited free tier",
    url: "https://firefly.adobe.com",
    external: true,
    body: "Adobe Firefly's generative fill and background generation are polished and commercially safe (trained on licensed images). Inpainting quality is high for objects and environments, though portrait results can be inconsistent — identity preservation isn't a design priority.",
    pro: "Commercial licensing, deep Photoshop integration, high ceiling",
    con: "Expensive standalone, inconsistent on faces",
  },
  {
    rank: "3",
    name: "Clipdrop (Stability AI) — Best Free Option",
    price: "Free tier available · Pro from $9/month",
    url: "https://clipdrop.co",
    external: true,
    body: "Clipdrop's background removal and replacement is fast and requires no technical setup. The inpainting results for objects and backgrounds are solid for the price. Portrait-specific work is hit-or-miss — it doesn't attempt to preserve facial identity the way purpose-built tools do.",
    pro: "Generous free tier, clean UI, fast background swap",
    con: "Not identity-aware, no portrait-specific modes",
  },
  {
    rank: "4",
    name: "Runway ML Gen-3 — Best for Video & Advanced Use",
    price: "From $15/month",
    url: "https://runwayml.com",
    external: true,
    body: "Runway's inpainting shines for video frames and complex scene editing. For still portrait photos, it's overkill — the UI is production-oriented and assumes familiarity with AI pipelines. Excellent results when you invest the time, but not a beginner tool.",
    pro: "Best-in-class for video inpainting, extremely powerful",
    con: "Steep learning curve, expensive for casual use",
  },
  {
    rank: "5",
    name: "Canva Magic Edit — Best for Non-Technical Users",
    price: "Free with Canva · Pro from ~$13/month",
    url: "https://canva.com",
    external: true,
    body: "Canva's Magic Edit and background replace are accessible to non-technical users — select an area, describe what you want, done. Quality is adequate for social media use but limited for precise work. Good for replacing simple backgrounds on casual photos.",
    pro: "Easiest to use, great for social media, built into Canva",
    con: "Limited precision, outputs best at social-media resolution",
  },
  {
    rank: "6",
    name: "AUTOMATIC1111 / ComfyUI — Best for Full Control",
    price: "Free (self-hosted)",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    external: true,
    body: "Running Stable Diffusion locally gives you unlimited generations and total control over every parameter — model, sampler, inpainting mask, strength, and more. For portrait inpainting, combining SD with a face-restoration model (GFPGAN, CodeFormer) produces excellent results. The barrier: you need a capable GPU and patience for setup.",
    pro: "Free, unlimited, maximum control and quality ceiling",
    con: "Requires GPU, technical setup, no hand-holding",
  },
];

export default function BestAiInpaintingTools2026Page() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Best AI Inpainting Tools 2026
        </h1>
        <BrushDivider className="mt-2" />
        <p className="mt-3 text-xs text-ink-soft">8 min read · Updated August 2026</p>
      </div>

      <p className="text-lg text-ink">
        The best AI inpainting tools in 2026 have moved far beyond basic background removal — the
        best ones can swap environments, erase objects, and transform entire scenes while keeping
        the subject intact. These six tools cover the range from one-click portrait tools to
        full-control local pipelines.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">What to Look For</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li><strong className="text-ink">Identity preservation</strong> — critical for portrait use; many tools ignore this entirely</li>
          <li><strong className="text-ink">Output resolution</strong> — web-only tools max out at ~1024px; check before paying</li>
          <li><strong className="text-ink">Commercial licensing</strong> — matters if you&apos;re using outputs professionally</li>
          <li><strong className="text-ink">Speed</strong> — cloud tools vary 10–60 seconds; local models depend on your GPU</li>
          <li><strong className="text-ink">Free tier</strong> — most tools offer limited free use before paywall</li>
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        {TOOLS.map((tool) => (
          <div key={tool.rank} className="flex flex-col gap-2 rounded-2xl border border-border-soft p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-ink-soft">#{tool.rank}</span>
                <h2 className="font-display text-lg font-semibold text-ink">{tool.name}</h2>
                <p className="text-xs text-ink-soft">{tool.price}</p>
              </div>
              {tool.external ? (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full border border-border-soft px-3 py-1 text-xs hover:bg-border-soft"
                >
                  Visit ↗
                </a>
              ) : (
                <Link
                  href={tool.url}
                  className="shrink-0 rounded-full border border-border-soft px-3 py-1 text-xs hover:bg-border-soft"
                >
                  Try free →
                </Link>
              )}
            </div>
            <p className="text-sm text-ink">{tool.body}</p>
            <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
              <p className="text-ink-soft"><span className="font-medium text-green-700 dark:text-green-400">✓ Best for:</span> {tool.pro}</p>
              <p className="text-ink-soft"><span className="font-medium text-red-700 dark:text-red-400">✗ Limitation:</span> {tool.con}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Which Should You Use?</h2>
        <p className="text-ink">
          For <strong>professional portraits and headshots</strong>: start with HeadshotMaker AI —
          it&apos;s the only tool in this list built specifically to keep your face consistent
          across styles, and the free tier means there&apos;s nothing to lose testing it.
        </p>
        <p className="text-ink">
          For <strong>general object removal or scene editing</strong>: Clipdrop is the best
          free option, and Adobe Firefly is the best paid option if you&apos;re already in the
          Creative Cloud ecosystem.
        </p>
        <p className="text-ink">
          For <strong>advanced or unlimited use</strong>: AUTOMATIC1111 is unbeatable if
          you have a GPU and are willing to spend an afternoon setting it up.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Try AI Headshots Free</h2>
        <div className="rounded-2xl border border-border-soft p-6 text-center">
          <p className="text-ink">
            HeadshotMaker AI — 6 free previews, no signup. Upload a photo, pick a style, done.
          </p>
          <Link
            href="/professional-headshot-generator"
            className="mt-3 inline-block rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas hover:opacity-90"
          >
            Generate my free headshot →
          </Link>
        </div>
      </section>
    </main>
  );
}
