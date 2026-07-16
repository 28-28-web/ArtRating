"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavAuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <div className="flex items-center gap-4">
      <Link href="/credits" className="hover:text-ink">
        Credits
      </Link>
      {session?.user ? (
        <>
          <span className="text-xs text-ink-soft">{session.user.email}</span>
          <button onClick={() => signOut()} className="hover:text-ink">
            Log out
          </button>
        </>
      ) : (
        <Link href="/login" className="hover:text-ink">
          Log in
        </Link>
      )}
    </div>
  );
}
