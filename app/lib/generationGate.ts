import { prisma } from "@/app/lib/prisma";

// TODO: remove once the "quota incremented on failure" report is confirmed
// resolved on the live deploy. Audited this file end-to-end: this is the
// only place in the codebase that increments AnonymousUsage.count or counts
// toward a logged-in user's cap (grepped for anonymousUsage.upsert / count:
// { increment across the whole app/ tree — one hit, right here), and it's
// only ever called from the 5 generation routes after `result.image` is
// confirmed truthy, never on a timeout/error path. Couldn't reproduce the
// reported bug by reading the code — this log exists so the next failed
// attempt on the live deploy shows definitively whether this function is
// (or isn't) being reached, rather than guessing.
const DEBUG_GENERATION = process.env.DEBUG_GENERATION === "true";

// Generation is free and doesn't require login — a visitor can generate up
// to this many images per tool, and the pool is shared across all five
// tools per anon cookie (not per-tool), so switching tools doesn't reset the
// count. Logging in starts a fresh pool of the same size tied to the
// account, which is a real incentive to log in before hitting the cap, even
// though download (not generation) is the only place payment applies now.
export const FREE_GENERATION_CAP = 6;

export type GateResult = { allowed: boolean };

export async function checkGenerationEligibility(params: {
  anonId: string | null;
  userId: string | null;
}): Promise<GateResult> {
  const { anonId, userId } = params;

  if (userId) {
    const count = await prisma.generation.count({ where: { userId } });
    return { allowed: count < FREE_GENERATION_CAP };
  }

  if (!anonId) return { allowed: true }; // first-ever visit, no cookie yet
  const anon = await prisma.anonymousUsage.findUnique({ where: { id: anonId } });
  if (!anon || anon.count < FREE_GENERATION_CAP) return { allowed: true };
  return { allowed: false };
}

// Only call this after a generation actually succeeded — never count on
// failure. No credit deduction here anymore — download is the paid step.
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
      console.log("[generationGate] recording success (logged-in), no quota counter to bump:", { toolId, userId });
    }
    const generation = await prisma.generation.create({
      data: { userId, toolId, imageUrl, cleanImageUrl, status: "success" },
      select: { id: true },
    });
    return { generationId: generation.id };
  }

  if (anonId) {
    if (DEBUG_GENERATION) {
      console.log("[generationGate] recording success (anon), incrementing AnonymousUsage.count:", { toolId, anonId });
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
}): Promise<{ used: number; cap: number }> {
  const { anonId, userId } = params;

  if (userId) {
    const used = await prisma.generation.count({ where: { userId } });
    return { used, cap: FREE_GENERATION_CAP };
  }

  if (!anonId) return { used: 0, cap: FREE_GENERATION_CAP };
  const anon = await prisma.anonymousUsage.findUnique({ where: { id: anonId } });
  return { used: anon?.count ?? 0, cap: FREE_GENERATION_CAP };
}
