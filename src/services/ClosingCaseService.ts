import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { closingCases } from "@/db/schema";
import { MarketCode } from "@/lib/constants";
import { ClosingCase, ClosingDates } from "@/types/closing.types";

type Row = typeof closingCases.$inferSelect;

const toCase = (row: Row): ClosingCase => ({
  listingKey: row.listingKey,
  market: row.market as MarketCode,
  dates: { awardDate: row.awardDate, distributionDate: row.distributionDate, taxNoticeDate: row.taxNoticeDate, handoverDate: row.handoverDate },
  done: row.done,
  updatedAt: row.updatedAt,
});

/**
 * ClosingCaseService
 *
 * The buyer's own case after the Zuschlag. Kept on the server (not in the
 * browser like the bid limit) so the Termin-Begleiter can remind of its dates.
 */
export class ClosingCaseService {
  static get = async (userId: string, listingKey: string): Promise<ClosingCase | null> => {
    const [row] = await db.select().from(closingCases).where(and(eq(closingCases.userId, userId), eq(closingCases.listingKey, listingKey)));
    return row ? toCase(row) : null;
  };

  static saveDates = async (userId: string, listingKey: string, market: MarketCode, dates: ClosingDates): Promise<void> => {
    await db
      .insert(closingCases)
      .values({ userId, listingKey, market, ...dates })
      .onConflictDoUpdate({ target: [closingCases.userId, closingCases.listingKey], set: { ...dates, updatedAt: new Date() } });
  };

  /** Sets the award date only — keeps every other date and the ticks. */
  static saveAwardDate = async (userId: string, listingKey: string, market: MarketCode, awardDate: string): Promise<void> => {
    await db
      .insert(closingCases)
      .values({ userId, listingKey, market, awardDate })
      .onConflictDoUpdate({ target: [closingCases.userId, closingCases.listingKey], set: { awardDate, updatedAt: new Date() } });
  };

  static setDone = async (userId: string, listingKey: string, market: MarketCode, taskId: string, isDone: boolean): Promise<void> => {
    const current = await ClosingCaseService.get(userId, listingKey);
    const done = new Set(current?.done ?? []);
    if (isDone) done.add(taskId);
    else done.delete(taskId);
    await db
      .insert(closingCases)
      .values({ userId, listingKey, market, done: [...done] })
      .onConflictDoUpdate({ target: [closingCases.userId, closingCases.listingKey], set: { done: [...done], updatedAt: new Date() } });
  };

  static remove = async (userId: string, listingKey: string): Promise<void> => {
    await db.delete(closingCases).where(and(eq(closingCases.userId, userId), eq(closingCases.listingKey, listingKey)));
  };
}
