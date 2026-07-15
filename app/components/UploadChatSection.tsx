"use client";

import UploadBox from "@/app/components/UploadBox";
import ChatWidget from "@/app/components/ChatWidget";
import { ART_STYLE_MODE, type PreviewMode } from "@/app/lib/previewModes";

export default function UploadChatSection({
  selectedStyle,
  onStyleChange,
  mode = ART_STYLE_MODE,
}: {
  selectedStyle: string | null;
  onStyleChange: (style: string) => void;
  mode?: PreviewMode;
}) {
  return (
    <section className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      <UploadBox selectedStyle={selectedStyle} mode={mode} />
      <ChatWidget onStyleDetected={onStyleChange} mode={mode} />
    </section>
  );
}
