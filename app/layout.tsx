import type { Metadata } from "next";
import { Fraunces, Inter, Caveat } from "next/font/google";
import Link from "next/link";
import SessionProviderWrapper from "@/app/components/SessionProviderWrapper";
import SiteNav from "@/app/components/SiteNav";
import Logo from "@/app/components/Logo";
import BrushDivider from "@/app/components/BrushDivider";
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
          <header className="chrome-wash border-b border-border-soft">
            <SiteNav />
          </header>

          {children}

          <footer className="chrome-wash flex flex-col items-center gap-3 border-t border-border-soft px-6 py-10 text-center text-xs text-ink-soft">
            <Logo />
            <p className="max-w-xs text-ink-soft">
              Turn your photos into paintings with AI — upload, pick a style, download.
            </p>
            <BrushDivider className="my-1" />
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
