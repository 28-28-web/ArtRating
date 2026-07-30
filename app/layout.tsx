import type { Metadata } from "next";
import { Fraunces, Inter, Caveat } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import ReactDOM from "react-dom";
import SessionProviderWrapper from "@/app/components/SessionProviderWrapper";
import SiteNav from "@/app/components/SiteNav";
import NavLogo from "@/app/components/NavLogo";
import BrushDivider from "@/app/components/BrushDivider";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { SITE_URL } from "@/app/lib/site";
import "./globals.css";

// Runs before hydration (see `strategy="beforeInteractive"` below) so the
// correct theme is set before first paint — otherwise a dark-mode visitor
// would see a flash of the light theme. Only ever sets data-theme="dark";
// light mode is the absence of the attribute, matching ThemeToggle's own
// convention, so a stored "light" preference correctly leaves it unset
// instead of writing a `data-theme="light"` attribute that nothing reads.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var isDark=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(isDark)document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();`;

const CLARITY_PROJECT_ID = "xt7gfyiss5";
const CLARITY_SCRIPT = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`;

const GA_MEASUREMENT_ID = "G-3TQ0NFYHJV";
const GA_SCRIPT = `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}');`;

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const TITLE = "HeadshotMaker AI — Professional AI Headshots in Seconds";
const DESCRIPTION =
  "Turn any photo into a professional AI headshot for LinkedIn, resumes, and portfolios. Free to try, no signup needed.";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "HeadshotMaker AI",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "HeadshotMaker AI" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Turn any photo into a professional AI headshot in seconds.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Marquee/showcase photos are served from images.unsplash.com — warm the
  // connection early. React's float API (not a hand-written <head> element,
  // which the App Router ESLint rule disallows) is the documented way to
  // emit resource hints from a Server Component.
  ReactDOM.preconnect("https://images.unsplash.com");

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: CLARITY_SCRIPT }}
        />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {GA_SCRIPT}
        </Script>
        <SessionProviderWrapper>
          <header className="chrome-wash border-b border-border-soft">
            <SiteNav />
          </header>

          <Breadcrumbs />

          {children}

          <footer className="chrome-wash flex flex-col items-center gap-3 border-t border-border-soft px-6 py-10 text-center text-xs text-ink-soft">
            <NavLogo />
            <p className="max-w-xs text-ink-soft">
              Turn any photo into a professional AI headshot — upload, generate, download.
            </p>
            <BrushDivider className="my-1" />
            <nav className="flex flex-wrap justify-center gap-4">
              <Link href="/professional-headshot-generator" className="hover:text-accent-text">
                Headshot Generator
              </Link>
              <Link href="/linkedin-headshot" className="hover:text-accent-text">
                LinkedIn Headshot
              </Link>
              <Link href="/author-headshot" className="hover:text-accent-text">
                Author Headshot
              </Link>
            </nav>
            <p className="text-xs text-ink-soft">
              HeadshotMaker AI is a product of{" "}
              <a href="https://thefclbd.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-text">
                Fateh Consortium Ltd (FCLBD)
              </a>
              , Bangladesh.
            </p>
            <p className="text-xs text-ink-soft">
              🔒 Secure payments by Paddle &bull; 📧 hello@artrating.art &bull; 🏢 Fateh Consortium Ltd, Bangladesh
            </p>
            <nav className="flex flex-wrap justify-center gap-4">
              <Link href="/privacy" className="hover:text-accent-text">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-accent-text">
                Terms
              </Link>
              <Link href="/refund" className="hover:text-accent-text">
                Refund Policy
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
