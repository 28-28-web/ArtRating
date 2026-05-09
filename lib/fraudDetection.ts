import { prisma } from "@/lib/prisma";

export async function checkFraud(userId: string, ip: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("ব্যবহারকারী পাওয়া যায়নি");

  const hours = (Date.now() - user.createdAt.getTime()) / 3600000;
  if (hours < 48) throw new Error("নতুন একাউন্ট ৪৮ ঘণ্টা পর রেটিং দিতে পারবে");

  const oneHourAgo = new Date(Date.now() - 3600000);
  const recent = await prisma.rating.count({
    where: { userId, createdAt: { gte: oneHourAgo } },
  });
  if (recent >= 10) throw new Error("প্রতি ঘণ্টায় সর্বোচ্চ ১০টি রেটিং দেওয়া যাবে");

  const ipCheck = await prisma.rating.findMany({
    where: { ipAddress: ip, createdAt: { gte: oneHourAgo } },
    select: { userId: true },
    distinct: ["userId"],
  });
  if (ipCheck.length > 3) {
    await prisma.fraudLog.create({
      data: {
        userId,
        actionType: "multiple_ip",
        ipAddress: ip,
        details: "Same IP multiple accounts",
      },
    });
  }
}
