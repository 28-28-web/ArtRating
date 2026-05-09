import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            গোপনীয়তা নীতি
          </h1>
          <p className="text-lg text-zinc-300">
            ArtRating.art আপনার তথ্য কীভাবে সংরক্ষণ করে তা জানুন
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8">
          
          {/* Site Information */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur rounded-2xl border border-blue-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-2xl font-bold text-white">সাইটের তথ্য</h2>
            </div>
            <div className="space-y-3 text-zinc-200">
              <p><strong>সাইটের নাম:</strong> ArtRating.art</p>
              <p><strong>ওয়েবসাইট:</strong> https://artrating.art</p>
              <p><strong>পরিষেবা:</strong> অনলাইন আর্ট রেটিং প্ল্যাটফর্ম</p>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur rounded-2xl border border-purple-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <h2 className="text-2xl font-bold text-white">কী ডেটা সংগ্রহ করা হয়</h2>
            </div>
            <div className="space-y-4 text-zinc-200">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">অ্যাকাউন্ট তৈরির সময়:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>পূর্ণ নাম</li>
                  <li>মোবাইল নম্বর</li>
                  <li>ইমেইল ঠিকানা (ঐচ্ছিক)</li>
                  <li>প্রোফাইল ছবি (ঐচ্ছিক)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">আর্ট আপলোডের সময়:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>আর্টওয়ার্কের ছবি</li>
                  <li>আর্টওয়ার্কের শিরোনাম</li>
                  <li>আর্টওয়ার্কের বিবরণ</li>
                  <li>আপলোডের সময় ও তারিখ</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">স্বয়ংক্রিয় সংগ্রহ:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>IP ঠিকানা</li>
                  <li>ব্রাউজারের ধরন</li>
                  <li>ডিভাইসের তথ্য</li>
                  <li>পেজ ভিজিটের সময়</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur rounded-2xl border border-green-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h2 className="text-2xl font-bold text-white">কীভাবে ব্যবহার হয়</h2>
            </div>
            <div className="space-y-3 text-zinc-200">
              <p>আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করা হয়:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>অ্যাকাউন্ট ব্যবস্থাপনা ও পরিচালনা</li>
                <li>আর্টওয়ার্ক আপলোড ও প্রদর্শন</li>
                <li>রেটিং সিস্টেম পরিচালনা</li>
                <li>পুরস্কার বিতরণ ও পেআউট প্রক্রিয়া</li>
                <li>সাইটের নিরাপত্তা নিশ্চিতকরণ</li>
                <li>সার্ভিস উন্নতিকরণ</li>
                <li>আইনি প্রয়োজনে তথ্য প্রদান</li>
              </ul>
            </div>
          </div>

          {/* Third Party Services */}
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur rounded-2xl border border-orange-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-2xl font-bold text-white">তৃতীয় পক্ষের সার্ভিস</h2>
            </div>
            <div className="space-y-4 text-zinc-200">
              <div>
                <h3 className="text-lg font-semibold text-orange-300 mb-2">Cloudinary</h3>
                <p>ছবি সংরক্ষণ ও ডেলিভারির জন্য Cloudinary ব্যবহার করা হয়। ছবিগুলো এনক্রিপ্টেড অবস্থায় সংরক্ষিত থাকে।</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-orange-300 mb-2">Google Analytics</h3>
                <p>সাইটের পারফরম্যান্স ও ইউজার বিহেভিয়র বোঝার জন্য Google Analytics ব্যবহার করা হয়। কোনো ব্যক্তিগত তথ্য সংরক্ষণ করা হয় না।</p>
              </div>
            </div>
          </div>

          {/* User Rights */}
          <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 backdrop-blur rounded-2xl border border-indigo-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-2xl font-bold text-white">ইউজারের অধিকার</h2>
            </div>
            <div className="space-y-3 text-zinc-200">
              <p>আপনার নিম্নলিখিত অধিকার রয়েছে:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>যেকোনো সময় আপনার অ্যাকাউন্ট ডিলিট করার অধিকার</li>
                <li>আপনার আর্টওয়ার্ক সরানোর অধিকার</li>
                <li>আপনার তথ্য দেখার অধিকার</li>
                <li>তথ্য সংশোধনের অধিকার</li>
                <li>ডেটা পোর্টেবিলিটির অধিকার</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 backdrop-blur rounded-2xl border border-teal-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-bold text-white">যোগাযোগ</h2>
            </div>
            <div className="space-y-3 text-zinc-200">
              <p>গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকলে:</p>
              <div className="bg-black/30 rounded-xl p-4">
                <p><strong>ইমেইল:</strong> support@artrating.art</p>
                <p><strong>ফোন:</strong> +880 1XXX-XXXXXX</p>
                <p><strong>সময়:</strong> সকাল ৯টা - সন্ধ্যা ৬টা</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-zinc-400 text-sm">
            <p>সর্বশেষ হালনাগাদ: {new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
