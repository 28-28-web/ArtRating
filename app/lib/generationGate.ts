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
// original tools per anon cookie (not per-tool), so switching tools doesn't
// reset the count. Logging in starts a fresh pool of the same size tied to
// the account, which is a real incentive to log in before hitting the cap,
// even though download (not generation) is the only place payment applies
// now.
export const FREE_GENERATION_CAP = 2;

export type GateResult = { allowed: boolean };

// Optional pool scoping — omit entirely to get the original, fully-shared-
// across-every-tool behavior (unchanged for headshot/pet-to-human/
// toy-ification/photo-mix/art-style). Pass one to give a tool (or family of
// tools) its own independent cap and counter instead of sharing the default
// pool — e.g. the coloring-page generator uses a higher cap and shouldn't
// have its free uses eaten by (or eat into) the headshot pool.
export type GatePool = {
  cap: number;
  // Distinguishes this pool's AnonymousUsage row from the default pool's —
  // same table, different id, so no schema change was needed for this.
  poolId: string;
  // For logged-in users, only these Generation.toolId values count toward
  // this pool's cap (the default pool counts every toolId, unfiltered).
  toolIds: string[];
};

function anonUsageKey(anonId: string, pool?: GatePool): string {
  return pool ? `${pool.poolId}:${anonId}` : anonId;
}

export async function checkGenerationEligibility(params: {
  anonId: string | null;
  userId: string | null;
  pool?: GatePool;
}): Promise<GateResult> {
  const { anonId, userId, pool } = params;
  const cap = pool?.cap ?? FREE_GENERATION_CAP;

  if (userId) {
    const where = pool ? { userId, toolId: { in: pool.toolIds } } : { userId };
    const count = await prisma.generation.count({ where });
    return { allowed: count < cap };
  }

  if (!anonId) return { allowed: true }; // first-ever visit, no cookie yet
  const anon = await prisma.anonymousUsage.findUnique({ where: { id: anonUsageKey(anonId, pool) } });
  if (!anon || anon.count < cap) return { allowed: true };
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
  pool?: GatePool;
}): Promise<{ generationId: string | null }> {
  const { toolId, imageUrl, cleanImageUrl, userId, anonId, pool } = params;

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
      const usageId = anonUsageKey(anonId, pool);
      await tx.anonymousUsage.upsert({
        where: { id: usageId },
        create: { id: usageId, count: 1 },
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
  pool?: GatePool;
}): Promise<{ used: number; cap: number }> {
  const { anonId, userId, pool } = params;
  const cap = pool?.cap ?? FREE_GENERATION_CAP;

  // Raw counts can legitimately exceed the cap — the stored tally is never
  // itself capped (checkGenerationEligibility just compares count < cap,
  // which works correctly at any magnitude), and FREE_GENERATION_CAP has
  // already been lowered once this project (6 -> 2). A session that
  // generated under an old, higher cap keeps its old count in the DB
  // forever. Clamp for display only — the raw count stays intact for
  // anyone who wants the real historical number.
  if (userId) {
    const where = pool ? { userId, toolId: { in: pool.toolIds } } : { userId };
    const used = await prisma.generation.count({ where });
    return { used: Math.min(used, cap), cap };
  }

  if (!anonId) return { used: 0, cap };
  const anon = await prisma.anonymousUsage.findUnique({ where: { id: anonUsageKey(anonId, pool) } });
  return { used: Math.min(anon?.count ?? 0, cap), cap };
}
