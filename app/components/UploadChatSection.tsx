"use client";

import { useState } from "react";
import UploadBox from "@/app/components/UploadBox";
import ChatWidget from "@/app/components/ChatWidget";

export default function UploadChatSection() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  return (
    <section className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
      <UploadBox selectedStyle={selectedStyle} />
      <ChatWidget onStyleDetected={setSelectedStyle} />
    </section>
  );
}
