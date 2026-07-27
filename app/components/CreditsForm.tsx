"use client";

import { useEffect, useState } from "react";
import { usePaddle, onCheckoutCompleted } from "@/app/lib/paddle";
import type { CREDIT_PACKS } from "@/app/lib/creditPacks";

type Pack = (typeof CREDIT_PACKS)[number];

export default function CreditsForm({
  packs,
  userId,
  userEmail,
}: {
  packs: Pack[];
  userId: string;
  userEmail: string;
}) {
  const { paddle, failed } = usePaddle();
  const [pendingPackId, setPendingPackId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => onCheckoutCompleted(() => setSuccess(true)), []);

  function handleBuy(pack: Pack) {
    if (!pack.paddlePriceId) return; // button is disabled in this case, see below

    if (!paddle) {
      if (failed) window.location.reload();
      return;
    }

    setSuccess(false);
    setPendingPackId(pack.id);
    paddle.Checkout.open({
      settings: { displayMode: "overlay", theme: "light", locale: "en" },
      items: [{ priceId: pack.paddlePriceId, quantity: 1 }],
      customData: { userId, priceId: pack.paddlePriceId },
      customer: { email: userEmail },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {success && (
        <p
          className="rounded-xl border p-4 text-center text-sm font-medium"
          style={{ borderColor: "var(--jade)", color: "var(--jade-text)", background: "color-mix(in srgb, var(--jade) 10%, var(--canvas))" }}
        >
          Credits added! It can take a few seconds to reflect in your balance.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {packs.map((pack) => {
          const priceNotReady = !pack.paddlePriceId;
          const isPending = pendingPackId === pack.id && !success;
          return (
            <div key={pack.id} className="flex flex-col items-center gap-2 rounded-xl border border-border-soft p-4 text-center">
              <p className="text-lg font-semibold text-ink">{pack.credits} credits</p>
              <p className="text-2xl font-display font-semibold text-ink">{pack.priceLabel}</p>
              <button
                type="button"
                onClick={() => handleBuy(pack)}
                disabled={priceNotReady}
                className="mt-2 w-full rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas disabled:opacity-50"
              >
                {priceNotReady
                  ? "Not available yet"
                  : isPending && !paddle && !failed
                    ? "Preparing checkout…"
                    : isPending && failed
                      ? "Payment system unavailable — tap to retry"
                      : "Buy now"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-ink-soft">Payments processed securely by Paddle.</p>
    </div>
  );
}
