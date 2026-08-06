import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Daily free-generation cap for LOGGED-IN headshot users only. Anonymous
// visitors are untouched — still governed solely by the shared 2-total
// AnonymousUsage cap in generationGate.ts. Exists because headshot now
// costs real Neurons per call (flux-2-dev), unlike the free tools, so
// "unlimited for logged-in" isn't safe here. Generation stays entirely
// free either way — hitting this cap does NOT unlock via spending a
// credit; credits only ever pay for the download (1 credit), unchanged.
// Configurable so the free/cost balance can be tuned without touching the
// route.
export const HEADSHOT_DAILY_FREE_CAP = 15;

// Literal "YYYY-MM-DD" in UTC — matches Cloudflare's 00:00 UTC Neuron reset,
// same convention as PhotoMixDailyUsage.
function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function checkHeadshotDailyCap(userId: string): Promise<{ allowed: boolean }> {
  const usageDate = todayUtc();
  const usage = await prisma.headshotDailyUsage.findUnique({
    where: { userId_usageDate: { userId, usageDate } },
  });
  if (!usage || usage.count < HEADSHOT_DAILY_FREE_CAP) return { allowed: true };
  return { allowed: false };
}

// Only call after a generation actually succeeded — mirrors
// recordSuccessfulGeneration's success-only discipline.
export async function recordHeadshotDailyUsage(userId: string): Promise<void> {
  const usageDate = todayUtc();
  await prisma.headshotDailyUsage.upsert({
    where: { userId_usageDate: { userId, usageDate } },
    create: { userId, usageDate, count: 1 },
    update: { count: { increment: 1 } },
  });
}

export function headshotDailyCapResponse() {
  return NextResponse.json(
    {
      error: "headshot-daily-cap",
      message: `You've used all ${HEADSHOT_DAILY_FREE_CAP} free headshots today. More free generations open up at 00:00 UTC — in the meantime, credits let you download anything you've already generated.`,
    },
    { status: 402 }
  );
}
