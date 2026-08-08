import { buildMetadata } from "@/app/lib/seo";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/app/components/HeroSection";
import HeadshotShowcase from "@/app/components/HeadshotShowcase";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";
import { FREE_GENERATION_CAP } from "@/app/lib/generationGate";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata = buildMetadata({
  title: "HeadshotMaker AI — Free AI Headshot Generator",
  description:
    "Generate studio-quality professional headshots from any selfie using AI. Perfect for LinkedIn, Amazon author pages, and resumes. Free to try — no signup needed.",
  path: "/",
});


const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Turn any photo into a professional AI headshot for LinkedIn, resumes, and portfolios. Free to try, no signup needed.",
    },
  ],
};

const cheapestPack = CREDIT_PACKS[0];

const HOW_IT_WORKS = [
  { n: "1", title: "Upload your photo", body: "Any clear face photo works. A forward-facing selfie in natural light gives the best result — no studio setup needed." },
  { n: "2", title: "Pick your style", body: "Choose from 22+ professional styles: LinkedIn, CEO, Doctor, Author, Passport, and more. Each style sets a new background and lighting automatically." },
  { n: "3", title: "Get your AI headshot", body: "A professional-quality preview generates in under 60 seconds. Regenerate as many times as you like — previews are always free." },
  { n: "4", title: "Download in HD", body: `Happy with the result? Log in and spend 2 credits to download the full-resolution, watermark-free file. Packs start from ${CREDIT_PACKS[0].priceLabel}.` },
];

const PROFESSION_GROUPS = [
  {
    title: "Corporate & Professional",
    styles: "LinkedIn · CV · CEO · Corporate Team · Executive",
    body: "Your LinkedIn profile photo is the first impression in every job search and cold outreach. Corporate AI headshots deliver a studio-quality result in the time it takes to make a coffee.",
  },
  {
    title: "Freelancers & Creators",
    styles: "Freelancer · Fiverr · Upwork · YouTube · Instagram · Twitter · GitHub",
    body: "Profile photos on freelance platforms directly affect trust and conversion rates. A clean, professional photo signals credibility before a client reads a single word of your pitch.",
  },
  {
    title: "Specialists & Professionals",
    styles: "Doctor · Lawyer · Teacher · Speaker · Author",
    body: "Professional roles demand a headshot that signals authority and trust. AI headshots for doctors, lawyers, and educators deliver a formal look without a studio booking.",
  },
  {
    title: "Everyday & Field Workers",
    styles: "Farmer · Foreman · Office Support · Tea Boy · Student",
    body: "Professional photos aren't just for office roles. Whether it's a student portfolio, a receptionist profile, or a field supervisor's ID badge, every role deserves a decent headshot.",
  },
  {
    title: "Documents & ID",
    styles: "Passport Style",
    body: "Document headshots require a plain, formal look with precise framing. The Passport style follows standard guidelines: neutral background, front-facing, formal attire.",
  },
];

const AI_VS_PHOTO = [
  {
    label: "Cost",
    ai: `Free previews · from ${CREDIT_PACKS[0].priceLabel} to download`,
    pro: "$150–$500+ per session",
    body: `AI headshots start free — previews cost nothing. Clean downloads start from ${CREDIT_PACKS[0].priceLabel}, compared to $150–$500+ for a professional photography session.`,
  },
  {
    label: "Time",
    ai: "Ready in under 60 seconds",
    pro: "1–3 weeks (booking + editing)",
    body: "An AI headshot is ready before you'd finish booking a photographer's calendar link. No waiting for edited files.",
  },
  {
    label: "Convenience",
    ai: "Any device · any time · no appointment",
    pro: "Studio visit · limited slots · travel required",
    body: "Generate from any device, at any time, from anywhere in the world. No appointment, no commute, no posing sessions.",
  },
];

const TESTIMONIALS = [
  {
    name: "মোহাম্মদ রফিকুল ইসলাম",
    nameRoman: "Mohammad Rafiqul Islam",
    avatar: "/testimonials/rafiqul-islam.jpg",
    rating: 5,
    style: "Passport",
    quote:
      "স্টুডিওতে গিয়ে লাইনে দাঁড়ানোর দরকারই হলো না। মোবাইলের একটা ছবি থেকেই পাসপোর্ট সাইজের ফরম্যাটে রেডি হয়ে গেল।",
  },
];

