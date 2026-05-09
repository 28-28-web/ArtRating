import { prisma } from "@/lib/prisma";
import { sendOtpSms } from "@/lib/sms";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phone, purpose = "register" } = await req.json();
  if (!/^01\d{9}$/.test(phone ?? "")) {
    return NextResponse.json({ success: false, message: "সঠিক মোবাইল নম্বর দিন" }, { status: 400 });
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.otpVerification.create({ data: { phone, otp, purpose, expiresAt } });
  await sendOtpSms({ phone, otp });
  const includeOtp = process.env.NODE_ENV !== "production";
  return NextResponse.json({ success: true, message: "OTP পাঠানো হয়েছে", otp: includeOtp ? otp : undefined });
}
