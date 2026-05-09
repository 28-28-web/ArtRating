import { generateArtId } from "@/lib/artId";
import { requireUser } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const artworks = await prisma.artwork.findMany({
    where: { status: "approved" },
    include: { user: true, ratings: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(artworks);
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const user = await requireUser();
    if (!body.title || !body.description || !body.category || !body.imageUrl) {
      return NextResponse.json({ message: "সব তথ্য দিন" }, { status: 400 });
    }
    const artId = await generateArtId();
    const artwork = await prisma.artwork.create({
      data: {
        artId,
        userId: user.id,
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        imagePublicId: body.imagePublicId ?? "demo-public-id",
        category: body.category,
        status: "pending",
        isAIGenerated: !!body.isAIGenerated,
      },
    });
    return NextResponse.json(artwork);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 401 });
  }
}
