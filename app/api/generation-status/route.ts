import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { getGenerationUsage, type GatePool } from "@/app/lib/generationGate";

// ?pool=coloring switches to the coloring tool's independent, higher-cap
// pool instead of the default pool shared by the other 5 tools. Add new
// entries here as more independently-pooled tools are introduced.
const POOLS: Record<string, GatePool> = {
  coloring: { cap: 3, poolId: "coloring", toolIds: ["coloring"] },
};

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const anonId = await verifyAnonId(readCookie(request.headers.get("cookie"), ANON_ID_COOKIE));

  const poolKey = new URL(request.url).searchParams.get("pool");
  const pool = poolKey ? POOLS[poolKey] : undefined;

  const usage = await getGenerationUsage({ anonId, userId, pool });
  return NextResponse.json(usage);
}
