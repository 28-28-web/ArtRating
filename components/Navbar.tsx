"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useMemo, useState } from "react";

const menu = [
  { href: "/", label: "হোম" },
  { href: "/gallery", label: "সব ছবি" },
  { href: "/forum", label: "ফোরাম" },
  { href: "/leaderboard", label: "লিডারবোর্ড" },
  { href: "/competition", label: "প্রতিযোগিতা" },
  { href: "/campaign", label: "ক্যাম্পেইন" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const active = useMemo(() => {
    return menu.find((m) => m.href === pathname)?.href;
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

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
          {session ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-black/40 px-3 py-2">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-sm font-bold text-white">
                  {session.user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_0_22px_rgba(239,68,68,0.18)]"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_22px_rgba(34,197,94,0.18)]"
              >
                লগইন
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_22px_rgba(249,115,22,0.18)]"
              >
                নিবন্ধন
              </Link>
            </>
          )}
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
              <div className="mt-2">
                {session ? (
                  <div className="flex items-center gap-2 rounded-xl bg-black/40 px-4 py-3">
                    {session.user?.image && (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm font-bold text-white">
                      {session.user?.name}
                    </span>
                    <div className="flex-1" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-white"
                    >
                      লগআউট
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
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
                )}
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

