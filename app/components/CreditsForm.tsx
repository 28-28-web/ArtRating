"use client";

import { useState } from "react";

export default function CreditsForm({
  packs,
  bkashNumber,
  nagadNumber,
}: {
  packs: { id: string; credits: number; priceLabel: string }[];
  bkashNumber: string;
  nagadNumber: string;
}) {
  const [packId, setPackId] = useState(packs[0]?.id);
  const [method, setMethod] = useState<"bkash" | "nagad">("bkash");
  const [transactionRef, setTransactionRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/credits/purchase-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, method, transactionRef }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit request");
        return;
      }
      setMessage(
        "Submitted! We'll add your credits after reviewing the payment, usually within a few hours."
      );
      setTransactionRef("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {packs.map((pack) => (
          <button
            key={pack.id}
            type="button"
            onClick={() => setPackId(pack.id)}
            className={`rounded-xl border p-4 text-center ${
              packId === pack.id ? "border-accent bg-[var(--border-soft)]/30" : "border-border-soft"
            }`}
          >
            <p className="text-lg font-semibold text-ink">{pack.credits} credits</p>
            <p className="text-sm text-ink-soft">{pack.priceLabel}</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border-soft p-4 text-sm">
        <p className="font-medium text-ink">Pay via bKash or Nagad (Send Money):</p>
        <p className="mt-1 text-ink-soft">
          bKash: {bkashNumber} · Nagad: {nagadNumber}
        </p>
        <p className="mt-1 text-xs text-ink-soft/70">
          Placeholder numbers until the site owner adds real merchant numbers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="method"
              checked={method === "bkash"}
              onChange={() => setMethod("bkash")}
            />
            bKash
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="method"
              checked={method === "nagad"}
              onChange={() => setMethod("nagad")}
            />
            Nagad
          </label>
        </div>
        <input
          required
          placeholder="Transaction reference / TrxID"
          value={transactionRef}
          onChange={(e) => setTransactionRef(e.target.value)}
          className="rounded-full border border-border-soft bg-transparent px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        {message && <p className="text-sm text-jade">{message}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit for review"}
        </button>
      </form>
    </div>
  );
}
