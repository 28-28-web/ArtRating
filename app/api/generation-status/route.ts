import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ANON_ID_COOKIE, readCookie, verifyAnonId } from "@/app/lib/anonId";
import { getGenerationUsage } from "@/app/lib/generationGate";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const anonId = await verifyAnonId(readCookie(request.headers.get("cookie"), ANON_ID_COOKIE));

  const usage = await getGenerationUsage({ anonId, userId });
  return NextResponse.json(usage);
}
