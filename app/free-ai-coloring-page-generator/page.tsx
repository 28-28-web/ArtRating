import type { Metadata } from "next";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { accentVars } from "@/app/lib/accent";

export const metadata: Metadata = {
  title: "Free AI Coloring Page Generator — No Signup",
  description:
    "Create your own coloring page free with AI — no signup needed. Generate and download your first pages online in seconds.",
  keywords: [
    "free ai coloring page generator",
    "ai coloring page generator online free",
    "create your own coloring page free",
  ],
  alternates: { canonical: "/free-ai-coloring-page-generator" },
};

// Honesty note: the free tier is a fixed lifetime allowance (3 generations),
// not a daily-resetting credit — the copy below says "first 3", never
// "daily free credits," so it doesn't promise a reset that doesn't exist.
const faqs = [
  {
    question: "Is this AI coloring page generator really free?",
    answer:
      "Yes — your first 3 coloring page generations are completely free, watermarked, and require no signup at all.",
  },
  {
    question: "Do I need to create an account to use it for free?",
    answer:
      "No. You can generate and download your first 3 watermarked coloring pages with no account. An account is only needed to remove the watermark.",
  },
  {
    question: "How many free coloring pages can I generate?",
    answer:
      "You get 3 free generations without signing up. This is a one-time free allowance, not a daily reset.",
  },
  {
    question: "What do I get if I don't want the watermark?",
    answer:
      "Create a free account and spend 1 credit to download the clean, watermark-free, print-quality version of any page you generate.",
  },
  {
    question: "Can I create my own coloring page online without downloading software?",
    answer:
      "Yes — everything runs in your browser. There's nothing to install; you type a prompt, generate, and download the image directly.",
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

export default function FreeAiColoringPageGeneratorPage() {
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
          Free AI Coloring Page Generator
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Create your own coloring page free — no signup, no software to install, no cost to try
          it out.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Free, No Signup Required</h2>
        <p className="text-ink">
          Most AI coloring page tools ask for an email or account before you can generate anything.
          This one doesn&apos;t. Type a prompt, pick a style, and get a printable coloring page —
          your first 3 generations are free, watermarked, and require nothing from you but a
          browser. It&apos;s a genuinely free ai coloring page generator online, not a free trial
          that asks for a card number.
        </p>
        <p className="text-ink">
          If you decide you want the clean, watermark-free file for printing, a free account and 1
          credit unlocks that — but trying the tool and seeing what it can do costs nothing at all.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">How to Create Your Own Coloring Page Free</h2>
        <ol className="list-decimal space-y-2 pl-5 text-ink">
          <li>Type a short description of what you want — an animal, a scene, an idea.</li>
          <li>Pick a style: Simple, Detailed, Mandala, or Cartoon.</li>
          <li>Generate and download — completely free, watermarked, no account needed.</li>
        </ol>
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
        <p className="text-ink">Try it now — free, no signup needed.</p>
        <Link
          href="/coloring-page-generator"
          className="mt-3 inline-block rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas hover:opacity-90"
        >
          Generate a free coloring page →
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
            href="/ai-coloring-book-generator"
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">AI Coloring Book Generator →</p>
            <p className="mt-1 text-sm text-ink-soft">Build a themed set of pages for KDP or class.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
