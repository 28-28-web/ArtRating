// USD pricing per site owner request. NOTE: the actual payment collection
// mechanism (CreditsForm.tsx / credits/page.tsx) is still bKash/Nagad manual
// review — both are BDT-only Bangladeshi mobile wallets. There is no
// currency conversion wired up anywhere: a buyer picking "$5" still has to
// send some BDT amount via bKash/Nagad, and nothing in this codebase
// computes what that amount should be. This mismatch needs resolving
// (either real BDT-equivalent numbers, or an actual USD-capable payment
// processor) before this pricing is live.
//
// "Unlimited" is not a real recurring subscription — there's no billing
// webhook/cron/expiry anywhere in this codebase, only the same one-time
// manual-review purchase flow as the other two packs. Modeled here as a
// large one-time credit grant sold under the "Unlimited" label so it works
// with the existing balance-decrement logic without fabricating
// subscription infrastructure that doesn't exist. Revisit if real recurring
// billing gets built.
export const CREDIT_PACKS = [
  { id: "pack-starter", credits: 10, priceLabel: "$5" },
  { id: "pack-pro", credits: 50, priceLabel: "$19" },
  { id: "pack-unlimited", credits: 1000, priceLabel: "$39/mo" },
];
