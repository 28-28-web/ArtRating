import type { Metadata } from "next";
import Link from "next/link";
import ColoringPageClient from "@/app/components/ColoringPageClient";
import BrushDivider from "@/app/components/BrushDivider";
import { accentVars } from "@/app/lib/accent";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata: Metadata = {
  title: "AI Coloring Page Generator — Free Printable Pages",
  description:
    "Free AI coloring page generator — type a prompt, pick a style, and print instantly. No signup needed to try it.",
  keywords: [
    "ai coloring page generator",
    "ai coloring pages generator",
    "coloring pages ai",
    "coloring page generator free",
  ],
  alternates: { canonical: "/coloring-page-generator" },
};

const cheapestPack = CREDIT_PACKS[0];

// PAA-style phrasing (matches how these get typed into Google), answers kept
// accurate to what's actually built — no PDF export, no daily-reset credits,
// watermark-free requires login, same honesty bar as the rest of the site.
const faqs = [
  {
    question: "What is an AI coloring page generator?",
    answer:
      "It's a tool that turns a short text description — like \"a cute cat sitting in a garden\" — into a black-and-white, printable line-art coloring page, without you needing to draw anything yourself.",
  },
  {
    question: "Is the AI coloring page generator free to use?",
    answer:
      "Yes. Your first 3 generations are free with no signup — each comes with a small watermark. Removing the watermark for a clean print-ready file needs a free account and costs 1 credit.",
  },
  {
    question: "How do I make my own coloring page with AI?",
    answer:
      "Type what you want to see, choose a style — Simple, Detailed, Mandala, or Cartoon — and click Generate. You'll get a preview in seconds that you can download and print right away.",
  },
  {
    question: "Can I use AI-generated coloring pages for a coloring book or classroom?",
    answer:
      "For classroom or personal printing, yes, even on the free watermarked version. For commercial use — like selling a coloring book — you'll need the paid, watermark-free download. See our terms of service for details.",
  },
  {
    question: "What styles can the AI coloring page generator create?",
    answer:
      "Four presets: Simple (thick lines for young kids), Detailed (fine lines for adult coloring books), Mandala (geometric, symmetrical patterns), and Cartoon (bold, playful outlines).",
  },
  {
    question: "Do I need to sign up to use the coloring pages AI tool?",
    answer:
      "No signup is needed to generate and download your first 3 watermarked coloring pages. An account is only required if you want the watermark-free, print-quality version.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

// applicationCategory: "DesignApplication" rather than "PhotoApplication" —
// this tool generates original line art from a text prompt, it doesn't edit
// a photo, so DesignApplication (a real schema.org enum value) is the more
// accurate fit.
const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: `${SITE_NAME} Coloring Page Generator`,
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}/coloring-page-generator`,
  description: "AI coloring page generator — type a prompt and get a free, printable black-and-white coloring page.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "First 3 generations free, watermarked, no signup needed",
    },
    {
      "@type": "Offer",
      price: cheapestPack.priceLabel.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      description: `Starter pack — ${cheapestPack.credits} credits for watermark-free downloads`,
    },
  ],
};

export default function ColoringPageGeneratorPage() {
  return (
    <main
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-12 px-6 py-16"
      style={accentVars("saffron")}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          AI Coloring Page Generator — Free &amp; Printable
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Type anything — animals, fantasy, nature, holidays — and this free AI coloring page
          generator turns it into a printable page in seconds. No signup needed.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-ink-soft">
          <span className="rounded-full border border-border-soft px-3 py-1">Free to use</span>
          <span className="rounded-full border border-border-soft px-3 py-1">Printable PNG</span>
          <span className="rounded-full border border-border-soft px-3 py-1">Kids &amp; Adults</span>
          <span className="rounded-full border border-border-soft px-3 py-1">No signup</span>
        </div>
      </div>

      <ColoringPageClient />

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">How It Works</h2>
        <ol className="list-decimal space-y-2 pl-5 text-ink">
          <li>Describe what you want — a subject, a scene, or an idea, in a few words.</li>
          <li>Pick a style: Simple, Detailed, Mandala, or Cartoon.</li>
          <li>Generate your coloring page and download it — free with a watermark, or 1 credit for the clean, print-ready version.</li>
        </ol>
      </section>

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Who It&apos;s For</h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>
            <strong>Parents</strong> — a fresh, on-theme coloring page for a rainy afternoon or a
            themed birthday party, generated in seconds instead of searching for a printable online.
          </li>
          <li>
            <strong>Teachers</strong> — custom coloring sheets tied to whatever the class is
            learning that week, from animals to holidays to shapes.
          </li>
          <li>
            <strong>KDP authors</strong> — generate a themed set of pages, one at a time, in a
            consistent style, then compile them into your own coloring book.
          </li>
        </ul>
      </section>

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">What Can You Make?</h2>
        <p className="text-ink">
          Type any idea and the AI turns it into a clean, printable line-art coloring page —
          animals, fantasy creatures like dragons and unicorns, holiday scenes, intricate mandalas,
          nature scenes, and fun cartoon characters. Pick Simple for younger kids, Detailed for
          adult coloring books, Mandala for geometric patterns, or Cartoon for bold, playful
          outlines.
        </p>
      </section>

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">How to Print Your Coloring Page</h2>
        <p className="text-ink">
          Download your coloring page, then open the file and print it like any other image —
          standard letter or A4 paper works well. For the cleanest printed lines, choose your
          printer&apos;s &quot;best quality&quot; or &quot;photo&quot; setting rather than draft mode.
        </p>
      </section>

      <section className="flex w-full flex-col gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Frequently Asked Questions</h2>
          <BrushDivider className="mt-1" />
        </div>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-border-soft p-4">
              <p className="font-medium text-ink">{faq.question}</p>
              <p className="mt-1 text-sm text-ink-soft">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex w-full flex-col gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">More Ways to Create Coloring Pages</h2>
          <BrushDivider className="mt-1" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/photo-to-coloring-page"
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">Photo to Coloring Page →</p>
            <p className="mt-1 text-sm text-ink-soft">Describe a photo, get a matching coloring page.</p>
          </Link>
          <Link
            href="/ai-coloring-book-generator"
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">AI Coloring Book Generator →</p>
            <p className="mt-1 text-sm text-ink-soft">Build a themed set of pages for KDP or class.</p>
          </Link>
          <Link
            href="/free-ai-coloring-page-generator"
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">Free AI Coloring Page Generator →</p>
            <p className="mt-1 text-sm text-ink-soft">No signup, no cost to try it out.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
