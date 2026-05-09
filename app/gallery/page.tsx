import Link from "next/link";
import { ProtectedImage } from "@/components/ProtectedImage";
import { WaveDivider } from "@/components/WaveDivider";
import { demoArtworks } from "@/lib/demo";

export default function GalleryPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-6">
      <section className="card-glow rounded-3xl p-5 sm:p-7">
        <h1 className="text-3xl font-extrabold">সব ছবি</h1>
        <p className="mt-2 text-sm font-bold text-zinc-300">
          শুধুমাত্র অ্যাডমিন অনুমোদিত ছবিগুলো এখানে দেখা যাবে।
        </p>
        <WaveDivider />
      </section>

      <section className="rounded-3xl card-glow p-4 sm:p-6">
        <div className="columns-1 gap-4 sm:columns-2">
          {demoArtworks.map((art) => (
            <article
              key={art.artId}
              className="mb-4 break-inside-avoid rounded-2xl border border-white/10 bg-black/10 p-3"
            >
              <ProtectedImage src={art.imageUrl} artId={art.artId} alt={art.title} />
              <div className="mt-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-extrabold">{art.title}</p>
                  <Link
                    href={`/art/${art.artId}`}
                    className="rounded-lg bg-white/5 px-2 py-1 text-xs font-extrabold text-zinc-100"
                  >
                    রেট দিন
                  </Link>
                </div>
                <p className="mt-1 text-zinc-300">ART ID: {art.artId}</p>
                <p className="text-zinc-300">শিল্পী: {art.artist}</p>
                <p className="text-zinc-200">
                  রেটিং:{" "}
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300">
                    {art.ratings}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

