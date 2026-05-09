import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);
  const user = await prisma.user.upsert({
    where: { phone: "01700000000" },
    update: {},
    create: {
      name: "ডেমো শিল্পী",
      phone: "01700000000",
      passwordHash,
      isVerified: true,
    },
  });

  await prisma.artwork.upsert({
    where: { artId: "ART-2026-00001" },
    update: {},
    create: {
      artId: "ART-2026-00001",
      userId: user.id,
      title: "নীল নদীর বিকেল",
      description: "ডেমো আর্টওয়ার্ক",
      imageUrl: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=1200&auto=format&fit=crop",
      imagePublicId: "demo/1",
      category: "দৃশ্যপট",
      status: "approved",
    },
  });
}

main().finally(async () => prisma.$disconnect());
