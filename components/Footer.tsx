import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-3 py-2 text-sm font-extrabold text-white shadow-[0_0_22px_rgba(236,72,153,0.25)] inline-block">
              🎨 চিত্রাঙ্কন
            </div>
            <p className="text-zinc-300 text-sm">
              বাংলাদেশের শিল্পীদের মিলনমেলা
            </p>
            <p className="text-zinc-400 text-xs">
              আপনার আঁকা ছবি আপলোড করুন, রেটিং দিন এবং প্রতি সপ্তাহে জিতে নিন নগদ পুরস্কার
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-3">দ্রুত লিংক</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-300 hover:text-white transition-colors text-sm">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-zinc-300 hover:text-white transition-colors text-sm">
                  সব ছবি
                </Link>
              </li>
              <li>
                <Link href="/campaign" className="text-zinc-300 hover:text-white transition-colors text-sm">
                  ক্যাম্পেইন
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-zinc-300 hover:text-white transition-colors text-sm">
                  লিডারবোর্ড
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-3">আইনি</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-zinc-300 hover:text-white transition-colors text-sm">
                  গোপনীয়তা নীতি
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-300 hover:text-white transition-colors text-sm">
                  সেবার শর্ত
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors text-sm">
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-3">যোগাযোগ</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-zinc-300">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@artrating.art</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>সকাল ৯টা - সন্ধ্যা ৬টা</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-400 text-sm">
              © 2026 ArtRating.art. সর্বস্বত্ব সংরক্ষিত।
            </p>
            
            <div className="flex gap-4">
              <Link 
                href="https://facebook.com/artrating" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              
              <Link 
                href="https://instagram.com/artrating" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 2.465 1.359 2.963 2.39 2.963 1.031 0 2.242-.498 2.963-2.39.667-1.266 1.646-1.647 4.85-1.647 1.266 0 2.642.381 4.85 1.647 1.031 1.892 2.39 2.963 2.39 1.031 0 2.242-.498 2.963-2.39.667-1.266 1.646-1.647 4.85-1.647 1.266 0 2.642.381 4.85 1.647 1.031 1.892 2.39 2.963 2.39 1.031 0 2.242-.498 2.963-2.39.667-1.266 1.646-1.647 4.85-1.647 1.266 0 2.642.381 4.85 1.647 1.031 1.892 2.39 2.963 2.39 1.031 0 2.242-.498 2.963-2.39.667-1.266 1.646-1.647 4.85-1.647 1.266 0 2.642.381 4.85 1.647 1.031 1.892 2.39 2.963 2.39 1.031 0 2.242-.498 2.963-2.39.667-1.266 1.646-1.647 4.85-1.647 1.266 0 2.642.381 4.85 1.647z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
