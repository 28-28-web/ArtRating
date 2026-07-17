"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuthForm } from "@/app/lib/useAuthForm";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { formMode, email, setEmail, password, setPassword, error, submitting, handleSubmit, toggleMode } =
    useAuthForm(() => router.push(callbackUrl));

  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-ink">
        {formMode === "login" ? "Log in" : "Create account"}
      </h1>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-full border border-border-soft bg-transparent px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-full border border-border-soft bg-transparent px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas disabled:opacity-50"
        >
          {submitting ? "…" : formMode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
      <button onClick={toggleMode} className="text-xs text-ink-soft underline hover:text-accent-text">
        {formMode === "login" ? "New here? Create account" : "Already have an account? Log in"}
      </button>
    </>
  );
}
