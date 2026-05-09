"use client";

import { ProtectedImage } from "@/components/ProtectedImage";
import { demoArtworks } from "@/lib/demo";
import confetti from "canvas-confetti";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ArtDetailPage() {
  const params = useParams<{ artId: string }>();
  const artId = params.artId;
  const art = demoArtworks.find((item) => item.artId === artId) ?? demoArtworks[0];
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const { data: session } = useSession();

  async function submitRating() {
    if (!session?.user?.id) {
      setStatus("রেটিং দিতে লগইন প্রয়োজন");
      return;
    }
    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artId: art.artId, stars }),
    });
    const data = await res.json();
    if (res.ok) {
      confetti({ particleCount: 80, spread: 50 });
      setStatus("রেটিং সফল");
    } else {
      setStatus(data.message ?? "রেটিং ব্যর্থ");
    }
  }

  async function submitComment() {
    if (!session?.user?.id) {
      setStatus("মন্তব্য দিতে লগইন প্রয়োজন");
      return;
    }
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artId: art.artId, content: comment }),
    });
    setStatus(res.ok ? "মন্তব্য যোগ হয়েছে" : "মন্তব্য ব্যর্থ");
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-4 p-4">
      <ProtectedImage src={art.imageUrl} artId={art.artId} alt={art.title} />
      <div className="rounded-3xl card-glow p-4 sm:p-5">
        <p className="inline-flex rounded bg-black/40 px-2 py-1 text-xs">ART ID: {art.artId}</p>
        <h1 className="mt-2 text-2xl font-bold">{art.title}</h1>
        <p className="text-zinc-300">শিল্পী: {art.artist}</p>
      </div>
      <section className="card-glow rounded-2xl p-4">
        <h2 className="text-lg font-extrabold">রেটিং সেকশন</h2>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setStars(n)}
              className={[
                "text-2xl transition",
                stars >= n ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 drop-shadow-[0_0_14px_rgba(245,158,11,0.35)]" : "text-zinc-700",
              ].join(" ")}
              aria-label={`স্টার ${n}`}
            >
              ★
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={submitRating}
          className="mt-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_26px_rgba(236,72,153,0.12)]"
        >
          রেটিং সাবমিট
        </button>
      </section>
      <section className="card-glow rounded-2xl p-4">
        <h2 className="font-semibold">ফোরাম</h2>
        <p className="text-sm text-zinc-300">শিল্পীর গল্প/প্রেক্ষাপট</p>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="mt-2 w-full rounded bg-black/40 p-2" placeholder="আপনার মন্তব্য লিখুন" />
        <button
          type="button"
          onClick={submitComment}
          className="mt-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-extrabold text-black"
        >
          মন্তব্য দিন
        </button>
      </section>
      {status ? <p className="text-sm text-zinc-300">{status}</p> : null}
    </main>
  );
}
