import { prisma } from "@/lib/prisma";

export async function generateArtId(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.artwork.count();
  const padded = String(count + 1).padStart(5, "0");
  return `ART-${year}-${padded}`;
}
