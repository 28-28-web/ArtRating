import type { Metadata } from "next";
import Link from "next/link";
import HomeInteractive from "@/app/components/HomeInteractive";
import HeroGallery from "@/app/components/HeroGallery";
import HeadshotShowcase from "@/app/components/HeadshotShowcase";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";
import { FREE_GENERATION_CAP } from "@/app/lib/generationGate";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The Art Style tool lives directly on the homepage (no separate route),
// so "hiding" it means not rendering this section — temporarily disabled
// per site owner request, same flag/reasoning as SiteNav.tsx's TOOLS list.
// Component/code untouched, just not mounted.
const SHOW_ART_STYLE_TOOL = false;

// Positions/sizes/delays are hand-varied so the four dabs don't float in
// sync — purely decorative, hidden on mobile and paused under
// prefers-reduced-motion (see .paint-dab-bg in globals.css).
const HERO_DABS = [
  { color: "var(--cobalt)", top: "8%", left: "6%", size: 120, delay: "0s" },
  { color: "var(--jade)", top: "55%", left: "88%", size: 90, delay: "1.5s" },
  { color: "var(--saffron)", top: "82%", left: "18%", size: 100, delay: "3s" },
  { color: "var(--magenta)", top: "4%", left: "72%", size: 80, delay: "4.5s" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Turn any photo into a professional AI headshot for LinkedIn, resumes, and portfolios. Free to try, no signup needed.",
    },
  ],
};

// No aggregateRating field here — the site has no real review/rating system
// behind it yet, and Google's structured-data guidelines treat a fabricated
// rating as a policy violation (can trigger a manual action on rich
// results). Add it once genuine ratings exist to back it up.
const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "PhotoApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: "AI-powered professional headshot generator for LinkedIn, resumes, and portfolios.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to try, no signup needed",
  },
};

const cheapestPack = CREDIT_PACKS[0];

// Kept in sync with the visible FAQ section below — numbers pulled from the
// real gating logic (generationGate.ts) and pricing (creditPacks.ts) rather
// than hardcoded, so this can't silently drift out of date the way the
// spec's own "2 credits" / "$5" figures already had (actual free tier is
// generations, not credits, and pricing is in BDT, not USD).
const FAQS = [
  {
    question: "How does HeadshotMaker AI work?",
    answer:
      "Upload any photo, choose a style — Corporate, Creative, or Executive — and our AI generates a professional headshot in seconds. No signup needed for the free preview.",
  },
  {
    question: "Is HeadshotMaker AI free?",
    answer: `Yes — generating a preview is free and doesn't require an account, with ${FREE_GENERATION_CAP} free generations shared across the site. Downloading the full-quality, watermark-free file needs an account and costs 1 credit; packs start at ${cheapestPack.priceLabel} for ${cheapestPack.credits} credits.`,
  },
  {
    question: "How long does it take to generate a headshot?",
    answer:
      "AI headshot generation takes seconds. You get an instant preview and can download the full-resolution version once you're happy with it.",
  },
  {
    question: "Are my photos stored?",
    answer:
      "No. Uploaded photos are deleted within 24 hours and are never used to train AI models.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <main className="flex w-full max-w-5xl flex-1 flex-col items-center gap-16 px-6 py-16">
        <div className="hero-decorative flex w-full flex-col items-center gap-16">
          {HERO_DABS.map((dab, i) => (
            <span
              key={i}
              className="paint-dab-bg"
              aria-hidden="true"
              style={{
                background: dab.color,
                top: dab.top,
                left: dab.left,
                width: dab.size,
                height: dab.size,
                animationDelay: dab.delay,
              }}
            />
          ))}

          <section className="flex flex-col items-center gap-4 text-center">
            <h1 className="headline-in max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Turn Any Photo Into a Professional Headshot
            </h1>
            <BrushDivider />
            <p className="max-w-xl text-lg text-ink-soft">
              Upload your photo and get a professional AI headshot in seconds. Perfect for{" "}
              <Link href="/guides/linkedin-premium-review" className="underline hover:text-accent-text">
                LinkedIn
              </Link>
              , resumes, and portfolios.
            </p>
          </section>

          <section className="flex w-full flex-col items-center gap-6 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              How HeadshotMaker AI Works
            </h2>
            <div className="grid w-full gap-4 sm:grid-cols-3">
              {[
                { step: "1", title: "Upload your photo", body: "Any clear photo of your face works." },
                { step: "2", title: "Choose your style", body: "Corporate, Creative, or Executive." },
                { step: "3", title: "Download in seconds", body: "Get your full-resolution headshot." },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-border-soft p-4">
                  <p className="font-display text-lg font-semibold text-ink">
                    {item.step}. {item.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <HeroGallery />
        </div>

        <section className="flex w-full flex-col items-center gap-10">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            AI Headshot Styles
          </h2>
          <HeadshotShowcase />
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Frequently Asked Questions</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-border-soft p-4">
                <p className="font-medium text-ink">{faq.question}</p>
                <p className="mt-1 text-sm text-ink-soft">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {SHOW_ART_STYLE_TOOL && <HomeInteractive />}

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Guides &amp; Comparisons</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/best-photo-to-painting-ai-tools-2026"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">Best AI headshot generators 2026</p>
              <p className="mt-1 text-sm text-ink-soft">Our top picks, ranked and compared.</p>
            </Link>
            <Link
              href="/deep-art-effects-vs-photoai"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">LinkedIn headshot tips</p>
              <p className="mt-1 text-sm text-ink-soft">What makes a profile photo get more views.</p>
            </Link>
            <Link
              href="/van-gogh-style-ai-filter-top-tools"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">AI headshot vs photographer</p>
              <p className="mt-1 text-sm text-ink-soft">Cost, quality, and turnaround compared.</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
