"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

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
      <h1 className="text-3xl font-extrabold">রেজিস্ট্রেশন</h1>
      <section className="rounded-3xl card-glow p-4 sm:p-6">
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" placeholder="নাম" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" placeholder="মোবাইল নম্বর" />
          
          {/* Important Warning */}
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 text-lg mt-0.5">⚠️</span>
              <div className="text-sm text-zinc-200 leading-relaxed">
                <p className="font-semibold text-yellow-300 mb-1">গুরুত্বপূর্ণ সতর্কতা</p>
                <p>
                  এই মোবাইল নম্বরটি আপনার একাউন্টের সাথে স্থায়ীভাবে যুক্ত থাকবে। পুরস্কার প্রাপ্তি, OTP যাচাই এবং সকল যোগাযোগ এই নম্বরেই হবে। ভবিষ্যতে এই নম্বর পরিবর্তন করা যাবে না। তাই আপনার সবচেয়ে নিয়মিত ব্যবহৃত নম্বরটি দিন।
                </p>
              </div>
            </div>
          </div>
          
          <button onClick={sendOtp} className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(34,197,94,0.14)]">
            OTP পাঠান
          </button>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" placeholder="OTP" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" placeholder="পাসওয়ার্ড" />
          <button onClick={register} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(236,72,153,0.12)]">
            অ্যাকাউন্ট তৈরি করুন
          </button>
          {status ? <p className="text-sm font-bold text-zinc-300">{status}</p> : null}
        </div>
      </section>
    </main>
  );
}
