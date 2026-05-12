"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [registerType, setRegisterType] = useState<"google" | "phone">("google");

  async function onGoogleRegister() {
    // This will redirect to Google's OAuth consent screen
    const res = await signIn("google");
    if (res !== undefined) {
      setStatus("Google রেজিস্ট্রেশন সফল");
      router.push("/");
    } else {
      setStatus("Google রেজিস্ট্রেশন ব্যর্থ");
    }
  }

  async function sendOtp() {
    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose: "register" }),
    });
    const data = await res.json();
    setStatus(data.message ?? "OTP পাঠানো হয়েছে");
  }

  async function register() {
    const verify = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, purpose: "register" }),
    });
    if (!verify.ok) {
      setStatus("OTP যাচাই ব্যর্থ");
      return;
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, password }),
    });
    if (res.ok) {
      setStatus("রেজিস্ট্রেশন সফল");
      router.push("/login");
    } else {
      const data = await res.json();
      setStatus(data.message ?? "রেজিস্ট্রেশন ব্যর্থ");
    }
  }

  return (
    <main className="mx-auto w-full max-w-md space-y-4 p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold text-center">রেজিস্ট্রেশন</h1>
      
      {/* Registration Type Toggle */}
      <div className="flex rounded-xl bg-black/40 p-1 mb-4">
        <button
          onClick={() => setRegisterType("google")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
            registerType === "google"
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              : "bg-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Google রেজিস্ট্রেশন
        </button>
        <button
          onClick={() => setRegisterType("phone")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
            registerType === "phone"
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
              : "bg-transparent text-zinc-400 hover:text-white"
          }`}
        >
          ফোন রেজিস্ট্রেশন
        </button>
      </div>

      {/* Google Registration */}
      {registerType === "google" && (
        <section className="rounded-3xl card-glow p-4 sm:p-6">
          <div className="space-y-3">
            <p className="text-sm text-zinc-300 text-center mb-4">
              Google অ্যাকাউন্ট দিয়ে দ্রুত রেজিস্ট্রেশন করুন। রেটিং, ফোরাম, এবং অন্যান্য সব কার্যক্রমের জন্য। ছবি আপলোড করার জন্য ফোন লগইন করুন।
            </p>
            <button
              onClick={onGoogleRegister}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(59,130,246,0.14)] hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25-.57C21.63 8.67 20.15 7 18.5 7c-1.76 0-3.13.67-4.25 1.48-.58 1.37-.54 1.87.5l2.57 2.28c.45.5.08 1.09.08 1.64 0 .56-.08 1.09-.08 1.64 0L9.5 15.5c-.45.5-.08 1.09-.08 1.64 0l2.57-2.28c.45-.5.08-1.09.08-1.64 0-.78.07-1.53.2-2.25.57z"/>
                <path d="M5.84 14.09c-.22-.61-.35-1.27-.35-2.09 0s-1.48.35-2.09.35c-.61 0-1.27.35-2.09.35l1.86.98c-.18.6-.35 1.27-.35 2.09 0l1.86-.98c.18-.6.35-1.27.35-2.09 0s-1.48-.35-2.09-.35c-.61 0-1.27.35-2.09-.35l1.86.98c.18-.6-.35-1.27-.35-2.09 0z"/>
              </svg>
              Google দিয়ে রেজিস্ট্রেশন করুন
            </button>
            {status && <p className="text-sm font-bold text-zinc-300 mt-3">{status}</p>}
          </div>
        </section>
      )}

      {/* Phone Registration */}
      {registerType === "phone" && (
        <section className="rounded-3xl card-glow p-4 sm:p-6">
          <div className="space-y-3">
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" 
              placeholder="নাম" 
            />
            
            {/* Important Warning */}
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 text-lg mt-0.5">⚠️</span>
                <div className="text-sm text-zinc-200 leading-relaxed">
                  <p className="font-semibold text-yellow-300 mb-1">গুরুত্বপূর্ণ সতর্কতা</p>
                  <p>
                    এই মোবাইল নম্বরটি আপনার একাউন্টের সাথে স্থায়ীভাবে যুক্ত থাকবে। পুরস্কার প্রাপ্তি, OTP যাচাই এবং সকল যোগাযোগ এই নম্বরেই হবে। ভবিষ্যতে এই নম্বর পরিবর্তন করা যাবে না। তাই আপনার সব চেয়ে নিয়মিত ব্যবহৃত নম্বরটি দিন।
                  </p>
                </div>
              </div>
            </div>
            
            <input 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" 
              placeholder="মোবাইল নম্বর" 
            />
            <button 
              onClick={sendOtp} 
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(34,197,94,0.14)]"
            >
              OTP পাঠান
            </button>
            <input 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" 
              placeholder="OTP" 
            />
            <input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" 
              placeholder="পাসওয়ার্ড" 
            />
            <button 
              onClick={register} 
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(236,72,153,0.12)]"
            >
              অ্যাকাউন্ট তৈরি করুন
            </button>
            {status && <p className="text-sm font-bold text-zinc-300">{status}</p>}
          </div>
        </section>
      )}

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-zinc-400">
          অ্যাকাউন্ট আছেন?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300 underline">
            লগইন করুন
          </a>
        </p>
      </div>
    </main>
  );
}
