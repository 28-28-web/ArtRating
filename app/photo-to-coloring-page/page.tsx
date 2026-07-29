import type { Metadata } from "next";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { accentVars } from "@/app/lib/accent";

export const metadata: Metadata = {
  title: "Picture to Coloring Page Converter — Free AI Tool",
  description:
    "Turn a picture into a coloring page with AI — describe your photo and get matching printable line art in seconds. Free to try, no signup.",
  keywords: [
    "picture to coloring page converter",
    "turn picture into coloring page",
    "photo to coloring page",
    "convert photo to coloring page free",
  ],
  alternates: { canonical: "/photo-to-coloring-page" },
};

// Honest positioning note: the underlying tool is text-prompt based (see
// ColoringPageClient.tsx), not a direct image-upload converter. This page
// targets the "photo to coloring page" search intent but is written to
// describe the real workflow — describing your photo in words — rather
// than implying an upload feature that doesn't exist. Same reasoning as
// the earlier fix to the "sample results" section on the homepage: never
// label something as a capability the product doesn't actually have.
const faqs = [
  {
    question: "Can I turn a photo into a coloring page with AI?",
    answer:
      "Yes — describe what's in your photo (the subject, pose, and setting) and the AI generates a matching black-and-white coloring page. This tool works from a written description rather than a direct photo upload.",
  },
  {
    question: "How does the photo to coloring page converter work?",
    answer:
      "You describe your photo in a few words, pick a style, and the AI generates a printable line-art version based on that description — no drawing skill needed.",
  },
  {
    question: "Do I need to upload my photo?",
    answer:
      "No upload is required. Just describe what the photo shows, and the AI creates a coloring page to match your description.",
  },
  {
    question: "What's the best way to describe my photo for the best result?",
    answer:
      "Be specific: mention the subject (a person, pet, or object), what it's doing, and the setting — for example \"a golden retriever running on a beach\" works better than just \"a dog.\"",
  },
  {
    question: "Is converting a photo to a coloring page free?",
    answer:
      "Yes — your first 3 generations are free with a watermark and no signup. Removing the watermark for a clean print requires a free account and 1 credit.",
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

export default function PhotoToColoringPagePage() {
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
          Picture to Coloring Page Converter
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Turn a picture into a coloring page without drawing a single line — describe the photo,
          and get a matching printable line-art version in seconds.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">How It Works</h2>
        <ol className="list-decimal space-y-2 pl-5 text-ink">
          <li>Describe your picture — the subject, what it&apos;s doing, and the setting.</li>
          <li>Choose a style: Simple, Detailed, Mandala, or Cartoon.</li>
          <li>Generate and download your coloring page, free with a watermark.</li>
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">From Photo to Printable Line Art</h2>
        <p className="text-ink">
          A favorite family photo, a pet, a birthday party — almost any picture can become the
          basis for a coloring page. Instead of uploading the image file itself, you describe what
          it shows in a sentence or two, the same way you&apos;d describe it to an illustrator. The AI
          then generates a clean, black-and-white line-art version built from that description —
          thick or fine outlines, no shading, ready to print.
        </p>
        <p className="text-ink">
          This works well for turning a photo into a coloring page when you want the general scene
          — say, a photo to coloring page project for a pet, a favorite toy, or a family activity
          — rather than an exact pixel-for-pixel trace of the original image.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Example</h2>
        <p className="text-ink">
          A photo of a dog running on a beach might become the prompt{" "}
          <em>&quot;a golden retriever running on a sandy beach with waves in the background&quot;</em>{" "}
          in the Detailed style — turning a real memory into a page anyone can color in.
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
        <p className="text-ink">Describe your picture and get a coloring page in seconds — free, no signup.</p>
        <Link
          href="/coloring-page-generator"
          className="mt-3 inline-block rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas hover:opacity-90"
        >
          Try the converter →
        </Link>
      </div>

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">More Coloring Page Tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
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
