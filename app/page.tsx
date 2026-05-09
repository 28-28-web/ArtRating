import Link from "next/link";
import { FloatingArtEmojis } from "@/components/FloatingArtEmojis";
import { ProtectedImage } from "@/components/ProtectedImage";
import { ShareModal } from "@/components/ShareModal";
import { WeekCountdown } from "@/components/WeekCountdown";
import { WaveDivider } from "@/components/WaveDivider";
import { RatingClock } from "@/components/RatingClock";
import { demoArtworks } from "@/lib/demo";
import { useState } from "react";

export default function HomePage() {
  const top = demoArtworks[0];
  const [shareModalArt, setShareModalArt] = useState<{
    artId: string;
    title: string;
    artist: string;
    imageUrl: string;
  } | null>(null);
  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <section className="hero-splash card-glow relative mb-6 rounded-3xl p-5 sm:p-7">
        <FloatingArtEmojis />
        <h1 className="relative z-10 text-3xl font-extrabold sm:text-5xl">
          বাংলাদেশের শিল্পীদের মিলনমেলা
        </h1>
        <p className="relative z-10 mt-3 max-w-2xl text-base font-bold text-zinc-200 sm:text-lg">
          আপনার আঁকা ছবি আপলোড করুন, রেটিং দিন এবং প্রতি সপ্তাহে জিতে নিন নগদ পুরস্কার
        </p>

        <div className="relative z-10 mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 shadow-[0_0_28px_rgba(236,72,153,0.10)]">
            <div className="text-sm font-extrabold text-zinc-300">সাপ্তাহিক কাউন্টডাউন</div>
            <WeekCountdown />
          </div>
          <div className="flex gap-2">
            <Link
              href="/upload"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black"
            >
              ছবি আপলোড
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 px-4 py-2 text-sm font-extrabold text-black"
            >
              লিডারবোর্ড দেখুন
            </Link>
          </div>
        </div>
      </section>

      {/* Campaign Banner */}
      <section className="mb-6 rounded-3xl card-glow bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏆</span>
              <h2 className="text-xl font-extrabold text-yellow-400">এই সপ্তাহের চ্যালেঞ্জ: প্রকৃতির রং</h2>
            </div>
            <p className="text-zinc-200 font-bold">পুরস্কার: ৳১০,০০০ পর্যন্ত</p>
          </div>
          <Link
            href="/campaign"
            className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 text-sm font-extrabold text-black shadow-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105"
          >
            অংশ নিন
          </Link>
        </div>
      </section>

      <WaveDivider />

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <RatingClock
            artId={top.artId}
            imageUrl={top.imageUrl}
            title={top.title}
            artist={top.artist}
            initialCount={top.ratings}
          />

          <section className="rounded-3xl card-glow p-4 sm:p-5">
            <h2 className="mb-3 text-xl font-extrabold">অনুমোদিত ছবির গ্যালারি</h2>
            <div className="columns-1 gap-4 sm:columns-2">
              {demoArtworks.map((art) => (
                <article key={art.artId} className="mb-4 break-inside-avoid rounded-2xl border border-white/10 bg-black/10 p-3">
                  <ProtectedImage src={art.imageUrl} artId={art.artId} alt={art.title} />
                  <div className="mt-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-extrabold">{art.title}</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setShareModalArt({
                            artId: art.artId,
                            title: art.title,
                            artist: art.artist,
                            imageUrl: art.imageUrl
                          })}
                          className="rounded-lg bg-white/5 px-2 py-1 text-xs font-extrabold text-zinc-100 hover:bg-white/10 transition-colors"
                          title="শেয়ার করুন"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-4.732 2.684m4.732-2.684a3 3 0 00-4.732-2.684M3 12a3 3 0 104.732 2.684M3 12a3 3 0 014.732-2.684" />
                          </svg>
                        </button>
                        <Link href={`/art/${art.artId}`} className="rounded-lg bg-white/5 px-2 py-1 text-xs font-extrabold text-zinc-100 hover:bg-white/10 transition-colors">
                          বিস্তারিত
                        </Link>
                      </div>
                    </div>
                    <p className="mt-1 text-zinc-300">ART ID: {art.artId}</p>
                    <p className="text-zinc-300">শিল্পী: {art.artist}</p>
                    <p className="text-zinc-200">
                      রেটিং:{" "}
                      <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300">
                        {art.ratings}
                      </span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-3xl card-glow p-4 sm:p-5">
          <h3 className="text-xl font-extrabold">সাপ্তাহিক টপ ৫ লিডারবোর্ড</h3>
          <ol className="mt-4 space-y-3">
            {demoArtworks.map((art, idx) => {
              const rank = idx + 1;
              const badge =
                rank === 1 ? { label: "🥇", cls: "from-amber-400 to-yellow-200" } :
                rank === 2 ? { label: "🥈", cls: "from-slate-300 to-slate-500" } :
                rank === 3 ? { label: "🥉", cls: "from-orange-300 to-pink-300" } :
                { label: `#${rank}`, cls: "from-violet-400 to-fuchsia-400" };
              return (
                <li key={art.artId} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-3">
                  <div className={`rounded-xl bg-gradient-to-r ${badge.cls} px-3 py-2 text-sm font-extrabold text-black shadow-[0_0_22px_rgba(124,58,237,0.15)]`}>
                    {badge.label}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-white">{art.artist}</div>
                    <div className="text-xs text-zinc-300">রেটিং {art.ratings}</div>
                  </div>
                  <div className="ml-auto text-xs font-extrabold text-zinc-300">
                    🏆
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-4">
            <Link href="/leaderboard" className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black">
              বিস্তারিত ট্রফি তালিকা
            </Link>
          </div>
        </aside>
      </div>
      
      {shareModalArt && (
        <ShareModal
          isOpen={!!shareModalArt}
          onClose={() => setShareModalArt(null)}
          artId={shareModalArt.artId}
          title={shareModalArt.title}
          artist={shareModalArt.artist}
          imageUrl={shareModalArt.imageUrl}
        />
      )}
    </main>
  );
}
