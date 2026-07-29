"use client";

import { useState } from "react";
import PaintDab from "@/app/components/PaintDab";
import GenerationCounter from "@/app/components/GenerationCounter";
import DownloadButton from "@/app/components/DownloadButton";

const STYLES = [
  { id: "simple", label: "Simple", hint: "Thick lines, easy for kids" },
  { id: "detailed", label: "Detailed", hint: "Fine lines, for adults" },
  { id: "mandala", label: "Mandala", hint: "Geometric patterns" },
  { id: "cartoon", label: "Cartoon", hint: "Bold outlines, fun style" },
] as const;

type StyleId = (typeof STYLES)[number]["id"];

type Example = {
  prompt: string;
  style: StyleId;
  label: string;
  icon: React.ReactNode;
};

// Hand-authored line-art SVG thumbnails, not stock photos — a photo can't
// honestly represent what a black-and-white printable coloring page looks
// like, so these are simple original vector icons instead. One per SEO
// category (Animals / Fantasy / Holidays / Mandalas / Nature / Cartoon).
function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" stroke="#1a1a1a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="97" height="97" rx="8" fill="#ffffff" stroke="#d8d8d8" strokeWidth={2} />
      {children}
    </svg>
  );
}

const EXAMPLES: Example[] = [
  {
    label: "Animals",
    prompt: "a cute cat sitting in a garden",
    style: "simple",
    icon: (
      <IconWrap>
        <circle cx="50" cy="55" r="22" />
        <path d="M32 40 L28 22 L42 34 Z" />
        <path d="M68 40 L72 22 L58 34 Z" />
        <circle cx="42" cy="52" r="2.5" fill="#1a1a1a" />
        <circle cx="58" cy="52" r="2.5" fill="#1a1a1a" />
        <path d="M45 62 Q50 66 55 62" />
        <path d="M50 77 Q70 82 74 66" />
      </IconWrap>
    ),
  },
  {
    label: "Fantasy",
    prompt: "a magical unicorn with a rainbow mane",
    style: "detailed",
    icon: (
      <IconWrap>
        <path d="M30 70 L38 40 L55 30 L50 45 L70 35 L58 52 L62 70" />
        <circle cx="52" cy="42" r="3" fill="#1a1a1a" />
        <path d="M55 30 L62 18" />
        <path d="M38 40 Q34 55 30 70" />
        <path d="M40 70 L36 85 M48 70 L46 85 M56 70 L58 85" />
      </IconWrap>
    ),
  },
  {
    label: "Holidays",
    prompt: "a decorated christmas tree with ornaments",
    style: "cartoon",
    icon: (
      <IconWrap>
        <path d="M50 15 L38 35 L44 35 L30 55 L38 55 L24 78 L76 78 L62 55 L70 55 L56 35 L62 35 Z" />
        <rect x="44" y="78" width="12" height="10" />
        <circle cx="50" cy="20" r="3" fill="#1a1a1a" />
        <circle cx="42" cy="48" r="2.5" />
        <circle cx="58" cy="48" r="2.5" />
        <circle cx="35" cy="68" r="2.5" />
        <circle cx="65" cy="68" r="2.5" />
      </IconWrap>
    ),
  },
  {
    label: "Mandalas",
    prompt: "a detailed mandala pattern with flowers",
    style: "mandala",
    icon: (
      <IconWrap>
        <circle cx="50" cy="50" r="32" />
        <circle cx="50" cy="50" r="20" />
        <circle cx="50" cy="50" r="6" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="50"
            x2={50 + 32 * Math.cos((deg * Math.PI) / 180)}
            y2={50 + 32 * Math.sin((deg * Math.PI) / 180)}
          />
        ))}
      </IconWrap>
    ),
  },
  {
    label: "Nature",
    prompt: "a big oak tree with birds in the branches",
    style: "simple",
    icon: (
      <IconWrap>
        <path d="M50 85 L50 55" />
        <path d="M50 60 Q30 55 28 35 Q35 40 40 32 Q42 20 50 18 Q58 20 60 32 Q65 40 72 35 Q70 55 50 60 Z" />
        <path d="M20 82 Q35 68 48 82" />
        <path d="M52 82 Q65 68 80 82" />
      </IconWrap>
    ),
  },
  {
    label: "Cartoon",
    prompt: "a cartoon rocket ship flying through space",
    style: "cartoon",
    icon: (
      <IconWrap>
        <path d="M50 15 Q65 35 60 65 L40 65 Q35 35 50 15 Z" />
        <circle cx="50" cy="38" r="6" />
        <path d="M40 65 L32 80 L44 72 Z" />
        <path d="M60 65 L68 80 L56 72 Z" />
        <path d="M44 65 L44 78 M56 65 L56 78" />
      </IconWrap>
    ),
  },
];

