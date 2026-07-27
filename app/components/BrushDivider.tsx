"use client";

import { useEffect, useRef, useState } from "react";

// Hand-painted-looking divider that draws itself in once scrolled into view.
// Colored via --accent (see app/lib/accent.ts) unless overridden by className.
// Hover/idle-shimmer behavior lives entirely in globals.css (.brush-divider*)
// — hovering the parent heading/section (any div/section directly wrapping
// this SVG, via :has()) shifts the stroke to gold, thickens it, and reveals
// the ghost path; while visible and unhovered it pulses opacity slowly.
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function BrushDivider({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      width="90"
      height="14"
      viewBox="0 0 90 14"
      className={`brush-divider ${drawn ? "is-drawn" : ""} ${className}`}
      aria-hidden="true"
    >
      {/* Ghost echo — offset 3px below the main stroke, hidden until the
          parent heading/section is hovered (see .brush-divider-ghost in
          globals.css). Same path shape, translated down. */}
      <path
        className="brush-divider-ghost"
        d="M2 6 Q 20 2, 45 6 T 88 5"
        transform="translate(0, 3)"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="brush-divider-stroke"
        d="M2 6 Q 20 2, 45 6 T 88 5"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
