"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function useAuthForm(onSuccess: () => void) {
  const [formMode, setFormMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (formMode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not create account");
          return;
        }
      }

      const result = await signIn("credentials", { redirect: false, email, password });
      if (result?.error) {
        setError("Incorrect email or password");
        return;
      }
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleMode() {
    setFormMode((m) => (m === "login" ? "signup" : "login"));
  }

  return { formMode, email, setEmail, password, setPassword, error, submitting, handleSubmit, toggleMode };
}
