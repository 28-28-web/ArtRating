import Link from "next/link";
import HomeInteractive from "@/app/components/HomeInteractive";
import HeroGallery from "@/app/components/HeroGallery";
import CompareSlider from "@/app/components/CompareSlider";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

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
              Turn Any Photo Into a Painting with AI
            </h1>
            <BrushDivider />
            <p className="max-w-xl text-lg text-ink-soft">
              Upload a photo, tell our style advisor what look you want, and we&apos;ll point you to
              the best AI photo-to-painting tool for the job.
            </p>
          </section>

          <CompareSlider />

          <HeroGallery />
        </div>

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
