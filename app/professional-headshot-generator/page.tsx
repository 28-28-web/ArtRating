import type { Metadata } from "next";
import Link from "next/link";
import ToolInteractive from "@/app/components/ToolInteractive";
import BrushDivider from "@/app/components/BrushDivider";
import { HEADSHOT_MODE } from "@/app/lib/previewModes";
import { accentVars } from "@/app/lib/accent";
import { FREE_GENERATION_CAP } from "@/app/lib/generationGate";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata: Metadata = {
  title: "Professional AI Headshot Generator — Studio Quality from Your Selfie",
  description:
    "Upload any selfie and get a professional headshot in 30 seconds. Used by LinkedIn professionals, indie authors, and job seekers. From $5.",
  alternates: { canonical: "/professional-headshot-generator" },
};

const cheapestPack = CREDIT_PACKS[0];

const faqs = [
  {
    question: "How does an AI headshot generator work?",
    answer:
      "You upload a photo, pick a style — Corporate, Creative, Executive, or Casual — and the AI restyles your background, lighting, and attire to look professional while keeping your actual face and likeness. It works from the photo you give it, so a clear, well-lit selfie gives the best result.",
  },
  {
    question: "Are AI headshots professional enough for LinkedIn?",
    answer:
      "For most LinkedIn profiles, yes — the goal is a clean, well-lit, professional-looking photo, which is exactly what this is built for. It's not a substitute for a real studio photoshoot if you need something like an executive press kit, but for a standard LinkedIn profile photo, resume, or job application, it holds up well.",
  },
  {
    question: "How much does an AI headshot cost?",
    answer: `Generating a preview is free — you get ${FREE_GENERATION_CAP} free generations with a watermark, no signup needed. Downloading the full-quality, watermark-free file requires an account and costs 1 credit, with packs starting at ${cheapestPack.priceLabel} for ${cheapestPack.credits} credits.`,
  },
  {
    question: "How long does it take to generate an AI headshot?",
    answer:
      "Generation typically takes around 30 seconds. You get an instant on-screen preview and can download the full-resolution version right after.",
  },
  {
    question: "Can I use AI headshots for my Amazon author page?",
    answer:
      "Yes. A clean, professional headshot works for an Amazon author page the same way it works for LinkedIn or a resume — see our dedicated guide on author headshots for tips specific to book covers and author bios.",
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
          Professional AI Headshot Generator
        </h1>
        <BrushDivider />
        <p className="max-w-xl text-lg text-ink-soft">
          Upload a photo and see an instant AI preview of a professional headshot — pick a Corporate,
          Creative, Executive, or Casual look.
        </p>
      </div>

      <ToolInteractive mode={HEADSHOT_MODE} />

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">How Our AI Headshot Generator Works</h2>
        <p className="text-ink">
          Upload any selfie — no special equipment, lighting setup, or photographer needed. Choose
          a style from the four presets above, and the AI headshot generator restyles your
          background, lighting, and attire to match a professional look while keeping your actual
          face and likeness intact. The whole process takes about 30 seconds from upload to
          preview, and you can regenerate as many times as you have free generations left if the
          first result isn&apos;t quite right.
        </p>
        <p className="text-ink">
          Your first {FREE_GENERATION_CAP} generations are free, watermarked previews — no account,
          no credit card. When you&apos;re happy with a result, log in and use one credit to
          download the full-resolution, watermark-free file.
        </p>
      </section>

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Why Professionals Choose HeadshotMaker AI
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>
            <strong>Speed</strong> — a professional-looking headshot in about 30 seconds, not a
            2-week wait for a photographer&apos;s booking and editing turnaround.
          </li>
          <li>
            <strong>Price</strong> — free to preview, and full downloads start at{" "}
            {cheapestPack.priceLabel} instead of the $150-$500+ a photographer session typically
            costs.
          </li>
          <li>
            <strong>No studio required</strong> — works from a selfie you take on your phone,
            anywhere.
          </li>
          <li>
            <strong>Unlimited reshoots</strong> — don&apos;t like a result? Generate again, no
            extra session fee.
          </li>
        </ul>
      </section>

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">AI Headshots for Every Use Case</h2>
        <p className="text-ink">
          A professional headshot generator is useful anywhere a plain casual photo undersells
          you — LinkedIn profiles, resumes and job applications, company &quot;About&quot; pages,
          portfolio sites, and email signatures all benefit from the same clean, consistent look.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/linkedin-headshot"
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">LinkedIn Headshot Generator →</p>
            <p className="mt-1 text-sm text-ink-soft">Built specifically for LinkedIn profile photos.</p>
          </Link>
          <Link
            href="/author-headshot"
            className="rounded-xl border border-border-soft p-4 hover:border-accent"
          >
            <p className="font-medium text-ink">Author Headshot Generator →</p>
            <p className="mt-1 text-sm text-ink-soft">For book covers and Amazon author pages.</p>
          </Link>
        </div>
      </section>

      <section className="flex w-full flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">What Our Users Say</h2>
        <p className="text-ink">
          We don&apos;t publish invented star ratings or made-up customer quotes — if we ever add
          testimonials here, they&apos;ll be from real users, not written for SEO. What we can tell
          you honestly is what people consistently use this tool for: a fast, cheap way to get a
          decent LinkedIn photo without booking a photographer, and a way to try a few different
          professional looks before committing to a download.
        </p>
      </section>

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

      <p className="text-sm text-ink-soft">
        Ready to download a watermark-free result?{" "}
        <Link href="/credits" className="underline hover:text-accent-text">
          Get credits →
        </Link>
      </p>
    </main>
  );
}
