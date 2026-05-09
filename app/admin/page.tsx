"use client";

import { WaveDivider } from "@/components/WaveDivider";

const reasons = [
  "অশ্লীল বা আপত্তিকর কন্টেন্ট",
  "AI দিয়ে তৈরি ছবি",
  "কপি করা বা চুরি করা ছবি",
  "রাজনৈতিক বা ধর্মীয় বিতর্কিত",
  "অপ্রচেষ্টামূলক (blank/scribble)",
  "অন্যান্য",
];

export default function AdminPage() {
  async function markPaid() {
    const confirmed = window.confirm("আপনি কি ম্যানুয়ালি 500 টাকা 017XXXXXXXX নম্বরে পাঠিয়েছেন?");
    if (!confirmed) return;
    await fetch("/api/admin/payouts/paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payoutId: "replace-with-real-id" }),
    });
    alert("Paid মার্ক করা হয়েছে");
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold">অ্যাডমিন প্যানেল</h1>

      <section className="rounded-3xl card-glow p-4 sm:p-6">
        <p className="font-extrabold">ড্যাশবোর্ড: ব্যবহারকারী, ছবি, রেটিং, মুলতুবি পেআউট</p>
      </section>

      <WaveDivider />

      <section className="space-y-2 rounded-3xl card-glow p-4 sm:p-6">
        <h2 className="text-xl font-extrabold">কন্টেন্ট মডারেশন</h2>
        <select className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100">
          {reasons.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-2 text-sm font-extrabold text-black">Approve</button>
          <button className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-3 py-2 text-sm font-extrabold text-black">Reject</button>
        </div>
      </section>

      <section className="rounded-3xl card-glow p-4 sm:p-6">জালিয়াতি সতর্কতা: সন্দেহজনক একাউন্ট তালিকা</section>

      <section className="rounded-3xl card-glow p-4 sm:p-6">
        <p className="font-bold">⚠️ ম্যানুয়ালি বিকাশ/নগদে পাঠান তারপর Paid মার্ক করুন</p>
        <button onClick={markPaid} className="mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-extrabold text-black">
          Paid
        </button>
      </section>

      <section className="rounded-3xl card-glow p-4 sm:p-6">
        <button className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(236,72,153,0.12)]">
          সাপ্তাহিক ড্র ট্রিগার
        </button>
      </section>
    </main>
  );
}
