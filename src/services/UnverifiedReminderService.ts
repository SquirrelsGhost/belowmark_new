import "server-only";
import { and, asc, eq, gt, isNull, lt, notExists, sql } from "drizzle-orm";
import { db } from "@/db";
import { authTokens, users } from "@/db/schema";
import { TOKEN_PURPOSE, TOKEN_TTL } from "@/lib/auth/authConfig";
import { hashToken } from "@/lib/auth/tokens";
import { AuthMailService } from "@/services/AuthMailService";
import { AuthService } from "@/services/AuthService";

const MIN_AGE_MS = 2 * 60 * 60 * 1000;
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const DEFAULT_BATCH_LIMIT = 25;
const SYNTHETIC_OR_INTERNAL_EMAIL = /\.(local|invalid|test)$/i;
const INTERNAL_DOMAIN_EMAIL = /@belowmark\./i;

export interface UnverifiedReminderOptions {
  dryRun?: boolean;
  limit?: number;
  baseUrl?: string;
}

export interface UnverifiedReminderReport {
  dryRun: boolean;
  eligible: number;
  sent: number;
  failed: number;
  recipients: string[];
}

function isExcludedEmail(email: string): boolean {
  const clean = email.trim();
  return SYNTHETIC_OR_INTERNAL_EMAIL.test(clean) || INTERNAL_DOMAIN_EMAIL.test(clean);
}

export function reminderMarkerId(userId: string): string {
  return hashToken(`verify-reminder:${userId}`);
}

export class UnverifiedReminderService {
  /**
   * Sends at most ONE polite verification reminder (with a fresh 72h link + 6-digit OTP code)
   * to accounts still unverified 2h–14d after registration.
   *
   * Strict DB idempotency: inserts `purpose = 'verify_email_reminder_sent'` into `auth_tokens`
   * with a deterministic SHA-256 primary key (`verify-reminder:<userId>`) and a 10-year TTL,
   * guaranteeing that at most 1 reminder mail is ever sent per user.
   */
  static run = async (
    nowMs = Date.now(),
    options: UnverifiedReminderOptions = {},
  ): Promise<UnverifiedReminderReport> => {
    const dryRun = Boolean(options.dryRun);
    const limit = options.limit ?? DEFAULT_BATCH_LIMIT;
    const olderThan = new Date(nowMs - MIN_AGE_MS);
    const newerThan = new Date(nowMs - MAX_AGE_MS);

    const rows = await db
      .select({ id: users.id, email: users.email, locale: users.locale })
      .from(users)
      .where(
        and(
          isNull(users.emailVerifiedAt),
          isNull(users.gesperrtAm),
          lt(users.createdAt, olderThan),
          gt(users.createdAt, newerThan),
          notExists(
            db
              .select({ one: sql`1` })
              .from(authTokens)
              .where(
                and(
                  eq(authTokens.userId, users.id),
                  eq(authTokens.purpose, TOKEN_PURPOSE.verifyEmailReminderSent),
                ),
              ),
          ),
        ),
      )
      .orderBy(asc(users.createdAt))
      .limit(limit);

    const eligibleRows = rows.filter((u) => !isExcludedEmail(u.email));
    if (dryRun) {
      return {
        dryRun: true,
        eligible: eligibleRows.length,
        sent: 0,
        failed: 0,
        recipients: eligibleRows.map((u) => u.email),
      };
    }

    let sent = 0;
    let failed = 0;
    const recipients: string[] = [];
    const markerExpiresAt = new Date(nowMs + TOKEN_TTL.verifyEmailReminderMarker);

    for (const u of eligibleRows) {
      const markerId = reminderMarkerId(u.id);
      const claimed = await db
        .insert(authTokens)
        .values({
          id: markerId,
          userId: u.id,
          purpose: TOKEN_PURPOSE.verifyEmailReminderSent,
          expiresAt: markerExpiresAt,
        })
        .onConflictDoNothing()
        .returning({ id: authTokens.id });
      if (claimed.length === 0) continue;

      try {
        const { token, code } = await AuthService.issueVerificationReminderCredentials(u.id);
        await AuthMailService.sendVerificationReminder(
          { email: u.email, locale: u.locale },
          token,
          code,
          options.baseUrl,
        );
        sent += 1;
        recipients.push(u.email);
      } catch (err) {
        failed += 1;
        await db
          .delete(authTokens)
          .where(and(eq(authTokens.id, markerId), eq(authTokens.purpose, TOKEN_PURPOSE.verifyEmailReminderSent)))
          .catch(() => undefined);
        console.error("[UnverifiedReminderService] send failed for", u.email, err);
      }
    }

    return {
      dryRun: false,
      eligible: eligibleRows.length,
      sent,
      failed,
      recipients,
    };
  };
}