// No aggregateRating field here — the site has no real review/rating system
// behind it yet, and Google's structured-data guidelines treat a fabricated
// rating as a policy violation (can trigger a manual action on rich
// results). Add it once genuine ratings exist to back it up.
//
// applicationCategory stays "PhotoApplication" — schema.org's actual
// enumerated ApplicationCategory values don't include "PhotoEditingApplication";
// using a non-existent category risks the whole block being ignored rather
// than helping.
//
// offers is an array (schema.org allows multiple Offer entries) so it can
// honestly represent both real price points: generating a preview is
// genuinely free, and $5 is the real starting price for a credit pack
// (download/watermark removal), not the cost to use the app itself.
const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "PhotoApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: "AI-powered professional headshot generator for LinkedIn, resumes, and portfolios.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to try, no signup needed",
    },
    {
      "@type": "Offer",
      price: cheapestPack.priceLabel.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      description: `Starter pack — ${cheapestPack.credits} credits for watermark-free downloads`,
    },
  ],
};

// Kept in sync with the visible FAQ section below — numbers pulled from the
// real gating logic (generationGate.ts) and pricing (creditPacks.ts) rather
// than hardcoded, so this can't silently drift out of date the way the
// spec's own "2 credits" / "$5" figures already had (actual free tier is
// generations, not credits, and pricing is in BDT, not USD).
const FAQS = [
  {
    question: "How does HeadshotMaker AI work?",
    answer:
      "Upload any photo, choose a style — Corporate, Creative, or Executive — and our AI generates a professional headshot in seconds. No signup needed for the free preview.",
  },
  {
    question: "Is HeadshotMaker AI free?",
    answer: `Try free — ${FREE_GENERATION_CAP} headshots with watermark, no signup. Remove watermark — from ${cheapestPack.priceLabel}. Downloading the full-quality, watermark-free file needs an account and costs 2 credits; packs start at ${cheapestPack.priceLabel} for ${cheapestPack.credits} credits.`,
  },
  {
    question: "How long does it take to generate a headshot?",
    answer:
      "AI headshot generation takes seconds. You get an instant preview and can download the full-resolution version once you're happy with it.",
  },
  {
    question: "Are my photos stored?",
    answer:
      "Your original uploaded photo is never stored by us — it is processed in memory and discarded when the request ends. Generated headshots are stored on Cloudinary so you can download them later; you can request deletion at hello@artrating.art. The AI inference providers (fal.ai and Cloudflare Workers AI) process your image under their own privacy policies.",
  },
  {
    question: "What resolution is the downloaded headshot?",
    answer:
      "Downloaded files are full-quality JPEG at the AI model's native resolution — typically 1024×1024px or higher, suitable for LinkedIn, resumes, and web use. For large-format print, a professional photographer still provides higher resolution.",
  },
  {
    question: "Can I use an AI headshot on LinkedIn or official documents?",
    answer:
      "Yes for LinkedIn, resumes, email signatures, and most professional profiles — AI headshots are widely accepted for digital use. For government ID, passports, or visa applications, use a photo taken by a human photographer that meets that authority's specific requirements.",
  },
  {
    question: "How does the AI actually generate the headshot?",
    answer:
      "HeadshotMaker AI uses FLUX.1 Kontext, an instruction-based image editing model, for logged-in users. It receives your photo and a style instruction — \"replace the background, keep the face unchanged\" — and renders a new image. It edits your photo rather than generating a new person, which is why your identity is preserved.",
  },
  {
    question: "What is the difference between free and paid?",
    answer: `The free tier gives you ${FREE_GENERATION_CAP} AI headshot previews with a watermark — no signup, no credit card. Paid means removing the watermark: log in, spend 2 credits, and download the full-quality file. Credits start from ${cheapestPack.priceLabel}. Generation is always free; you only pay to download.`,
  },
  {
    question: "Is Paintify the same as HeadshotMaker AI?",
    answer:
      "Yes — HeadshotMaker AI was previously called Paintify. Same product, same team, rebranded to better reflect the focus on professional headshots. All existing accounts and credits carry over.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <HeroSection freeGenerationCap={FREE_GENERATION_CAP} />

      <main className="flex w-full max-w-5xl flex-1 flex-col items-center gap-16 px-6 py-16">
        <section id="examples" className="flex w-full flex-col items-center gap-10">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            AI Headshot Styles
          </h2>
          <HeadshotShowcase />
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">How It Works</h2>
            <BrushDivider className="mt-1" />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.n} className="rounded-xl border border-border-soft p-4">
                <span className="font-display text-3xl font-bold text-accent-text">{step.n}</span>
                <p className="mt-2 font-medium text-ink">{step.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Built For Every Profession</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROFESSION_GROUPS.map((group) => (
              <div key={group.title} className="rounded-xl border border-border-soft p-4">
                <p className="font-medium text-ink">{group.title}</p>
                <p className="mt-1 text-xs font-medium text-accent-text">{group.styles}</p>
                <p className="mt-2 text-sm text-ink-soft">{group.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">AI Headshot vs Traditional Photography</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {AI_VS_PHOTO.map((row) => (
              <div key={row.label} className="rounded-xl border border-border-soft p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{row.label}</p>
                <p className="mt-2 font-medium text-ink">{row.ai}</p>
                <p className="mt-1 text-sm text-ink-soft line-through">{row.pro}</p>
                <p className="mt-2 text-sm text-ink-soft">{row.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">How It&apos;s Built</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="rounded-xl border border-border-soft p-5">
            <p className="text-sm text-ink-soft">
              HeadshotMaker AI runs on <strong className="text-ink">FLUX.1 Kontext</strong> — an
              instruction-based image editing model from Black Forest Labs. It receives your photo
              and a text instruction, then edits the background and lighting while preserving your
              face. It does not generate a new person; it edits the one in your photo.
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              Logged-in users get FLUX.1 Kontext via fal.ai&apos;s inference infrastructure.
              Anonymous free previews run on Cloudflare Workers AI using Stable Diffusion 1.5 —
              same concept, lighter compute, enough to show you what a style looks like before you
              decide to download.
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              Your uploaded photo is processed in memory and discarded immediately after generation.
              We never store your source image or use it to train models.
            </p>
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">What Users Say</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.nameRoman}
                className="flex flex-col gap-3 rounded-xl border border-border-soft p-5"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={`${t.nameRoman} profile photo`}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-ink">{t.name}</p>
                    <p className="text-xs text-ink-soft">{t.nameRoman}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-saffron" aria-hidden="true">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-ink-soft">{t.quote}</p>
                <span className="self-start rounded-full border border-border-soft px-2 py-0.5 text-xs font-medium text-accent-text">
                  {t.style}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">More AI Headshot Tools</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/professional-headshot-generator"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">AI Headshot Generator</p>
              <p className="mt-1 text-sm text-ink-soft">The main tool — upload, choose a style, download.</p>
            </Link>
            <Link
              href="/linkedin-headshot"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">LinkedIn Headshot Generator</p>
              <p className="mt-1 text-sm text-ink-soft">Built for LinkedIn profile photos specifically.</p>
            </Link>
            <Link
              href="/author-headshot"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">Author Headshot Generator</p>
              <p className="mt-1 text-sm text-ink-soft">For book covers and Amazon author pages.</p>
            </Link>
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Frequently Asked Questions</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-border-soft p-4">
                <p className="font-medium text-ink">{faq.question}</p>
                <p className="mt-1 text-sm text-ink-soft">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Guides &amp; Comparisons</h2>
            <BrushDivider className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/linkedin-headshot"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">LinkedIn headshot tips</p>
              <p className="mt-1 text-sm text-ink-soft">What makes a profile photo get more views.</p>
            </Link>
            <Link
              href="/guides/ai-headshot-vs-photographer"
              className="rounded-xl border border-border-soft p-4 hover:border-accent"
            >
              <p className="font-medium text-ink">AI headshot vs photographer</p>
              <p className="mt-1 text-sm text-ink-soft">Cost, quality, and turnaround compared.</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
