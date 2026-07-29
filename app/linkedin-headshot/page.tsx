import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BrushDivider from "@/app/components/BrushDivider";
import { FREE_GENERATION_CAP } from "@/app/lib/generationGate";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "AI LinkedIn Headshot Generator — Professional Profile Photos in 30 Seconds",
  description:
    "Generate a professional LinkedIn headshot from any selfie using AI. Free to try, no signup needed — perfect for job seekers and professionals updating their profile photo.",
  alternates: { canonical: "/linkedin-headshot" },
};

const cheapestPack = CREDIT_PACKS[0];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AI LinkedIn Headshot Generator — Professional Profile Photos in 30 Seconds",
  description:
    "Generate a professional LinkedIn headshot from any selfie using AI. Free to try, no signup needed.",
  datePublished: "2026-07-29",
  dateModified: "2026-07-29",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME },
  mainEntityOfPage: `${SITE_URL}/linkedin-headshot`,
};

export default function LinkedInHeadshotPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          AI LinkedIn Headshot Generator — Professional Profile Photos in 30 Seconds
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Upload a selfie, pick a style, and get a LinkedIn-ready headshot without booking a
          photographer.
        </p>
      </div>

      <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-72">
        <Image
          src="/images/guides/linkedin-hero.webp"
          alt="LinkedIn app icon"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Why Your LinkedIn Photo Matters</h2>
        <p className="text-ink">
          Your profile photo is the first thing anyone sees before they read a single line of your
          experience — recruiters, hiring managers, and potential connections decide whether to
          click into your profile at all based partly on that one image. A blurry crop from a
          group photo, an old vacation shot, or no photo at all quietly costs you profile views
          and connection requests you never see happen.
        </p>
        <p className="text-ink">
          The fix doesn&apos;t require a studio session. An <strong>AI LinkedIn headshot</strong>{" "}
          generator can turn a normal selfie into a clean, professional-looking profile photo in
          about the time it takes to read this paragraph.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">How It Works</h2>
        <ol className="list-decimal space-y-2 pl-5 text-ink">
          <li>Upload a clear, front-facing selfie — natural light works best.</li>
          <li>Choose a style: Corporate, Creative, Executive, or Casual.</li>
          <li>Get an instant AI-generated preview, watermarked and free.</li>
          <li>Log in and download the full-resolution, watermark-free version for {cheapestPack.priceLabel}+ in credits.</li>
        </ol>
        <p className="text-ink">
          Your first {FREE_GENERATION_CAP} generations don&apos;t require an account at all — try
          a style before you commit to anything.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          What Makes a Good LinkedIn Profile Photo
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>Your face fills most of the frame — head and shoulders, not a full-body shot</li>
          <li>Plain or softly blurred background, not a busy scene</li>
          <li>Even, natural-looking lighting with no harsh shadows</li>
          <li>Neutral or business-appropriate attire depending on your industry</li>
          <li>A genuine, approachable expression rather than a stiff pose</li>
        </ul>
        <p className="text-ink">
          These are exactly the qualities the Corporate and Executive presets are built to
          produce — consistent lighting and a neutral, professional backdrop, generated from
          whatever photo you already have.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          AI Headshot vs a Real Photographer for LinkedIn
        </h2>
        <p className="text-ink">
          For a standard LinkedIn profile photo, an AI headshot generator gets you most of the way
          there for a fraction of the cost and none of the scheduling. Save the professional
          photographer budget for situations where the photo itself is the deliverable — a press
          kit, a book jacket, a magazine feature — and use AI for the everyday case of just needing
          a decent, current profile photo.
        </p>
      </section>

      <div className="rounded-2xl border border-border-soft p-6 text-center">
        <p className="text-ink">
          Try free — {FREE_GENERATION_CAP} headshots with watermark, no signup needed.
        </p>
        <Link
          href="/professional-headshot-generator"
          className="mt-3 inline-block rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas hover:opacity-90"
        >
          Generate my LinkedIn headshot →
        </Link>
      </div>
    </main>
  );
}
