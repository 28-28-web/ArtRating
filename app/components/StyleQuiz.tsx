"use client";

import { useState } from "react";
import { SITE_URL } from "@/app/lib/site";

type StyleId = "van-gogh" | "watercolor" | "anime" | "oil-painting" | "monet" | "pop-art";

type StyleInfo = {
  name: string;
  keyword: string;
  description: string;
};

const STYLES: Record<StyleId, StyleInfo> = {
  "van-gogh": {
    name: "Van Gogh",
    keyword: "van gogh",
    description: "Bold, emotional, can't sit still.",
  },
  watercolor: {
    name: "Watercolor",
    keyword: "watercolor",
    description: "Soft-spoken, dreamy, goes with the flow.",
  },
  anime: {
    name: "Anime",
    keyword: "anime",
    description: "Expressive, a little dramatic, main-character energy.",
  },
  "oil-painting": {
    name: "Oil Painting",
    keyword: "oil painting",
    description: "Classic, composed, likes things done right.",
  },
  monet: {
    name: "Monet",
    keyword: "monet",
    description: "Calm, nature-loving, finds beauty in the little things.",
  },
  "pop-art": {
    name: "Pop Art",
    keyword: "pop art",
    description: "Loud, confident, lives for the spotlight.",
  },
};

type Option = { label: string; style: StyleId };
type Question = { question: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    question: "How do you start your morning?",
    options: [
      { label: "Blast music, dance while brushing teeth", style: "van-gogh" },
      { label: "Slow coffee, journal for ten minutes", style: "watercolor" },
      { label: "Open the windows, water the plants", style: "monet" },
      { label: "Pick today's outfit like it's a runway", style: "pop-art" },
    ],
  },
  {
    question: "Pick your favorite color.",
    options: [
      { label: "Swirling midnight blue", style: "van-gogh" },
      { label: "Bubblegum pink with sparkles", style: "anime" },
      { label: "Deep burgundy", style: "oil-painting" },
      { label: "Electric yellow", style: "pop-art" },
    ],
  },
  {
    question: "Ideal weekend plan?",
    options: [
      { label: "Spontaneous road trip, no plan at all", style: "van-gogh" },
      { label: "Picnic in a garden, watch the clouds drift", style: "watercolor" },
      { label: "Museum visit then a fancy dinner", style: "oil-painting" },
      { label: "Pop-up concert with friends, loud and bright", style: "pop-art" },
    ],
  },
  {
    question: "How do you make big decisions?",
    options: [
      { label: "Gut feeling — go with the emotion", style: "van-gogh" },
      { label: "Ask my group chat, then go bold", style: "anime" },
      { label: "Sleep on it, let it settle slowly", style: "monet" },
      { label: "Whatever's trending, I commit fast", style: "pop-art" },
    ],
  },
  {
    question: "Pick a home decor style.",
    options: [
      { label: "Soft linen, dried flowers, muted tones", style: "watercolor" },
      { label: "Fairy lights, figurines, cozy corner shelf", style: "anime" },
      { label: "Classic furniture, symmetry, everything matched", style: "oil-painting" },
      { label: "Garden view, natural light, plants everywhere", style: "monet" },
    ],
  },
];

function computeResult(answers: StyleId[]): StyleId {
  const scores: Record<StyleId, number> = {
    "van-gogh": 0,
    watercolor: 0,
    anime: 0,
    "oil-painting": 0,
    monet: 0,
    "pop-art": 0,
  };
  for (const style of answers) scores[style] += 1;
  return (Object.keys(scores) as StyleId[]).reduce((best, key) =>
    scores[key] > scores[best] ? key : best
  );
}

export default function StyleQuiz({
  onSelectStyle,
}: {
  onSelectStyle: (style: string) => void;
}) {
  const [answers, setAnswers] = useState<StyleId[]>([]);
  const [copied, setCopied] = useState(false);

  const currentIndex = answers.length;
  const isComplete = currentIndex >= QUESTIONS.length;
  const result = isComplete ? computeResult(answers) : null;

  function handleAnswer(style: StyleId) {
    setAnswers((prev) => [...prev, style]);
  }

  function handleRetake() {
    setAnswers([]);
    setCopied(false);
  }

  async function handleShare() {
    if (!result) return;
    const text = `I'm a ${STYLES[result].name} type! Find your art style →`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "What's Your Art Style?", text, url: SITE_URL });
      } catch {
        // user cancelled the share sheet
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text} ${SITE_URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border-2 border-dashed border-black/15 p-6 dark:border-white/15">
      {!isComplete && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-zinc-500">
            Question {currentIndex + 1} of {QUESTIONS.length}
          </p>
          <p className="font-medium">{QUESTIONS[currentIndex].question}</p>
          <div className="flex flex-col gap-2">
            {QUESTIONS[currentIndex].options.map((option) => (
              <button
                key={option.label}
                onClick={() => handleAnswer(option.style)}
                className="w-full rounded-xl border border-black/10 p-4 text-left text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isComplete && result && (
        <div className="flex flex-col items-center gap-3 text-center">
          <h3 className="text-xl font-semibold">You&apos;re a {STYLES[result].name} type!</h3>
          <p className="text-sm text-zinc-500">{STYLES[result].description}</p>

          <div className="mt-2 flex flex-col items-center gap-2">
            <button
              onClick={() => onSelectStyle(STYLES[result].keyword)}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Try this style on your photo →
            </button>
            <button
              onClick={handleShare}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              {copied ? "Copied!" : "Share your result"}
            </button>
            <button
              onClick={handleRetake}
              className="text-sm text-zinc-500 underline underline-offset-2 hover:text-foreground"
            >
              Retake quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
