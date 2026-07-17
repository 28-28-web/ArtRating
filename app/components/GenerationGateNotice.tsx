"use client";

import Link from "next/link";
import PaintDab from "@/app/components/PaintDab";
import { useAuthForm } from "@/app/lib/useAuthForm";

export default function GenerationGateNotice({
  kind,
  onAuthenticated,
}: {
  kind: "needs-login" | "needs-payment";
  onAuthenticated?: () => void;
}) {
  const { formMode, email, setEmail, password, setPassword, error, submitting, handleSubmit, toggleMode } =
    useAuthForm(() => onAuthenticated?.());

  if (kind === "needs-payment") {
    return (
      <div className="gate-notice flex flex-col items-center gap-2 p-4 text-center">
        <PaintDab size={14} />
        <p className="font-display text-sm font-semibold text-ink">
          You&apos;ve used both free generations.
        </p>
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

  return (
    <div className="gate-notice flex flex-col items-center gap-3 p-4 text-center">
      <PaintDab size={14} />
      <p className="font-display text-sm font-semibold text-ink">
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
        {error && <p className="text-xs text-danger">{error}</p>}
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
    </div>
  );
}
