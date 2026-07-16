import type { Metadata } from "next";
import { AFFILIATE_TOOLS } from "@/app/lib/affiliate";
import BrushDivider from "@/app/components/BrushDivider";

export const metadata: Metadata = {
  title: "Best Photo-to-Painting AI Tools 2026 | Paintify",
  description:
    "Our ranked picks for the best AI tools that turn photos into paintings in 2026, including Deep Art Effects and PhotoAI.",
};

const tools = [
  {
    ...AFFILIATE_TOOLS["deep-art-effects"],
    rank: 1,
    notes:
      "100+ painting styles, batch processing, and desktop apps make it the strongest all-round pick for classic painting looks.",
  },
  {
    ...AFFILIATE_TOOLS.photoai,
    rank: 2,
    notes:
      "Best if you want stylized AI portraits or avatars from a handful of selfies rather than a painterly filter on an existing photo.",
  },
];

const honorableMentions = ["Prisma", "VanceAI", "Fotor AI Art Effects"];

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Best Photo-to-Painting AI Tools 2026
        </h1>
        <BrushDivider className="mt-1" />
        <p className="mt-3 text-ink-soft">
          We tested style range, output quality, and ease of use to rank the AI tools worth paying
          for this year.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className="rounded-2xl border border-border-soft p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ink">
                #{tool.rank}. {tool.name}
              </h2>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-canvas hover:opacity-90"
              >
                Visit {tool.name} →
              </a>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{tool.tagline}</p>
            <p className="mt-3 text-ink">{tool.notes}</p>
            <p className="mt-2 text-sm text-ink-soft">
              <span className="font-medium text-ink">Best for:</span> {tool.bestFor}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border-soft p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Honorable mentions</h2>
        <p className="mt-2 text-ink-soft">
          {honorableMentions.join(", ")} are also worth a look if the two picks above don&apos;t
          fit your workflow.
        </p>
      </div>
    </main>
  );
}
