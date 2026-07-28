import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const credit = await prisma.userCredit.findUnique({
    where: { userId: session.user.id },
    select: { balance: true },
  });
  return NextResponse.json({ balance: credit?.balance ?? 0 });
}
