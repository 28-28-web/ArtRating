import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phone, otp, purpose = "register" } = await req.json();
  const row = await prisma.otpVerification.findFirst({
    where: { phone, otp, purpose, used: false, expiresAt: { gt: new Date() } },
  });
  if (!row) return NextResponse.json({ success: false, message: "OTP সঠিক নয়" }, { status: 400 });
  await prisma.otpVerification.update({ where: { id: row.id }, data: { used: true } });
  return NextResponse.json({ success: true });
}
