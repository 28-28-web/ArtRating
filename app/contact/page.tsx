import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Paintify",
  description: "Get in touch with the team behind Paintify.",
};

const CONTACT_EMAIL = "support@artrating.art";

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Contact</h1>

      <p className="text-ink">
        Paintify is built and operated by FCLBD (Fateh Consortium Ltd Bangladesh).
      </p>

      <p className="text-ink">
        For questions, feedback, or data requests, email us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-accent-text">
          {CONTACT_EMAIL}
        </a>
        . We aim to respond within a few business days.
      </p>

      <p className="text-ink">
        If you&apos;re reporting misuse of the platform (e.g. content that violates our terms),
        please include as much detail as possible so we can investigate quickly.
      </p>
    </main>
  );
}
