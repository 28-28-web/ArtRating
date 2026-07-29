import type { Metadata } from "next";
import ColoringPageClient from "@/app/components/ColoringPageClient";
import BrushDivider from "@/app/components/BrushDivider";
import { accentVars } from "@/app/lib/accent";

export const metadata: Metadata = {
  title: "Free AI Coloring Page Generator — Printable Pages Instantly",
  description:
    "Generate free printable coloring pages with AI. Type any prompt — animals, fantasy, holidays — and download instantly. Perfect for kids, teachers, and adults.",
  keywords: [
    "free coloring pages",
    "coloring page generator",
    "printable coloring pages",
    "AI coloring pages",
    "kids coloring pages",
  ],
  alternates: { canonical: "/coloring-page-generator" },
};

const faqs = [
  {
    question: "Is the coloring page generator free?",
    answer:
      "Yes — generating and downloading a watermarked coloring page is completely free, no signup needed. Removing the watermark for a clean, print-ready file requires an account and costs 1 credit.",
  },
  {
    question: "Can I use this for my classroom?",
    answer:
      "Yes. Teachers and parents use it to generate printable coloring pages for lessons, holidays, and activities — the free watermarked download is enough for classroom printing.",
  },
  {
    question: "What file format do I get?",
    answer: "Coloring pages download as PNG image files, which print cleanly on any standard printer.",
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

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          Free Coloring Page Generator — AI-Powered
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Type anything — animals, fantasy, nature, holidays — and get a printable coloring page in
          seconds. Free, no signup needed.
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
    </main>
  );
}
