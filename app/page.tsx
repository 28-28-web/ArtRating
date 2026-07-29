import type { Metadata } from "next";
import Link from "next/link";
import HomeInteractive from "@/app/components/HomeInteractive";
import HeroSection from "@/app/components/HeroSection";
import HeadshotShowcase from "@/app/components/HeadshotShowcase";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";
import { FREE_GENERATION_CAP } from "@/app/lib/generationGate";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata: Metadata = {
  title: "HeadshotMaker AI — Free AI Headshot Generator | Professional Results in 30s",
  description:
    "Generate studio-quality professional headshots from any selfie using AI. Perfect for LinkedIn, Amazon author pages, and resumes. Free to try — no signup needed.",
  alternates: { canonical: "/" },
};

// The Art Style tool lives directly on the homepage (no separate route),
// so "hiding" it means not rendering this section — temporarily disabled
// per site owner request, same flag/reasoning as SiteNav.tsx's TOOLS list.
// Component/code untouched, just not mounted.
const SHOW_ART_STYLE_TOOL = false;

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

const cheapestPack = CREDIT_PACKS[0];

// No aggregateRating field here — the site has no real review/rating system
// behind it yet, and Google's structured-data guidelines treat a fabricated
// rating as a policy violation (can trigger a manual action on rich
// results). Add it once genuine ratings exist to back it up.
//
// applicationCategory stays "PhotoApplication" — schema.org's actual
// enumerated ApplicationCategory values don't include "PhotoEditingApplication";
// using a non-existent category risks the whole block being ignored rather
// than helping.
//
// offers is an array (schema.org allows multiple Offer entries) so it can
// honestly represent both real price points: generating a preview is
// genuinely free, and $5 is the real starting price for a credit pack
// (download/watermark removal), not the cost to use the app itself.
const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "PhotoApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: "AI-powered professional headshot generator for LinkedIn, resumes, and portfolios.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to try, no signup needed",
    },
    {
      "@type": "Offer",
      price: cheapestPack.priceLabel.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      description: `Starter pack — ${cheapestPack.credits} credits for watermark-free downloads`,
    },
  ],
};

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
    answer: `Try free — ${FREE_GENERATION_CAP} headshots with watermark, no signup. Remove watermark — from ${cheapestPack.priceLabel}. Downloading the full-quality, watermark-free file needs an account and costs 1 credit; packs start at ${cheapestPack.priceLabel} for ${cheapestPack.credits} credits.`,
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
      <HeroSection freeGenerationCap={FREE_GENERATION_CAP} />

      <main className="flex w-full max-w-5xl flex-1 flex-col items-center gap-16 px-6 py-16">
        <section id="examples" className="flex w-full flex-col items-center gap-10">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            AI Headshot Styles
          </h2>
          <HeadshotShowcase />
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">More AI Headshot Tools</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/professional-headshot-generator"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">AI Headshot Generator</p>
              <p className="mt-1 text-sm text-ink-soft">The main tool — upload, choose a style, download.</p>
            </Link>
            <Link
              href="/linkedin-headshot"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">LinkedIn Headshot Generator</p>
              <p className="mt-1 text-sm text-ink-soft">Built for LinkedIn profile photos specifically.</p>
            </Link>
            <Link
              href="/author-headshot"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">Author Headshot Generator</p>
              <p className="mt-1 text-sm text-ink-soft">For book covers and Amazon author pages.</p>
            </Link>
          </div>
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
