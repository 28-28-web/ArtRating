"use client";

import { useEffect, useState } from "react";
import { Certificate } from "@/components/Certificate";

type PayoutRow = {
  id: string;
  amount: number;
  paymentMethod: string;
  accountNumber: string;
  status: string;
  createdAt: string;
};

export default function PayoutPage() {
  const [method, setMethod] = useState("bkash");
  const [number, setNumber] = useState("");
  const [ratingCount, setRatingCount] = useState(120);
  const [rows, setRows] = useState<PayoutRow[]>([]);
  const [status, setStatus] = useState("");

  async function loadHistory() {
    const res = await fetch("/api/payouts");
    if (res.ok) {
      setRows(await res.json());
    }
  }

  async function requestPayout() {
    const res = await fetch("/api/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethod: method, accountNumber: number, ratingCount }),
    });
    const data = await res.json();
    setStatus(res.ok ? "পেআউট অনুরোধ সফল" : data.message ?? "ব্যর্থ");
    loadHistory();
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl space-y-4 p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold">পেআউট</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl card-glow p-4">বর্তমান রেটিং: {ratingCount}</div>
        <div className="rounded-3xl card-glow p-4">অর্জিত পরিমাণ: ৳{Math.floor(ratingCount / 100) * 100}</div>
      </div>
      <form className="space-y-3 rounded-3xl card-glow p-4 sm:p-6">
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100">
          <option value="bkash">bKash</option>
          <option value="nagad">নগদ</option>
        </select>
        <input value={number} onChange={(e) => setNumber(e.target.value)} className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" placeholder="একাউন্ট নম্বর" />
        
        {/* Security Warning */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <span className="text-green-400 text-lg mt-0.5">🔒</span>
            <div className="text-sm text-zinc-200 leading-relaxed">
              <p>
                নিরাপত্তার জন্য আপনার নিবন্ধিত নম্বরে একটি OTP পাঠানো হবে। পুরস্কারের টাকা শুধুমাত্র যাচাইকৃত একাউন্টে পাঠানো হবে।
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-sm font-bold text-amber-200">⚠️ পেআউট নিলে রেটিং শূন্য থেকে শুরু হবে</p>
        <p className="text-sm font-bold text-zinc-300">পেআউট অনুরোধ পাওয়ার ৭২ ঘণ্টার মধ্যে আপনার বিকাশ/নগদ নম্বরে পাঠানো হবে।</p>
        <label className="flex items-center gap-2 text-sm font-bold text-zinc-200"><input type="checkbox" /> আমি নিশ্চিত করছি</label>
        <button type="button" onClick={requestPayout} className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(236,72,153,0.12)]">পেআউট অনুরোধ</button>
      </form>
      {status ? <p className="text-sm font-bold text-zinc-300">{status}</p> : null}
      
      {/* Certificate Download Section */}
      <section className="rounded-3xl card-glow p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-extrabold">🏆 সার্টিফিকেট ডাউনলোড</h2>
        <div className="mb-4 text-sm text-zinc-300">
          আপনার অর্জনের স্বীকৃতি হিসেবে ডিজিটাল সার্টিফিকেট ডাউনলোড করুন
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">সাপ্তাহিক সার্টিফিকেট</h3>
              <p className="text-sm text-zinc-300 mb-3">সর্বশেষ সাপ্তাহিক চ্যালেঞ্জে অংশগ্রহণের সার্টিফিকেট</p>
              <button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all">
                ডাউনলোড করুন
              </button>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <h3 className="text-lg font-bold text-green-400 mb-2">পুরস্কার সার্টিফিকেট</h3>
              <p className="text-sm text-zinc-300 mb-3">৳{Math.floor(ratingCount / 100) * 100} পুরস্কার অর্জনের সার্টিফিকেট</p>
              <button className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-bold text-white hover:from-green-600 hover:to-green-700 transition-all">
                ডাউনলোড করুন
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Certificate
              artistName="আপনার নাম"
              rating={4.5}
              prize={Math.floor(ratingCount / 100) * 100}
              certificateNumber="CERT-2026-12345"
              className="scale-75 origin-center"
            />
          </div>
        </div>
      </section>
      
      <section className="rounded-3xl card-glow p-4 sm:p-6">
        <h2 className="mb-2 text-xl font-extrabold">পেআউট ইতিহাস</h2>
        <div className="space-y-2 text-sm font-bold">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-white/10 bg-black/10 p-3">
              ৳{row.amount} - {row.paymentMethod} ({row.accountNumber}) - {row.status}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
