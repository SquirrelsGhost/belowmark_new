import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";

const HIBP_RANGE_URL = "https://api.pwnedpasswords.com/range/";
const TIMEOUT_MS = 1500;
const MIN_BREACH_COUNT = 1000;

/**
 * Checks a password against the Have I Been Pwned breach corpus using
 * k-anonymity: only the first 5 hex chars of its SHA-1 leave the server.
 *
 * Fails open — when the service is slow or down, sign-up must not break.
 */
export async function isBreachedPassword(password: string): Promise<boolean> {
  if (!env.authBreachCheck) return false;
  const sha1 = createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  try {
    const response = await fetch(`${HIBP_RANGE_URL}${prefix}`, {
      headers: { "Add-Padding": "true" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) return false;
    const body = await response.text();
    return body.split("\n").some((line) => {
      const [hashSuffix, count] = line.trim().split(":");
      return hashSuffix === suffix && Number(count) >= MIN_BREACH_COUNT;
    });
  } catch {
    return false;
  }
}
