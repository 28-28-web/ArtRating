"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSession } from "next-auth/react";
import { WaveDivider } from "@/components/WaveDivider";

export default function UploadPage() {
  const { data: session } = useSession();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("প্রতিকৃতি");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");
  const [createdArtId, setCreatedArtId] = useState("");
  const [status, setStatus] = useState("");
  const [otpEndsAt, setOtpEndsAt] = useState<number | null>(null);
  const [otpRemainingText, setOtpRemainingText] = useState("");
  const shareLink = useMemo(() => {
    if (!createdArtId || typeof window === "undefined") return "";
    return `${window.location.origin}/art/${createdArtId}`;
  }, [createdArtId]);

  async function sendOtp() {
    setStatus("OTP পাঠানো হচ্ছে...");
    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose: "upload" }),
    });
    const data = await res.json();
    setStatus(data.message ?? "OTP পাঠানো হয়েছে");
    if (res.ok) setOtpEndsAt(Date.now() + 5 * 60 * 1000);
  }

  async function verifyOtp() {
    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, purpose: "upload" }),
    });
    if (res.ok) {
      setVerified(true);
      setStatus("OTP যাচাই সম্পন্ন");
      setOtpEndsAt(null);
    } else {
      setStatus("OTP যাচাই ব্যর্থ");
    }
  }

  useEffect(() => {
    if (!otpEndsAt) return;
    const tick = () => {
      const diff = Math.max(0, otpEndsAt - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      const mm = String(m).padStart(2, "0");
      const ss = String(s).padStart(2, "0");
      setOtpRemainingText(`${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [otpEndsAt]);

  async function onFileChange(file: File | null) {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setStatus("শুধু JPG/PNG ছবি দিন");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("ছবির সাইজ max 5MB হতে হবে");
      return;
    }
    const sigRes = await fetch("/api/upload/signature", { method: "POST" });
    if (!sigRes.ok) {
      setStatus("ছবি আপলোডের জন্য লগইন প্রয়োজন");
      return;
    }
    const sig = await sigRes.json();
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("folder", sig.folder);
    form.append("signature", sig.signature);
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });
    const data = await uploadRes.json();
    setImageUrl(data.secure_url);
    setImagePublicId(data.public_id);
    setStatus("ছবি আপলোড সম্পন্ন");
  }

  async function submitArtwork() {
    const res = await fetch("/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session?.user?.id,
        title,
        description,
        category,
        imageUrl,
        imagePublicId,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setCreatedArtId(data.artId);
      setStatus("আপলোড সফল, অ্যাডমিন অনুমোদনের অপেক্ষায়");
    } else {
      setStatus(data.message ?? "আপলোড ব্যর্থ");
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-4 p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold">আপনার ছবি আপলোড করুন</h1>

      <section className="space-y-3 rounded-3xl card-glow p-4 sm:p-6">
        <h2 className="text-lg font-extrabold">ধাপ ১ - OTP যাচাই</h2>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500"
          placeholder="মোবাইল নম্বর (01XXXXXXXXX)"
        />
        
        {/* OTP Message */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-3">
          <p className="text-sm text-blue-200">
            আপনার নিবন্ধিত নম্বরে OTP পাঠানো হবে
          </p>
        </div>
        
        <button
          type="button"
          onClick={sendOtp}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(34,197,94,0.16)]"
        >
          OTP পাঠান
        </button>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500"
          placeholder="৬ সংখ্যার OTP"
        />
        <button
          type="button"
          onClick={verifyOtp}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(236,72,153,0.12)]"
        >
          OTP যাচাই
        </button>
        <div className="text-sm font-bold text-zinc-300">
          OTP সময়সীমা: {otpRemainingText ? otpRemainingText : "৫ মিনিট"}
        </div>
      </section>
      <WaveDivider />

      <section className={`space-y-3 rounded-3xl card-glow p-4 sm:p-6 ${!verified ? "opacity-50 pointer-events-none" : ""}`}>
        <h2 className="text-lg font-extrabold">ধাপ ২ - ছবির বিবরণ</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" placeholder="শিরোনাম" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100">
          <option>প্রতিকৃতি</option>
          <option>দৃশ্যপট</option>
          <option>বিমূর্ত</option>
          <option>কার্টুন</option>
          <option>অন্যান্য</option>
        </select>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl bg-black/40 p-3 text-sm font-bold text-zinc-100 placeholder:text-zinc-500" placeholder="এই ছবিটি কেন আঁকলেন?" rows={4} />
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-dashed border-zinc-500 bg-black/20 p-4 text-sm"
        />
        <div className="rounded-xl border border-amber-400/60 bg-amber-400/10 p-3 text-sm font-bold text-amber-100">
          ⚠️ AI দিয়ে তৈরি, কপি করা বা অশ্লীল ছবি আপলোড নিষিদ্ধ
        </div>
        <button
          type="button"
          onClick={submitArtwork}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_24px_rgba(236,72,153,0.12)]"
        >
          সাবমিট
        </button>
      </section>
      {status ? <p className="text-sm font-bold text-zinc-300">{status}</p> : null}
      {createdArtId ? (
        <section className="rounded-3xl card-glow p-4 sm:p-6">
          <p className="text-lg font-extrabold">ART ID: {createdArtId}</p>
          <p className="mt-1 text-sm font-bold break-all text-zinc-300">শেয়ার লিংক: {shareLink}</p>
          {shareLink ? <QRCodeCanvas value={shareLink} bgColor="#0f0c29" fgColor="#ffffff" /> : null}
        </section>
      ) : null}
    </main>
  );
}
