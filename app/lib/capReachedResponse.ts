import { NextResponse } from "next/server";
import { FREE_GENERATION_CAP } from "@/app/lib/generationGate";

export function capReachedResponse(_userId: string | null, _cap: number = FREE_GENERATION_CAP) {
  return NextResponse.json(
    {
      error: "cap-reached",
      // Shown inline in the upload box — instructs anon visitors to sign in.
      // Logged-in users never hit this path (checkGenerationEligibility lets
      // them through unconditionally), so the copy only needs to address anon.
      message: `You've used all ${FREE_GENERATION_CAP} free previews — sign in to continue generating.`,
    },
    { status: 429 }
  );
}
