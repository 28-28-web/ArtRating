import { requireUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await requireUser();
  const { artworkId, artId, content, parentId } = await req.json();
  const artwork = artworkId
    ? await prisma.artwork.findUnique({ where: { id: artworkId } })
    : await prisma.artwork.findUnique({ where: { artId } });
  if (!artwork) return NextResponse.json({ message: "ছবি পাওয়া যায়নি" }, { status: 404 });
  const comment = await prisma.comment.create({ data: { artworkId: artwork.id, userId: user.id, content, parentId } });
  return NextResponse.json(comment);
}
