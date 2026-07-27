import Link from "next/link";

// Ring geometry drawn in a 64x64 internal coordinate space (viewBox) so the
// spec'd numbers — 10px photo radius, 20px ring radius from center — fit
// without clipping, then scaled down to the spec'd 44x44 rendered size via
// the svg width/height attributes. Center (32,32), six photo circles at
// 60-degree steps starting from the top.
const CENTER = 32;
const RING_R = 20;
const FACE_R = 10;
const FACES = [
  { name: "asian", angleDeg: -90 },
  { name: "european-female", angleDeg: -30 },
  { name: "african", angleDeg: 30 },
  { name: "arabic", angleDeg: 90 },
  { name: "chinese", angleDeg: 150 },
  { name: "european-male", angleDeg: 210 },
].map((f) => {
  const rad = (f.angleDeg * Math.PI) / 180;
  return {
    ...f,
    cx: CENTER + RING_R * Math.cos(rad),
    cy: CENTER + RING_R * Math.sin(rad),
  };
});

export default function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <svg width="44" height="44" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          {FACES.map((face) => (
            <clipPath id={`nav-logo-face-${face.name}`} key={face.name}>
              <circle cx={face.cx} cy={face.cy} r={FACE_R} />
            </clipPath>
          ))}
        </defs>

        {FACES.map((face) => (
          <image
            key={face.name}
            href={`/images/logo-faces/${face.name}.jpg`}
            x={face.cx - FACE_R}
            y={face.cy - FACE_R}
            width={FACE_R * 2}
            height={FACE_R * 2}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#nav-logo-face-${face.name})`}
          />
        ))}

        <circle cx={CENTER} cy={CENTER} r={9} fill="#378ADD" stroke="var(--canvas)" strokeWidth="2" />
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-inter)"
          fontSize="12"
          fontWeight="700"
          fill="#fff"
        >
          AI
        </text>
      </svg>

      <span className="font-display text-lg leading-none text-ink">
        <span className="font-semibold">HeadshotMaker</span>
        <span style={{ color: "#378ADD" }}> AI</span>
      </span>
    </Link>
  );
}
