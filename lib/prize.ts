export function calculatePrize(ratingCount: number): number {
  const base = Math.floor(ratingCount / 100) * 100;
  return Math.min(base, 10000);
}
