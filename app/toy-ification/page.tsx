import type { Metadata } from "next";
import ToolInteractive from "@/app/components/ToolInteractive";
import BrushDivider from "@/app/components/BrushDivider";
import { TOY_MODE } from "@/app/lib/previewModes";
import { accentVars } from "@/app/lib/accent";

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
    <main
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-12 px-6 py-16"
      style={accentVars(TOY_MODE.accent)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          Toy-ify Yourself — Free AI Preview
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Upload a photo and see an instant AI preview of yourself as a collectible action figure.
        </p>
      </div>

      <ToolInteractive mode={TOY_MODE} />

      <section className="flex w-full flex-col gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">FAQ</h2>
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
