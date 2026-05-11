"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { LanguageToggle } from "./LanguageToggle";

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const [open, setOpen] = useState(false);

  const menu = useMemo(() => [
    { href: "/", label: t('home') },
    { href: "/gallery", label: t('gallery') },
    { href: "/forum", label: t('forum') },
    { href: "/leaderboard", label: t('leaderboard') },
    { href: "/competition", label: t('competition') },
    { href: "/campaign", label: t('campaign') },
  ], [t]);

  const active = useMemo(() => {
    return menu.find((m) => m.href === pathname)?.href;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-3 py-2 text-sm font-extrabold text-white shadow-[0_0_22px_rgba(236,72,153,0.25)]"
          >
            🎨 চিত্রাঙ্কন
          </Link>
        </div>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-5 md:flex">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "text-sm font-bold transition-colors",
                item.href === active ? "text-white" : "text-zinc-300 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_22px_rgba(34,197,94,0.18)]"
          >
            {t('login')}
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_22px_rgba(249,115,22,0.18)]"
          >
            {t('register')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="মেনু"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-extrabold text-white"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t border-white/10 md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <nav className="grid gap-3">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold transition",
                    item.href === active ? "text-white" : "text-zinc-200 hover:text-white hover:border-pink-500/30",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-center text-sm font-extrabold text-black"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 px-4 py-2 text-center text-sm font-extrabold text-black"
                >
                  নিবন্ধন
                </Link>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

