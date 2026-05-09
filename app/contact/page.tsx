"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            যোগাযোগ
          </h1>
          <p className="text-lg text-zinc-300">
            আমাদের সাথে যোগাযোগ করুন
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur rounded-2xl border border-blue-500/30 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              বার্তা পাঠান
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-200 mb-2">
                  নাম *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-white placeholder:text-zinc-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="আপনার নাম"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-200 mb-2">
                  ইমেইল *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-white placeholder:text-zinc-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-200 mb-2">
                  বার্তা *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-white placeholder:text-zinc-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-none"
                  placeholder="আপনার বার্তা লিখুন..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
              </button>
            </form>
            
            {showSuccess && (
              <div className="mt-4 p-4 bg-green-600/20 border border-green-500/30 rounded-xl text-green-300 text-sm">
                আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            
            {/* Email */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur rounded-2xl border border-purple-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                ইমেইল
              </h3>
              <div className="space-y-3 text-zinc-200">
                <p className="text-lg font-semibold">support@artrating.art</p>
                <p className="text-sm">সাধারণ জিজ্ঞাসা ও সাহায্যের জন্য</p>
                <p className="text-sm">প্রতিক্রিয়া সময়: ২৪ ঘন্টার মধ্যে</p>
              </div>
            </div>

            {/* Office Address */}
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur rounded-2xl border border-green-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                অফিস ঠিকানা
              </h3>
              <div className="space-y-3 text-zinc-200">
                <p className="text-lg font-semibold">ঢাকা, বাংলাদেশ</p>
                <p className="text-sm">ধানমন্ডি, বাংলাদেশ</p>
                <p className="text-sm">পোস্ট কোড: ১২০০</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur rounded-2xl border border-orange-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ব্যবসায়িক সময়
              </h3>
              <div className="space-y-2 text-zinc-200">
                <p className="text-sm"><strong>শনি থেকে বৃহস্পতিবার:</strong> সকাল ৯টা - সন্ধ্যা ৬টা</p>
                <p className="text-sm"><strong>শুক্রবার:</strong> সকাল ১০টা - সন্ধ্যা ৪টা</p>
                <p className="text-sm"><strong>শনিবার:</strong> বন্ধ</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 backdrop-blur rounded-2xl border border-indigo-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                সোশ্যাল মিডিয়া
              </h3>
              <div className="flex gap-3">
                <button className="rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-3 text-white hover:from-purple-700 hover:to-pink-700 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 2.465 1.359 2.963 2.39 2.963 1.031 0 2.242-.498 2.963-2.39.667-1.266 1.646-1.647 4.85-1.647 1.266 0 2.642.381 4.85 1.647 1.031 1.892 2.39 2.963 2.39 1.031 0 2.242-.498 2.963-2.39.667-1.266 1.646-1.647 4.85-1.647 1.266 0 2.642.381 4.85 1.647 1.031 1.892 2.39 2.963 2.39 1.031 0 2.242-.498 2.963-2.39.667-1.266 1.646-1.647 4.85-1.647 1.266 0 2.642.381 4.85 1.647z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center space-y-4">
          <Link
            href="/"
            className="inline-block rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            হোম পেজে ফিরে যান
          </Link>
          
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
              গোপনীয়তা নীতি
            </Link>
            <span className="text-zinc-500">|</span>
            <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
              সেবার শর্ত
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
