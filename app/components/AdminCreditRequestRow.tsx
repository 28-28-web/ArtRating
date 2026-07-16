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
    <div className="flex flex-col gap-2 rounded-xl border border-black/10 p-4 dark:border-white/10">
      <p className="text-sm font-medium">
        {request.email} — {request.credits} credits ({request.method})
      </p>
      <p className="text-xs text-zinc-500">Ref: {request.transactionRef}</p>
      <p className="text-xs text-zinc-400">{new Date(request.createdAt).toLocaleString()}</p>
      <div className="flex gap-2">
        <button
          disabled={busy}
          onClick={() => act("approve")}
          className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background disabled:opacity-50"
        >
          Approve
        </button>
        <button
          disabled={busy}
          onClick={() => act("reject")}
          className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-medium disabled:opacity-50 dark:border-white/10"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
