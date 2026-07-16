import type { Metadata } from "next";
import ToolInteractive from "@/app/components/ToolInteractive";
import { TOY_MODE } from "@/app/lib/previewModes";

export const metadata: Metadata = {
  title: "Toy-ify Yourself — Free AI Preview | Paintify",
  description:
    "Upload a photo and get a free AI-generated preview of yourself as a collectible action figure.",
};

const faqs = [
  {
    question: "Will this look like a real toy?",
    answer:
      "It's a stylized AI preview designed to look toy-like, not a real photo of a physical product. Treat it as a fun visual, not a manufacturing mockup.",
  },
  {
    question: "Is this free?",
    answer:
      "Your first-ever generation on the site is free, full quality, no login needed. After that, one more free generation once you log in — after those two, you'll need credits to keep generating.",
  },
  {
    question: "Can I share my figure?",
    answer:
      "Yes — use the Download button to save it, or the Share button to send it to friends or post it on WhatsApp or Facebook.",
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

export default function ToyIficationPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-12 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Toy-ify Yourself — Free AI Preview
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Upload a photo and see an instant AI preview of yourself as a collectible action figure.
        </p>
      </div>

      <ToolInteractive mode={TOY_MODE} />

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-black/10 p-4 dark:border-white/10"
            >
              <p className="font-medium">{faq.question}</p>
              <p className="mt-1 text-sm text-zinc-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
