import { buildMetadata } from "@/app/lib/seo";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { FREE_GENERATION_CAP } from "@/app/lib/generationGate";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

export const metadata = buildMetadata({
  title: "AI Author Headshot Generator — Book Covers & Amazon Pages",
  description:
    "Generate a professional author headshot from any selfie using AI. Perfect for your Amazon author page, book back cover, and press kit. Free to try, from $5.",
  path: "/author-headshot",
});

const cheapestPack = CREDIT_PACKS[0];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AI Author Headshot Generator — Book Covers & Amazon Pages",
  description:
    "Generate a professional author headshot from any selfie using AI. Perfect for your Amazon author page, book back cover, and press kit.",
  datePublished: "2026-07-29",
  dateModified: "2026-07-29",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME },
  mainEntityOfPage: `${SITE_URL}/author-headshot`,
};

export default function AuthorHeadshotPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          AI Author Headshot Generator — Professional Photos for Your Book Cover &amp; Amazon Page
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Upload a selfie, get a professional author photo for your Amazon author page, book back
          cover, or press kit — no photographer needed.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Why Authors Need a Professional Photo
        </h2>
        <p className="text-ink">
          Readers judge a book by more than its cover — your author photo is part of the pitch too.
          A professional headshot on your Amazon author page and book back cover builds the kind of
          trust that turns a browser into a buyer, and a consistent, professional image across your
          website, social media, and press kit makes an author brand look deliberate rather than
          thrown together.
        </p>
        <p className="text-ink">
          Most authors don&apos;t have a marketing budget for a professional photoshoot, especially
          for a first or second book. An <strong>AI author headshot</strong> generator closes that
          gap — a professional-looking result from a selfie you already have, for a fraction of the
          cost.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Where to Use It</h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>Amazon KDP author page</li>
          <li>Book back cover</li>
          <li>Author website &quot;About&quot; page</li>
          <li>Social media and press kit</li>
          <li>Publisher or agent submissions</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">How It Works</h2>
        <ol className="list-decimal space-y-2 pl-5 text-ink">
          <li>Upload a clear, front-facing selfie.</li>
          <li>Choose a style — Corporate, Creative, Executive, or Casual, depending on your genre and brand.</li>
          <li>Get an instant watermarked preview, free, with no signup.</li>
          <li>Log in and download the full-resolution file for {cheapestPack.priceLabel}+ in credits.</li>
        </ol>
        <p className="text-ink">
          Your first {FREE_GENERATION_CAP} generations are free — try a style before deciding
          whether to download.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Which Style Fits Your Genre?</h2>
        <p className="text-ink">
          Non-fiction, business, and self-help authors tend to suit the Corporate or Executive
          presets — they read as credible and authoritative. Fiction authors, especially in
          contemporary or genre fiction, often do better with the Creative or Casual presets, which
          read as warmer and more approachable. There&apos;s no cost to trying more than one before
          you pick a favorite.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">More for Authors</h2>
        <p className="text-ink">
          If you&apos;re working on the book itself, not just the author photo,{" "}
          <a
            href="https://bookkraftai.com/headshot"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-accent-text"
          >
            BookKraft AI&apos;s author headshot guide
          </a>{" "}
          covers the same topic from a publishing angle — formatting your KDP author page and book
          back cover around the photo once you have it.
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
          Generate my author headshot →
        </Link>
      </div>
    </main>
  );
}
