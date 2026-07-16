"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCreditRequestRow({
  request,
}: {
  request: {
    id: string;
    email: string;
    method: string;
    transactionRef: string;
    credits: number;
    createdAt: string;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "approve" | "reject") {
    setBusy(true);
    try {
      await fetch(`/api/admin/credit-requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-soft p-4">
      <p className="text-sm font-medium text-ink">
        {request.email} — {request.credits} credits ({request.method})
      </p>
      <p className="text-xs text-ink-soft">Ref: {request.transactionRef}</p>
      <p className="text-xs text-ink-soft/70">{new Date(request.createdAt).toLocaleString()}</p>
      <div className="flex gap-2">
        <button
          disabled={busy}
          onClick={() => act("approve")}
          className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-canvas disabled:opacity-50"
        >
          Approve
        </button>
        <button
          disabled={busy}
          onClick={() => act("reject")}
          className="rounded-full border border-border-soft px-4 py-1.5 text-xs font-medium text-ink disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
