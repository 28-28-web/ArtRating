"use client";

import { useEffect, useState } from "react";

// `refreshSignal` should change (e.g. an incrementing counter) after each
// successful generation so this re-fetches the authoritative server count
// rather than guessing client-side.
export default function GenerationCounter({ refreshSignal }: { refreshSignal?: number }) {
  const [status, setStatus] = useState<{ used: number; cap: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/generation-status")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [refreshSignal]);

  if (!status) return null;

  return (
    <p className="text-xs text-ink-soft">
      {status.used} of {status.cap} free generations used
    </p>
  );
}
