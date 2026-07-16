import type { Metadata } from "next";
import ToolInteractive from "@/app/components/ToolInteractive";
import { PET_TO_HUMAN_MODE } from "@/app/lib/previewModes";

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
      "Your first-ever generation on the site is free, full quality, no login needed. After that, one more free generation once you log in — after those two, you'll need credits to keep generating.",
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
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-12 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Pet to Human Generator — Free AI Preview
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Upload a photo of your pet and see an instant AI preview of what they might look like as a
          human.
        </p>
      </div>

      <ToolInteractive mode={PET_TO_HUMAN_MODE} />

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