export default function ColoringPageClient() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<StyleId>("simple");
  const [image, setImage] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capMessage, setCapMessage] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);

  async function generate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    setCapMessage(null);
    try {
      const res = await fetch("/api/generate-coloring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style }),
      });
      const data = await res.json();

      if (res.status === 429) {
        setCapMessage(data.message || "You've used all your free generations.");
        return;
      }
      if (!res.ok || data.error || !data.image) {
        setError(data.error || "Preview generation temporarily unavailable");
        return;
      }
      setImage(data.image);
      setGenerationId(data.generationId ?? null);
      setGenerationCount((n) => n + 1);
    } catch {
      setError("Preview generation temporarily unavailable");
    } finally {
      setGenerating(false);
    }
  }

  function downloadFree() {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "coloring-page.png";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="tool-card w-full max-w-md">
        <div className="mb-3 flex items-center gap-2">
          <PaintDab />
          <span className="font-flourish text-lg text-ink-soft">Describe your coloring page</span>
        </div>

        <div className="tool-card-content flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="a cute cat sitting in a garden"
            rows={3}
            className="w-full rounded-2xl border border-border-soft bg-transparent p-4 text-sm text-ink outline-none focus:border-accent"
          />

          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Coloring page style">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={style === s.id}
                onClick={() => setStyle(s.id)}
                title={s.hint}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  style === s.id
                    ? "border-accent bg-[var(--border-soft)]/30 text-ink"
                    : "border-border-soft text-ink-soft hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div>
            <GenerationCounter refreshSignal={generationCount} pool="coloring" />
          </div>

          <button
            onClick={generate}
            disabled={generating || !prompt.trim()}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas disabled:opacity-50"
          >
            {generating ? "Generating…" : "Generate Coloring Page"}
          </button>

          {generating && (
            <div className="progress-bar-track" role="progressbar" aria-label="Generating your coloring page" aria-valuetext="Generating">
              <div className="progress-bar-fill" />
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          {capMessage && (
            <div className="gate-notice flex flex-col items-center gap-2 p-4 text-center">
              <PaintDab size={14} />
              <p className="font-display text-sm font-semibold text-ink">{capMessage}</p>
            </div>
          )}

          {image && (
            <div className="flex flex-col items-center gap-3 border-t border-border-soft pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="AI coloring page generated from your prompt (watermarked preview)" className="max-h-96 w-full rounded-lg border border-border-soft object-contain bg-white" />
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={downloadFree}
                  className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent-text"
                >
                  Download Free (with watermark)
                </button>
                <DownloadButton generationId={generationId} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-sm text-ink-soft">Examples — click to try this prompt</p>
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setPrompt(ex.prompt);
                setStyle(ex.style);
              }}
              aria-label={`${ex.label} coloring page example — click to try this prompt`}
              className="flex flex-col items-center gap-2 rounded-xl p-2 text-center hover:opacity-80"
            >
              <div className="aspect-square w-full max-w-32">{ex.icon}</div>
              <span className="text-xs font-medium text-ink-soft">{ex.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
