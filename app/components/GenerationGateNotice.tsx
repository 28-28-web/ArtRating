"use client";

import Link from "next/link";
import PaintDab from "@/app/components/PaintDab";
import { useAuthForm, signInWithGoogle } from "@/app/lib/useAuthForm";

export default function GenerationGateNotice({
  kind,
  message,
  onAuthenticated,
}: {
  kind: "needs-login" | "needs-payment";
  // Overrides the default "You need a credit to download this" copy — used
  // when this component is reused for a different needs-payment-shaped
  // state (e.g. headshot's daily generation cap) where that default text
  // would be inaccurate. When provided, the download-specific "Remove
  // watermark — from $5" subline is also skipped, since it doesn't apply.
  message?: string;
  onAuthenticated?: () => void;
}) {
  const { formMode, email, setEmail, password, setPassword, error, submitting, handleSubmit, toggleMode } =
    useAuthForm(() => onAuthenticated?.());

  if (kind === "needs-payment") {
    return (
      <div className="gate-notice flex flex-col items-center gap-2 p-4 text-center">
        <PaintDab size={14} />
        <p className="font-display text-sm font-semibold text-ink">
          {message ?? "You need a credit to download this."}
        </p>
        {!message && <p className="text-sm text-ink-soft">Remove watermark — from $5.</p>}
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
        Log in to download this image.
      </p>

      <button
        type="button"
        onClick={() => signInWithGoogle(window.location.href)}
        className="flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-ink hover:bg-[var(--border-soft)]/30"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M15.68 8.18c0-.57-.05-1.11-.14-1.64H8v3.1h4.3a3.68 3.68 0 0 1-1.6 2.42v2h2.58c1.51-1.4 2.4-3.45 2.4-5.88Z"
          />
          <path
            fill="#34A853"
            d="M8 16c2.16 0 3.97-.72 5.29-1.94l-2.58-2c-.72.48-1.63.77-2.71.77-2.08 0-3.85-1.41-4.48-3.3H.86v2.07A8 8 0 0 0 8 16Z"
          />
          <path fill="#FBBC05" d="M3.52 9.53a4.8 4.8 0 0 1 0-3.06V4.4H.86a8 8 0 0 0 0 7.2l2.66-2.07Z" />
          <path
            fill="#EA4335"
            d="M8 3.18c1.17 0 2.23.4 3.06 1.19l2.29-2.29A7.96 7.96 0 0 0 8 0 8 8 0 0 0 .86 4.4l2.66 2.07C4.15 4.6 5.92 3.18 8 3.18Z"
          />
        </svg>
        Continue with Google
      </button>
      <div className="flex w-full max-w-xs items-center gap-3 text-xs text-ink-soft">
        <span className="h-px flex-1 bg-border-soft" />
        or
        <span className="h-px flex-1 bg-border-soft" />
      </div>

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
