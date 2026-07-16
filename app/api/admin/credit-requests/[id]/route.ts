import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let action: string;
  try {
    const body = await request.json();
    action = body?.action === "reject" ? "reject" : "approve";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const purchaseRequest = await prisma.creditPurchaseRequest.findUnique({ where: { id } });
  if (!purchaseRequest || purchaseRequest.status !== "pending") {
    return NextResponse.json({ error: "Request not found or already reviewed" }, { status: 404 });
  }

  if (action === "approve") {
    await prisma.$transaction([
      prisma.creditPurchaseRequest.update({
        where: { id },
        data: { status: "approved", reviewedAt: new Date() },
      }),
      prisma.userCredit.upsert({
        where: { userId: purchaseRequest.userId },
        create: { userId: purchaseRequest.userId, balance: purchaseRequest.credits },
        update: { balance: { increment: purchaseRequest.credits } },
      }),
    ]);
  } else {
    await prisma.creditPurchaseRequest.update({
      where: { id },
      data: { status: "rejected", reviewedAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
