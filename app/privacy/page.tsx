import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Paintify",
  description: "How Paintify collects, uses, and protects your data.",
};

const CONTACT_EMAIL = "support@artrating.art";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Privacy policy</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: July 17, 2026</p>
      </div>

      <p className="text-ink">
        Paintify is operated by FCLBD (Fateh Consortium Ltd Bangladesh). This policy explains what
        we collect, why, and what control you have.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">What we collect</h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>
            <strong>Photos you upload</strong> — used only to generate your requested image (art
            style, headshot, pet-to-human, toy figure, or photo mix). Uploaded photos and
            generated results are stored via Cloudinary so you can view and download your results.
          </li>
          <li>
            <strong>Account details</strong> — email address and a hashed password, if you create
            an account. We never store your password in plain text.
          </li>
          <li>
            <strong>Usage data</strong> — a small anonymous identifier (cookie) to track your
            free-generation quota before you log in. This is not linked to your identity unless
            you later create an account.
          </li>
          <li>
            <strong>Generation logs</strong> — which tool you used and when, to prevent abuse and
            monitor service health.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">How we use it</h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>To generate the images you request.</li>
          <li>To enforce free-generation limits and prevent abuse of the service.</li>
          <li>To operate your account and any credits/payment history tied to it.</li>
          <li>We do not sell your photos or personal data to third parties.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Third-party processors</h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>
            <strong>Cloudflare Workers AI</strong> — processes uploaded photos to generate output
            images.
          </li>
          <li>
            <strong>Cloudinary</strong> — stores uploaded and generated images.
          </li>
        </ul>
        <p className="text-ink-soft">
          These providers process data on our behalf under their own security practices; we do
          not control their infrastructure directly.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Payments</h2>
        <p className="text-ink">
          Credit purchases are currently verified manually (bKash/Nagad transaction reference
          reviewed by our team). We do not collect or store your card or mobile banking PIN — you
          pay directly through your own banking app, and only share a transaction reference with
          us for verification.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Your rights</h2>
        <p className="text-ink">
          You can request a copy of your data, ask us to delete your account and associated
          photos, or ask questions about this policy by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-accent-text">
            {CONTACT_EMAIL}
          </a>
          . We will respond within a reasonable time.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Children&apos;s privacy</h2>
        <p className="text-ink">
          Paintify is not intended for children under 13 (or the minimum age required by your
          local law, if higher). We do not knowingly collect data from children.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Changes</h2>
        <p className="text-ink">
          We may update this policy as the service changes. Material changes will be reflected
          here with an updated date.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
        <p className="text-ink">
          Questions about this policy:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-accent-text">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </main>
  );
}
