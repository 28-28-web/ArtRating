// USD pricing, sold via Paddle Checkout (see app/lib/paddle.ts,
// app/components/CreditsForm.tsx, app/api/webhook/paddle/route.ts).
// paddlePriceId is read from the matching NEXT_PUBLIC_PADDLE_PRICE_*
// env var — undefined until the site owner creates the real prices in
// the Paddle dashboard and sets them. CreditsForm disables a pack's
// button rather than crash when its priceId is missing.
export const CREDIT_PACKS = [
  {
    id: "pack-starter",
    credits: 10,
    priceLabel: "$5",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER,
  },
  {
    id: "pack-pro",
    credits: 50,
    priceLabel: "$19",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO,
  },
  {
    id: "pack-unlimited",
    credits: 200,
    priceLabel: "$39",
    paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_UNLIMITED,
  },
];

// Server-side lookup for the webhook — maps a Paddle price ID back to how
// many credits it grants. Built from the same array so the two can't drift.
export function creditsForPriceId(priceId: string): number | null {
  const pack = CREDIT_PACKS.find((p) => p.paddlePriceId === priceId);
  return pack ? pack.credits : null;
}
