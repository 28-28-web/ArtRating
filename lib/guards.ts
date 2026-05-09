import { auth } from "@/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("লগইন প্রয়োজন");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin" && user.phone !== process.env.ADMIN_PHONE) {
    throw new Error("অ্যাডমিন অনুমতি নেই");
  }
  return user;
}
