"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function NavAuthStatus() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    // No setBalance(null) for the logged-out case — that branch never
    // renders the balance pill anyway (see the `session?.user` check
    // below), so there's nothing to reset. Avoids a synchronous setState
    // in the effect body for a case that has no visible effect.
    if (!session?.user) return;
    fetch("/api/user/balance")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.balance != null) setBalance(data.balance);
      })
      .catch(() => {});
  }, [session?.user]);

  if (status === "loading") return null;

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-soft">{session.user.email}</span>
        {balance !== null && (
          <Link
            href="/credits"
            className="rounded-full px-2.5 py-0.5 text-xs font-medium text-ink-soft ring-1 ring-border-soft hover:text-ink"
          >
            {balance} credits
          </Link>
        )}
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
