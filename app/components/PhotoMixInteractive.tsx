"use client";

import PhotoMixBox from "@/app/components/PhotoMixBox";
import ChatWidget from "@/app/components/ChatWidget";
import type { PreviewMode } from "@/app/lib/previewModes";

export default function PhotoMixInteractive({ mode }: { mode: PreviewMode }) {
  return (
    <section className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      <PhotoMixBox mode={mode} />
      <ChatWidget mode={mode} />
    </section>
  );
}
