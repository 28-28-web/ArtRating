import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/app/components/LoginForm";

export const metadata: Metadata = {
  title: "Log In | HeadshotMaker AI",
  description: "Log in to HeadshotMaker AI to download your full-quality, watermark-free headshots.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
