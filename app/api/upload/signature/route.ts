import { auth } from "@/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "লগইন প্রয়োজন" }, { status: 401 });
  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json({ message: "Cloudinary কনফিগার করা নেই" }, { status: 500 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "artrating/artworks";
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex");

  return NextResponse.json({
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    signature,
  });
}
