import Image from "next/image";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";

type ShowcaseStyle = "Corporate" | "Creative" | "Executive";

type Photo = { src: string; alt: string };

type MarqueeRow = {
  style: ShowcaseStyle;
  direction: "left" | "right";
  color: string;
  photos: Photo[];
};

function stylePhotos(style: string, count: number): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    src: `/images/headshots/${style}-${i + 1}.jpg`,
    alt: `${style[0].toUpperCase()}${style.slice(1)}-style headshot preview photo`,
  }));
}

// Real Unsplash portrait photos (see public/images/headshots/), grouped by
// showcase style. Row scroll direction alternates per the task spec so
// adjacent rows don't visually sync. Duration varies slightly per row
// (same hand-varied-timing convention as HERO_DABS in page.tsx) so the
// three rows don't loop in lockstep.
const MARQUEE_ROWS: MarqueeRow[] = [
  { style: "Corporate", direction: "left", color: "var(--cobalt)", photos: stylePhotos("corporate", 5) },
  { style: "Creative", direction: "right", color: "var(--magenta)", photos: stylePhotos("creative", 5) },
  { style: "Executive", direction: "left", color: "var(--jade)", photos: stylePhotos("executive", 5) },
];
const MARQUEE_DURATIONS: Record<ShowcaseStyle, string> = {
  Corporate: "26s",
  Creative: "30s",
  Executive: "28s",
};

// 8-card reveal grid (4x2) — reuses the same stock photo set, not new
// assets. Only the first few frames of each style so the grid reads as a
// curated sample rather than a straight repeat of the marquee order.
const GRID_CARDS: (Photo & { style: ShowcaseStyle; color: string })[] = [
  { ...stylePhotos("corporate", 1)[0], style: "Corporate", color: "var(--cobalt)" },
  { ...stylePhotos("creative", 1)[0], style: "Creative", color: "var(--magenta)" },
  { ...stylePhotos("executive", 1)[0], style: "Executive", color: "var(--jade)" },
  { ...stylePhotos("corporate", 3)[2], style: "Corporate", color: "var(--cobalt)" },
  { ...stylePhotos("creative", 3)[2], style: "Creative", color: "var(--magenta)" },
  { ...stylePhotos("executive", 3)[2], style: "Executive", color: "var(--jade)" },
  { ...stylePhotos("corporate", 5)[4], style: "Corporate", color: "var(--cobalt)" },
  { ...stylePhotos("creative", 5)[4], style: "Creative", color: "var(--magenta)" },
];

const MARQUEE_SIZES = "(max-width: 639px) 28vw, 140px";
const GRID_SIZES = "(max-width: 639px) 45vw, (max-width: 1023px) 23vw, 200px";

export default function HeadshotShowcase() {
  return (
    <section className="flex w-full flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          AI headshots trusted by professionals
        </h2>
        <p className="max-w-md text-ink-soft">
          Upload once — choose your style — download in seconds.
        </p>
      </div>

      <div className="flex w-full flex-col gap-5">
        {MARQUEE_ROWS.map((row) => (
          <div key={row.style} className="headshot-marquee-row">
            <span
              className="headshot-marquee-label"
              style={{ ["--label-color" as string]: row.color }}
            >
              {row.style}
            </span>
            <div className="headshot-marquee-mask">
              <div
                className={`headshot-marquee-track headshot-marquee-${row.direction}`}
                style={{ ["--marquee-duration" as string]: MARQUEE_DURATIONS[row.style] }}
              >
                {[...row.photos, ...row.photos].map((photo, i) => (
                  <div key={`${photo.src}-${i}`} className="headshot-marquee-card">
                    <Image src={photo.src} alt={photo.alt} fill sizes={MARQUEE_SIZES} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="font-display text-xl font-semibold text-ink">Sample results from our AI</h3>
        <BrushDivider className="mt-1" />
        <p className="max-w-sm text-xs text-ink-soft">
          Stock preview photos shown for style and layout only — not actual Paintify-generated
          output.{" "}
          <Link href="/professional-headshot-generator" className="underline hover:text-accent-text">
            Try the real generator →
          </Link>
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {GRID_CARDS.map((card, i) => (
          <div
            key={`${card.src}-${i}`}
            className="headshot-grid-card"
            style={{ animationDelay: `${i * 0.625}s` }}
          >
            <Image src={card.src} alt={card.alt} fill sizes={GRID_SIZES} loading="lazy" />
            <span className="headshot-grid-name">{card.style}</span>
            <span className="headshot-grid-badge" style={{ ["--badge-color" as string]: card.color }}>
              {card.style}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
