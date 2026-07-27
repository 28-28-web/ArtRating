"use client";

import { useEffect, useRef, useState } from "react";

// Gradient accent bar that draws itself in (width 0 -> 80px) once scrolled
// into view, and widens to 120px on hover of the parent heading/section
// (see .brush-divider in globals.css — hover is targeted via :has() on
// whichever div/section directly wraps this element, not this element
// itself, so no call site needs a class change). Respects
// prefers-reduced-motion.
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function BrushDivider({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
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

  return <div ref={ref} className={`brush-divider ${drawn ? "is-drawn" : ""} ${className}`} aria-hidden="true" />;
}
