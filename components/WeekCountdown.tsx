"use client";

import { useEffect, useMemo, useState } from "react";

function formatBanglaNumber(n: number) {
  return new Intl.NumberFormat("bn-BD").format(n);
}

function computeTarget() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const targetDay = 0; // Sunday
  let daysUntil = (targetDay - day + 7) % 7;

  // If it's Sunday already, decide based on time.
  if (daysUntil === 0) {
    const isPast = now.getHours() > 11 || (now.getHours() === 11 && now.getMinutes() >= 59);
    if (isPast) daysUntil = 7;
  }

  const target = new Date(now);
  target.setDate(now.getDate() + daysUntil);
  target.setHours(11, 59, 0, 0);
  return target;
}

export function WeekCountdown() {
  const target = useMemo(() => computeTarget(), []);
  const [diffMs, setDiffMs] = useState(() => target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setDiffMs(target.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const safe = Math.max(0, diffMs);
  const totalSeconds = Math.floor(safe / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return (
    <div className="mt-2">
      <div className="text-2xl font-extrabold bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 bg-clip-text text-transparent">
        {formatBanglaNumber(days)} দিন {formatBanglaNumber(hours)} ঘণ্টা {formatBanglaNumber(minutes)} মিনিট
      </div>
      <div className="mt-1 text-sm font-bold text-zinc-300">পরবর্তী রবিবার ১১:৫৯ পর্যন্ত</div>
    </div>
  );
}

