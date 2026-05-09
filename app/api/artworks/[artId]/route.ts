import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ artId: string }> }) {
  const { artId } = await params;
  const artwork = await prisma.artwork.findUnique({
    where: { artId },
    include: { user: true, ratings: true, comments: true },
  });
  if (!artwork) return NextResponse.json({ message: "ছবি পাওয়া যায়নি" }, { status: 404 });
  return NextResponse.json(artwork);
}
