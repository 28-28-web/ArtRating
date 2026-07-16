import type { Metadata } from "next";
import Link from "next/link";
import { AFFILIATE_TOOLS } from "@/app/lib/affiliate";
import BrushDivider from "@/app/components/BrushDivider";

export const metadata: Metadata = {
  title: "Van Gogh Style AI Filter — Top Tools | Paintify",
  description:
    "Want that swirling Starry Night brushstroke look? Here are the best AI tools for turning photos into Van Gogh-style paintings.",
};

export default function Page() {
  const dae = AFFILIATE_TOOLS["deep-art-effects"];
  const pai = AFFILIATE_TOOLS.photoai;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Van Gogh Style AI Filter — Top Tools
        </h1>
        <BrushDivider className="mt-1" />
        <p className="mt-3 text-ink-soft">
          That swirling, thick-brushstroke <em>Starry Night</em> look is one of the most requested
          AI painting styles. Here&apos;s what actually does it well.
        </p>
      </div>

      <div className="rounded-2xl border border-border-soft p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Top pick: {dae.name}</h2>
          <a
            href={dae.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-canvas hover:opacity-90"
          >
            Try {dae.name} →
          </a>
        </div>
        <p className="mt-3 text-ink">
          Has dedicated Van Gogh-style presets among its 100+ art styles, with adjustable brush
          stroke intensity and color so you can dial in how close to <em>Starry Night</em> you want
          to go. Supports batch processing if you want to convert a whole album.
        </p>
      </div>

      <div className="rounded-2xl border border-border-soft p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Also consider: {pai.name}</h2>
          <a
            href={pai.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-canvas hover:opacity-90"
          >
            Try {pai.name} →
          </a>
        </div>
        <p className="mt-3 text-ink">
          Better suited if you want a brand-new stylized AI portrait of yourself in a painterly
          style rather than filtering an existing photo.
        </p>
      </div>

      <p className="text-sm text-ink-soft">
        Not sure which fits your photo? Use the{" "}
        <Link href="/" className="underline hover:text-accent-text">
          style advisor on the homepage
        </Link>{" "}
        for a quick recommendation.
      </p>
    </main>
  );
}
