"use client";

import TabbedUploadSection from "@/app/components/TabbedUploadSection";
import { HEADSHOT_MODE, type PreviewMode } from "@/app/lib/previewModes";

export default function ToolInteractive({ mode = HEADSHOT_MODE }: { mode?: PreviewMode }) {
  if (mode.styleTabs) {
    return <TabbedUploadSection mode={mode} />;
  }
  // Fallback — currently all tools use styleTabs; keep for type safety.
  return <TabbedUploadSection mode={mode} />;
}
