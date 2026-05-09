import Link from "next/link";
import { WaveDivider } from "@/components/WaveDivider";

export default function LeaderboardPage() {
  const rows = [
    { rank: 1, artist: "তাসনিম আক্তার", title: "নীল নদীর বিকেল", rating: 412, prize: "৳400", badge: "🥇", cls: "from-amber-400 to-yellow-200" },
    { rank: 2, artist: "রাফি হাসান", title: "পুরান ঢাকার সকাল", rating: 356, prize: "৳300", badge: "🥈", cls: "from-slate-300 to-slate-500" },
    { rank: 3, artist: "সানজিদা রহমান", title: "বৃষ্টির সিঁড়ি", rating: 290, prize: "৳200", badge: "🥉", cls: "from-orange-300 to-pink-300" },
    { rank: 4, artist: "মাহমুদ হাসান", title: "রঙিন ছায়া", rating: 210, prize: "৳100", badge: "#4", cls: "from-violet-400 to-fuchsia-400" },
    { rank: 5, artist: "তাহসিন আলভি", title: "চোখের কথা", rating: 180, prize: "৳50", badge: "#5", cls: "from-emerald-400 to-cyan-400" },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 p-4 sm:p-6">
      <section className="card-glow rounded-3xl p-5 sm:p-7">
        <h1 className="text-3xl font-extrabold">সাপ্তাহিক শীর্ষ শিল্পী</h1>
        <p className="mt-2 text-sm font-bold text-zinc-300">
          ট্রফি ব্যাজ, রঙিন র‍্যাংকিং আর সবার চোখে থাকা টপ পারফরম্যান্স।
        </p>
        <WaveDivider />
      </section>

      <section className="card-glow rounded-3xl p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-300">
                <th>র‍্যাংক</th>
                <th>শিল্পী</th>
                <th>ছবি</th>
                <th>রেটিং</th>
                <th>পুরস্কার</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.rank} className="border-t border-white/5">
                  <td className="py-3">
                    <div className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${r.cls} px-3 py-2 text-xs font-extrabold text-black shadow-[0_0_20px_rgba(124,58,237,0.12)]`}>
                      <span>{r.badge}</span>
                      <span>#{r.rank}</span>
                    </div>
                  </td>
                  <td className="py-3 font-extrabold">{r.artist}</td>
                  <td className="py-3">
                    <span className="font-bold text-zinc-200">{r.title}</span>
                  </td>
                  <td className="py-3 font-extrabold text-amber-200">{r.rating}</td>
                  <td className="py-3">
                    <span className="rounded-xl bg-white/5 px-3 py-2 font-extrabold text-emerald-200">
                      {r.prize}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-glow rounded-3xl p-4 sm:p-6">
          <h2 className="text-xl font-extrabold">পুরস্কার ক্যালকুলেটর</h2>
          <p className="mt-1 text-sm font-bold text-zinc-300">যত বেশি রেটিং, তত বেশি সম্ভাব্য পুরস্কার।</p>
          <input type="range" min={0} max={2000} className="mt-4 w-full accent-pink-400" />
        </section>
        <section className="card-glow rounded-3xl p-4 sm:p-6">
          <h2 className="text-xl font-extrabold">গত সপ্তাহের বিজয়ী</h2>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="text-sm font-bold text-zinc-300">বিজয়ী</div>
              <div className="text-lg font-extrabold text-white">রাফি হাসান</div>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/competition" className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black">
              প্রতিযোগিতার বিস্তারিত
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
