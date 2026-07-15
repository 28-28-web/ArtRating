"use client";

import { useState } from "react";
import UploadChatSection from "@/app/components/UploadChatSection";
import { HEADSHOT_MODE } from "@/app/lib/previewModes";

export default function HeadshotInteractive() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  return (
    <UploadChatSection
      selectedStyle={selectedStyle}
      onStyleChange={setSelectedStyle}
      mode={HEADSHOT_MODE}
    />
  );
}
