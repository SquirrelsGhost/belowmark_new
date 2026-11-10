import "server-only";
import { and, gt, isNull, lt } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AuthService } from "@/services/AuthService";
import { RateLimitService } from "@/services/RateLimitService";

const MIN_AGE_MS = 40 * 60 * 1000;
const MAX_AGE_MS = 72 * 60 * 60 * 1000;
const ONCE_RULE = { limit: 1, windowMs: 365 * 24 * 60 * 60 * 1000 } as const;

export class UnverifiedReminderService {
  /**
   * Sends at most ONE polite verification reminder + fresh 6-digit OTP code
   * to accounts still unverified 40m–72h after registration.
   */
  static run = async (nowMs = Date.now()): Promise<number> => {
    const olderThan = new Date(nowMs - MIN_AGE_MS);
    const newerThan = new Date(nowMs - MAX_AGE_MS);

    const pending = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(
        and(
          isNull(users.emailVerifiedAt),
          isNull(users.gesperrtAm),
          lt(users.createdAt, olderThan),
          gt(users.createdAt, newerThan),
        ),
      )
      .limit(5);

    let sent = 0;
    for (const u of pending) {
      if (/\.(local|invalid|test)$/i.test(u.email)) continue;
      const gate = await RateLimitService.hit(`reengage:unverified-dossier-v1:${u.id}`, ONCE_RULE);
      if (!gate.allowed) continue;
      try {
        await AuthService.resendVerification(u.email);
        sent += 1;
      } catch (err) {
        console.error("[UnverifiedReminderService] send failed for", u.email, err);
      }
    }
    return sent;
  };
}
