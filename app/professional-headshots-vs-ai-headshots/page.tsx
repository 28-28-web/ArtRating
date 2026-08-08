import type { Metadata } from "next";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata: Metadata = {
  title: "Professional Headshots vs AI Headshots: Which Is Right for You? (2026)",
  description:
    "Professional headshots vs AI headshots — honest cost, quality, and speed comparison. When a $5 AI photo is good enough, and when you still need a real photographer.",
  alternates: { canonical: "/professional-headshots-vs-ai-headshots" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Professional Headshots vs AI Headshots: Which Is Right for You? (2026)",
  description:
    "Professional headshots vs AI headshots — honest cost, quality, and speed comparison. When a $5 AI photo is good enough, and when you still need a real photographer.",
  datePublished: "2026-08-08",
  dateModified: "2026-08-08",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME },
  mainEntityOfPage: `${SITE_URL}/professional-headshots-vs-ai-headshots`,
};

const cheapestPack = CREDIT_PACKS[0];

const PROS_AI = [
  "Ready in under 60 seconds",
  "No booking, no commute, no awkward posing",
  "Unlimited retries — change the style, regenerate",
  `Free preview, watermark-free download from ${cheapestPack.priceLabel}`,
  "22+ styles: LinkedIn, CEO, Doctor, Author, and more",
  "Works from any decent selfie",
];

const CONS_AI = [
  "Starts from the photo you have — bad lighting limits results",
  "No artistic direction or posing feedback",
  "Not suitable for large print, press kits, or campaigns",
  "Identity must be clear in the source photo",
];

const PROS_PRO = [
  "Photographer controls lighting, composition, and posing",
  "Results are unique and fully customisable",
  "Multiple outfit changes in one session",
  "Print-quality output at any size",
  "Great for book covers, press kits, campaigns",
];

const CONS_PRO = [
  "$150–$500+ per session, often more in major cities",
  "1–3 week wait: booking + editing turnaround",
  "Reshoots cost another full session fee",
  "Scheduling around photographer availability",
];

export default function ProfessionalHeadshotsVsAiPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Professional Headshots vs AI Headshots
        </h1>
        <BrushDivider className="mt-2" />
        <p className="mt-3 text-xs text-ink-soft">6 min read · Updated August 2026</p>
      </div>

      <p className="text-lg text-ink">
        Professional headshots cost $150–$500 and take weeks to book. AI headshots cost a fraction of
        that and are ready in under a minute. Here&apos;s how to decide which one you actually need.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Quick Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-soft">
                <th className="py-2 pr-4 font-medium text-ink">Factor</th>
                <th className="py-2 pr-4 font-medium text-ink">AI headshot</th>
                <th className="py-2 font-medium text-ink">Pro photographer</th>
              </tr>
            </thead>
            <tbody className="text-ink-soft">
              {[
                ["Cost", `${cheapestPack.priceLabel}–$39 one-time`, "$150–$500+ per session"],
                ["Turnaround", "Under 60 seconds", "1–3 weeks"],
                ["Reshoots", "Unlimited, free", "Extra session fee"],
                ["Styles", "22+ presets", "Fully custom"],
                ["Location", "Any device, anywhere", "Photographer's studio or your location"],
                ["Print-quality", "Screen / web use", "Any resolution"],
                ["Best for", "LinkedIn, CV, social, everyday use", "Press kits, book covers, campaigns"],
              ].map(([factor, ai, pro]) => (
                <tr key={factor} className="border-b border-border-soft">
                  <td className="py-2 pr-4 font-medium text-ink">{factor}</td>
                  <td className="py-2 pr-4">{ai}</td>
                  <td className="py-2">{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">AI Headshots — Pros & Cons</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-soft p-4">
            <p className="mb-2 text-sm font-semibold text-ink">Pros</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              {PROS_AI.map((p) => <li key={p}>✓ {p}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-border-soft p-4">
            <p className="mb-2 text-sm font-semibold text-ink">Cons</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              {CONS_AI.map((c) => <li key={c}>✗ {c}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Professional Headshots — Pros & Cons</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-soft p-4">
            <p className="mb-2 text-sm font-semibold text-ink">Pros</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              {PROS_PRO.map((p) => <li key={p}>✓ {p}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-border-soft p-4">
            <p className="mb-2 text-sm font-semibold text-ink">Cons</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              {CONS_PRO.map((c) => <li key={c}>✗ {c}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Cost in Detail</h2>
        <p className="text-ink">
          A professional headshot session in a mid-size city typically runs $200–$350 for an
          hour, 2–3 outfit changes, and 5–10 edited photos. In New York or London, expect $400–$600.
          You also pay in time: finding a photographer, waiting for their schedule, showing up, and
          then waiting 1–2 weeks for edited files.
        </p>
        <p className="text-ink">
          AI headshots start free — HeadshotMaker AI gives you{" "}
          <Link href="/professional-headshot-generator" className="underline hover:text-accent-text">
            6 free previews with no signup
          </Link>
          . Removing the watermark for a download costs {cheapestPack.priceLabel}. That&apos;s the
          full cost for most people.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Quality: When Is AI Good Enough?</h2>
        <p className="text-ink">
          For a LinkedIn profile, a company &quot;About&quot; page, or a job application — AI is
          genuinely good enough for the vast majority of use cases. The output depends heavily on
          your source photo: a sharp, well-lit selfie in natural light produces a far better result
          than a grainy, backlit screenshot.
        </p>
        <p className="text-ink">
          Where a photographer&apos;s skill shows most is in posing direction, lighting setups, and
          the ability to capture genuine expression over dozens of shots. An AI generator works from
          a single image, so it can&apos;t replicate that — but it can make the photo you already
          have look significantly more polished.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Choose AI if…</h2>
        <ul className="list-disc space-y-1 pl-5 text-ink">
          <li>You need a LinkedIn or social profile photo this week</li>
          <li>You want to try multiple styles before committing</li>
          <li>Budget is a constraint</li>
          <li>You have a decent selfie already</li>
          <li>You need different background styles for different platforms</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Choose a Photographer if…</h2>
        <ul className="list-disc space-y-1 pl-5 text-ink">
          <li>You need a press kit or book author photo</li>
          <li>The photo will be printed large (billboard, magazine)</li>
          <li>You&apos;re doing a major brand campaign</li>
          <li>You want multiple looks from a single session</li>
          <li>You need an experienced eye for posing and expression</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">The Honest Verdict</h2>
        <p className="text-ink">
          For the 90% of professionals who need a clean, trustworthy headshot for digital use — AI
          wins on every practical measure: speed, cost, and convenience. Professional photography
          still wins on maximum quality and creative control, but it&apos;s genuinely overkill for
          most everyday use cases.
        </p>
        <p className="text-ink">
          If you&apos;re unsure, try the AI version first — it&apos;s free. If the result meets
          your bar, you&apos;ve saved several hundred pounds/dollars and a few weeks. If it
          doesn&apos;t, you&apos;ll know exactly what to ask a photographer for.
        </p>
        <p className="text-sm text-ink-soft">
          For a deeper technical breakdown, see our full{" "}
          <Link href="/guides/ai-headshot-vs-photographer" className="underline hover:text-accent-text">
            AI headshot vs photographer comparison guide
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Try AI Headshots Free</h2>
        <div className="rounded-2xl border border-border-soft p-6 text-center">
          <p className="text-ink">
            6 free AI headshot previews — no account, no credit card. Styles include LinkedIn,
            CEO, Doctor, Author, Passport, and 17 more.
          </p>
          <Link
            href="/professional-headshot-generator"
            className="mt-3 inline-block rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas hover:opacity-90"
          >
            Generate my free headshot →
          </Link>
        </div>
      </section>
    </main>
  );
}
