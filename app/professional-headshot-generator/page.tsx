import type { Metadata } from "next";
import ToolInteractive from "@/app/components/ToolInteractive";
import BrushDivider from "@/app/components/BrushDivider";
import { HEADSHOT_MODE } from "@/app/lib/previewModes";
import { accentVars } from "@/app/lib/accent";

export const metadata: Metadata = {
  title: "Professional Headshot Generator — Free AI Preview | Paintify",
  description:
    "Upload a photo and get a free AI-generated professional headshot preview — Corporate, LinkedIn, Studio Portrait, or Creative Professional styles.",
};

const faqs = [
  {
    question: "Can AI generate a professional headshot from a selfie?",
    answer:
      "AI can restyle your photo's background, lighting, and attire to look more professional, but it works from your existing photo — it can't fix poor image quality or awkward angles, and it isn't a substitute for a real photoshoot. Treat it as a quick, casual preview rather than a finished product.",
  },
  {
    question: "Is this free?",
    answer:
      "Your first-ever generation on the site is free, full quality, no login needed. After that, one more free generation once you log in — after those two, you'll need credits to keep generating.",
  },
  {
    question: "How is this different from Deep Art Effects or PhotoAI?",
    answer:
      "Deep Art Effects turns photos into painterly art styles like Van Gogh or watercolor — not headshots. PhotoAI generates stylized AI portraits and avatars from your selfies, which is closer to a polished headshot, so that's what we recommend for the full version.",
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

export default function ProfessionalHeadshotGeneratorPage() {
  return (
    <main
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-12 px-6 py-16"
      style={accentVars(HEADSHOT_MODE.accent)}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          Professional Headshot Generator — Free AI Preview
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Upload a photo and see an instant AI preview of a professional headshot — pick a Corporate,
          LinkedIn, Studio Portrait, or Creative Professional look.
        </p>
      </div>

      <ToolInteractive mode={HEADSHOT_MODE} />

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
