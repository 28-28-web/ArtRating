"use client";

import { useId, useState } from "react";
import Link from "next/link";

// TODO: swap `src` for a real Paintify before/after pair (same person,
// actual AI output) once the site owner shares test-run results or
// Cloudflare credentials are available to generate one. Deliberately NOT
// using two different stock photos as a fake "before/after" here — that
// would misrepresent what the tool actually produces, the same honesty
// concern already flagged for testimonials elsewhere on this site. Instead
// this uses one real photo twice, with a CSS filter standing in for the
// "after" side, and says so in the caption below the slider.
const PHOTO =
  "https://images.unsplash.com/photo-1533063392863-a7e43da2afeb?w=500&h=500&fit=crop&auto=format&q=80";

export default function CompareSlider() {
  const [value, setValue] = useState(50);
  const labelId = useId();

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2">
      <div
        className="compare-slider"
        style={{ ["--compare-pos" as string]: `${value}%` } as React.CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTO} alt="Illustrative 'after' preview — same photo with a CSS enhancement filter" className="compare-after" />
        <div className="compare-before-clip">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO} alt="Illustrative 'before' preview — the unedited photo" className="compare-before" />
        </div>
        <span className="compare-tag compare-tag-before">Before</span>
        <span className="compare-tag compare-tag-after">After</span>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-labelledby={labelId}
          className="compare-handle"
        />
      </div>
      <p id={labelId} className="text-center text-xs text-ink-soft">
        Illustrative preview (same photo, CSS enhancement) — not an actual AI result.{" "}
        <Link href="/professional-headshot-generator" className="underline hover:text-accent-text">
          Try the real Headshot Generator →
        </Link>
      </p>
    </div>
  );
}
