import "server-only";
import { eq, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";
import { RateLimitRule } from "@/lib/auth/authConfig";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMinutes: number;
}

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

function result(count: number, limit: number, resetAt: Date): RateLimitResult {
  const retryAfterMinutes = Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / MINUTE_MS));
  return { allowed: count <= limit, retryAfterMinutes };
}

/** Calculates exponential backoff duration based on failed login attempts. */
function backoffMsForFailures(failures: number): number {
  if (failures < 5) return 0;
  if (failures < 8) return MINUTE_MS; // 1 minute from 5 failures
  if (failures < 11) return 15 * MINUTE_MS; // 15 minutes from 8 failures
  return 60 * MINUTE_MS; // 60 minutes from 11+ failures
}

/**
 * RateLimitService
 *
 * Fixed-window counters and persistent exponential backoff in Postgres so limits
 * hold across restarts and multiple server instances.
 */
export class RateLimitService {
  /** Counts a hit and says whether it is still within the limit. */
  static hit = async (key: string, rule: RateLimitRule): Promise<RateLimitResult> => {
    const resetAt = new Date(Date.now() + rule.windowMs);
    const [row] = await db
      .insert(rateLimits)
      .values({ key, count: 1, resetAt })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: {
          count: sql`CASE WHEN ${rateLimits.resetAt} < now() THEN 1 ELSE ${rateLimits.count} + 1 END`,
          resetAt: sql`CASE WHEN ${rateLimits.resetAt} < now() THEN ${resetAt} ELSE ${rateLimits.resetAt} END`,
        },
      })
      .returning({ count: rateLimits.count, resetAt: rateLimits.resetAt });
    return result(row.count, rule.limit, row.resetAt);
  };

  /** Reads the counter without counting — for "failures only" limits. */
  static peek = async (key: string, rule: RateLimitRule): Promise<RateLimitResult> => {
    const [row] = await db.select().from(rateLimits).where(eq(rateLimits.key, key));
    if (!row || row.resetAt.getTime() < Date.now()) return { allowed: true, retryAfterMinutes: 0 };
    if (row.lockedUntil && row.lockedUntil.getTime() > Date.now()) {
      const retryAfterMinutes = Math.max(1, Math.ceil((row.lockedUntil.getTime() - Date.now()) / MINUTE_MS));
      return { allowed: false, retryAfterMinutes };
    }
    return { allowed: row.count < rule.limit, retryAfterMinutes: result(row.count, rule.limit, row.resetAt).retryAfterMinutes };
  };

  /** Checks if an IP or account key is currently locked by persistent exponential backoff. */
  static checkBackoff = async (key: string): Promise<RateLimitResult> => {
    const [row] = await db.select().from(rateLimits).where(eq(rateLimits.key, key));
    if (!row?.lockedUntil) return { allowed: true, retryAfterMinutes: 0 };
    const remainingMs = row.lockedUntil.getTime() - Date.now();
    if (remainingMs <= 0) return { allowed: true, retryAfterMinutes: 0 };
    return { allowed: false, retryAfterMinutes: Math.max(1, Math.ceil(remainingMs / MINUTE_MS)) };
  };

  /** Records a failed login attempt for IP or account and applies persistent exponential backoff. */
  static recordFailure = async (key: string): Promise<void> => {
    const now = Date.now();
    const resetAt = new Date(now + DAY_MS);
    const [row] = await db
      .insert(rateLimits)
      .values({ key, count: 1, resetAt, lockedUntil: null })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: {
          count: sql`CASE WHEN ${rateLimits.resetAt} < now() THEN 1 ELSE ${rateLimits.count} + 1 END`,
          resetAt,
        },
      })
      .returning({ count: rateLimits.count });

    const lockMs = backoffMsForFailures(row.count);
    const lockedUntil = lockMs > 0 ? new Date(now + lockMs) : null;
    if (lockedUntil) {
      await db.update(rateLimits).set({ lockedUntil }).where(eq(rateLimits.key, key));
    }
  };

  static reset = async (key: string): Promise<void> => {
    await db.delete(rateLimits).where(eq(rateLimits.key, key));
  };

  /** Housekeeping: drops expired windows so the table stays small. */
  static sweep = async (): Promise<void> => {
    await db.delete(rateLimits).where(lt(rateLimits.resetAt, new Date()));
  };
}
