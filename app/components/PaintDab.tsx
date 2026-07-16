export default function PaintDab({
  color,
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`paint-dab ${className}`}
      style={color ? { background: color } : undefined}
      aria-hidden="true"
    />
  );
}
