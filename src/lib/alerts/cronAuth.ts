import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import { RateLimitService } from "@/services/RateLimitService";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

function derivedFallbackCronToken(): string {
  try {
    const dbUrl = env.databaseUrl;
    if (!dbUrl) return "";
    return createHmac("sha256", dbUrl).update("bm-cron-auth-v1").digest("base64url");
  } catch {
    return "";
  }
}

function safeEquals(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/**
 * Verifies whether a request may start the alert or deadline run:
 * 1. Explicit `Bearer <CRON_SECRET>` (or derived internal CLI token) -> constant-time check.
 * 2. When `CRON_SECRET` is explicitly configured in env, unauthenticated requests are strictly rejected.
 * 3. When `CRON_SECRET` is unset on Vercel, requires `vercel-cron/` UA + `x-vercel-id`, rejects browser
 *    headers (`origin`, `referer`, `cookie`, `sec-fetch-site`), AND enforces a 6-hour PostgreSQL replay lock
 *    so spoofed `User-Agent` headers can never trigger repeated runs.
 */
export async function isAuthorisedRun(
  authorization: string | null,
  headers?: Headers,
  jobKey = "default",
): Promise<boolean> {
  const explicitSecret = env.alertsCronSecret;
  const bearer = (authorization ?? "").replace(/^Bearer\s+/i, "").trim();

  if (bearer) {
    if (explicitSecret && safeEquals(bearer, explicitSecret)) return true;
    const derived = derivedFallbackCronToken();
    if (!explicitSecret && derived && safeEquals(bearer, derived)) return true;
    return false;
  }

  if (explicitSecret) return false;
  if (process.env.NODE_ENV !== "production") return true;

  if (
    headers?.has("origin") ||
    headers?.has("referer") ||
    headers?.has("cookie") ||
    headers?.has("sec-fetch-site")
  ) {
    return false;
  }

  const ua = headers?.get("user-agent") ?? "";
  if (!ua.startsWith("vercel-cron/") || !headers?.get("x-vercel-id")) {
    return false;
  }

  const { allowed } = await RateLimitService.hit(`cron-guard:${jobKey}`, {
    limit: 1,
    windowMs: SIX_HOURS_MS,
  });
  return allowed;
}
