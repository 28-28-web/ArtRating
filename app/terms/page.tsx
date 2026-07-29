import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | HeadshotMaker AI",
  description: "The terms that apply when you use HeadshotMaker AI.",
  alternates: { canonical: "/terms" },
};

const CONTACT_EMAIL = "hello@artrating.art";

export default function TermsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Terms of service</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: July 27, 2026</p>
      </div>

      <p className="text-ink">
        By using HeadshotMaker AI at artrating.art, operated by FCLBD (Fateh Consortium Ltd
        Bangladesh), you agree to these terms.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">What HeadshotMaker AI does</h2>
        <p className="text-ink">
          HeadshotMaker AI generates professional-style AI headshots from photos you upload.
          Results are AI-generated interpretations, not real photographs — they may not perfectly
          represent reality.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Acceptable use</h2>
        <p className="text-ink">You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5 text-ink">
          <li>Upload photos of anyone other than yourself without their knowledge and consent.</li>
          <li>
            Use HeadshotMaker AI to create content that is illegal, harassing, defamatory, sexually
            explicit involving minors, or otherwise harmful.
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
          You retain rights to the photos you upload. The headshots HeadshotMaker AI generates for
          you are yours to use for personal or commercial purposes. By using the service, you
          grant us a limited license to process your photos solely to generate your requested
          output.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Coloring pages you generate</h2>
        <p className="text-ink">
          Coloring pages you download after paying with a credit are yours to use for personal or
          commercial purposes, including printing and selling physical or digital coloring books —
          for example through Amazon KDP or another print-on-demand service.
        </p>
        <p className="text-ink">
          Your first 3 free, watermarked generations are for personal use only (previewing the
          tool, printing at home, classroom use). Commercial use, including anything you plan to
          sell, requires the paid, watermark-free download.
        </p>
        <p className="text-ink">
          You may not resell, redistribute, or rebrand the coloring page generator itself. If a
          platform you publish to (such as Amazon KDP) requires you to disclose that content is
          AI-generated, you&apos;re responsible for making that disclosure — we don&apos;t
          represent coloring page output as wholly human-authored.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Credits and payments</h2>
        <p className="text-ink">
          Generating a preview is free and doesn&apos;t require an account, up to the generation
          limit described on the site. Downloading the full-quality, watermark-free file requires
          an account and 1 credit per download. Because downloads are a digital product delivered
          immediately, all sales are final — we do not offer refunds once a file has been
          downloaded.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">No warranty</h2>
        <p className="text-ink">
          HeadshotMaker AI is provided &quot;as is.&quot; We do not guarantee generated results
          will meet your expectations, be free of errors, or be available at all times.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Limitation of liability</h2>
        <p className="text-ink">
          To the extent permitted by law, FCLBD is not liable for indirect, incidental, or
          consequential damages arising from your use of HeadshotMaker AI.
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
