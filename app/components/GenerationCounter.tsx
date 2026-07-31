"use client";

import { useEffect, useState } from "react";

// `refreshSignal` should change (e.g. an incrementing counter) after each
// successful generation so this re-fetches the authoritative server count
// rather than guessing client-side. `pool` should match a key in
// generation-status/route.ts's POOLS map (e.g. "coloring") for tools with
// their own independent free-generation pool; omit for the default pool.
export default function GenerationCounter({ refreshSignal, pool }: { refreshSignal?: number; pool?: string }) {
  const [status, setStatus] = useState<{ used: number; cap: number; unlimited?: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = pool ? `/api/generation-status?pool=${encodeURIComponent(pool)}` : "/api/generation-status";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [refreshSignal, pool]);

  // Logged-in users aren't capped — no "X of Y free" line to show them.
  if (!status || status.unlimited) return null;

  return (
    <p className="text-xs text-ink-soft">
      {status.used} of {status.cap} free generations used
    </p>
  );
}
