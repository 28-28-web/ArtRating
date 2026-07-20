"use client";

import { useState } from "react";
import GenerationGateNotice from "@/app/components/GenerationGateNotice";

// The only gated action left — generation itself is free. Logged-out or
// out-of-credits both surface inline via the shared GenerationGateNotice
// (login form / "get credits" link) instead of a page navigation.
export default function DownloadButton({ generationId }: { generationId: string | null }) {
  const [gate, setGate] = useState<"needs-login" | "needs-payment" | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function attemptDownload() {
    if (!generationId) return;
    setDownloading(true);
    setError(null);
    setGate(null);
    try {
      const res = await fetch(`/api/download/${generationId}`, { method: "POST" });
      const data = await res.json();

      if (res.status === 401) {
        setGate("needs-login");
        return;
      }
      if (res.status === 402) {
        setGate("needs-payment");
        return;
      }
      if (!res.ok || !data.url) {
        setError(data.error || "Could not prepare your download. Please try again.");
        return;
      }

      const link = document.createElement("a");
      link.href = data.url;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDone(true);
    } catch {
      setError("Could not prepare your download. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (!generationId) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={attemptDownload}
        disabled={downloading}
        className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas hover:opacity-90 disabled:opacity-50"
      >
        {downloading ? "Preparing…" : done ? "Download again" : "Download full quality"}
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
      {gate && <GenerationGateNotice kind={gate} onAuthenticated={attemptDownload} />}
    </div>
  );
}
