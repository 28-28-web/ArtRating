"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavAuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <div className="flex items-center gap-4">
      <Link href="/credits" className="hover:text-foreground">
        Credits
      </Link>
      {session?.user ? (
        <>
          <span className="text-xs text-zinc-400">{session.user.email}</span>
          <button onClick={() => signOut()} className="hover:text-foreground">
            Log out
          </button>
        </>
      ) : (
        <Link href="/login" className="hover:text-foreground">
          Log in
        </Link>
      )}
    </div>
  );
}
