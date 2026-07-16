"use client";

import { useEffect, useRef, useState } from "react";

// Hand-painted-looking divider that draws itself in once scrolled into view.
// Colored via --accent (see app/lib/accent.ts) unless overridden by className.
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
      height="10"
      viewBox="0 0 90 10"
      className={`brush-divider ${drawn ? "is-drawn" : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 6 Q 20 2, 45 6 T 88 5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
