export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/payout/:path*", "/admin/:path*"],
};
