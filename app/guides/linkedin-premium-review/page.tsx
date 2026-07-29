import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BrushDivider from "@/app/components/BrushDivider";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "LinkedIn Premium Review 2026: Is It Worth $39/Month?",
  description:
    "I paid for LinkedIn Premium for 3 months. Honest breakdown of features, pricing, and whether job seekers actually need it in 2026.",
  alternates: { canonical: "/guides/linkedin-premium-review" },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "LinkedIn Premium Review 2026: Is It Worth $39/Month?",
  description:
    "I paid for LinkedIn Premium for 3 months. Honest breakdown of features, pricing, and whether job seekers actually need it in 2026.",
  datePublished: "2026-07-28",
  dateModified: "2026-07-28",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME },
  mainEntityOfPage: `${SITE_URL}/guides/linkedin-premium-review`,
};

export default function LinkedInPremiumReviewPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />

      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          LinkedIn Premium Review 2026: Is It Worth $39/Month?
        </h1>
        <BrushDivider className="mt-2" />
        <p className="mt-3 text-xs text-ink-soft">5 min read · Last updated July 28, 2026</p>
      </div>

      <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-72">
        <Image
          src="/images/guides/linkedin-hero.webp"
          alt="LinkedIn app icon"
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
        LinkedIn Premium Career runs $29.99/month for most subscribers — though LinkedIn has been
        rolling out a price increase, and some newer signups are seeing $39.99/month instead. I
        spent three months on it during an active job search. Here&apos;s exactly what you get —
        and whether it&apos;s worth it either way.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          What Does LinkedIn Premium Actually Include?
        </h2>
        <p className="text-ink">
          The Career tier bundles a handful of features that sound useful on the sales page but
          land very differently once you&apos;re actually using them. You get 5 InMail credits a
          month to message people you&apos;re not connected to — recruiters, hiring managers,
          people at companies you want in at. You get a &quot;Who&apos;s Viewed Your Profile&quot;
          list going back 90 days instead of LinkedIn&apos;s usual last-5 teaser. You get a
          Top Applicant or Featured Applicant badge on some job listings, salary insights pulled
          from LinkedIn&apos;s own data when you&apos;re sizing up an offer, and full access to
          LinkedIn Learning&apos;s course library — thousands of videos on everything from resume
          writing to Excel to interview technique.
        </p>
        <p className="text-ink">
          More recently LinkedIn has folded in AI-assisted job application tools — suggestions for
          tailoring your resume or cover letter to a specific posting. It&apos;s a nice-to-have,
          not a reason to subscribe on its own.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">LinkedIn Premium Pricing in 2026</h2>
        <p className="text-ink">
          There are three tiers depending on what you actually need LinkedIn for:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>
            <strong>Career</strong> — $29.99/month (some accounts are being shown $39.99/month as
            LinkedIn phases in a price increase). Built for job seekers.
          </li>
          <li>
            <strong>Business</strong> — around $59.99/month. Adds unlimited people browsing and
            business-insight tools, aimed at networking and company research rather than job
            hunting specifically.
          </li>
          <li>
            <strong>Sales Navigator</strong> — around $99.99/month. Built for sales teams doing
            prospecting and lead generation, not individual job seekers — skip this one unless
            that&apos;s literally your job.
          </li>
        </ul>
        <p className="text-sm text-ink-soft">
          LinkedIn changes pricing by region and rolls out increases gradually, so check the
          checkout page for your actual current rate before subscribing.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Who Should Buy LinkedIn Premium?</h2>
        <p className="text-ink">It earns its keep for a fairly specific group of people:</p>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>Active job seekers who need InMail credits to reach recruiters directly</li>
          <li>Salespeople and business developers who rely on LinkedIn for outreach</li>
          <li>Recruiters sourcing candidates outside their existing network</li>
        </ul>
        <p className="text-ink">
          If you&apos;re in a real job search, the InMail credits alone can be worth the price —
          one message that lands you an interview more than pays for the month.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">Who Should Skip LinkedIn Premium?</h2>
        <p className="text-ink">
          Students, casual browsers, and anyone currently employed and not actively looking don&apos;t
          get much out of it. The profile-viewer history and LinkedIn Learning access are nice, but
          neither is worth $30-40 a month on its own — most of that content is a Google search
          away for free.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">My Verdict After 3 Months</h2>
        <p className="text-ink">
          Worth it while you&apos;re actively job hunting, not worth it as a standing subscription.
          The InMail credits are the actual value — everything else is a nice bonus you&apos;d use
          maybe twice. Once I landed a role, I cancelled the same week. That&apos;s the right way
          to use it: turn it on for the search, turn it off once you&apos;re hired.
        </p>
        <p className="text-ink">
          If you&apos;re building out your job-search toolkit at the same time, our{" "}
          <Link href="/guides/best-resume-builders" className="underline hover:text-accent-text">
            resume builder comparison
          </Link>{" "}
          covers the other half of the equation.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Complete Your LinkedIn Profile With a Professional Headshot
        </h2>
        <p className="text-ink">
          A strong LinkedIn profile needs more than Premium — your headshot is the first thing
          recruiters see, before they read a single line of your experience.
        </p>
        <div className="rounded-2xl border border-border-soft p-6 text-center">
          <p className="text-ink">Try our free AI headshot generator — no signup needed.</p>
          <Link
            href="/linkedin-headshot"
            className="mt-3 inline-block rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas hover:opacity-90"
          >
            Generate my LinkedIn headshot →
          </Link>
        </div>
      </section>
    </main>
  );
}
