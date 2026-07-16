import type { Metadata } from "next";
import { Fraunces, Inter, Caveat } from "next/font/google";
import Link from "next/link";
import SessionProviderWrapper from "@/app/components/SessionProviderWrapper";
import NavAuthStatus from "@/app/components/NavAuthStatus";
import PaintDab from "@/app/components/PaintDab";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Paintify — AI Photo-to-Painting Tools",
  description:
    "Turn your photos into paintings with AI. Get style recommendations and compare the best photo-to-painting tools like Deep Art Effects and PhotoAI.",
};

const NAV_TOOLS = [
  { href: "/professional-headshot-generator", label: "Headshot Generator", color: "var(--teal-muted)" },
  { href: "/pet-to-human", label: "Pet to Human", color: "var(--jade)" },
  { href: "/toy-ification", label: "Toy-ify Yourself", color: "var(--saffron)" },
  { href: "/photo-mix", label: "Photo Mix", color: "var(--magenta)" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <SessionProviderWrapper>
          <header className="border-b border-border-soft">
            <nav className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
              <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <PaintDab color="var(--cobalt)" />
                Paintify
              </Link>
              <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft">
                <Link href="/best-photo-to-painting-ai-tools-2026" className="hover:text-accent-text">
                  Best Tools 2026
                </Link>
                <Link href="/deep-art-effects-vs-photoai" className="hover:text-accent-text">
                  Deep Art Effects vs PhotoAI
                </Link>
                <Link href="/van-gogh-style-ai-filter-top-tools" className="hover:text-accent-text">
                  Van Gogh Filters
                </Link>
                {NAV_TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center gap-1.5 hover:text-ink"
                  >
                    <PaintDab color={tool.color} className="!h-2.5 !w-2.5" />
                    {tool.label}
                  </Link>
                ))}
                <NavAuthStatus />
              </div>
            </nav>
          </header>

          {children}

          <footer className="flex flex-col items-center gap-3 border-t border-border-soft px-6 py-6 text-center text-xs text-ink-soft">
            <p>
              Paintify may earn a commission from links to Deep Art Effects and PhotoAI at no
              extra cost to you.
            </p>
            <nav className="flex gap-4">
              <Link href="/privacy" className="hover:text-accent-text">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-accent-text">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-accent-text">
                Contact
              </Link>
            </nav>
          </footer>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
