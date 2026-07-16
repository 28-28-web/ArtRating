"use client";

import { useRef, useState } from "react";
import type { PreviewMode } from "@/app/lib/previewModes";
import GenerationGateNotice from "@/app/components/GenerationGateNotice";

function PhotoPanel({
  label,
  hint,
  preview,
  onFile,
}: {
  label: string;
  hint: string;
  preview: string | null;
  onFile: (file: File | undefined) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-sm font-medium">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition-colors ${
          dragOver
            ? "border-foreground bg-black/5 dark:bg-white/5"
            : "border-black/15 dark:border-white/15"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="max-h-32 rounded-lg object-contain" />
        ) : (
          <>
            <p className="text-sm font-medium">Drop a photo or click to upload</p>
            <p className="text-xs text-zinc-500">{hint}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

export default function PhotoMixBox({ mode }: { mode: PreviewMode }) {
  const [previewA, setPreviewA] = useState<string | null>(null);
  const [previewB, setPreviewB] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [gate, setGate] = useState<"needs-login" | "needs-payment" | null>(null);
  const [showShareLinks, setShowShareLinks] = useState(false);

  function readFile(file: File | undefined, onDone: (dataUrl: string) => void) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      onDone(reader.result as string);
      setAiPreview(null);
      setPreviewError(null);
      setGate(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "My AI photo mix",
          text: mode.resultCaption,
          url: window.location.href,
        });
        return;
      } catch {
        // fall through to manual share links
      }
    }
    setShowShareLinks((v) => !v);
  }

  async function generatePreview() {
    if (!previewA || !previewB || !consent) return;
    setGenerating(true);
    setPreviewError(null);
    setGate(null);
    try {
      const res = await fetch(mode.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageA: previewA, imageB: previewB, consent }),
      });

      if (res.status === 401) {
        setGate("needs-login");
        return;
      }
      if (res.status === 402) {
        setGate("needs-payment");
        return;
      }

      const data = await res.json();
      if (!res.ok || data.error || !data.image) {
        setPreviewError(data.error || "Preview generation temporarily unavailable");
        return;
      }
      setAiPreview(data.image);
    } catch {
      setPreviewError("Preview generation temporarily unavailable");
    } finally {
      setGenerating(false);
    }
  }

  const canGenerate = Boolean(previewA && previewB && consent);

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-4 sm:flex-row">
        <PhotoPanel
          label="Your photo"
          hint="JPG or PNG · stays on your device"
          preview={previewA}
          onFile={(file) => readFile(file, setPreviewA)}
        />
        <PhotoPanel
          label="Your pet or favorite thing"
          hint="JPG or PNG · stays on your device"
          preview={previewB}
          onFile={(file) => readFile(file, setPreviewB)}
        />
      </div>

      {mode.disclaimer && <p className="mt-2 text-xs text-zinc-400">{mode.disclaimer}</p>}

      {previewB && (
        <label className="mt-3 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
          />
          <span>{mode.consentCheckboxLabel}</span>
        </label>
      )}

      {(previewA || previewB) && (
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={generatePreview}
            disabled={!canGenerate || generating}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {generating ? "Generating…" : "Generate Free Preview"}
          </button>

          {previewError && <p className="text-sm text-red-500">{previewError}</p>}

          {gate && <GenerationGateNotice kind={gate} onAuthenticated={generatePreview} />}

          {aiPreview && (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-black/10 p-3 dark:border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={aiPreview}
                alt="AI-generated photo mix preview"
                className="max-h-96 w-full rounded-lg object-contain"
              />
              <p className="text-center text-sm text-zinc-500">{mode.resultCaption}</p>

              {mode.bottomActions?.includes("download") && (
                <a
                  href={aiPreview}
                  download={`${mode.id ?? "paintify"}-preview.jpg`}
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                >
                  Download
                </a>
              )}

              {mode.bottomActions?.includes("share") && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    Share
                  </button>
                  {showShareLinks && (
                    <div className="flex gap-2 text-sm">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Check out my AI photo mix! ${typeof window !== "undefined" ? window.location.href : ""}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-foreground"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          typeof window !== "undefined" ? window.location.href : ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-foreground"
                      >
                        Facebook
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
