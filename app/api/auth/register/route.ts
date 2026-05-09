import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, phone, password } = await req.json();
  if (!name || !/^01\d{9}$/.test(phone ?? "") || !password || String(password).length < 6) {
    return NextResponse.json({ success: false, message: "তথ্য সঠিক নয়" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) return NextResponse.json({ success: false, message: "এই নম্বরে একাউন্ট আছে" }, { status: 409 });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, phone, passwordHash, isVerified: true } });
  return NextResponse.json({ success: true, userId: user.id });
}
