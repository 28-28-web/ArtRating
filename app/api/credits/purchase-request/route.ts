import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Log in to request credits" }, { status: 401 });
  }

  let method: string;
  let transactionRef: string;
  let packId: string;
  try {
    const body = await request.json();
    method = body?.method === "nagad" ? "nagad" : "bkash";
    transactionRef = typeof body?.transactionRef === "string" ? body.transactionRef.trim() : "";
    packId = typeof body?.packId === "string" ? body.packId : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack || !transactionRef) {
    return NextResponse.json(
      { error: "Choose a pack and enter your transaction reference" },
      { status: 400 }
    );
  }

  await prisma.creditPurchaseRequest.create({
    data: {
      userId: session.user.id,
      method,
      transactionRef,
      credits: pack.credits,
    },
  });

  return NextResponse.json({ ok: true });
}
