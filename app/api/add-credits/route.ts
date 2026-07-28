import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

// Called by bookkraftai.com's Paddle webhook after a headshot credit purchase
// completes. Verifies the shared secret, finds the artrating user by email,
// and adds credits idempotently using paddleOrderId as a uniqueness key.
export async function POST(request: Request) {
  const secret = process.env.ARTRATING_WEBHOOK_SECRET;
  if (!secret) {
    console.error("add-credits: ARTRATING_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { email?: string; credits?: number; paddleOrderId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { email, credits, paddleOrderId } = body;

  if (!email || typeof credits !== "number" || !paddleOrderId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("add-credits: user not found:", email);
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  try {
    await prisma.$transaction([
      prisma.paddlePurchase.create({
        data: {
          userId: user.id,
          paddleOrderId,
          priceId: "cross-domain-headshot",
          creditsAdded: credits,
          amountPaidCents: null,
        },
      }),
      prisma.userCredit.upsert({
        where: { userId: user.id },
        create: { userId: user.id, balance: credits },
        update: { balance: { increment: credits } },
      }),
    ]);
    console.log(`add-credits: +${credits} credits → ${email} (order ${paddleOrderId})`);
    return NextResponse.json({ ok: true, creditsAdded: credits });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ ok: true, alreadyProcessed: true });
    }
    console.error("add-credits: transaction failed:", err);
    return NextResponse.json({ error: "transaction_failed" }, { status: 500 });
  }
}
