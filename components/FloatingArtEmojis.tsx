"use client";

import { useMemo } from "react";

export function FloatingArtEmojis() {
  const items = useMemo(() => {
    const base = [
      { emoji: "🎨", x: 10, y: 10, d: 0.1, s: 1.0 },
      { emoji: "🖌️", x: 30, y: 25, d: 0.8, s: 1.1 },
      { emoji: "✏️", x: 60, y: 15, d: 1.2, s: 0.95 },
      { emoji: "🖼️", x: 80, y: 30, d: 0.4, s: 1.05 },
    ];
    return base.map((b, idx) => ({
      ...b,
      id: idx,
      left: `${b.x}%`,
      top: `${b.y}%`,
      delay: `${b.d}s`,
      scale: b.s,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute select-none text-3xl sm:text-4xl opacity-90 animate-[floatEmoji_6s_ease-in-out_infinite]"
          style={{
            left: it.left,
            top: it.top,
            animationDelay: it.delay,
            transform: `scale(${it.scale})`,
          }}
        >
          {it.emoji}
        </span>
      ))}
      <style jsx>{`
        @keyframes floatEmoji {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.25));
          }
          50% {
            transform: translate3d(0, -18px, 0) scale(1.03);
            filter: drop-shadow(0 0 22px rgba(124, 58, 237, 0.35));
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.25));
          }
        }
      `}</style>
    </div>
  );
}

