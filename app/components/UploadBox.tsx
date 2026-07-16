"use client";

import { useRef, useState } from "react";
import { ART_STYLE_MODE, type PreviewMode } from "@/app/lib/previewModes";
import GenerationGateNotice from "@/app/components/GenerationGateNotice";
import PaintDab from "@/app/components/PaintDab";

export default function UploadBox({
  selectedStyle,
  mode = ART_STYLE_MODE,
}: {
  selectedStyle?: string | null;
  mode?: PreviewMode;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [gate, setGate] = useState<"needs-login" | "needs-payment" | null>(null);
  const [showShareLinks, setShowShareLinks] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "My AI preview",
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

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setAiPreview(null);
      setPreviewError(null);
      setGate(null);
    };
    reader.readAsDataURL(file);
  }

  async function generatePreview() {
    if (!preview) return;
    setGenerating(true);
    setPreviewError(null);
    setGate(null);
    try {
      const res = await fetch(mode.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: selectedStyle ?? mode.fallbackStyle, image: preview }),
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

  return (
    <div className="tool-card w-full max-w-md">
      <div className="mb-3 flex items-center gap-2">
        <PaintDab />
        <span className="font-flourish text-lg text-ink-soft">{mode.cardTagline}</span>
      </div>

      <div className="tool-card-content">
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
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex min-h-52 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
            dragOver ? "border-accent bg-[var(--border-soft)]/30" : "border-border-soft"
          }`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Your uploaded photo" className="max-h-48 rounded-lg object-contain" />
          ) : (
            <>
              <p className="font-medium text-ink">Drop a photo here or click to upload</p>
              <p className="text-sm text-ink-soft">JPG or PNG · stays on your device</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {mode.disclaimer && <p className="mt-2 text-xs text-ink-soft">{mode.disclaimer}</p>}

        {preview && (
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={generatePreview}
              disabled={generating}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas disabled:opacity-50"
            >
              {generating ? "Generating…" : "Generate Free Preview"}
            </button>

            {previewError && <p className="text-sm text-red-600">{previewError}</p>}

            {gate && <GenerationGateNotice kind={gate} onAuthenticated={generatePreview} />}

            {aiPreview && (
              <div className="flex flex-col items-center gap-2 border-t border-border-soft pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={aiPreview}
                  alt="AI-generated style preview"
                  className="max-h-96 w-full rounded-lg object-contain"
                />
                <p className="text-center text-sm text-ink-soft">{mode.resultCaption}</p>

                {mode.ctaTool && (
                  <a
                    href={mode.ctaTool.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas hover:opacity-90"
                  >
                    Try {mode.ctaTool.name} →
                  </a>
                )}

                {mode.bottomActions?.includes("download") && (
                  <a
                    href={aiPreview}
                    download={`${mode.id ?? "paintify"}-preview.jpg`}
                    className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas hover:opacity-90"
                  >
                    Download
                  </a>
                )}

                {mode.bottomActions?.includes("share") && (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent-text"
                    >
                      Share
                    </button>
                    {showShareLinks && (
                      <div className="flex gap-2 text-sm">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `Check out my AI preview! ${typeof window !== "undefined" ? window.location.href : ""}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-soft hover:text-accent-text"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            typeof window !== "undefined" ? window.location.href : ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-soft hover:text-accent-text"
                        >
                          Facebook
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {mode.bottomToolsCaption && mode.bottomTools && mode.bottomTools.length > 0 && (
              <>
                <p className="text-sm text-ink-soft">{mode.bottomToolsCaption}</p>
                <div className="flex flex-wrap gap-2">
                  {mode.bottomTools.map((tool) => (
                    <a
                      key={tool.id}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="rounded-full border border-border-soft px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent-text"
                    >
                      {tool.name} →
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
