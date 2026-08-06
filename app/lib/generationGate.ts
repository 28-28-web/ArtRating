import { prisma } from "@/app/lib/prisma";

const DEBUG_GENERATION = process.env.DEBUG_GENERATION === "true";

// Anonymous visitors get this many free watermarked generations before hitting
// the login wall. Logged-in users bypass this cap entirely — generation stays
// free for them; payment only applies at download (see download route).
export const FREE_GENERATION_CAP = 6;

export type GateResult = { allowed: boolean };

export async function checkGenerationEligibility(params: {
  anonId: string | null;
  userId: string | null;
}): Promise<GateResult> {
  const { anonId, userId } = params;

  if (userId) return { allowed: true };
  if (!anonId) return { allowed: true }; // first-ever visit, no cookie yet
  const anon = await prisma.anonymousUsage.findUnique({ where: { id: anonId } });
  if (!anon || anon.count < FREE_GENERATION_CAP) return { allowed: true };
  return { allowed: false };
}

export async function recordSuccessfulGeneration(params: {
  toolId: string;
  imageUrl: string | null;
  cleanImageUrl: string | null;
  userId: string | null;
  anonId: string | null;
}): Promise<{ generationId: string | null }> {
  const { toolId, imageUrl, cleanImageUrl, userId, anonId } = params;

  if (userId) {
    if (DEBUG_GENERATION) {
      console.log("[generationGate] recording success (logged-in):", { toolId, userId });
    }
    const generation = await prisma.generation.create({
      data: { userId, toolId, imageUrl, cleanImageUrl, status: "success" },
      select: { id: true },
    });
    return { generationId: generation.id };
  }

  if (anonId) {
    if (DEBUG_GENERATION) {
      console.log("[generationGate] recording success (anon), incrementing count:", { toolId, anonId });
    }
    const generation = await prisma.$transaction(async (tx) => {
      const created = await tx.generation.create({
        data: { anonId, toolId, imageUrl, status: "success" },
        select: { id: true },
      });
      await tx.anonymousUsage.upsert({
        where: { id: anonId },
        create: { id: anonId, count: 1 },
        update: { count: { increment: 1 } },
      });
      return created;
    });
    return { generationId: generation.id };
  }

  return { generationId: null };
}

export async function getGenerationUsage(params: {
  anonId: string | null;
  userId: string | null;
}): Promise<{ used: number; cap: number; unlimited?: boolean }> {
  const { anonId, userId } = params;

  if (userId) {
    const used = await prisma.generation.count({ where: { userId } });
    return { used, cap: FREE_GENERATION_CAP, unlimited: true };
  }

  if (!anonId) return { used: 0, cap: FREE_GENERATION_CAP };
  const anon = await prisma.anonymousUsage.findUnique({ where: { id: anonId } });
  return { used: Math.min(anon?.count ?? 0, FREE_GENERATION_CAP), cap: FREE_GENERATION_CAP };
}
