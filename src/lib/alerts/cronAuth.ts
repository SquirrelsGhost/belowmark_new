import { timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

/**
 * Whether a request may start the alert or deadline run.
 * - With ALERTS_CRON_SECRET / CRON_SECRET set, the bearer token must match (constant-time).
 * - Without an explicit secret, allows local development and Vercel's internal cron scheduler.
 */
export function isAuthorisedRun(authorization: string | null, headers?: Headers): boolean {
  const secret = env.alertsCronSecret;
  if (!secret) {
    if (process.env.NODE_ENV !== "production") return true;
    const ua = headers?.get("user-agent") ?? "";
    return ua.startsWith("vercel-cron/");
  }
  const given = Buffer.from((authorization ?? "").replace(/^Bearer\s+/i, ""));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
