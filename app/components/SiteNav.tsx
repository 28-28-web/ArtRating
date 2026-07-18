"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import NavDropdown from "@/app/components/NavDropdown";
import NavAuthStatus from "@/app/components/NavAuthStatus";
import PaintDab from "@/app/components/PaintDab";
import ThemeToggle from "@/app/components/ThemeToggle";

// Headshot Generator lives as its own top-level nav item (see below) — it's
// the primary affiliate-funnel page right now — so it's deliberately not in
// this list. The other four tools stay grouped under the Tools dropdown.
const TOOLS = [
  { href: "/", label: "Art Style", color: "var(--cobalt)" },
  { href: "/pet-to-human", label: "Pet to Human", color: "var(--jade)" },
  { href: "/toy-ification", label: "Toy-ify Yourself", color: "var(--saffron)" },
  { href: "/photo-mix", label: "Photo Mix", color: "var(--magenta)" },
];

const GUIDES = [
  { href: "/best-photo-to-painting-ai-tools-2026", label: "Best Tools 2026" },
  { href: "/deep-art-effects-vs-photoai", label: "Deep Art Effects vs PhotoAI" },
  { href: "/van-gogh-style-ai-filter-top-tools", label: "Van Gogh Filters" },
];

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="mx-auto w-full max-w-5xl px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/professional-headshot-generator" className="text-sm text-ink-soft hover:text-ink">
            Headshot Generator
          </Link>
          <NavDropdown label="Tools" items={TOOLS} />
          <NavDropdown label="Guides" items={GUIDES} />
          <Link href="/credits" className="text-sm text-ink-soft hover:text-ink">
            Credits
          </Link>
          <ThemeToggle />
          <NavAuthStatus />
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:hidden"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="mt-4 flex flex-col gap-1 border-t border-border-soft pt-4 md:hidden">
          <Link
            href="/professional-headshot-generator"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink hover:bg-[var(--border-soft)]/40"
          >
            <PaintDab color="var(--teal-muted)" size={10} />
            Headshot Generator
          </Link>

          <p className="mt-2 px-2 text-xs font-medium uppercase tracking-wide text-ink-soft/70">Tools</p>
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink hover:bg-[var(--border-soft)]/40"
            >
              <PaintDab color={tool.color} size={10} />
              {tool.label}
            </Link>
          ))}

          <p className="mt-2 px-2 text-xs font-medium uppercase tracking-wide text-ink-soft/70">Guides</p>
          {GUIDES.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-2 text-sm text-ink hover:bg-[var(--border-soft)]/40"
            >
              {guide.label}
            </Link>
          ))}

          <div className="mt-2 flex items-center justify-between border-t border-border-soft px-2 pt-3">
            <Link
              href="/credits"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-ink-soft hover:text-ink"
            >
              Credits
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NavAuthStatus />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
