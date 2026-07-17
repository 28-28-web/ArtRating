import Link from "next/link";
import HomeInteractive from "@/app/components/HomeInteractive";
import HeroGallery from "@/app/components/HeroGallery";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

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
        "Turn your photos into paintings with AI. Get style recommendations and compare the best photo-to-painting tools.",
    },
  ],
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <main className="flex w-full max-w-5xl flex-1 flex-col items-center gap-16 px-6 py-16">
        <section className="flex flex-col items-center gap-4 text-center">
          <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Turn Any Photo Into a Painting with AI
          </h1>
          <BrushDivider />
          <p className="max-w-xl text-lg text-ink-soft">
            Upload a photo, tell our style advisor what look you want, and we&apos;ll point you to
            the best AI photo-to-painting tool for the job.
          </p>
        </section>

        <HeroGallery />

        <HomeInteractive />

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
              <p className="font-medium text-ink">Best Photo-to-Painting AI Tools 2026</p>
              <p className="mt-1 text-sm text-ink-soft">Our top picks, ranked and compared.</p>
            </Link>
            <Link
              href="/deep-art-effects-vs-photoai"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">Deep Art Effects vs PhotoAI</p>
              <p className="mt-1 text-sm text-ink-soft">Head-to-head feature and pricing comparison.</p>
            </Link>
            <Link
              href="/van-gogh-style-ai-filter-top-tools"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">Van Gogh Style AI Filter — Top Tools</p>
              <p className="mt-1 text-sm text-ink-soft">Best apps for that swirling brushstroke look.</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
