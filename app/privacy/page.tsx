import { buildMetadata } from "@/app/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy | HeadshotMaker AI",
  description:
    "How HeadshotMaker AI collects, uses, and protects your data.",
  path: "/privacy",
});

const CONTACT_EMAIL = "hello@artrating.art";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Privacy policy</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: August 8, 2026</p>
      </div>

      <p className="text-ink">
        HeadshotMaker AI (artrating.art) is operated by FCLBD (Fateh Consortium Ltd Bangladesh).
        This policy explains what we collect, why, and what control you have.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">What we collect</h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>
            <strong>Email address</strong> — collected when you create an account, to identify
            your account and send you service-related messages.
          </li>
          <li>
            <strong>Photos you upload</strong> — used only to generate your requested headshot.
            Your original photo is processed in memory and never stored by us. Generated headshots
            are stored on Cloudinary so you can download them later; email us to request deletion.
          </li>
          <li>
            <strong>Payment information</strong> — handled directly by our payment processor,
            Paddle. We never receive or store your card details ourselves.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Photo retention</h2>
        <p className="text-ink">
          Your original uploaded photo is never stored by us — it is processed in memory and
          discarded when the request ends. Generated headshots are stored on Cloudinary so you can
          download them. We do not use your photos to train AI models. To request deletion of your
          generated headshots, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-accent-text">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">How we use it</h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>To generate the headshot you request.</li>
          <li>To operate your account and any credits or purchase history tied to it.</li>
          <li>To enforce free-generation limits and prevent abuse of the service.</li>
          <li>We do not sell your photos or personal data to third parties.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Third-party processors</h2>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>
            <strong>fal.ai</strong> — runs FLUX.1 Kontext inference for logged-in users.
          </li>
          <li>
            <strong>Cloudflare Workers AI</strong> — runs Stable Diffusion inference for anonymous
            free previews.
          </li>
          <li>
            <strong>Cloudinary</strong> — stores generated headshots so you can download them.
          </li>
          <li>
            <strong>Paddle</strong> — handles payment collection and processing on our behalf; we
            do not store your payment details.
          </li>
        </ul>
        <p className="text-ink-soft">
          These providers process data on our behalf under their own security practices; we do
          not control their infrastructure directly.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Your rights</h2>
        <p className="text-ink">
          You can request a copy of your data, ask us to delete your account, or ask questions
          about this policy by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-accent-text">
            {CONTACT_EMAIL}
          </a>
          . We will respond within a reasonable time.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Children&apos;s privacy</h2>
        <p className="text-ink">
          HeadshotMaker AI is not intended for children under 13 (or the minimum age required by
          your local law, if higher). We do not knowingly collect data from children.
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
