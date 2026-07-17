import Link from "next/link";

type GalleryItem = {
  tool: "art-style" | "headshot" | "pet-human" | "toy" | "photo-mix";
  label: string;
  href: string;
  borderClass: string;
  src: string;
  alt: string;
};

// TODO: replace with real Paintify-generated examples before launch — these
// are openly-licensed Unsplash stock photos (Unsplash License — free for
// commercial use, no attribution required) standing in for actual tool
// output, per the "no fake results, no competitor images" rule. Each was
// picked and content-checked (not just seeded/randomized like the previous
// Picsum placeholders, which is why they didn't actually match their
// labels — a "toy-ification" seed returned an unrelated building photo)
// to visually match what that specific tool transforms:
const GALLERY: GalleryItem[] = [
  {
    // Art-style: applies painterly filters to any photo — a cityscape gives
    // clear architectural lines/color that read well "painted".
    // Photo: city skyline at sunset, by Sony ILCE-7M3 (Unsplash, free).
    tool: "art-style",
    label: "Art Style",
    href: "#try-it",
    borderClass: "from-art-style",
    src: "https://images.unsplash.com/photo-1675317439693-5cb511abc665?w=400&h=400&fit=crop&auto=format&q=80",
    alt: "Placeholder example — city skyline at sunset, a stand-in for the Art Style tool's painterly filter (stock photo, not a real Paintify output)",
  },
  {
    // Headshot: turns a casual selfie into a professional headshot — the
    // placeholder should look like the "before", not a finished headshot.
    // Photo: man taking a casual outdoor selfie, by Alexis Chloe (Unsplash, free).
    tool: "headshot",
    label: "Headshot",
    href: "/professional-headshot-generator",
    borderClass: "from-headshot",
    src: "https://images.unsplash.com/photo-1533063392863-a7e43da2afeb?w=400&h=400&fit=crop&auto=format&q=80",
    alt: "Placeholder example — a casual outdoor selfie, a stand-in for the 'before' photo the Headshot tool starts from (stock photo, not a real Paintify output)",
  },
  {
    // Pet-to-human: the whole point is a pet's face — needs an actual,
    // clearly visible pet.
    // Photo: golden retriever close-up, by Helena Lopes (Unsplash, free).
    tool: "pet-human",
    label: "Pet-to-Human",
    href: "/pet-to-human",
    borderClass: "from-pet-human",
    src: "https://images.unsplash.com/photo-1769117086394-15a1e67b53e9?w=400&h=400&fit=crop&auto=format&q=80",
    alt: "Placeholder example — a golden retriever's face, a stand-in for the Pet-to-Human tool's source photo (stock photo, not a real Paintify output)",
  },
  {
    // Toy-ification: turns a person into a collectible figure — needs a
    // clear portrait of a person, not architecture or scenery (the bug
    // being fixed here).
    // Photo: portrait of a man outdoors, by Clem Onojeghuo (Unsplash, free).
    tool: "toy",
    label: "Toy-ification",
    href: "/toy-ification",
    borderClass: "from-toy",
    src: "https://images.unsplash.com/photo-1519164497992-65f6b58a2981?w=400&h=400&fit=crop&auto=format&q=80",
    alt: "Placeholder example — a portrait of a man outdoors, a stand-in for the Toy-ification tool's source photo (stock photo, not a real Paintify output)",
  },
  {
    // Photo-mix: blends a person's photo with a pet/object photo — a
    // photo that already shows a person and a pet together best hints at
    // the two-photo input.
    // Photo: woman standing beside a dog, by Fredrik Öhlander (Unsplash, free).
    tool: "photo-mix",
    label: "Photo Mix",
    href: "/photo-mix",
    borderClass: "from-photo-mix",
    src: "https://images.unsplash.com/photo-1528447796577-8d58af85ff07?w=400&h=400&fit=crop&auto=format&q=80",
    alt: "Placeholder example — a woman standing beside a dog, a stand-in for the Photo Mix tool's two-photo input (stock photo, not a real Paintify output)",
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
          <img src={item.src} alt={item.alt} loading="lazy" />
          <span className="hero-gallery-label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
