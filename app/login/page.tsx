"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loginType, setLoginType] = useState<"google" | "phone">("google");

  async function onGoogleLogin() {
    const res = await signIn("google", { redirect: false });
    if (res?.ok) {
      setStatus("Google লগইন সফল");
      router.push("/");
    } else {
      setStatus("Google লগইন ব্যর্থ");
    }
  }

  async function onPhoneLogin() {
    const res = await signIn("credentials", { phone, password, redirect: false });
    if (res?.ok) {
      setStatus("ফোন লগইন সফল");
      router.push("/");
    } else {
      setStatus("ফোন বা পাসওয়ার্ড সঠিক নয়");
    }
  }

  return (
    <main className="mx-auto w-full max-w-md space-y-4 p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold text-center">লগইন</h1>
      
      {/* Login Type Toggle */}
      <div className="flex rounded-xl bg-black/40 p-1 mb-4">
        <button
          onClick={() => setLoginType("google")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
            loginType === "google"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              : "bg-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Google লগইন
        </button>
        <button
          onClick={() => setLoginType("phone")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
            loginType === "phone"
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
              : "bg-transparent text-zinc-400 hover:text-white"
          }`}
        >
          ফোন লগইন
        </button>
      </div>

      {/* Google Login */}
      {loginType === "google" && (
        <section className="rounded-3xl card-glow p-4 sm:p-6">
          <div className="space-y-3">
            <p className="text-sm text-zinc-300 text-center mb-4">
              Google অ্যাকাউন্ট দিয়ে দ্রুত লগইন করুন। রেটিং, ফোরাম, এবং অন্যান্য সব কার্যক্রমের জন্য।
            </p>
            <button
              onClick={onGoogleLogin}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(59,130,246,0.14)] hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25-.57C21.63 8.67 20.15 7 18.5 7c-1.76 0-3.13.67-4.25 1.48-.58 1.37-.54 1.87.5l2.57 2.28c.45.5.08 1.09.08 1.64 0 .56-.08 1.09-.08 1.64 0L9.5 15.5c-.45.5-.08 1.09-.08 1.64 0l2.57-2.28c.45-.5.08-1.09.08-1.64 0-.78.07-1.53.2-2.25.57z"/>
                <path d="M5.84 14.09c-.22-.61-.35-1.27-.35-2.09 0s-1.48.35-2.09.35c-.61 0-1.27.35-2.09.35l1.86.98c-.18.6-.35 1.27-.35 2.09 0l1.86-.98c.18-.6.35-1.27.35-2.09 0s-1.48-.35-2.09-.35c-.61 0-1.27.35-2.09-.35l1.86.98c-.18-.6-.35-1.27-.35-2.09 0z"/>
              </svg>
              Google দিয়ে লগইন করুন
            </button>
            {status && <p className="text-sm font-bold text-zinc-300 mt-3">{status}</p>}
          </div>
        </section>
      )}

      {/* Phone Login */}
      {loginType === "phone" && (
        <section className="rounded-3xl card-glow p-4 sm:p-6">
          <div className="space-y-3">
            <p className="text-sm text-zinc-300 text-center mb-4">
              ছবি আপলোড করার জন্য ফোন লগইন। শুধুমাত্র আপলোডারদের জন্য।
            </p>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500"
              placeholder="মোবাইল নম্বর"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500"
              placeholder="পাসওয়ার্ড"
            />
            <button
              onClick={onPhoneLogin}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(34,197,94,0.14)]"
            >
              ফোন লগইন করুন
            </button>
            {status && <p className="text-sm font-bold text-zinc-300">{status}</p>}
          </div>
        </section>
      )}

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-zinc-400">
          অ্যাকাউন্ট নেই?{" "}
          <a href="/register" className="text-blue-400 hover:text-blue-300 underline">
            নিবন্ধন করুন
          </a>
        </p>
      </div>
    </main>
  );
}
