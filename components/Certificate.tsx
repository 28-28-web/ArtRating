"use client";

import { useState } from "react";

interface CertificateProps {
  artistName: string;
  rating: number;
  prize: number;
  certificateNumber: string;
  className?: string;
}

export function Certificate({
  artistName,
  rating,
  prize,
  certificateNumber,
  className = "",
}: CertificateProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate PDF generation/download
    setTimeout(() => {
      setIsDownloading(false);
      // In a real app, this would generate and download a PDF
      alert("সার্টিফিকেট ডাউনলোড হচ্ছে...");
    }, 1500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "সাপ্তাহিক পুরস্কার সার্টিফিকেট",
          text: `${artistName} ${rating} রেটিং অর্জন করে ৳${prize} পুরস্কার জিতেছেন!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `${artistName} ${rating} রেটিং অর্জন করে ৳${prize} পুরস্কার জিতেছেন!`
      );
      alert("সার্টিফিকেট লিঙ্ক কপি করা হয়েছে!");
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Certificate Container */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-lg shadow-2xl border-4 border-yellow-500/30 overflow-hidden">
        
        {/* Golden Border Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/20 via-yellow-500/30 to-yellow-400/20 blur-sm"></div>
        
        {/* Inner Content */}
        <div className="relative z-10 text-center">
          
          {/* Logo */}
          <div className="mb-6">
            <div className="inline-block rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-white shadow-lg">
              🎨 ArtRating.art
            </div>
          </div>

          {/* Certificate Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8 drop-shadow-lg">
            সাপ্তাহিক পুরস্কার সার্টিফিকেট
          </h1>

          {/* Artist Name */}
          <div className="mb-8">
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
              শিল্পী
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-yellow-300 drop-shadow-lg">
              {artistName}
            </div>
          </div>

          {/* Achievement Text */}
          <div className="mb-8 text-lg md:text-xl text-zinc-200">
            <span className="text-yellow-400 font-bold">{rating}</span> রেটিং অর্জন করে
            <span className="text-green-400 font-bold"> ৳{prize}</span> পুরস্কার জিতেছেন
          </div>

          {/* Certificate Number */}
          <div className="mb-8 text-sm text-zinc-400 font-mono">
            সার্টিফিকেট নম্বর: {certificateNumber}
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            <div className="text-yellow-500 text-2xl">★</div>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          </div>

          {/* Date */}
          <div className="text-sm text-zinc-400 mb-8">
            {new Date().toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {isDownloading ? "ডাউনলোড হচ্ছে..." : "PDF ডাউনলোড"}
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:from-green-600 hover:to-green-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m9.032 4.026A9.001 9.001 0 012.968 10.326m9.032 4.026A9.001 9.001 0 012.968 10.326" />
              </svg>
              শেয়ার করুন
            </button>
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 text-yellow-500/30 text-3xl">❦</div>
        <div className="absolute top-4 right-4 text-yellow-500/30 text-3xl">❦</div>
        <div className="absolute bottom-4 left-4 text-yellow-500/30 text-3xl">❦</div>
        <div className="absolute bottom-4 right-4 text-yellow-500/30 text-3xl">❦</div>
      </div>
    </div>
  );
}
