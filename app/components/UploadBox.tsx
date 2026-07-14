"use client";

import { useRef, useState } from "react";
import { AFFILIATE_TOOLS } from "@/app/lib/affiliate";

export default function UploadBox() {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
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
        <div className="mt-4 flex flex-col gap-2">
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
