import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await requireAdmin();
  const { artId, status, moderationNote, isAIGenerated } = await req.json();
  const artwork = await prisma.artwork.update({
    where: { artId },
    data: { status, moderationNote, isAIGenerated: !!isAIGenerated },
  });
  return NextResponse.json(artwork);
}
