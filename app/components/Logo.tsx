import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
      <svg width="28" height="24" viewBox="0 0 28 24" aria-hidden="true">
        <circle cx="9" cy="9" r="7" fill="var(--cobalt)" opacity="0.9" />
        <circle cx="17" cy="7" r="6" fill="var(--saffron)" opacity="0.9" />
        <circle cx="13" cy="16" r="7" fill="var(--magenta)" opacity="0.9" />
      </svg>
      Paintify
    </Link>
  );
}
