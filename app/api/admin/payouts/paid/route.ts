import { requireAdmin } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await requireAdmin();
  const { payoutId } = await req.json();
  const updated = await prisma.payout.update({
    where: { id: payoutId },
    data: { status: "paid", paidAt: new Date() },
  });
  return NextResponse.json(updated);
}
