import type { Metadata } from "next";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { accentVars } from "@/app/lib/accent";

export const metadata: Metadata = {
  title: "AI Coloring Book Generator — Themed Page Sets",
  description:
    "Build a themed coloring book with our AI coloring book generator — generate consistent pages for kids, classrooms, or KDP publishing. Free to start.",
  keywords: ["ai coloring book generator", "coloring book generator", "coloring book page generator"],
  alternates: { canonical: "/ai-coloring-book-generator" },
};

// Honesty note: there is no one-click "generate 30 pages" batch feature —
// pages are generated one at a time, same as the main tool. This page is
// written around that real workflow (pick one style, vary the prompt,
// repeat) rather than claiming a bulk-export feature that doesn't exist.
const faqs = [
  {
    question: "Can I make a whole coloring book with AI?",
    answer:
      "Yes — generate each page one at a time using the same style preset and a shared theme (like ocean animals or dinosaurs), then compile the pages into your book using any PDF or document tool.",
  },
  {
    question: "How many pages can I generate for my coloring book?",
    answer:
      "Your first 3 pages are free with no signup. Beyond that, each additional watermark-free page costs 1 credit, so you can build a book as large as you need.",
  },
  {
    question: "Can I use AI coloring book pages for KDP or Amazon self-publishing?",
    answer:
      "Yes, for pages you've paid to download watermark-free — those are yours for commercial use, including KDP and other self-publishing. The free, watermarked generations are for personal and classroom use only. Per our terms of service, you're responsible for any AI-content disclosure your publishing platform requires.",
  },
  {
    question: "How do I keep my coloring book pages consistent in style?",
    answer:
      "Stick to one style preset — Simple, Detailed, Mandala, or Cartoon — for every page in the set, and keep your prompts structured the same way (subject + setting) so the line weight and look stay consistent across the book.",
  },
  {
    question: "Is there a bulk or batch generator for coloring books?",
    answer:
      "Not yet — today you generate each page individually, choosing the same style each time to keep a consistent look across your set.",
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

export default function AiColoringBookGeneratorPage() {
  return (
    <main
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16"
      style={accentVars("saffron")}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          AI Coloring Book Generator
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Build a themed set of coloring pages with AI — one consistent style, as many pages as
          your book needs.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">How to Build a Coloring Book</h2>
        <ol className="list-decimal space-y-2 pl-5 text-ink">
          <li>Pick a theme — ocean animals, dinosaurs, holidays, fantasy creatures.</li>
          <li>Choose one style preset and keep it the same for every page in the set.</li>
          <li>Generate each page with a different prompt inside that theme, then download.</li>
          <li>Compile your finished pages into a PDF or document to print or publish.</li>
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Built for Teachers and KDP Authors</h2>
        <p className="text-ink">
          A coloring book generator saves the two slowest parts of making a themed coloring book:
          coming up with enough on-theme ideas, and drawing consistent line art for each one.
          Teachers can generate a week&apos;s worth of themed activity sheets — say, five ocean animals
          for a marine biology unit — in the time it would take to find printables online. KDP
          authors and independent publishers use the same workflow to build low-content coloring
          books: pick a theme and a style, generate page after page, and assemble the finished set
          into a book file using whatever publishing tool they already use.
        </p>
        <p className="text-ink">
          Because every page comes from the same style preset, a themed set — dinosaurs, under-the-
          sea, or holiday scenes — reads as one cohesive book rather than a random mix of styles,
          even though each page is generated individually.
        </p>
      </section>

      <section className="flex flex-col gap-4">
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

      <div className="rounded-2xl border border-border-soft p-6 text-center">
        <p className="text-ink">Start your themed set — your first 3 pages are free, no signup.</p>
        <Link
          href="/coloring-page-generator"
          className="mt-3 inline-block rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas hover:opacity-90"
        >
          Start generating pages →
        </Link>
      </div>

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">More Coloring Page Tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/photo-to-coloring-page"
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">Photo to Coloring Page →</p>
            <p className="mt-1 text-sm text-ink-soft">Describe a photo, get a matching coloring page.</p>
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
