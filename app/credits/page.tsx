import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import CreditsForm from "@/app/components/CreditsForm";
import BrushDivider from "@/app/components/BrushDivider";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata: Metadata = {
  title: "Get Credits | HeadshotMaker AI",
  description: "Buy credits to download your full-quality, watermark-free AI photo results.",
  alternates: { canonical: "/credits" },
};

export default async function CreditsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await auth();
  const params = await searchParams;
  const showSuccess = params.success === "true";

  const creditRow = session?.user?.id
    ? await prisma.userCredit.findUnique({
        where: { userId: session.user.id },
        select: { balance: true },
      })
    : null;
  const balance = creditRow?.balance ?? 0;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Get Credits</h1>
        <BrushDivider />
        {session?.user && (
          <p className="rounded-full bg-[var(--border-soft)] px-4 py-1 text-sm font-medium text-ink">
            Your balance: {balance} credit{balance === 1 ? "" : "s"}
          </p>
        )}
        <p className="text-ink-soft">
          Try free — 2 headshots with watermark, no signup. Remove watermark — from $5.
        </p>
        <p className="text-ink-soft">
          Every 2 credits let you download one full-quality, watermark-free result. Checkout is
          handled securely by Paddle — credits are added automatically once your payment goes
          through.
        </p>
        <p className="text-sm text-ink-soft">
          <Link href="/professional-headshot-generator" className="underline hover:text-accent-text">
            ← Back to the headshot generator
          </Link>
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
          userId={session.user.id ?? ""}
          userEmail={session.user.email ?? ""}
          showSuccess={showSuccess}
        />
      )}
    </main>
  );
}
