import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  await requireAdmin();
  const topRating = await prisma.rating.groupBy({
    by: ["artworkId"],
    _count: { artworkId: true },
    orderBy: { _count: { artworkId: "desc" } },
    take: 1,
  });
  const winnerArtworkId = topRating[0]?.artworkId ?? null;
  const draw = await prisma.weeklyDraw.create({
    data: {
      weekStart: new Date(),
      weekEnd: new Date(Date.now() + 7 * 24 * 3600000),
      artworkId: winnerArtworkId,
      winnerId: null,
      prizeAmount: topRating[0]?._count.artworkId ?? 0,
      totalRatings: topRating[0]?._count.artworkId ?? 0,
      status: "completed",
    },
  });
  return NextResponse.json(draw);
}
