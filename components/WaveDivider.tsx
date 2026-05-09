/* eslint-disable react/no-unknown-property */
"use client";

import { useId } from "react";

export function WaveDivider() {
  const gradId = useId().replace(/:/g, "");
  return (
    <div aria-hidden className="relative h-10 w-full overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 64" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <path
          d="M0,32 C120,52 240,12 360,32 C480,52 600,12 720,32 C840,52 960,12 1080,32 C1200,52 1320,12 1440,32 L1440,64 L0,64 Z"
          fill={`url(#${gradId})`}
        />
      </svg>
    </div>
  );
}

