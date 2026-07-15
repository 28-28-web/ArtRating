"use client";

import UploadBox from "@/app/components/UploadBox";
import ChatWidget from "@/app/components/ChatWidget";

export default function UploadChatSection({
  selectedStyle,
  onStyleChange,
}: {
  selectedStyle: string | null;
  onStyleChange: (style: string) => void;
}) {
  return (
    <section className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      <UploadBox selectedStyle={selectedStyle} />
      <ChatWidget onStyleDetected={onStyleChange} />
    </section>
  );
}
