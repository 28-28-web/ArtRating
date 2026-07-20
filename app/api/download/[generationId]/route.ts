import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { withAttachmentFlag } from "@/app/lib/cloudinaryUpload";

// The only place login is required in the whole generation flow — generation
// itself is free and anonymous, download is the paid step.
//
// Option (b) from the build brief: only generations made while logged in
// have a cleanImageUrl at all (see generationOutput.ts / Generation model),
// so an anonymous-era generation simply has nothing to download here — the
// visitor is told to log in and regenerate, which is free and fast under
// this model, rather than trying to retroactively "claim" an anon
// generation by matching cookies. Simpler to build correctly, and a
// reasonable tradeoff per the brief.
export async function POST(request: Request, { params }: { params: Promise<{ generationId: string }> }) {
  const { generationId } = await params;

  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (!userId) {
    return NextResponse.json(
      { error: "Log in to download your result." },
      { status: 401 }
    );
  }

  const generation = await prisma.generation.findUnique({ where: { id: generationId } });

  if (!generation || generation.userId !== userId) {
    return NextResponse.json({ error: "Generation not found" }, { status: 404 });
  }

  if (!generation.cleanImageUrl) {
    return NextResponse.json(
      {
        error:
          "This preview was made before you logged in and can't be downloaded — generate it again while logged in, it's free.",
      },
      { status: 404 }
    );
  }

  // Already paid for this one — let them re-download without a second charge.
  if (generation.downloadedAt) {
    const credit = await prisma.userCredit.findUnique({ where: { userId } });
    return NextResponse.json({
      url: withAttachmentFlag(generation.cleanImageUrl),
      remainingCredits: credit?.balance ?? 0,
    });
  }

  const credit = await prisma.userCredit.findUnique({ where: { userId } });
  if (!credit || credit.balance < 1) {
    return NextResponse.json(
      { error: "You need a credit to download this. Purchase credits to continue." },
      { status: 402 }
    );
  }

  const [updatedCredit] = await prisma.$transaction([
    prisma.userCredit.update({ where: { userId }, data: { balance: { decrement: 1 } } }),
    prisma.generation.update({
      where: { id: generationId },
      data: { usedCredit: true, downloadedAt: new Date() },
    }),
  ]);

  return NextResponse.json({
    url: withAttachmentFlag(generation.cleanImageUrl),
    remainingCredits: updatedCredit.balance,
  });
}
