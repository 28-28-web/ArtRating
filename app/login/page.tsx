import { Suspense } from "react";
import { buildMetadata } from "@/app/lib/seo";
import LoginForm from "@/app/components/LoginForm";

export const metadata = buildMetadata({
  title: "Log In | HeadshotMaker AI",
  description:
    "Log in to HeadshotMaker AI to download your full-quality, watermark-free headshots.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
