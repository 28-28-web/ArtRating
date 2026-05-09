"use client";

import { ProtectedImage } from "@/components/ProtectedImage";
import { ShareModal } from "@/components/ShareModal";
import { demoArtworks } from "@/lib/demo";
import { create } from "canvas-confetti";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function ArtDetailPage() {
  const params = useParams<{ artId: string }>();
  const artId = params.artId;
  const art = demoArtworks.find((item) => item.artId === artId) ?? demoArtworks[0];
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { data: session } = useSession();

  // Generate sharing URLs
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/art/${artId}` : `https://artrating.art/art/${artId}`;
  const shareTitle = `"${art.title}" - আমার ছবি দেখুন এবং রেটিং দিন! 🎨`;
  const shareDescription = `ArtRating.art এ আমার ছবি "${art.title}" দেখুন এবং রেটিং দিন। প্রতি ১০০ রেটিং = ১০০ টাকা পুরস্কার 💰`;

  // Social sharing functions
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}\n${shareDescription}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnMobile = () => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: `${shareTitle}\n${shareUrl}\n${shareDescription}`,
        url: shareUrl
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`${shareTitle}\n${shareUrl}\n${shareDescription}`);
      setStatus("লিংক কপি বাটন করা হয়েছে!");
    }
  };

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
      const canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      create(canvas, { particleCount: 80, spread: 50 });
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
    <>
      <Head>
        <title>{art.title} - শিল্পী: {art.artist} | ArtRating.art</title>
        <meta name="description" content={shareDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image" content={art.imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ArtRating.art" />
        <meta property="og:locale" content="bn_BD" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={shareUrl} />
        <meta property="twitter:title" content={shareTitle} />
        <meta property="twitter:description" content={shareDescription} />
        <meta property="twitter:image" content={art.imageUrl} />
        
        {/* Additional Meta */}
        <meta name="keywords" content="আর্ট, শিল্প, ছবি, রেটিং, বাংলাদেশ, পুরস্কার, প্রতিযোগিতা" />
        <meta name="author" content={art.artist} />
        <link rel="canonical" href={shareUrl} />
      </Head>
      
      <main className="mx-auto w-full max-w-3xl space-y-4 p-4">
        <ProtectedImage src={art.imageUrl} artId={art.artId} alt={art.title} />
        <div className="rounded-3xl card-glow p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="inline-flex rounded bg-black/40 px-2 py-1 text-xs">ART ID: {art.artId}</p>
              <h1 className="mt-2 text-2xl font-bold">{art.title}</h1>
              <p className="text-zinc-300">শিল্পী: {art.artist}</p>
            </div>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-3 py-2 text-sm font-extrabold text-white transition-all transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-4.732 2.684m4.732-2.684a3 3 0 00-4.732-2.684M3 12a3 3 0 104.732 2.684M3 12a3 3 0 014.732-2.684" />
              </svg>
              শেয়ার
            </button>
          </div>
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
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        artId={art.artId}
        title={art.title}
        artist={art.artist}
        imageUrl={art.imageUrl}
      />
    </>
  );
}
