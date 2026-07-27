import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Email login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        // No passwordHash means this account was created via Google OAuth —
        // it never set a password, so the credentials form can't authorize it.
        if (!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    // No Prisma adapter is configured (sessions are JWT-only, and the
    // Credentials provider already does its own manual DB lookups) — so for
    // Google sign-in this callback is the only place a User row gets
    // created. Runs once per sign-in attempt; find-or-create on email, then
    // overwrite `user.id`/`user.role` in place so the same object's values
    // (not Google's opaque `sub`) flow into the `jwt` callback below — this
    // is the standard next-auth pattern for OAuth + a hand-rolled DB layer
    // instead of an adapter.
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;

      const email = user.email.toLowerCase();
      const existing = await prisma.user.findUnique({ where: { email } });
      const dbUser = existing ?? (await prisma.user.create({ data: { email, passwordHash: null } }));

      user.id = dbUser.id;
      (user as { role?: string }).role = dbUser.role;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
