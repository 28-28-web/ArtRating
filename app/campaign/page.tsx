import Link from "next/link";
import { Certificate } from "@/components/Certificate";
import { generateMetadata, generateBreadcrumbStructuredData } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
  title: "সাপ্তাহিক আর্ট চ্যালেঞ্জ",
  description: "প্রতি সপ্তাহে নতুন থিম, নতুন চ্যালেঞ্জ, এবং আকর্ষণীয় পুরস্কার জেতার সুযোগ। এখনই অংশ নিন!",
  keywords: ["চ্যালেঞ্জ", "আর্ট চ্যালেঞ্জ", "সাপ্তাহিক প্রতিযোগিতা", "পুরস্কার", "থিম"],
  url: "https://artrating.art/campaign"
});

export default function CampaignPage() {
  const weeklyTheme = {
    title: "প্রকৃতির রং",
    description: "এই সপ্তাহে আঁকুন প্রকৃতির সৌন্দর্য - ফুল, পাখি, নদী বা যেকোনো প্রাকৃতিক দৃশ্য",
    deadline: "আগামী রবিবার, রাত ১১:৫৯ পর্যন্ত",
  };

  const pastWinners = [
    {
      id: 1,
      name: "রহিম উদ্দিন",
      artwork: "সূর্যাস্ত",
      rating: 4.8,
      prize: 10000,
      week: "সপ্তাহ ১২",
    },
    {
      id: 2,
      name: "ফারজানা আক্তার",
      artwork: "গ্রামীণ জীবন",
      rating: 4.6,
      prize: 8000,
      week: "সপ্তাহ ১১",
    },
    {
      id: 3,
      name: "সাজিদ হাসান",
      artwork: "শহরের আলো",
      rating: 4.5,
      prize: 6000,
      week: "সপ্তাহ ১০",
    },
  ];

  const handleShareCampaign = async (platform: string) => {
    const shareText = `🎨 সাপ্তাহিক আর্ট চ্যালেঞ্জ: ${weeklyTheme.title}\nপুরস্কার: ৳১০,০০০ পর্যন্ত!\nএখনই অংশ নিন: ${window.location.href}`;
    
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbStructuredData([
            { name: "হোম", url: "https://artrating.art" },
            { name: "সাপ্তাহিক আর্ট চ্যালেঞ্জ", url: "https://artrating.art/campaign" }
          ]))
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎨 সাপ্তাহিক আর্ট চ্যালেঞ্জ
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            প্রতি সপ্তাহে নতুন থিম, নতুন চ্যালেঞ্জ, এবং আকর্ষণীয় পুরস্কার জেতার সুযোগ
          </p>
        </div>

        {/* This Week's Theme */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur rounded-2xl border border-purple-500/30 p-8">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-bold text-white">এই সপ্তাহের থিম</h2>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
              <h3 className="text-3xl font-bold text-yellow-400 mb-3">{weeklyTheme.title}</h3>
              <p className="text-zinc-200 mb-4">{weeklyTheme.description}</p>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>সময় বাকি: {weeklyTheme.deadline}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prize Details */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🏆 পুরস্কার বিবরণ</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* First Prize */}
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 backdrop-blur rounded-xl border border-yellow-500/30 p-6 text-center">
              <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">১ম পুরস্কার</h3>
              <p className="text-2xl font-bold text-white mb-2">৳১০,০০০</p>
              <p className="text-sm text-zinc-300">+ ডিজিটাল সার্টিফিকেট</p>
            </div>

            {/* Highest Rater */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur rounded-xl border border-purple-500/30 p-6 text-center">
              <svg className="w-12 h-12 text-purple-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h3 className="text-xl font-bold text-purple-400 mb-2">সর্বোচ্চ রেটার</h3>
              <p className="text-2xl font-bold text-white mb-2">৳২০০</p>
              <p className="text-sm text-zinc-300">বোনাস পুরস্কার</p>
            </div>

            {/* All Participants */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur rounded-xl border border-green-500/30 p-6 text-center">
              <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <h3 className="text-xl font-bold text-green-400 mb-2">সবার জন্য</h3>
              <p className="text-lg font-bold text-white mb-2">সার্টিফিকেট</p>
              <p className="text-sm text-zinc-300">অংশগ্রহণের স্বীকৃতি</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-12">
          <Link
            href="/upload"
            className="inline-block rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 px-8 py-4 text-lg font-extrabold text-white shadow-lg hover:from-pink-600 hover:to-violet-600 transition-all transform hover:scale-105"
          >
            এখনই অংশ নিন
          </Link>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => handleShareCampaign("facebook")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m9.032 4.026A9.001 9.001 0 012.968 10.326m9.032 4.026A9.001 9.001 0 012.968 10.326" />
              </svg>
              Facebook শেয়ার
            </button>
            
            <button
              onClick={() => handleShareCampaign("whatsapp")}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-green-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m9.032 4.026A9.001 9.001 0 012.968 10.326m9.032 4.026A9.001 9.001 0 012.968 10.326" />
              </svg>
              WhatsApp শেয়ার
            </button>
          </div>
        </div>

        {/* Past Winners Gallery */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">অতীত বিজয়ীরা</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pastWinners.map((winner) => (
              <div
                key={winner.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur rounded-xl border border-white/10 p-6"
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">{winner.name}</h3>
                  <p className="text-sm text-zinc-400">{winner.week}</p>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-zinc-300 mb-1">শিল্পকর্ম: {winner.artwork}</p>
                  <p className="text-yellow-400 font-bold">রেটিং: {winner.rating}</p>
                  <p className="text-green-400 font-bold">পুরস্কার: ৳{winner.prize}</p>
                </div>

                <Certificate
                  artistName={winner.name}
                  rating={winner.rating}
                  prize={winner.prize}
                  certificateNumber={`CERT-2026-${String(winner.id).padStart(5, '0')}`}
                  className="scale-75 origin-top"
                />
              </div>
            ))}
          </div>
        </div>

        {/* How to Participate */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur rounded-2xl border border-blue-500/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">কিভাবে অংশ নিবেন</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">1</div>
              <p className="text-sm text-zinc-300">একাউন্ট করুন</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
              <p className="text-sm text-zinc-300">থিম অনুযায়ী আঁকুন</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
              <p className="text-sm text-zinc-300">ছবি আপলোড করুন</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">4</div>
              <p className="text-sm text-zinc-300">পুরস্কার জিতুন</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
