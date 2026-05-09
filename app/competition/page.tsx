import Link from "next/link";
import { WeekCountdown } from "@/components/WeekCountdown";
import { WaveDivider } from "@/components/WaveDivider";

export default function CompetitionPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 p-4 sm:p-6">
      <section className="card-glow rounded-3xl p-5 sm:p-7">
        <h1 className="text-3xl font-extrabold">প্রতিযোগিতা</h1>
        <p className="mt-2 text-sm font-bold text-zinc-300">
          প্রতি রবিবার নির্দিষ্ট সময়ের মধ্যে সবচেয়ে বেশি রেটিং পাওয়া শিল্পী পাবেন পুরস্কার।
        </p>
        <WeekCountdown />
        <WaveDivider />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl card-glow p-4 sm:p-6">
          <h2 className="text-xl font-extrabold">কীভাবে জিতবেন?</h2>
          <ol className="mt-3 space-y-2 text-sm font-bold text-zinc-200">
            <li>১) আপনার ছবি আপলোড করুন</li>
            <li>২) কমিউনিটি রেটিং দেবে</li>
            <li>৩) সাপ্তাহিক টপ গুনবে পুরস্কার</li>
          </ol>
          <div className="mt-4">
            <Link href="/upload" className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-extrabold text-black">
              এখনই আপলোড করুন
            </Link>
          </div>
        </div>

        <div className="rounded-3xl card-glow p-4 sm:p-6">
          <h2 className="text-xl font-extrabold">উদাহরণ বিজয়ী</h2>
          <div className="mt-3 rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <div className="text-sm font-bold text-zinc-300">গত সপ্তাহের বিজয়ী</div>
                <div className="text-lg font-extrabold">রাফি হাসান</div>
              </div>
            </div>
            <div className="mt-3 text-sm font-bold text-zinc-200">পুরস্কার: ৳400</div>
          </div>
          <div className="mt-4">
            <Link href="/leaderboard" className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-extrabold text-black">
              ট্রফি টেবিল দেখুন
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

