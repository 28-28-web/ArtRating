import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Independent of AnonymousUsage / the shared 6-generation cap on purpose —
// see the schema comment on PhotoMixDailyUsage for why photo-mix needs its
// own much stricter limit. This is checked in ADDITION to the shared cap in
// app/api/photo-mix/route.ts, not instead of it.
const PHOTO_MIX_DAILY_CAP = 1;

// Date-only (UTC) so the reset lines up with Cloudflare's 00:00 UTC Neuron
// reset — `new Date("YYYY-MM-DD")` parses as UTC midnight per the ECMAScript
// date-only string grammar, and the column is @db.Date (Postgres truncates
// to the date part regardless), so this needs no timezone adjustment.
function todayUtc(): Date {
  return new Date(new Date().toISOString().slice(0, 10));
}

export async function checkPhotoMixDailyCap(identityKey: string | null): Promise<{ allowed: boolean }> {
  if (!identityKey) return { allowed: true }; // no identity yet (shouldn't happen post-middleware, but matches the shared cap's own fallback)

  const usage = await prisma.photoMixDailyUsage.findUnique({
    where: { identityKey_usageDate: { identityKey, usageDate: todayUtc() } },
  });
  if (!usage || usage.count < PHOTO_MIX_DAILY_CAP) return { allowed: true };
  return { allowed: false };
}

// Only call after a photo-mix generation actually succeeded — mirrors
// recordSuccessfulGeneration's success-only design, called alongside it
// (not instead of it) from the route.
export async function recordPhotoMixDailyUsage(identityKey: string | null): Promise<void> {
  if (!identityKey) return;

  const usageDate = todayUtc();
  await prisma.photoMixDailyUsage.upsert({
    where: { identityKey_usageDate: { identityKey, usageDate } },
    create: { identityKey, usageDate, count: 1 },
    update: { count: { increment: 1 } },
  });
}

export function photoMixDailyCapResponse() {
  return NextResponse.json(
    {
      error: "photo-mix-daily-cap",
      message:
        "Photo Mix uses a more advanced AI model, so it's limited to 1 free try per day. Come back tomorrow, or check out the other tools in the meantime.",
    },
    { status: 429 }
  );
}
