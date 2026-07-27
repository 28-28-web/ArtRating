import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import CreditsForm from "@/app/components/CreditsForm";
import BrushDivider from "@/app/components/BrushDivider";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata: Metadata = {
  title: "Get Credits | HeadshotMaker AI",
  description: "Buy credits to download your full-quality, watermark-free AI photo results.",
  alternates: { canonical: "/credits" },
};

export default async function CreditsPage() {
  const session = await auth();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Get Credits</h1>
        <BrushDivider />
        <p className="text-ink-soft">
          Try free — 2 headshots with watermark, no signup. Remove watermark — from $5.
        </p>
        <p className="text-ink-soft">
          Each credit lets you download one full-quality, watermark-free result. Checkout is
          handled securely by Paddle — credits are added automatically once your payment goes
          through.
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
        <CreditsForm packs={CREDIT_PACKS} userId={session.user.id} userEmail={session.user.email ?? ""} />
      )}
    </main>
  );
}
