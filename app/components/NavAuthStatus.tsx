"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavAuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-soft">{session.user.email}</span>
        <button
          onClick={() => signOut()}
          className="rounded-full border border-border-soft px-3 py-1.5 text-sm font-medium text-ink hover:border-accent"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-canvas hover:opacity-90"
    >
      Log in
    </Link>
  );
}
