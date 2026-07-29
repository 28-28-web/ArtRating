import { NextResponse } from "next/server";
import { FREE_GENERATION_CAP } from "@/app/lib/generationGate";

// Generation itself is never login-gated anymore — this is the only
// response the cap check produces, and it's a 429 (rate/quota limit), not
// 401/402, since no login or payment unlocks more generations at this step.
export function capReachedResponse(userId: string | null, cap: number = FREE_GENERATION_CAP) {
  return NextResponse.json(
    {
      error: "cap-reached",
      message: userId
        ? `You've used all ${cap} free generations on this account.`
        : `You've used all ${cap} free generations. Log in for ${cap} more, free.`,
    },
    { status: 429 }
  );
}
