"use client";

import Link from "next/link";
import { useState } from "react";

export default function TermsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            সেবার শর্তাবলী
          </h1>
          <p className="text-lg text-zinc-300">
            ArtRating.art ব্যবহারের শর্তাবলী ও নিয়মাবলী
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-6">
          
          {/* Acceptance of Terms */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur rounded-2xl border border-blue-500/30 p-6">
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('acceptance')}>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                শর্তাবলী গ্রহণ
              </h2>
              <svg className={`w-5 h-5 text-blue-400 transition-transform ${expandedSection === 'acceptance' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSection === 'acceptance' && (
              <div className="text-zinc-200 space-y-3">
                <p>ArtRating.art-এ নিবন্ধন ও ব্যবহারের মাধ্যমে আপনি এই শর্তাবলী মেনে নিচ্ছেন।</p>
                <p>আপনি যদি এই শর্তাবলীতে সম্মত না হন, তবে অনুগ্রহ করবেন যে আপনি সাইটটি ব্যবহার করবেন না।</p>
              </div>
            )}
          </div>

          {/* Upload Rules */}
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur rounded-2xl border border-red-500/30 p-6">
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('upload')}>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                আপলোড নিয়ম
              </h2>
              <svg className={`w-5 h-5 text-red-400 transition-transform ${expandedSection === 'upload' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSection === 'upload' && (
              <div className="text-zinc-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-2">নিষিদ্ধ বিষয়বস্তু:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>NSFW (Not Safe For Work) বিষয়বস্তু</li>
                    <li>অশ্লীল, বর্বর বা আপত্তিকর বিষয়বস্তু</li>
                    <li>ঘৃণামূলক, বৈষম্যমূলক বা বিদ্বেষপূর্ণ বিষয়বস্তু</li>
                    <li>সহিংসাত্মক, সন্ত্রাসবাদী বা অবৈধ কার্যকলাপ</li>
                    <li>কপিরাইট লঙ্ঘনকারী বিষয়বস্তু</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-2">AI আর্ট নিয়ম:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>AI জেনারেটেড আর্ট সম্পূর্ণভাবে নিষিদ্ধ</li>
                    <li>শুধুমাত্র মানবসৃষ্ট আর্টওয়ার্ক অনুমোদিত</li>
                    <li>AI সহায়তায় তৈরি ছবি আপলোড করলে অ্যাকাউন্ট বাতিল হবে</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-2">আর্টওয়ার্কের মান:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>নূন্যতম রেজোলিউশন: 800x600 পিক্সেল</li>
                    <li>সর্বোচ্চ ফাইল সাইজ: 10MB</li>
                    <li>সমর্থিত ফরম্যাট: JPG, PNG, WebP</li>
                    <li>আর্টওয়ার্কের সঠিক বিবরণ দিতে হবে</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Prize Rules */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur rounded-2xl border border-green-500/30 p-6">
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('prize')}>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" />
                </svg>
                পুরস্কার নিয়ম
              </h2>
              <svg className={`w-5 h-5 text-green-400 transition-transform ${expandedSection === 'prize' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSection === 'prize' && (
              <div className="text-zinc-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-2">সাপ্তাহিক পুরস্কার:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>সর্বোচ্চ রেটিংধারী ৳১০,০০০ পাবেন</li>
                    <li>সর্বোচ্চ রেটার ৳২০০ বোনাস পাবেন</li>
                    <li>অংশগ্রহণকারী সবাই সার্টিফিকেট পাবেন</li>
                    <li>পুরস্কার বিতরণ সপ্তাহের শেষে</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-2">পেআউট নিয়ম:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>ন্যূনতম ১০০ রেটিং থাকলে পেআউট অনুরোধ করা যাবে</li>
                    <li>প্রতি ১০০ রেটিং = ৳১০০</li>
                    <li>পেআউট অনুরোধের ৭২ ঘন্টার মধ্যে প্রদান করা হবে</li>
                    <li>পেআউট নিলে রেটিং শূন্য হয়ে যাবে</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Account Termination */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur rounded-2xl border border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('termination')}>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                অ্যাকাউন্ট বাতিলের শর্ত
              </h2>
              <svg className={`w-5 h-5 text-purple-400 transition-transform ${expandedSection === 'termination' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSection === 'termination' && (
              <div className="text-zinc-200 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">অ্যাকাউন্ট বাতিলের কারণ:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>নিয়ম ভঙ্গ: ৩টি সতর্কতামূলক নোটিশের পর</li>
                    <li>NSFW বা AI আর্ট আপলোড: সরাসরি বাতিল</li>
                    <li>ভুয়া রেটিং বা কারসাজি: সরাসরি বাতিল</li>
                    <li>অন্য ব্যবহারকারীদের হয়রানি: সরাসরি বাতিল</li>
                    <li>আইনি লঙ্ঘন: সরাসরি বাতিল</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">বাতিলের পর:</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>সকল ডেটা স্থায়ীভাবে মুছে ফেলা হবে</li>
                    <li>আর্টওয়ার্ক ও রেটিং ডাটা মুছে যাবে</li>
                    <li>পেন্ডিং পেআউট বাতিল হবে</li>
                    <li>নতুন অ্যাকাউন্ট খোলা যাবে না</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* User Responsibilities */}
          <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 backdrop-blur rounded-2xl border border-indigo-500/30 p-6">
            <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('responsibilities')}>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                ব্যবহারকারীর দায়িত্ব
              </h2>
              <svg className={`w-5 h-5 text-indigo-400 transition-transform ${expandedSection === 'responsibilities' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedSection === 'responsibilities' && (
              <div className="text-zinc-200 space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>সঠিক তথ্য প্রদান করা</li>
                  <li>অন্যদের আর্টওয়ার্কের সম্মান করা</li>
                  <li>ন্যায্যভাবে রেটিং দেওয়া</li>
                  <li>কপিরাইট আইন মেনে চলা</li>
                  <li>সাইটের নিয়ম মেনে চলা</li>
                  <li>কোনো বাগ বা সমস্যা দেখলে জানানো</li>
                </ul>
              </div>
            )}
          </div>

          {/* Last Updated */}
          <div className="text-center text-zinc-400 text-sm bg-black/30 rounded-xl p-4">
            <p>সর্বশেষ হালনাগাদ: {new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-2">এই শর্তাবলী যেকোনো সময় পরিবর্তন করা যেতে পারে।</p>
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
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
              যোগাযোগ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
