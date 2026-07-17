"use client";

import { useState } from "react";
import ConfettiBurst from "@/app/components/ConfettiBurst";

type Category = "general" | "bug" | "misuse-report" | "business";

const CATEGORIES: { id: Category; label: string; chipClass: string }[] = [
  { id: "general", label: "General question", chipClass: "chip-cobalt" },
  { id: "bug", label: "Bug report", chipClass: "chip-saffron" },
  { id: "misuse-report", label: "Report misuse", chipClass: "chip-magenta" },
  { id: "business", label: "Business inquiry", chipClass: "chip-teal-muted" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email" | "category" | "message", string>>;

const inputClass =
  "rounded-xl border border-border-soft bg-canvas/60 px-4 py-2 text-sm text-ink outline-none focus:border-[var(--teal-muted)] focus:ring-2 focus:ring-[var(--teal-muted)]/30";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = "Enter your name";
    if (!email.trim()) next.email = "Enter your email";
    else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email address";
    if (!category) next.category = "Pick a category";
    if (!message.trim()) next.message = "Enter a message";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Could not send your message. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="contact-card tool-card relative w-full max-w-xl">
        <ConfettiBurst count={6} />
        <div className="tool-card-content flex flex-col items-center gap-2 py-6 text-center">
          <h3 className="font-display text-xl font-semibold text-ink">Message sent!</h3>
          <p className="text-sm text-ink-soft">
            Thanks for reaching out — we read every message and aim to respond within a few
            business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-card tool-card w-full max-w-xl">
      <div className="tool-card-content">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-name" className="text-sm font-medium text-ink">
              Name
            </label>
            <input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="contact-email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-ink" id="contact-category-label">
              Category
            </span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="contact-category-label">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={category === c.id}
                  className={`quiz-chip rounded-full px-4 py-2 text-sm font-medium ${
                    category === c.id ? c.chipClass : "border border-border-soft text-ink"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="contact-message" className="text-sm font-medium text-ink">
              Message
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className={inputClass}
            />
            {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="gradient-button rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
