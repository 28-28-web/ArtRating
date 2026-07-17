const CONFETTI_COLORS = ["var(--cobalt)", "var(--jade)", "var(--saffron)", "var(--magenta)", "var(--teal-muted)"];

// Pure-CSS confetti burst, shared by the style quiz result reveal and the
// contact form confirmation. `count` controls how festive it feels — the
// quiz uses the default, the contact form passes a smaller number since a
// support-form confirmation shouldn't compete with a fun quiz result.
export default function ConfettiBurst({ count = 12 }: { count?: number }) {
  const dots = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const distance = 40 + (i % 3) * 12;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    return {
      dx: `${dx}px`,
      dy: `${dy}px`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${(i % 4) * 40}ms`,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {dots.map((dot, i) => (
        <span
          key={i}
          className="confetti-dot"
          style={
            {
              left: "50%",
              top: "50%",
              background: dot.color,
              animationDelay: dot.delay,
              "--dx": dot.dx,
              "--dy": dot.dy,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
