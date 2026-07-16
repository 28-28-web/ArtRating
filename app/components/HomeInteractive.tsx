"use client";

import { useRef, useState } from "react";
import UploadChatSection from "@/app/components/UploadChatSection";
import StyleQuiz from "@/app/components/StyleQuiz";
import BrushDivider from "@/app/components/BrushDivider";

export default function HomeInteractive() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  function handleQuizResult(style: string) {
    setSelectedStyle(style);
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div ref={uploadRef} className="w-full">
        <UploadChatSection selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
      </div>

      <section className="flex w-full flex-col items-center gap-2">
        <h2 className="font-display text-xl font-semibold text-ink">Not Sure Which Style Fits You?</h2>
        <BrushDivider className="mb-4" />
        <StyleQuiz onSelectStyle={handleQuizResult} />
      </section>
    </>
  );
}
