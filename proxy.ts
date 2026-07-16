import { NextResponse, type NextRequest } from "next/server";
import { ANON_ID_COOKIE, signAnonId, verifyAnonId } from "@/app/lib/anonId";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const existing = request.cookies.get(ANON_ID_COOKIE)?.value;
  const verified = await verifyAnonId(existing);

  if (!verified) {
    const id = crypto.randomUUID();
    const signed = await signAnonId(id);
    response.cookies.set(ANON_ID_COOKIE, signed, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
