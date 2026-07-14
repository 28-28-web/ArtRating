import type { Metadata } from "next";
import { AFFILIATE_TOOLS } from "@/app/lib/affiliate";

export const metadata: Metadata = {
  title: "Deep Art Effects vs PhotoAI | Paintify",
  description:
    "A head-to-head comparison of Deep Art Effects and PhotoAI — features, best use cases, and which one to pick for your photo.",
};

const rows: [string, string, string][] = [
  ["Core use case", "Painting-style filters on your own photos", "Stylized AI portraits/avatars from selfies"],
  ["Style count", "100+ presets (Van Gogh, Monet, oil, watercolor…)", "Curated portrait/avatar styles"],
  ["Batch processing", "Yes", "Limited"],
  ["Platforms", "Desktop (Win/Mac) + mobile", "Web-based"],
  ["Best for", "Turning existing photos into paintings", "Generating new stylized portraits"],
];

export default function Page() {
  const dae = AFFILIATE_TOOLS["deep-art-effects"];
  const pai = AFFILIATE_TOOLS.photoai;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Deep Art Effects vs PhotoAI</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Both turn photos into art with AI, but they solve different problems. Here&apos;s how
          they compare.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 dark:bg-white/5">
            <tr>
              <th className="p-3 font-medium">&nbsp;</th>
              <th className="p-3 font-medium">{dae.name}</th>
              <th className="p-3 font-medium">{pai.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, a, b]) => (
              <tr key={label} className="border-t border-black/10 dark:border-white/10">
                <td className="p-3 font-medium text-zinc-500">{label}</td>
                <td className="p-3">{a}</td>
                <td className="p-3">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[dae, pai].map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="rounded-xl bg-foreground px-4 py-3 text-center font-medium text-background hover:opacity-90"
          >
            Try {tool.name} →
          </a>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold">Verdict</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Want your existing photo to look like a Van Gogh or oil painting? Go with{" "}
          <strong>{dae.name}</strong>. Want a brand-new stylized AI portrait or avatar from your
          selfies? Go with <strong>{pai.name}</strong>.
        </p>
      </div>
    </main>
  );
}
