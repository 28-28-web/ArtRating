import { checkFraud } from "@/lib/fraudDetection";
import { requireUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getISOWeek, getYear } from "date-fns";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const user = await requireUser();
    const artwork = body.artworkId
      ? await prisma.artwork.findUnique({ where: { id: body.artworkId } })
      : await prisma.artwork.findUnique({ where: { artId: body.artId } });
    if (!artwork) return NextResponse.json({ message: "ছবি পাওয়া যায়নি" }, { status: 404 });
    const ip = req.headers.get("x-forwarded-for") ?? "0.0.0.0";
    await checkFraud(user.id, ip);
    const now = new Date();
    const rating = await prisma.rating.upsert({
      where: { artworkId_userId: { artworkId: artwork.id, userId: user.id } },
      update: { stars: body.stars, ipAddress: ip },
      create: {
        artworkId: artwork.id,
        userId: user.id,
        stars: body.stars,
        ipAddress: ip,
        weekNumber: getISOWeek(now),
        weekYear: getYear(now),
      },
    });
    return NextResponse.json(rating);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
