import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";

// Records a Paddle purchase and credits the user's balance, atomically.
// Idempotent on paddleOrderId (the Paddle transaction id) — a retried
// webhook delivery for the same transaction returns { alreadyProcessed:
// true } instead of double-crediting. Pattern mirrors BookKraft AI's
// processPaddlePurchase (src/lib/db/purchases.js in that repo), translated
// from raw pg queries to a Prisma transaction since this project uses
// Prisma, not a hand-rolled pool.
export async function processPaddlePurchase(params: {
  userId: string;
  paddleOrderId: string;
  priceId: string;
  creditsToAdd: number;
  amountPaidCents: number | null;
}): Promise<{ alreadyProcessed: boolean }> {
  const { userId, paddleOrderId, priceId, creditsToAdd, amountPaidCents } = params;

  try {
    await prisma.$transaction([
      prisma.paddlePurchase.create({
        data: { userId, paddleOrderId, priceId, creditsAdded: creditsToAdd, amountPaidCents },
      }),
      prisma.userCredit.upsert({
        where: { userId },
        create: { userId, balance: creditsToAdd },
        update: { balance: { increment: creditsToAdd } },
      }),
    ]);
    return { alreadyProcessed: false };
  } catch (err) {
    // Unique constraint on paddleOrderId — a concurrent/retried delivery of
    // the same transaction already did the crediting. Not an error.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { alreadyProcessed: true };
    }
    throw err;
  }
}
