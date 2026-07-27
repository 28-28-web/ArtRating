import type { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";
import BrushDivider from "@/app/components/BrushDivider";

const CONTACT_EMAIL = "hello@artrating.art";

export const metadata: Metadata = {
  title: "Contact | HeadshotMaker AI",
  description: "Get in touch with the team behind HeadshotMaker AI.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-6 px-6 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Get in touch</h1>
        <BrushDivider />
        <p className="max-w-xl text-ink-soft">
          Questions about your headshot or account? We usually respond within 24 hours.
        </p>
        <p className="text-sm text-ink-soft">
          Or email us directly:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-accent-text">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>

      <ContactForm />
    </main>
  );
}
