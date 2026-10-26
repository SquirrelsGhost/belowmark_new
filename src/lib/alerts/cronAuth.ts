import { timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

/**
 * Whether a request may start the alert run. With ALERTS_CRON_SECRET set the
 * bearer token must match (constant-time); without it only development runs.
 */
export function isAuthorisedRun(authorization: string | null): boolean {
  const secret = env.alertsCronSecret;
  if (!secret) return process.env.NODE_ENV !== "production";
  const given = Buffer.from((authorization ?? "").replace(/^Bearer\s+/i, ""));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
