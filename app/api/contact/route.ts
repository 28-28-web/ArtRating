import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getClientIp, isRateLimited } from "@/app/lib/contactRateLimit";

const CATEGORIES = ["general", "bug", "misuse-report", "business"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent recently. Please try again in a bit." },
      { status: 429 }
    );
  }

  let name: string;
  let email: string;
  let category: string;
  let message: string;
  try {
    const body = await request.json();
    name = typeof body?.name === "string" ? body.name.trim() : "";
    email = typeof body?.email === "string" ? body.email.trim() : "";
    category = typeof body?.category === "string" ? body.category : "";
    message = typeof body?.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are all required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return NextResponse.json({ error: "Pick a valid category" }, { status: 400 });
  }

  await prisma.contactMessage.create({ data: { name, email, category, message } });

  return NextResponse.json({ ok: true });
}
