import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | HeadshotMaker AI",
  description: "HeadshotMaker AI's refund policy for AI-generated headshot downloads.",
  alternates: { canonical: "/refund" },
};

const CONTACT_EMAIL = "hello@artrating.art";

export default function RefundPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Refund Policy</h1>
        <p className="mt-2 text-sm text-ink-soft">Last updated: July 28, 2026</p>
      </div>

      <p className="text-ink">
        Due to the digital nature of AI-generated headshots, we do not offer refunds after
        download. If you experience a technical issue that prevents download, contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-accent-text">
          {CONTACT_EMAIL}
        </a>{" "}
        within 48 hours and we will resolve it.
      </p>
    </main>
  );
}
