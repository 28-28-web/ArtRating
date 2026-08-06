"use client";

import { useState } from "react";
import Link from "next/link";
import NavLogo from "@/app/components/NavLogo";
import NavDropdown from "@/app/components/NavDropdown";
import NavAuthStatus from "@/app/components/NavAuthStatus";
import PaintDab from "@/app/components/PaintDab";
import ThemeToggle from "@/app/components/ThemeToggle";

const GUIDES = [
  { href: "/guides/linkedin-premium-review", label: "LinkedIn Premium review" },
  { href: "/guides/best-resume-builders", label: "Best resume builders 2026" },
  { href: "/guides/ai-headshot-vs-photographer", label: "AI headshot vs photographer" },
];

export default function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="mx-auto w-full max-w-5xl px-6 py-4">
      <div className="flex items-center justify-between">
        <NavLogo />

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/professional-headshot-generator" className="text-sm text-ink-soft hover:text-ink">
            Headshot Generator
          </Link>
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
