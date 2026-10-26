import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { hearingResults } from "@/db/schema";
import { MarketCode } from "@/lib/constants";
import { ResultSample } from "@/lib/closing/priceStats";
import { SegmentKey } from "@/lib/snapshot";
import { HearingOutcome, HearingResult, HearingResultListingFacts, ResultSource } from "@/types/closing.types";

export interface StoredHearingResult extends HearingResult, HearingResultListingFacts {
  updatedAt: Date;
}

type Row = typeof hearingResults.$inferSelect;

const toResult = (row: Row): StoredHearingResult => ({
  listingKey: row.listingKey,
  market: row.market as MarketCode,
  hearingDate: row.hearingDate,
  outcome: row.outcome as HearingOutcome,
  highestBid: row.highestBid,
  retainedRights: row.retainedRights,
  bidderCount: row.bidderCount,
  source: row.source as ResultSource,
  isBuyer: row.isBuyer,
  shared: row.shared,
  regionCode: row.regionCode,
  segment: row.segment as SegmentKey,
  appraisedValue: row.appraisedValue,
  updatedAt: row.updatedAt,
});

/**
 * HearingResultService
 *
 * Results of hearings as users report them. A user sees and changes only their
 * own entries; the statistics read shared rows without user id or listing key.
 */
export class HearingResultService {
  /** The user's latest entry for a proceeding (several hearings possible: 1st and 2nd Termin). */
  static latest = async (userId: string, listingKey: string): Promise<StoredHearingResult | null> => {
    const [row] = await db
      .select()
      .from(hearingResults)
      .where(and(eq(hearingResults.userId, userId), eq(hearingResults.listingKey, listingKey)))
      .orderBy(desc(hearingResults.hearingDate))
      .limit(1);
    return row ? toResult(row) : null;
  };

  static listOwn = async (userId: string, market: MarketCode): Promise<StoredHearingResult[]> => {
    const rows = await db
      .select()
      .from(hearingResults)
      .where(and(eq(hearingResults.userId, userId), eq(hearingResults.market, market)))
      .orderBy(desc(hearingResults.hearingDate));
    return rows.map(toResult);
  };

  /** One entry per user and hearing — a second save corrects the first. */
  static save = async (userId: string, result: HearingResult, facts: HearingResultListingFacts): Promise<void> => {
    const values = { userId, ...result, ...facts };
    await db
      .insert(hearingResults)
      .values(values)
      .onConflictDoUpdate({
        target: [hearingResults.userId, hearingResults.listingKey, hearingResults.hearingDate],
        set: { ...result, ...facts, updatedAt: new Date() },
      });
  };

  static remove = async (userId: string, listingKey: string, hearingDate: string): Promise<void> => {
    await db
      .delete(hearingResults)
      .where(and(eq(hearingResults.userId, userId), eq(hearingResults.listingKey, listingKey), eq(hearingResults.hearingDate, hearingDate)));
  };

  /** Shared results of a market as anonymous samples for the statistics. */
  static samples = async (market: MarketCode): Promise<ResultSample[]> => {
    const rows = await db
      .select({
        listingKey: hearingResults.listingKey,
        hearingDate: hearingResults.hearingDate,
        regionCode: hearingResults.regionCode,
        segment: hearingResults.segment,
        outcome: hearingResults.outcome,
        appraisedValue: hearingResults.appraisedValue,
        highestBid: hearingResults.highestBid,
        retainedRights: hearingResults.retainedRights,
        bidderCount: hearingResults.bidderCount,
      })
      .from(hearingResults)
      .where(and(eq(hearingResults.market, market), eq(hearingResults.shared, true)));
    return rows.map(({ listingKey, hearingDate, ...row }) => ({
      ...row,
      hearingId: `${listingKey}|${hearingDate}`,
      segment: row.segment as SegmentKey,
      outcome: row.outcome as HearingOutcome,
    }));
  };
}
