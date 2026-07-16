export const ANON_ID_COOKIE = "anon_id";

function getKey() {
  const secret = process.env.ANON_ID_SECRET;
  if (!secret) throw new Error("ANON_ID_SECRET is not set");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signAnonId(id: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(id));
  return `${id}.${toHex(sig)}`;
}

// Recomputes the HMAC over the embedded id and compares against the cookie's
// signature — never trust a client-supplied anon id without this check.
export async function verifyAnonId(cookieValue: string | undefined | null): Promise<string | null> {
  if (!cookieValue) return null;
  const dot = cookieValue.lastIndexOf(".");
  if (dot === -1) return null;
  const id = cookieValue.slice(0, dot);
  const expected = await signAnonId(id);
  return expected === cookieValue ? id : null;
}

export function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
}
