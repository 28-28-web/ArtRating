import Link from "next/link";
import { WaveDivider } from "@/components/WaveDivider";

const posts = [
  { id: "1", title: "এই সপ্তাহের আর্ট স্টোরি", author: "তানভীর", replies: 12 },
  { id: "2", title: "কিভাবে স্কেচ থেকে ফাইনাল আর্ট হয়?", author: "সাবিনা", replies: 7 },
];

export default function ForumPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 p-4 sm:p-6">
      <section className="card-glow rounded-3xl p-5 sm:p-7">
        <h1 className="text-3xl font-extrabold">ফোরাম</h1>
        <p className="mt-2 text-sm font-bold text-zinc-300">শিল্পীদের গল্প, প্রশ্ন-উত্তর এবং মতবিনিময়।</p>
        <WaveDivider />
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/10 p-4 sm:p-6">
        <div className="space-y-3">
          {posts.map((p) => (
            <article key={p.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold">{p.title}</h2>
                <span className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 px-3 py-1 text-xs font-extrabold text-black">
                  {p.replies} রিপ্লাই
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-300">
                লেখক: <span className="font-extrabold">{p.author}</span>
              </p>
              <Link href={`/art/ART-2026-00001`} className="mt-3 inline-flex rounded-xl bg-white/5 px-4 py-2 text-sm font-extrabold hover:bg-white/10">
                আলোচনায় যান
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

