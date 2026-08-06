"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const HERO_STYLES = [
  {
    id: "linkedin",
    label: "LinkedIn",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&auto=format&q=80",
  },
  {
    id: "ceo",
    label: "CEO",
    src: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=500&fit=crop&auto=format&q=80",
  },
  {
    id: "passport",
    label: "Passport",
    src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=500&fit=crop&auto=format&q=80",
  },
  {
    id: "author",
    label: "Author",
    src: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=500&fit=crop&auto=format&q=80",
  },
] as const;

const STEPS = [
  { n: "1", title: "Upload your photo", body: "Any clear face photo works" },
  { n: "2", title: "Choose your style", body: "Corporate, Creative, or Executive" },
  { n: "3", title: "Download in seconds", body: "Full resolution, watermark-free" },
];

const STATS = [
  { value: "30s", label: "average generation time" },
  { value: "22+ styles", label: "to choose from" },
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
            AI Headshot Generator.
            <br />
            <span className="hero-main-h1-accent">Professional results in seconds.</span>
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
            <span>22+ styles</span>
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
              alt={`${active.label}-style AI headshot generator example — professional results from selfie`}
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
