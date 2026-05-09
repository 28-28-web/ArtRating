import { calculatePrize } from "@/lib/prize";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const ratings = await prisma.rating.groupBy({
    by: ["artworkId"],
    _count: { artworkId: true },
    orderBy: { _count: { artworkId: "desc" } },
    take: 5,
  });

  const withArtwork = await Promise.all(
    ratings.map(async (item, idx) => {
      const artwork = await prisma.artwork.findUnique({ where: { id: item.artworkId }, include: { user: true } });
      return {
        rank: idx + 1,
        artist: artwork?.user.name ?? "অজানা",
        title: artwork?.title ?? "নামহীন",
        ratings: item._count.artworkId,
        prize: calculatePrize(item._count.artworkId),
      };
    }),
  );
  return NextResponse.json(withArtwork);
}
