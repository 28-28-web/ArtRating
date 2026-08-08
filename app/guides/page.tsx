import type { Metadata } from "next";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_URL } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Guides — AI Headshots, LinkedIn, and Career Tools | HeadshotMaker AI",
  description:
    "Honest, tested guides on AI headshots, LinkedIn profiles, and the tools job seekers actually pay for — including what's worth the money and what isn't.",
  alternates: { canonical: "/guides" },
};

type Guide = {
  href: string;
  title: string;
  excerpt: string;
};

// Every page under app/guides/. Keep this in sync when adding a guide —
// the breadcrumb on each guide page links back here, so an unlisted guide
// becomes a dead end rather than part of the cluster.
const GUIDES: Guide[] = [
  {
    href: "/guides/ai-headshot-vs-photographer",
    title: "AI Headshot vs Professional Photographer",
    excerpt:
      "AI headshots cost $5-39 and take 30 seconds. Photographers cost $200-500 and take 2 weeks. When each one is the right call.",
  },
  {
    href: "/guides/best-ai-inpainting-tools-2026",
    title: "Best AI Inpainting Tools 2026",
    excerpt:
      "Ranked by quality, speed, and value — covering background replacement, object removal, and headshot transformation.",
  },
  {
    href: "/guides/best-resume-builders",
    title: "7 Best Resume Builders 2026",
    excerpt:
      "The resume builders worth paying for, ranked by value, template range, and how quickly you can get to a finished draft.",
  },
  {
    href: "/guides/linkedin-premium-review",
    title: "LinkedIn Premium Review 2026",
    excerpt:
      "Is it worth $39/month? A breakdown of the features, the pricing tiers, and whether job seekers actually need it.",
  },
];

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "HeadshotMaker AI Guides",
  itemListElement: GUIDES.map((guide, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: guide.title,
    url: `${SITE_URL}${guide.href}`,
  })),
};

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }}
      />

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Guides
        </h1>
        <BrushDivider className="mt-2" />
        <p className="mt-3 text-ink">
          Practical write-ups on getting a professional photo, building a profile that gets
          replies, and which career tools are actually worth paying for.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">{guide.title} →</p>
            <p className="mt-1 text-sm text-ink-soft">{guide.excerpt}</p>
          </Link>
        ))}
      </div>

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Try the generator</h2>
        <p className="text-ink">
          Most of these guides end at the same place: you need a decent photo of yourself. You can
          make one from a selfie in about 30 seconds, free to preview.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/professional-headshot-generator"
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">Professional Headshot Generator →</p>
            <p className="mt-1 text-sm text-ink-soft">Studio-quality results from a phone selfie.</p>
          </Link>
          <Link
            href="/linkedin-headshot"
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">LinkedIn Headshot Generator →</p>
            <p className="mt-1 text-sm text-ink-soft">Built specifically for LinkedIn profile photos.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
