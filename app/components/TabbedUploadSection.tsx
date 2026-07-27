"use client";

import { useState } from "react";
import UploadBox from "@/app/components/UploadBox";
import type { PreviewMode } from "@/app/lib/previewModes";

// Literal tab-based style selector, used only when mode.styleTabs is set
// (currently just HEADSHOT_MODE) — every other tool keeps the chat-based
// advisor via UploadChatSection. See the comment on PreviewMode.styleTabs.
export default function TabbedUploadSection({ mode }: { mode: PreviewMode }) {
  const tabs = mode.styleTabs ?? [];
  const [selectedStyle, setSelectedStyle] = useState<string>(tabs[0]?.id ?? mode.fallbackStyle);

  return (
    <section className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Headshot style">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selectedStyle === tab.id}
            onClick={() => setSelectedStyle(tab.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selectedStyle === tab.id
                ? "border-accent bg-[var(--border-soft)]/30 text-ink"
                : "border-border-soft text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <UploadBox selectedStyle={selectedStyle} mode={mode} />
    </section>
  );
}
