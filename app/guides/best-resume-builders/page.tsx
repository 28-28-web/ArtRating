import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "7 Best Resume Builders 2026 — Ranked After Testing Each One",
  description:
    "I tested 7 resume builders over 2 weeks. Here are the best ones for getting more interviews, ranked by value, templates, and ease of use.",
  alternates: { canonical: "/guides/best-resume-builders" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "7 Best Resume Builders 2026 — Ranked After Testing Each One",
  description:
    "I tested 7 resume builders over 2 weeks. Here are the best ones for getting more interviews, ranked by value, templates, and ease of use.",
  datePublished: "2026-07-28",
  dateModified: "2026-07-28",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME },
  mainEntityOfPage: `${SITE_URL}/guides/best-resume-builders`,
};

const TOOLS = [
  {
    rank: "1",
    name: "Resume.io — Best Overall",
    price: "$7.49/week (billed $29.95 every 4 weeks)",
    body: "The most polished all-round option — clean, ATS-friendly templates and a builder that doesn't fight you. The free tier only lets you preview, though; you're paying before you can download.",
    pro: "Fastest to a finished, professional-looking resume",
    con: "Nothing usable without paying",
  },
  {
    rank: "2",
    name: "Zety — Best Template Variety",
    price: "~$5.99/week (from $23.70/month)",
    body: "18+ templates and AI-generated bullet-point suggestions based on your job title, which is genuinely useful if you're staring at a blank line not knowing how to describe what you do.",
    pro: "Best AI phrasing suggestions of the bunch",
    con: "Pricier than it first looks once you're past the trial",
  },
  {
    rank: "3",
    name: "Novoresume — Best Free Option",
    price: "Free tier usable; Premium from $19.99/month",
    body: "The most generous free plan here — modern templates and a genuinely usable free export, not just a preview. Premium unlocks more templates and unlimited exports.",
    pro: "Actually free tier, not just a free trial",
    con: "Free plan limits you to one page and fewer export options",
  },
  {
    rank: "4",
    name: "Kickresume — Best AI Writing Assistant",
    price: "From $19/month (varies by billing term)",
    body: "Built around an AI assistant that drafts bullet points from a job description, which saves real time if you're customizing a resume per application. Strongest for tech and startup roles.",
    pro: "Best job-description-matching AI of the group",
    con: "Templates skew tech/startup — less at home in more traditional industries",
  },
  {
    rank: "5",
    name: "Canva — Best for Creative Roles",
    price: "Free (Canva Pro optional, not required)",
    body: "If you want a resume that looks like a portfolio piece — design, marketing, creative roles — Canva's visual-first templates are hard to beat, and it's free.",
    pro: "Completely free, huge design flexibility",
    con: "Most templates aren't ATS-friendly — heavy formatting can confuse resume-scanning software",
  },
  {
    rank: "6",
    name: "MyPerfectResume — Best for Beginners",
    price: "~$2.95/week trial, then recurring subscription",
    body: "A guided, fill-in-the-blank builder that holds your hand through the process — good if resume-writing genuinely intimidates you. Templates feel a bit dated next to Resume.io or Zety.",
    pro: "Easiest builder for a first-ever resume",
    con: "Template designs haven't kept up with the competition",
  },
  {
    rank: "7",
    name: "VisualCV — Best for Portfolio Roles",
    price: "From $16/month",
    body: "Combines a resume with an online portfolio/CV page you can share as a link — useful for designers, photographers, and anyone whose work needs to be seen, not just described.",
    pro: "Resume + shareable portfolio link in one tool",
    con: "Overkill if you just need a plain, one-page resume",
  },
];

export default function BestResumeBuildersPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          7 Best Resume Builders in 2026 — Ranked and Tested
        </h1>
        <BrushDivider className="mt-2" />
        <p className="mt-3 text-xs text-ink-soft">6 min read · Last updated July 28, 2026</p>
      </div>

      <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-72">
        <Image
          src="/images/guides/professional-working.webp"
          alt="Two people reviewing resume documents next to open laptops"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <p className="text-xs text-ink-soft">
        This page may contain affiliate links. We may earn a commission at no cost to you.
      </p>

      <p className="text-lg text-ink">
        I tested 7 resume builders over 2 weeks — same work history, same target job, different
        tool each time — to see which ones actually help you land interviews instead of just
        looking nice in a preview window. Here&apos;s how they ranked.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Why Your Resume Format Matters More Than You Think
        </h2>
        <p className="text-ink">
          Most mid-size and large companies run resumes through an applicant tracking system (ATS)
          before a human ever sees them. Heavy graphics, multi-column layouts, and unusual fonts
          can confuse that software and quietly drop you from the pile — which is why the builders
          below get judged on ATS-friendliness, not just how good the template looks in a
          screenshot.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">The 7 Best Resume Builders Ranked</h2>
        <p className="text-ink">
          Ranked by overall value — a mix of template quality, ease of use, ATS-friendliness, and
          what you actually get for the price.
        </p>
      </section>

      {TOOLS.map((tool) => (
        <section key={tool.rank} className="flex flex-col gap-2">
          <h2 className="font-display text-xl font-semibold text-ink">
            {tool.rank}. {tool.name}
          </h2>
          <p className="text-sm font-medium text-ink-soft">{tool.price}</p>
          <p className="text-ink">{tool.body}</p>
          <p className="text-sm text-ink">
            <span className="font-medium text-jade">Pro:</span> {tool.pro}
          </p>
          <p className="text-sm text-ink">
            <span className="font-medium text-danger">Con:</span> {tool.con}
          </p>
        </section>
      ))}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">How to Choose the Right Resume Builder</h2>
        <p className="text-ink">
          Match the tool to your situation, not the highest-rated one on this list. Job-hunting
          right now and want the least friction? Resume.io. Tight budget? Novoresume or Canva.
          Applying to tech roles and want AI help matching job descriptions? Kickresume. Creative
          field where visuals matter? Canva or VisualCV.
        </p>
        <p className="text-ink">
          If you&apos;re also polishing your LinkedIn profile alongside your resume, see our{" "}
          <Link href="/guides/linkedin-premium-review" className="underline hover:text-accent-text">
            LinkedIn Premium review
          </Link>{" "}
          for whether that subscription is worth adding to the mix.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">One More Thing: Your Profile Photo</h2>
        <p className="text-ink">
          Before you send that resume, make sure your LinkedIn photo matches the professional image
          you&apos;re projecting on paper.
        </p>
        <div className="rounded-2xl border border-border-soft p-6 text-center">
          <p className="text-ink">Try our free AI headshot generator — no signup needed.</p>
          <Link
            href="/professional-headshot-generator"
            className="mt-3 inline-block rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas hover:opacity-90"
          >
            Generate my headshot →
          </Link>
        </div>
      </section>
    </main>
  );
}
