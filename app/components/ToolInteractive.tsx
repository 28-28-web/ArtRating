"use client";

import { useState } from "react";
import UploadChatSection from "@/app/components/UploadChatSection";
import TabbedUploadSection from "@/app/components/TabbedUploadSection";
import PhotoMixInteractive from "@/app/components/PhotoMixInteractive";
import { HEADSHOT_MODE, type PreviewMode } from "@/app/lib/previewModes";

export default function ToolInteractive({ mode = HEADSHOT_MODE }: { mode?: PreviewMode }) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  if (mode.requiresTwoImages) {
    return <PhotoMixInteractive mode={mode} />;
  }

  if (mode.styleTabs) {
    return <TabbedUploadSection mode={mode} />;
  }

  return (
    <UploadChatSection
      selectedStyle={selectedStyle}
      onStyleChange={setSelectedStyle}
      mode={mode}
    />
  );
}
