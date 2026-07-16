import { prisma } from "@/app/lib/prisma";

export type GateResult =
  | { allowed: true; reason: "free-anonymous" | "free-logged-in" | "paid"; deductCredit?: boolean }
  | { allowed: false; reason: "needs-login" | "needs-payment" };

export async function checkGenerationEligibility(params: {
  anonId: string | null;
  userId: string | null;
}): Promise<GateResult> {
  const { anonId, userId } = params;

  if (userId) {
    const priorCount = await prisma.generation.count({ where: { userId } });
    if (priorCount < 1) return { allowed: true, reason: "free-logged-in" };

    const credit = await prisma.userCredit.findUnique({ where: { userId } });
    if (credit && credit.balance > 0) return { allowed: true, reason: "paid", deductCredit: true };

    return { allowed: false, reason: "needs-payment" };
  }

  // anonymous path
  if (!anonId) return { allowed: true, reason: "free-anonymous" }; // first-ever visit, no cookie yet
  const anon = await prisma.anonymousUsage.findUnique({ where: { id: anonId } });
  if (!anon || anon.count < 1) return { allowed: true, reason: "free-anonymous" };

  return { allowed: false, reason: "needs-login" };
}

// Only call this after a generation actually succeeded — never charge/count on failure.
export async function recordSuccessfulGeneration(params: {
  toolId: string;
  imageUrl: string | null;
  userId: string | null;
  anonId: string | null;
  deductCredit?: boolean;
}) {
  const { toolId, imageUrl, userId, anonId, deductCredit } = params;

  if (userId) {
    await prisma.$transaction(async (tx) => {
      await tx.generation.create({
        data: { userId, toolId, imageUrl, status: "success", usedCredit: !!deductCredit },
      });
      if (deductCredit) {
        await tx.userCredit.update({ where: { userId }, data: { balance: { decrement: 1 } } });
      }
    });
    return;
  }

  if (anonId) {
    await prisma.$transaction(async (tx) => {
      await tx.generation.create({
        data: { anonId, toolId, imageUrl, status: "success" },
      });
      await tx.anonymousUsage.upsert({
        where: { id: anonId },
        create: { id: anonId, count: 1 },
        update: { count: { increment: 1 } },
      });
    });
  }
}
