import Link from "next/link";

type GalleryItem = {
  tool: "art-style" | "headshot" | "pet-human" | "toy" | "photo-mix";
  label: string;
  href: string;
  borderClass: string;
  src: string;
};

// TODO: replace with real Paintify-generated examples before launch — these
// are openly-licensed Lorem Picsum stock photos standing in for actual tool
// output, per the "no fake results, no competitor images" rule. Swap each
// `src` for a real screenshot/output from that tool once the site owner
// shares test-run results or credentials are available to generate fresh ones.
const GALLERY: GalleryItem[] = [
  {
    tool: "art-style",
    label: "Art Style",
    href: "#try-it",
    borderClass: "from-art-style",
    src: "https://picsum.photos/seed/paintify-art-style/400",
  },
  {
    tool: "headshot",
    label: "Headshot",
    href: "/professional-headshot-generator",
    borderClass: "from-headshot",
    src: "https://picsum.photos/seed/paintify-headshot/400",
  },
  {
    tool: "pet-human",
    label: "Pet-to-Human",
    href: "/pet-to-human",
    borderClass: "from-pet-human",
    src: "https://picsum.photos/seed/paintify-pet-human/400",
  },
  {
    tool: "toy",
    label: "Toy-ification",
    href: "/toy-ification",
    borderClass: "from-toy",
    src: "https://picsum.photos/seed/paintify-toy/400",
  },
  {
    tool: "photo-mix",
    label: "Photo Mix",
    href: "/photo-mix",
    borderClass: "from-photo-mix",
    src: "https://picsum.photos/seed/paintify-photo-mix/400",
  },
];

export default function HeroGallery() {
  return (
    <div className="hero-gallery w-full">
      {GALLERY.map((item) => (
        <Link
          key={item.tool}
          href={item.href}
          className={`hero-gallery-item ${item.borderClass}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={`Placeholder example — ${item.label} (stock photo, not a real Paintify output)`}
            loading="lazy"
          />
          <span className="hero-gallery-label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
