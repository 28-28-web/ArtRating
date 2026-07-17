// In-memory per-IP rate limit for the unauthenticated /api/contact endpoint.
// The ContactMessage model (intentionally) has no IP column, so this isn't
// persisted — a deploy/restart resets it, and it only limits within a single
// server instance. That's an acceptable tradeoff for "basic abuse" gating on
// a low-traffic support form; revisit with a shared store (Redis, or an
// IP+window DB table) if this ever needs to hold up across multiple
// instances or survive frequent redeploys.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
