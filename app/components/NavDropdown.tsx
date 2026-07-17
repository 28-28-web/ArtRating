"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PaintDab from "@/app/components/PaintDab";

type DropdownItem = { href: string; label: string; color?: string };

export default function NavDropdown({ label, items }: { label: string; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 rounded text-sm text-ink-soft hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        {label}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-20 mt-2 min-w-48 rounded-xl border border-border-soft bg-canvas p-1.5 shadow-lg"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-[var(--border-soft)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {item.color && <PaintDab color={item.color} size={10} />}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
