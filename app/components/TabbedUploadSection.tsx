"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import UploadBox from "@/app/components/UploadBox";
import type { PreviewMode } from "@/app/lib/previewModes";
import {
  HEADSHOT_STYLES,
  HEADSHOT_STYLE_GROUPS,
  GROUP_LABELS,
} from "@/app/lib/headshotStyles";

export default function TabbedUploadSection({ mode }: { mode: PreviewMode }) {
  const [selectedStyle, setSelectedStyle] = useState<string>("linkedin");
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function selectFromDropdown(id: string) {
    setSelectedStyle(id);
    const btn = buttonRefs.current[id];
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  return (
    <section className="flex w-full flex-col items-center gap-6">
      {/* ── Quick-jump dropdown ───────────────────────────────────────────── */}
      <div className="w-full flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
        <label
          htmlFor="style-quick-select"
          className="text-sm text-ink-soft whitespace-nowrap"
        >
          Or jump to a style:
        </label>
        <select
          id="style-quick-select"
          value={selectedStyle}
          onChange={(e) => selectFromDropdown(e.target.value)}
          className="w-full sm:flex-1 rounded-lg border border-border-soft bg-canvas text-ink text-sm px-3 py-2 focus:outline-none focus:border-accent cursor-pointer"
        >
          {HEADSHOT_STYLE_GROUPS.map((group) => (
            <optgroup key={group} label={GROUP_LABELS[group]}>
              {HEADSHOT_STYLES.filter((s) => s.group === group).map((style) => (
                <option key={style.id} value={style.id}>
                  {style.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* ── Grouped thumbnail grid ────────────────────────────────────────── */}
      {HEADSHOT_STYLE_GROUPS.map((group) => {
        const styles = HEADSHOT_STYLES.filter((s) => s.group === group);
        return (
          <div key={group} className="w-full flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft px-1">
              {GROUP_LABELS[group]}
            </p>
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none" }}
              role="tablist"
              aria-label={GROUP_LABELS[group]}
            >
              {styles.map((style) => (
                <button
                  key={style.id}
                  ref={(el) => { buttonRefs.current[style.id] = el; }}
                  type="button"
                  role="tab"
                  aria-selected={selectedStyle === style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`relative flex-none w-24 rounded-xl overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    selectedStyle === style.id
                      ? "border-accent shadow-md"
                      : "border-border-soft hover:border-ink-soft"
                  }`}
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={style.exampleImage}
                    alt={`${style.label} headshot style example`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                  {/* Colored badge — top-right pill */}
                  <span
                    className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white leading-none"
                    style={{ backgroundColor: style.badgeColor + "DD" }}
                    aria-hidden="true"
                  >
                    {style.label.split(" ")[0]}
                  </span>
                  {/* Name overlay — bottom gradient */}
                  <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/65 to-transparent px-1.5 py-1.5 text-[10px] font-medium text-white leading-tight text-left">
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <UploadBox selectedStyle={selectedStyle} mode={mode} />
    </section>
  );
}
