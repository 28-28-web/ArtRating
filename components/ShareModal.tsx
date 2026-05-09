"use client";

import { useState } from "react";
import { create } from "canvas-confetti";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  artId: string;
  title: string;
  artist: string;
  imageUrl: string;
}

const banglaCaptions = [
  "🎨 আমার আঁকা ছবি দেখুন এবং রেটিং দিন! প্রতি ১০০ রেটিং = ১০০ টাকা পুরস্কার 💰",
  "🖼️ আমার শিল্পকর্মটি দেখে আপনার মূল্যবান মতামত দিন ⭐",
  "🌟 আমার ছবিতে রেটিং দিয়ে আমাকে উৎসাহিত করুন 🙏",
  "🎭 শিল্পের মাধ্যমে বাংলাদেশকে তুলে ধরার চেষ্টা 🇧🇩",
  "🖌️ আমার অনুপ্রেরণামূলক ছবিটি দেখুন এবং সাপোর্ট করুন 💪"
];

export function ShareModal({ isOpen, onClose, artId, title, artist, imageUrl }: ShareModalProps) {
  const [copiedText, setCopiedText] = useState("");
  const [randomCaption] = useState(banglaCaptions[Math.floor(Math.random() * banglaCaptions.length)]);
  
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/art/${artId}` : `https://artrating.art/art/${artId}`;
  const shareTitle = `"${title}" - আমার ছবি দেখুন এবং রেটিং দিন! 🎨`;
  const shareDescription = `ArtRating.art এ আমার ছবি "${title}" দেখুন এবং রেটিং দিন। প্রতি ১০০ রেটিং = ১০০ টাকা পুরস্কার 💰`;

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    triggerConfetti();
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}\n${shareDescription}`)}`;
    window.open(whatsappUrl, '_blank');
    triggerConfetti();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedText("লিংক কপি করা হয়েছে!");
      triggerConfetti();
      setTimeout(() => setCopiedText(""), 3000);
    } catch (err) {
      setCopiedText("কপি করতে ব্যর্থ হয়েছে");
    }
  };

  const copyBanglaCaption = async () => {
    try {
      const fullCaption = `${randomCaption}\n\n📍 ছবি দেখুন: ${shareUrl}\n\n🎨 ছবির নাম: ${title}\n👨‍🎨 শিল্পী: ${artist}`;
      await navigator.clipboard.writeText(fullCaption);
      setCopiedText("বাংলা ক্যাপশন কপি হয়েছে!");
      triggerConfetti();
      setTimeout(() => setCopiedText(""), 3000);
    } catch (err) {
      setCopiedText("কপি করতে ব্যর্থ হয়েছে");
    }
  };

  const generateQRCode = () => {
    // Using a simple QR code API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
    return qrUrl;
  };

  const triggerConfetti = () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    create(canvas, { particleCount: 30, spread: 40 });
    setTimeout(() => document.body.removeChild(canvas), 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl card-glow p-6 border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="বন্ধ করুন"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-extrabold mb-4 text-center">ছবিটি শেয়ার করুন</h2>
        
        <div className="space-y-4">
          {/* QR Code Section */}
          <div className="text-center">
            <p className="text-sm font-extrabold mb-2">QR কোড স্ক্যান করুন</p>
            <div className="inline-block p-2 bg-white rounded-xl">
              <img 
                src={generateQRCode()} 
                alt="QR Code" 
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareOnFacebook}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-extrabold text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 px-4 py-3 text-sm font-extrabold text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>
          </div>

          {/* Copy Buttons */}
          <div className="space-y-3">
            <button
              onClick={copyLink}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 px-4 py-3 text-sm font-extrabold text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              লিংক কপি করুন
            </button>

            <button
              onClick={copyBanglaCaption}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-3 text-sm font-extrabold text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              বাংলা ক্যাপশন কপি করুন
            </button>
          </div>

          {/* Preview of Bangla Caption */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/10">
            <p className="text-xs font-extrabold text-zinc-400 mb-1">বাংলা ক্যাপশন প্রিভিউ:</p>
            <p className="text-sm text-zinc-200">{randomCaption}</p>
          </div>

          {/* Status Message */}
          {copiedText && (
            <div className="text-center text-sm font-extrabold text-green-400 animate-pulse">
              {copiedText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
