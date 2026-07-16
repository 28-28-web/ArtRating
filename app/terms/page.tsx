import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Paintify",
  description: "The terms that apply when you use Paintify.",
};

const CONTACT_EMAIL = "support@artrating.art";

export default function TermsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Terms of service</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: July 17, 2026</p>
      </div>

      <p className="text-ink">
        By using Paintify, operated by FCLBD (Fateh Consortium Ltd Bangladesh), you agree to
        these terms.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">What Paintify does</h2>
        <p className="text-ink">
          Paintify generates AI-based image transformations (art styles, headshots,
          pet-to-human, toy figures, and two-photo mixes) from photos you upload. Results are
          AI-generated interpretations, not real photographs — they may not accurately represent
          reality and are provided for entertainment and casual use.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Acceptable use</h2>
        <p className="text-ink">You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>Upload photos of anyone other than yourself without their knowledge and consent.</li>
          <li>
            Use Paintify to create content that is illegal, harassing, defamatory, sexually
            explicit involving minors, or otherwise harmful.
          </li>
          <li>
            Attempt to generate images depicting real, named public figures in a way that implies
            their endorsement or a real event.
          </li>
          <li>
            Attempt to abuse, overload, or circumvent the free-generation limits or security of
            the service.
          </li>
        </ul>
        <p className="text-ink">We may suspend or terminate accounts that violate these terms.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Your content</h2>
        <p className="text-ink">
          You retain rights to the photos you upload and the images Paintify generates for you.
          By using the service, you grant us a limited license to process your photos solely to
          generate your requested output. We may use anonymized, non-identifying examples of
          generated content for marketing only with your separate permission.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">The photo-mix tool</h2>
        <p className="text-ink">
          When mixing two photos, you confirm you have the right to use both images, including
          any photo of another person. You are responsible for having appropriate consent before
          uploading a second person&apos;s photo.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Credits and payments</h2>
        <p className="text-ink">
          Free generations are limited as described on the site (currently: one before login, one
          more after logging in). Additional generations require credits, purchased via manual
          bank transfer verification. Credits are non-refundable once used; unused credit
          balances tied to a clear payment error will be reviewed case by case if you contact us
          within 7 days of purchase.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">No warranty</h2>
        <p className="text-ink">
          Paintify is provided &quot;as is.&quot; We do not guarantee generated results will meet
          your expectations, be free of errors, or be available at all times.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Limitation of liability</h2>
        <p className="text-ink">
          To the extent permitted by law, FCLBD is not liable for indirect, incidental, or
          consequential damages arising from your use of Paintify.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Governing law</h2>
        <p className="text-ink">These terms are governed by the laws of Bangladesh.</p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Changes</h2>
        <p className="text-ink">
          We may update these terms as the service evolves. Continued use after changes means you
          accept the updated terms.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
        <p className="text-ink">
          Questions about these terms:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-accent-text">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>
    </main>
  );
}
