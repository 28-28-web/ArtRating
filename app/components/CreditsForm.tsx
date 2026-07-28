"use client";

import type { CREDIT_PACKS } from "@/app/lib/creditPacks";

type Pack = (typeof CREDIT_PACKS)[number];

const PLAN_FOR_PACK: Record<string, string> = {
  "pack-starter": "headshot-10",
  "pack-pro": "headshot-50",
  "pack-unlimited": "headshot-200",
};

export default function CreditsForm({
  packs,
  userEmail,
  showSuccess,
}: {
  packs: Pack[];
  userId: string;
  userEmail: string;
  showSuccess?: boolean;
}) {
  function handleBuy(pack: Pack) {
    const plan = PLAN_FOR_PACK[pack.id];
    if (!plan) return;
    window.location.href = `https://bookkraftai.com/credits?plan=${plan}&user=${encodeURIComponent(userEmail)}`;
  }

  return (
    <div className="flex flex-col gap-6">
      {showSuccess && (
        <p
          className="rounded-xl border p-4 text-center text-sm font-medium"
          style={{
            borderColor: "var(--jade)",
            color: "var(--jade-text)",
            background: "color-mix(in srgb, var(--jade) 10%, var(--canvas))",
          }}
        >
          Payment complete — credits are being added to your account. It can take a few seconds to reflect in your balance.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className="flex flex-col items-center gap-2 rounded-xl border border-border-soft p-4 text-center"
          >
            <p className="text-lg font-semibold text-ink">{pack.credits} credits</p>
            <p className="font-display text-2xl font-semibold text-ink">{pack.priceLabel}</p>
            <button
              type="button"
              onClick={() => handleBuy(pack)}
              className="mt-2 w-full rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas"
            >
              Buy now
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-ink-soft">
        Payments processed securely by Paddle.
      </p>
    </div>
  );
}
