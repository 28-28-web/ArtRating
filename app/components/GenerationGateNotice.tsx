"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function GenerationGateNotice({
  kind,
  onAuthenticated,
}: {
  kind: "needs-login" | "needs-payment";
  onAuthenticated?: () => void;
}) {
  const [formMode, setFormMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (kind === "needs-payment") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border-soft p-4 text-center">
        <p className="text-sm font-medium text-ink">You&apos;ve used both free generations.</p>
        <p className="text-sm text-ink-soft">Add credits to keep going.</p>
        <Link
          href="/credits"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas hover:opacity-90"
        >
          Get credits →
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (formMode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not create account");
          return;
        }
      }

      const result = await signIn("credentials", { redirect: false, email, password });
      if (result?.error) {
        setError("Incorrect email or password");
        return;
      }
      onAuthenticated?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border-soft p-4 text-center">
      <p className="text-sm font-medium text-ink">
        Log in to generate another image — your first one&apos;s on us!
      </p>
      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-2">
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
      <button
        onClick={() => setFormMode(formMode === "login" ? "signup" : "login")}
        className="text-xs text-ink-soft underline hover:text-accent-text"
      >
        {formMode === "login" ? "New here? Create account" : "Already have an account? Log in"}
      </button>
    </div>
  );
}
