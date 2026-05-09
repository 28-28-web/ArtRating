import { requireUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { calculatePrize } from "@/lib/prize";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { paymentMethod, accountNumber, ratingCount } = await req.json();
  const user = await requireUser();
  const amount = calculatePrize(ratingCount);
  const payout = await prisma.payout.create({
    data: { userId: user.id, paymentMethod, accountNumber, ratingCount, amount, status: "pending" },
  });
  await prisma.rating.updateMany({ where: { userId: user.id }, data: { isPaid: true } });
  const userArts = await prisma.artwork.findMany({ where: { userId: user.id }, select: { id: true } });
  if (userArts.length > 0) {
    await prisma.rating.deleteMany({ where: { artworkId: { in: userArts.map((a) => a.id) } } });
  }
  return NextResponse.json(payout);
}

export async function GET(req: Request) {
  const user = await requireUser();
  const rows = await prisma.payout.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}
