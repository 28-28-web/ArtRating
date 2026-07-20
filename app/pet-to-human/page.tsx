import type { Metadata } from "next";
import ToolInteractive from "@/app/components/ToolInteractive";
import BrushDivider from "@/app/components/BrushDivider";
import { PET_TO_HUMAN_MODE } from "@/app/lib/previewModes";
import { accentVars } from "@/app/lib/accent";

export const metadata: Metadata = {
  title: "Pet to Human Generator — Free AI Preview | Paintify",
  description:
    "Upload a photo of your pet and get a free AI-generated preview of what they might look like as a human.",
};

const faqs = [
  {
    question: "Is this an accurate prediction of anything?",
    answer:
      "No — this is a fun AI interpretation, not a scientific or accurate prediction. It's meant for entertainment, not to reveal any real fact about your pet.",
  },
  {
    question: "Is this free?",
    answer:
      "Generating a preview is free and doesn't need an account — you get 6 free generations, shared across every tool on the site. Downloading the full-quality, watermark-free file is the only part that needs an account: log in and use 1 credit per download.",
  },
  {
    question: "Can I use this on any pet photo?",
    answer:
      "You can try it on any clear photo of your pet. Results vary — a well-lit, front-facing photo tends to give the most recognizable result.",
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

export default function PetToHumanPage() {
  return (
    <main
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-12 px-6 py-16"
      style={accentVars(PET_TO_HUMAN_MODE.accent)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          Pet to Human Generator — Free AI Preview
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Upload a photo of your pet and see an instant AI preview of what they might look like as a
          human.
        </p>
      </div>

      <ToolInteractive mode={PET_TO_HUMAN_MODE} />

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
