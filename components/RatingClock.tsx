"use client";

import { useEffect, useState } from "react";
import { ProtectedImage } from "@/components/ProtectedImage";

type RatingClockProps = {
  artId: string;
  imageUrl: string;
  title: string;
  artist: string;
  initialCount: number;
};

export function RatingClock({ artId, imageUrl, title, artist, initialCount }: RatingClockProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const id = setInterval(() => setCount((prev) => prev + Math.floor(Math.random() * 3)), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="card-glow relative overflow-hidden rounded-2xl p-4">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-amber-400/10" />
      <div className="relative">
        <h2 className="mb-3 text-xl font-extrabold">
          এই মুহূর্তে সর্বোচ্চ রেটিং প্রাপ্ত ছবি
        </h2>
        <div className="rounded-xl border border-white/10 p-2 shadow-[0_0_32px_rgba(124,58,237,0.18)]">
          <ProtectedImage src={imageUrl} artId={artId} alt={title} />
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-sm font-bold text-zinc-300">শিল্পী: {artist}</p>
          <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
            {count} রেটিং
          </p>
        </div>

        <a
          href={`/art/${artId}`}
          className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_0_22px_rgba(34,197,94,0.18)]"
        >
          রেটিং দিন
        </a>
      </div>
    </section>
  );
}
