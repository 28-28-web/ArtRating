"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Reuses the same 3 Unsplash photos already downloaded for the
// HeadshotShowcase marquee (public/images/headshots/) — the photo IDs
// given for this hero are identical to that section's first corporate/
// creative/executive entries, so no new download was needed.
const HERO_STYLES = [
  { id: "corporate", label: "Corporate", src: "/images/headshots/corporate-1.jpg" },
  { id: "creative", label: "Creative", src: "/images/headshots/creative-1.jpg" },
  { id: "executive", label: "Executive", src: "/images/headshots/executive-1.jpg" },
] as const;

const STEPS = [
  { n: "1", title: "Upload your photo", body: "Any clear face photo works" },
  { n: "2", title: "Choose your style", body: "Corporate, Creative, or Executive" },
  { n: "3", title: "Download in seconds", body: "Full resolution, watermark-free" },
];

// Spec text said "4 styles" but only 3 style tabs are defined (Corporate/
// Creative/Executive) — using the real count instead of a number that
// doesn't match what's actually on the page.
const STATS = [
  { value: "30s", label: "average generation time" },
  { value: `${HERO_STYLES.length} styles`, label: "to choose from" },
  { value: "Free", label: "no signup required" },
];

export default function HeroSection({ freeGenerationCap }: { freeGenerationCap: number }) {
  const [activeId, setActiveId] = useState<(typeof HERO_STYLES)[number]["id"]>(HERO_STYLES[0].id);
  const active = HERO_STYLES.find((s) => s.id === activeId) ?? HERO_STYLES[0];

  return (
    <div className="w-full">
      <section className="hero-main">
        <div className="hero-main-left">
          <span className="hero-badge">AI-powered headshots</span>
          <h1 className="hero-main-h1">
            Your photo.
            <br />
            <span className="hero-main-h1-accent">Professional results.</span>
          </h1>
          <p className="hero-main-sub">
            Upload any selfie — get a LinkedIn-ready headshot in 30 seconds. No photographer, no
            studio, no waiting.
          </p>
          <div className="hero-cta-row">
            <Link href="/professional-headshot-generator" className="hero-cta-primary">
              Generate my headshot — free
            </Link>
            <a href="#examples" className="hero-cta-secondary">
              See examples ↓
            </a>
          </div>
          <p className="hero-trust-row">
            <span>No signup needed</span>
            <span aria-hidden="true">·</span>
            <span>{freeGenerationCap} free headshots</span>
            <span aria-hidden="true">·</span>
            <span>Results in 30s</span>
          </p>
        </div>

        <div className="hero-main-right">
          <div className="hero-style-tabs" role="tablist" aria-label="Preview a headshot style">
            {HERO_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                role="tab"
                aria-selected={style.id === activeId}
                data-active={style.id === activeId}
                className="hero-style-tab"
                onClick={() => setActiveId(style.id)}
              >
                {style.label}
              </button>
            ))}
          </div>
          <div className="hero-style-frame">
            <Image
              key={active.id}
              src={active.src}
              alt={`${active.label}-style AI headshot example`}
              fill
              sizes="(max-width: 767px) 90vw, 300px"
              className="hero-style-frame-img"
              priority
            />
            <span className="hero-style-label">{active.label}</span>
          </div>
        </div>
      </section>

      <section className="hero-steps-strip" aria-label="How it works">
        {STEPS.map((step) => (
          <div className="hero-step" key={step.n}>
            <span className="hero-step-circle" aria-hidden="true">
              {step.n}
            </span>
            <div className="hero-step-text">
              <p className="hero-step-title">{step.title}</p>
              <p className="hero-step-body">{step.body}</p>
            </div>
          </div>
        ))}
      </section>

      <p className="hero-social-proof">
        <span>LinkedIn Ready</span>
        <span aria-hidden="true"> • </span>
        <span>No Photographer Needed</span>
        <span aria-hidden="true"> • </span>
        <span>Results in 30 Seconds</span>
      </p>

      <section className="hero-stats-strip" aria-label="Key stats">
        {STATS.map((stat) => (
          <div className="hero-stat" key={stat.label}>
            <p className="hero-stat-value">{stat.value}</p>
            <p className="hero-stat-label">{stat.label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
