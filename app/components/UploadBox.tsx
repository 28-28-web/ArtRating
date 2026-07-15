"use client";

import { useRef, useState } from "react";
import { AFFILIATE_TOOLS } from "@/app/lib/affiliate";

const WATERMARK_TEXT = "PAINTIFY PREVIEW";

function watermarkAndResize(srcDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, 256, 256);
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.textAlign = "center";
      ctx.fillText(WATERMARK_TEXT, 128, 240);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = () => reject(new Error("Failed to load generated image"));
    img.src = srcDataUrl;
  });
}

export default function UploadBox({
  selectedStyle,
}: {
  selectedStyle?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setAiPreview(null);
      setPreviewError(null);
    };
    reader.readAsDataURL(file);
  }

  async function generatePreview() {
    if (!preview) return;
    setGenerating(true);
    setPreviewError(null);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: selectedStyle ?? "stylized painting", image: preview }),
      });
      const data = await res.json();
      if (!res.ok || data.error || !data.image) {
        setPreviewError(data.error || "Preview generation temporarily unavailable");
        return;
      }
      const watermarked = await watermarkAndResize(data.image);
      setAiPreview(watermarked);
    } catch {
      setPreviewError("Preview generation temporarily unavailable");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-md">
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
          dragOver
            ? "border-foreground bg-black/5 dark:bg-white/5"
            : "border-black/15 dark:border-white/15"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Your uploaded photo" className="max-h-48 rounded-lg object-contain" />
        ) : (
          <>
            <p className="font-medium">Drop a photo here or click to upload</p>
            <p className="text-sm text-zinc-500">JPG or PNG · stays on your device</p>
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

      {preview && (
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={generatePreview}
            disabled={generating}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            {generating ? "Generating…" : "Generate Free Preview"}
          </button>

          {previewError && <p className="text-sm text-red-500">{previewError}</p>}

          {aiPreview && (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-black/10 p-3 dark:border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={aiPreview}
                alt="AI-generated style preview"
                width={256}
                height={256}
                className="rounded-lg"
              />
              <p className="text-center text-sm text-zinc-500">
                এটা তো প্রিভিউ মাত্র! Full HD, watermark-ছাড়া ভার্সন পেতে →
              </p>
              <a
                href={AFFILIATE_TOOLS["deep-art-effects"].url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Try {AFFILIATE_TOOLS["deep-art-effects"].name} →
              </a>
            </div>
          )}

          <p className="text-sm text-zinc-500">
            Nice photo! Turn it into a painting with one of our recommended tools:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(AFFILIATE_TOOLS).map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
              >
                {tool.name} →
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
