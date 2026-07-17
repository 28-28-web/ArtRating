export default function PaintDab({
  color,
  size,
  className = "",
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  const style: React.CSSProperties = {};
  if (color) style.background = color;
  if (size) {
    style.width = size;
    style.height = size;
  }

  return (
    <span
      className={`paint-dab ${className}`}
      style={Object.keys(style).length ? style : undefined}
      aria-hidden="true"
    />
  );
}
