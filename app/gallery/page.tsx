import Link from "next/link";
import { ProtectedImage } from "@/components/ProtectedImage";
import { ShareModal } from "@/components/ShareModal";
import { WaveDivider } from "@/components/WaveDivider";
import { demoArtworks } from "@/lib/demo";
import { useState } from "react";

export default function GalleryPage() {
  const [shareModalArt, setShareModalArt] = useState<{
    artId: string;
    title: string;
    artist: string;
    imageUrl: string;
  } | null>(null);
  
  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-6">
      <section className="card-glow rounded-3xl p-5 sm:p-7">
        <h1 className="text-3xl font-extrabold">সব ছবি</h1>
        <p className="mt-2 text-sm font-bold text-zinc-300">
          শুধুমাত্র অ্যাডমিন অনুমোদিত ছবিগুলো এখানে দেখা যাবে।
        </p>
        <WaveDivider />
      </section>

      <section className="rounded-3xl card-glow p-4 sm:p-6">
        <div className="columns-1 gap-4 sm:columns-2">
          {demoArtworks.map((art) => (
            <article
              key={art.artId}
              className="mb-4 break-inside-avoid rounded-2xl border border-white/10 bg-black/10 p-3"
            >
              <ProtectedImage src={art.imageUrl} artId={art.artId} alt={art.title} />
              <div className="mt-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-extrabold">{art.title}</p>
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
              <div className="mt-3 flex gap-2">
                <Link 
                  href={`/art/${art.artId}`}
                  className="flex-1 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 px-3 py-2 text-xs font-extrabold text-white transition-all"
                >
                  রেট দিন
                </Link>
                <button
                  onClick={() => setShareModalArt({
                    artId: art.artId,
                    title: art.title,
                    artist: art.artist,
                    imageUrl: art.imageUrl
                  })}
                  className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-3 py-2 text-xs font-extrabold text-white transition-all"
                >
                  🔗 শেয়ার করুন
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      
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

