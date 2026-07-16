import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import CreditsForm from "@/app/components/CreditsForm";
import BrushDivider from "@/app/components/BrushDivider";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata: Metadata = {
  title: "Get Credits | Paintify",
  description: "Buy credits to keep generating AI photo previews after your free generations.",
};

export default async function CreditsPage() {
  const session = await auth();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Get Credits</h1>
        <BrushDivider />
        <p className="text-ink-soft">
          Each credit is one AI generation on any tool. Pay via bKash or Nagad and submit your
          transaction reference below — credits are added after a quick manual review.
        </p>
      </div>

      {!session?.user ? (
        <p className="text-center text-sm text-ink">
          <Link href="/login?callbackUrl=/credits" className="underline hover:text-accent-text">
            Log in
          </Link>{" "}
          to buy credits.
        </p>
      ) : (
        <CreditsForm
          packs={CREDIT_PACKS}
          bkashNumber={process.env.BKASH_NUMBER || "01XXXXXXXXX"}
          nagadNumber={process.env.NAGAD_NUMBER || "01XXXXXXXXX"}
        />
      )}
    </main>
  );
}
