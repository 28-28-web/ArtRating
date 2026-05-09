import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phone, otp, purpose = "register" } = await req.json();
  
  // First check if there's any expired OTP for this phone
  const expiredOtp = await prisma.otpVerification.findFirst({
    where: { phone, otp, purpose, used: false, expiresAt: { lt: new Date() } },
  });
  
  if (expiredOtp) {
    return NextResponse.json({ 
      success: false, 
      message: "OTP মেয়াদ উত্তীর্ণ হয়েছে। নতুন OTP চেষ্টা করুন।" 
    }, { status: 400 });
  }
  
  // Check for valid OTP
  const row = await prisma.otpVerification.findFirst({
    where: { phone, otp, purpose, used: false, expiresAt: { gt: new Date() } },
  });
  
  if (!row) {
    return NextResponse.json({ 
      success: false, 
      message: "OTP সঠিক নয়" 
    }, { status: 400 });
  }
  
  // Mark OTP as used
  await prisma.otpVerification.update({ 
    where: { id: row.id }, 
    data: { used: true } 
  });
  
  return NextResponse.json({ 
    success: true, 
    verified: true,
    message: "OTP সফলভাবে যাচাই করা হয়েছে"
  });
}
