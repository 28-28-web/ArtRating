import { NextResponse } from "next/server";
import { FREE_GENERATION_CAP } from "@/app/lib/generationGate";

// Generation itself is never login-gated anymore — this is the only
// response the cap check produces, and it's a 429 (rate/quota limit), not
// 401/402, since no login or payment unlocks more generations at this step.
export function capReachedResponse(userId: string | null) {
  return NextResponse.json(
    {
      error: "cap-reached",
      message: userId
        ? `You've used all ${FREE_GENERATION_CAP} free generations on this account.`
        : `You've used all ${FREE_GENERATION_CAP} free generations. Log in for ${FREE_GENERATION_CAP} more, free.`,
    },
    { status: 429 }
  );
}
