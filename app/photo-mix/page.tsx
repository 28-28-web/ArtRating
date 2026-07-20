import type { Metadata } from "next";
import ToolInteractive from "@/app/components/ToolInteractive";
import BrushDivider from "@/app/components/BrushDivider";
import { PHOTO_MIX_MODE } from "@/app/lib/previewModes";
import { accentVars } from "@/app/lib/accent";

export const metadata: Metadata = {
  title: "Mix Your Photo With Your Pet — Free AI Preview | Paintify",
  description:
    "Upload your photo and a photo of your pet or favorite thing, and get a free AI preview of both together in one scene.",
};

const faqs = [
  {
    question: "Can I mix myself with a celebrity photo?",
    answer:
      "This tool works with any photo you upload, but we recommend using pets or objects — that's what it's built and tested for. You're responsible for having the right to use any photo of another person, including making sure they've consented to being shown together with you.",
  },
  {
    question: "Is this free?",
    answer:
      "Generating a preview is free and doesn't need an account — you get 6 free generations, shared across every tool on the site. Downloading the full-quality, watermark-free file is the only part that needs an account: log in and use 1 credit per download.",
  },
  {
    question: "Why do my photos get resized?",
    answer:
      "The underlying model blends up to two reference photos and requires each one to be 512×512 pixels or smaller, so we automatically downscale larger photos to fit (preserving their aspect ratio) before generating.",
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

export default function PhotoMixPage() {
  return (
    <main
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-12 px-6 py-16"
      style={accentVars(PHOTO_MIX_MODE.accent)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          Mix Your Photo With Your Pet — Free AI Preview
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Upload your photo and a photo of your pet (or favorite thing), and see an instant AI
          preview of both together in one scene.
        </p>
      </div>

      <ToolInteractive mode={PHOTO_MIX_MODE} />

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
