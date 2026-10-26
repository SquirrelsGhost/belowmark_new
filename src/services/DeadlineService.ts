import "server-only";
import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { deadlineFeeds, deadlineFollows, deadlineRemindersSent } from "@/db/schema";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { DEADLINE_MAX_FOLLOWS } from "@/lib/deadlines/deadlineConstants";
import { MarketCode } from "@/lib/constants";

export interface DeadlineFollow {
  listingKey: string;
  market: MarketCode;
  mailEnabled: boolean;
  createdAt: Date;
}

const toFollow = (row: { listingKey: string; market: string; mailEnabled: boolean; createdAt: Date }): DeadlineFollow => ({
  ...row,
  market: row.market === "TR" ? "TR" : "DE",
});

const FOLLOW_COLUMNS = {
  listingKey: deadlineFollows.listingKey,
  market: deadlineFollows.market,
  mailEnabled: deadlineFollows.mailEnabled,
  createdAt: deadlineFollows.createdAt,
};

/**
 * DeadlineService
 *
 * What a user follows, which reminders went out, and the calendar feed token.
 * Every user-facing query is scoped to the user id.
 */
export class DeadlineService {
  static list = async (userId: string): Promise<DeadlineFollow[]> => {
    const rows = await db.select(FOLLOW_COLUMNS).from(deadlineFollows).where(eq(deadlineFollows.userId, userId)).orderBy(deadlineFollows.createdAt);
    return rows.map(toFollow);
  };

  static get = async (userId: string, listingKey: string): Promise<DeadlineFollow | null> => {
    const [row] = await db
      .select(FOLLOW_COLUMNS)
      .from(deadlineFollows)
      .where(and(eq(deadlineFollows.userId, userId), eq(deadlineFollows.listingKey, listingKey)))
      .limit(1);
    return row ? toFollow(row) : null;
  };

  /** false when the user already follows the maximum number of proceedings. */
  static follow = async (userId: string, listingKey: string, market: MarketCode): Promise<boolean> => {
    const [{ total }] = await db.select({ total: count() }).from(deadlineFollows).where(eq(deadlineFollows.userId, userId));
    if (total >= DEADLINE_MAX_FOLLOWS) return false;
    await db.insert(deadlineFollows).values({ userId, listingKey, market }).onConflictDoNothing();
    return true;
  };

  static unfollow = async (userId: string, listingKey: string): Promise<void> => {
    await db.delete(deadlineFollows).where(and(eq(deadlineFollows.userId, userId), eq(deadlineFollows.listingKey, listingKey)));
    await db.delete(deadlineRemindersSent).where(and(eq(deadlineRemindersSent.userId, userId), eq(deadlineRemindersSent.listingKey, listingKey)));
  };

  static setMail = async (userId: string, listingKey: string, mailEnabled: boolean): Promise<void> => {
    await db
      .update(deadlineFollows)
      .set({ mailEnabled })
      .where(and(eq(deadlineFollows.userId, userId), eq(deadlineFollows.listingKey, listingKey)));
  };

  /** Every follow with mail switched on, for the reminder run. */
  static listMailing = async (): Promise<(DeadlineFollow & { userId: string })[]> => {
    const rows = await db
      .select({ ...FOLLOW_COLUMNS, userId: deadlineFollows.userId })
      .from(deadlineFollows)
      .where(eq(deadlineFollows.mailEnabled, true));
    return rows.map((row) => ({ ...toFollow(row), userId: row.userId }));
  };

  /** Sent keys per user and proceeding: map key is DeadlineService.sentGroup(userId, listingKey). */
  static sentKeys = async (userIds: string[]): Promise<Map<string, Set<string>>> => {
    const groups = new Map<string, Set<string>>();
    if (userIds.length === 0) return groups;
    const rows = await db
      .select({ userId: deadlineRemindersSent.userId, listingKey: deadlineRemindersSent.listingKey, sentKey: deadlineRemindersSent.sentKey })
      .from(deadlineRemindersSent)
      .where(inArray(deadlineRemindersSent.userId, userIds));
    for (const row of rows) {
      const group = DeadlineService.sentGroup(row.userId, row.listingKey);
      groups.set(group, (groups.get(group) ?? new Set()).add(row.sentKey));
    }
    return groups;
  };

  // Listing keys may contain "|" and "#", so the separator is a character no key holds
  static sentGroup = (userId: string, listingKey: string): string => `${userId}\u0000${listingKey}`;

  static markSent = async (userId: string, entries: { listingKey: string; sentKey: string }[]): Promise<void> => {
    if (entries.length === 0) return;
    await db
      .insert(deadlineRemindersSent)
      .values(entries.map((entry) => ({ userId, ...entry })))
      .onConflictDoNothing();
  };

  static hasFeed = async (userId: string): Promise<boolean> => {
    const [row] = await db.select({ userId: deadlineFeeds.userId }).from(deadlineFeeds).where(eq(deadlineFeeds.userId, userId)).limit(1);
    return Boolean(row);
  };

  /** A new feed token; the old one stops working. Only the hash is stored. */
  static renewFeed = async (userId: string): Promise<string> => {
    const token = generateToken();
    const tokenHash = hashToken(token);
    await db
      .insert(deadlineFeeds)
      .values({ userId, tokenHash })
      .onConflictDoUpdate({ target: deadlineFeeds.userId, set: { tokenHash, createdAt: new Date(), lastFetchedAt: null } });
    return token;
  };

  static userForFeed = async (token: string): Promise<string | null> => {
    const tokenHash = hashToken(token);
    const [row] = await db.select({ userId: deadlineFeeds.userId }).from(deadlineFeeds).where(eq(deadlineFeeds.tokenHash, tokenHash)).limit(1);
    if (!row) return null;
    await db.update(deadlineFeeds).set({ lastFetchedAt: new Date() }).where(eq(deadlineFeeds.userId, row.userId));
    return row.userId;
  };
}
