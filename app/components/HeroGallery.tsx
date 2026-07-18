"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

type GalleryItem = {
  tool: "art-style" | "headshot" | "pet-human" | "toy" | "photo-mix";
  label: string;
  href: string;
  borderClass: string;
  src: string;
  alt: string;
};

// Real example photos supplied by the site owner (public/examples/), one per
// tool — each is what you'd upload to that tool, not a finished AI result.
// Files were renamed from inconsistent manual-save names to clean slugs; see
// the commit that did this for the original filenames.
const GALLERY: GalleryItem[] = [
  {
    tool: "art-style",
    label: "Art Style",
    href: "#try-it",
    borderClass: "from-art-style",
    src: "/examples/art-style-example.jpg",
    alt: "Example photo for the Art Style tool — a city skyline at sunset",
  },
  {
    tool: "headshot",
    label: "Headshot",
    href: "/professional-headshot-generator",
    borderClass: "from-headshot",
    src: "/examples/headshot-example.jpg",
    alt: "Example photo for the Headshot tool — a plain-background portrait",
  },
  {
    tool: "pet-human",
    label: "Pet-to-Human",
    href: "/pet-to-human",
    borderClass: "from-pet-human",
    src: "/examples/pet-to-human-example.jpg",
    alt: "Example photo for the Pet-to-Human tool — a close-up cat portrait",
  },
  {
    tool: "toy",
    label: "Toy-ification",
    href: "/toy-ification",
    borderClass: "from-toy",
    src: "/examples/toy-ification-example.jpg",
    alt: "Example photo for the Toy-ification tool — a plain-background portrait",
  },
  {
    tool: "photo-mix",
    label: "Photo Mix",
    href: "/photo-mix",
    borderClass: "from-photo-mix",
    src: "/examples/photo-mix-example.jpg",
    alt: "Example photo for the Photo Mix tool — a person with their cat",
  },
];

const MAX_TILT_DEG = 4;
const IMAGE_SIZES = "(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 260px";

export default function HeroGallery() {
  // Only tilt for mouse/trackpad users who haven't asked for less motion —
  // computed once on mount rather than per mousemove event.
  const canTilt = useRef(false);

  useEffect(() => {
    canTilt.current =
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLImageElement>) {
    if (!canTilt.current) return;
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.setProperty("--tilt-y", `${(relX * MAX_TILT_DEG * 2).toFixed(2)}deg`);
    img.style.setProperty("--tilt-x", `${(-relY * MAX_TILT_DEG * 2).toFixed(2)}deg`);
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLImageElement>) {
    e.currentTarget.style.setProperty("--tilt-x", "0deg");
    e.currentTarget.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div className="hero-gallery w-full">
      {GALLERY.map((item) => (
        <Link
          key={item.tool}
          href={item.href}
          className={`hero-gallery-item ${item.borderClass}`}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes={IMAGE_SIZES}
            loading="lazy"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          <span className="hero-gallery-label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
