import { buildMetadata } from "@/app/lib/seo";
import Image from "next/image";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";
import { CREDIT_PACKS } from "@/app/lib/creditPacks";

export const metadata = buildMetadata({
  title: "AI Headshot vs Professional Photographer: Honest 2026 Comparison",
  description:
    "AI headshots cost $5-39 and take 30 seconds. Photographers cost $200-500 and take 2 weeks. Here's when to use each — and when AI is good enough.",
  path: "/guides/ai-headshot-vs-photographer",
  type: "article",
});

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AI Headshot vs Professional Photographer: Honest 2026 Comparison",
  description:
    "AI headshots cost $5-39 and take 30 seconds. Photographers cost $200-500 and take 2 weeks. Here's when to use each — and when AI is good enough.",
  datePublished: "2026-07-28",
  dateModified: "2026-08-08",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME },
  mainEntityOfPage: `${SITE_URL}/guides/ai-headshot-vs-photographer`,
};

const cheapestPack = CREDIT_PACKS[0];
const priciestPack = CREDIT_PACKS[CREDIT_PACKS.length - 1];

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

const PROS_PHOTOGRAPHER = [
  "Photographer controls lighting, composition, and posing",
  "Results are unique and fully customisable",
  "Multiple outfit changes in one session",
  "Print-quality output at any size",
  "Great for book covers, press kits, campaigns",
];

const CONS_PHOTOGRAPHER = [
  "$150–$500+ per session, often more in major cities",
  "1–3 week wait: booking + editing turnaround",
  "Reshoots cost another full session fee",
  "Scheduling around photographer availability",
];

export default function AiHeadshotVsPhotographerPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          AI Headshot vs Professional Photographer: 2026 Comparison
        </h1>
        <BrushDivider className="mt-2" />
        <p className="mt-3 text-xs text-ink-soft">7 min read · Last updated August 8, 2026</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative h-40 overflow-hidden rounded-2xl sm:h-56">
          <Image
            src="/images/headshots/corporate-1.jpg"
            alt="AI-generated corporate-style headshot example"
            fill
            sizes="(max-width: 768px) 50vw, 384px"
            className="object-cover"
            priority
          />
        </div>
        <div className="relative h-40 overflow-hidden rounded-2xl sm:h-56">
          <Image
            src="/images/guides/photographer.webp"
            alt="Professional camera and lenses used for a traditional photo shoot"
            fill
            sizes="(max-width: 768px) 50vw, 384px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <p className="text-lg text-ink">
        A photographer quoted me $350 for a 1-hour session with 3 edited photos. I tried an AI
        headshot generator instead and spent a fraction of that. Here&apos;s an honest comparison
        of both.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          The Headshot Problem Nobody Talks About
        </h2>
        <p className="text-ink">
          Everyone needs a decent headshot — LinkedIn, a resume, a company &quot;About&quot; page —
          but a real photoshoot is expensive and slow enough that most people just keep using
          whatever photo they cropped out of a group shot three years ago. That gap is exactly
          where AI headshot generators have gotten good enough to matter.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Cost Comparison: AI vs Photographer</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-soft">
                <th className="py-2 pr-4 font-medium text-ink">Factor</th>
                <th className="py-2 pr-4 font-medium text-ink">AI headshot</th>
                <th className="py-2 font-medium text-ink">Photographer</th>
              </tr>
            </thead>
            <tbody className="text-ink-soft">
              <tr className="border-b border-border-soft">
                <td className="py-2 pr-4">Cost</td>
                <td className="py-2 pr-4">
                  {cheapestPack.priceLabel}–{priciestPack.priceLabel} one-time
                </td>
                <td className="py-2">$150–$500+</td>
              </tr>
              <tr className="border-b border-border-soft">
                <td className="py-2 pr-4">Turnaround</td>
                <td className="py-2 pr-4">~30 seconds</td>
                <td className="py-2">1–3 weeks (booking + editing)</td>
              </tr>
              <tr className="border-b border-border-soft">
                <td className="py-2 pr-4">Reshoots</td>
                <td className="py-2 pr-4">Unlimited (generate again)</td>
                <td className="py-2">Extra session cost</td>
              </tr>
              <tr className="border-b border-border-soft">
                <td className="py-2 pr-4">Styles</td>
                <td className="py-2 pr-4">22+ presets</td>
                <td className="py-2">Fully custom</td>
              </tr>
              <tr className="border-b border-border-soft">
                <td className="py-2 pr-4">Location</td>
                <td className="py-2 pr-4">Any device, anywhere</td>
                <td className="py-2">Studio or your location</td>
              </tr>
              <tr className="border-b border-border-soft">
                <td className="py-2 pr-4">Print quality</td>
                <td className="py-2 pr-4">Screen / web use</td>
                <td className="py-2">Any resolution</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Best for</td>
                <td className="py-2 pr-4">LinkedIn, resumes, everyday use</td>
                <td className="py-2">Press kits, book covers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">AI Headshots — Pros &amp; Cons</h2>
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
        <h2 className="font-display text-2xl font-semibold text-ink">
          Photographer Headshots — Pros &amp; Cons
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-soft p-4">
            <p className="mb-2 text-sm font-semibold text-ink">Pros</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              {PROS_PHOTOGRAPHER.map((p) => <li key={p}>✓ {p}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-border-soft p-4">
            <p className="mb-2 text-sm font-semibold text-ink">Cons</p>
            <ul className="space-y-1 text-sm text-ink-soft">
              {CONS_PHOTOGRAPHER.map((c) => <li key={c}>✗ {c}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">What a Session Actually Costs</h2>
        <p className="text-ink">
          That $350 quote wasn&apos;t unusual. A headshot session in a mid-size city typically runs
          $200–$350 for an hour, 2–3 outfit changes, and 5–10 edited photos. In New York or London,
          expect $400–$600. You also pay in time: finding a photographer, waiting for a slot in
          their schedule, showing up, then waiting another 1–2 weeks for the edited files.
        </p>
        <p className="text-ink">
          AI headshots start free — HeadshotMaker AI gives you{" "}
          <Link href="/professional-headshot-generator" className="underline hover:text-accent-text">
            6 free previews with no signup
          </Link>
          . Removing the watermark costs {cheapestPack.priceLabel}, and that&apos;s the whole cost
          for most people.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Speed and Convenience</h2>
        <p className="text-ink">
          A photographer means finding a date that works for both of you, showing up in person,
          sitting through a session, then waiting for edited files. An AI headshot generator means
          uploading a selfie you already have and getting a result before you&apos;d have finished
          booking the photographer&apos;s calendar link.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Quality: When AI Is Good Enough</h2>
        <p className="text-ink">
          AI won&apos;t replace a skilled photographer&apos;s lighting, direction, and retouching —
          it works from the photo you already have, so a blurry or badly-lit source photo limits
          what it can do. But for a clean, professional-looking result from a decent selfie, it
          gets remarkably close to studio quality for the specific job most people actually need:
          a normal, trustworthy profile photo.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">When to Use an AI Headshot Generator</h2>
        <ul className="list-disc space-y-1 pl-5 text-ink">
          <li>LinkedIn profile photo</li>
          <li>Job applications</li>
          <li>Company website &quot;About&quot; page</li>
          <li>Portfolio site</li>
          <li>Dating app profile</li>
          <li>Email signature</li>
          <li>Trying multiple styles before committing to a look</li>
          <li>Different background styles for different platforms</li>
          <li>Any situation where budget is the binding constraint</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">When to Hire a Photographer</h2>
        <ul className="list-disc space-y-1 pl-5 text-ink">
          <li>Executive press kit</li>
          <li>Book author photo</li>
          <li>Magazine feature</li>
          <li>Wedding photography</li>
          <li>Major brand campaign</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">The Verdict</h2>
        <p className="text-ink">
          For most professionals who just need a clean LinkedIn photo, an AI headshot generator is
          good enough — and dramatically cheaper. Save the photographer budget for the situations
          that genuinely call for it: a press kit, a book jacket, a campaign where the photo itself
          is the deliverable.
        </p>
        <p className="text-ink">
          If you&apos;re unsure, try the AI version first — it&apos;s free. If the result clears
          your bar, you&apos;ve saved a few hundred dollars and a couple of weeks. If it
          doesn&apos;t, you&apos;ll know exactly what to ask a photographer for.
        </p>
        <p className="text-ink">
          Building out the rest of your job-search kit too? Check our{" "}
          <Link href="/guides/best-resume-builders" className="underline hover:text-accent-text">
            resume builder comparison
          </Link>{" "}
          and{" "}
          <Link href="/guides/linkedin-premium-review" className="underline hover:text-accent-text">
            LinkedIn Premium review
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Try AI Headshots Free — No Signup Needed
        </h2>
        <div className="rounded-2xl border border-border-soft p-6 text-center">
          <p className="text-ink">
            Try HeadshotMaker AI free — 6 watermarked previews with no signup, no credit card.
            Styles include LinkedIn, CEO, Doctor, Author, Passport, and 18 more.
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
