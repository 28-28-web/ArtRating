import type { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";
import BrushDivider from "@/app/components/BrushDivider";

export const metadata: Metadata = {
  title: "Contact | Paintify",
  description: "Get in touch with the team behind Paintify.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-6 px-6 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Contact</h1>
        <BrushDivider />
        <p className="max-w-xl text-ink-soft">
          Paintify is built and operated by FCLBD (Fateh Consortium Ltd Bangladesh). We read every
          message and aim to respond within a few business days.
        </p>
      </div>

      <p className="max-w-xl text-center text-sm text-ink-soft">
        Reporting misuse of the platform (e.g. content that violates our terms)? Please include as
        much detail as possible in your message so we can investigate quickly.
      </p>

      <ContactForm />
    </main>
  );
}
