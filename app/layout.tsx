import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-black/10 dark:border-white/10">
          <nav className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="font-semibold">
              Paintify
            </Link>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <Link href="/best-photo-to-painting-ai-tools-2026" className="hover:text-foreground">
                Best Tools 2026
              </Link>
              <Link href="/deep-art-effects-vs-photoai" className="hover:text-foreground">
                Deep Art Effects vs PhotoAI
              </Link>
              <Link href="/van-gogh-style-ai-filter-top-tools" className="hover:text-foreground">
                Van Gogh Filters
              </Link>
              <Link href="/professional-headshot-generator" className="hover:text-foreground">
                Headshot Generator
              </Link>
            </div>
          </nav>
        </header>

        {children}

        <footer className="border-t border-black/10 px-6 py-6 text-center text-xs text-zinc-500 dark:border-white/10">
          Paintify may earn a commission from links to Deep Art Effects and PhotoAI at no extra
          cost to you.
        </footer>
      </body>
    </html>
  );
}
