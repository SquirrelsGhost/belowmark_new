"use server";

import { revalidatePath } from "next/cache";
import { listingHref } from "@/lib/appConstants";
import { RATE_LIMITS } from "@/lib/auth/authConfig";
import { CLOSING_DATE_FIELDS, CLOSING_ROUTES, closingHref, HEARING_OUTCOMES, RESULT_LIMITS, RESULT_RATIO_BOUNDS, RESULT_SOURCES } from "@/lib/closing/closingConstants";
import { addDays, isIsoDate, todayIn } from "@/lib/closing/closingSchedule";
import { closingTaskIds } from "@/lib/closing/closingTasks";
import { MarketCode } from "@/lib/constants";
import { ClosingCaseService } from "@/services/ClosingCaseService";
import { HearingResultService } from "@/services/HearingResultService";
import { ListingService } from "@/services/ListingService";
import { RateLimitService } from "@/services/RateLimitService";
import { SessionService } from "@/services/SessionService";
import { ClosingDates, HearingOutcome, HearingResult, ResultSource } from "@/types/closing.types";
import { Listing } from "@/types/listing.types";

/** Error codes travel to the form and are turned into words there. */
export type ClosingErrorCode = "auth" | "locked" | "date" | "future" | "outcome" | "bid" | "ratio" | "bidders" | "buyer" | "unknown";

export interface ClosingActionState {
  ok: boolean;
  error?: ClosingErrorCode;
  /** Set after a saved result where the user is the buyer — the form mirrors it into the portfolio record */
  won?: { price: number | null; date: string };
  saved?: boolean;
}

interface Target {
  userId: string;
  hasFullAccess: boolean;
  listing: Listing;
}

/** Only signed-in users, and only proceedings of their market. */
async function authorise(listingKey: unknown): Promise<Target | null> {
  const user = await SessionService.getCurrentUser();
  if (!user || typeof listingKey !== "string" || listingKey.length > 128) return null;
  const market: MarketCode = user.market === "TR" ? "TR" : "DE";
  const listing = await ListingService.getByKey(market, listingKey);
  return listing ? { userId: user.id, hasFullAccess: user.hasFullAccess, listing } : null;
}

/** Whole, non-negative amount or null for an empty field; NaN marks garbage. */
function amount(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : Number.NaN;
}

function readResult(formData: FormData, listing: Listing, now: number): { result?: HearingResult; awardDate?: string; error?: ClosingErrorCode } {
  const hearingDate = formData.get("hearingDate");
  if (!isIsoDate(hearingDate)) return { error: "date" };
  const today = todayIn(listing.market, now);
  if (hearingDate > today || hearingDate < addDays(today, -RESULT_LIMITS.maxDaysAfter)) return { error: "future" };

  const outcome = formData.get("outcome") as HearingOutcome;
  if (!HEARING_OUTCOMES.includes(outcome)) return { error: "outcome" };
  const source = RESULT_SOURCES.includes(formData.get("source") as ResultSource) ? (formData.get("source") as ResultSource) : "attended";

  const highestBid = amount(formData.get("highestBid"));
  const retainedRights = listing.market === "DE" ? amount(formData.get("retainedRights")) : null;
  const bidderCount = amount(formData.get("bidderCount"));
  if (Number.isNaN(highestBid) || Number.isNaN(retainedRights)) return { error: "bid" };
  if (Number.isNaN(bidderCount) || (bidderCount !== null && bidderCount > RESULT_LIMITS.maxBidders)) return { error: "bidders" };
  const hasBid = outcome === "awarded" || outcome === "refused" || outcome === "pending";
  if (outcome === "awarded" && !highestBid) return { error: "bid" };
  if (highestBid && listing.appraisedValue) {
    const ratio = (highestBid + (retainedRights ?? 0)) / listing.appraisedValue;
    if (ratio < RESULT_RATIO_BOUNDS.min || ratio > RESULT_RATIO_BOUNDS.max) return { error: "ratio" };
  }

  const isBuyer = formData.get("isBuyer") === "on";
  if (isBuyer && outcome !== "awarded") return { error: "buyer" };
  const awardInput = formData.get("awardDate");
  const awardDate = isBuyer ? (isIsoDate(awardInput) ? awardInput : hearingDate) : undefined;
  if (awardDate && (awardDate < hearingDate || awardDate > today)) return { error: "date" };

  return {
    awardDate,
    result: {
      listingKey: listing.key,
      market: listing.market,
      hearingDate,
      outcome,
      highestBid: hasBid ? highestBid : null,
      retainedRights: hasBid ? retainedRights : null,
      bidderCount: outcome === "cancelled" ? null : bidderCount,
      source,
      isBuyer,
      shared: formData.get("shared") === "on",
    },
  };
}

/** Server Action: stores the user's report of a hearing; as buyer it also opens the task list. */
export async function saveHearingResultAction(_: ClosingActionState, formData: FormData): Promise<ClosingActionState> {
  const target = await authorise(formData.get("listingKey"));
  if (!target) return { ok: false, error: "auth" };
  if (!target.hasFullAccess) return { ok: false, error: "locked" };
  const { listing, userId } = target;
  const { result, awardDate, error } = readResult(formData, listing, Date.now());
  if (!result) return { ok: false, error };
  try {
    const rl = await RateLimitService.hit(`closing:user:${userId}`, RATE_LIMITS.profileUpdate);
    if (!rl.allowed) return { ok: false, error: "unknown" };
    await HearingResultService.save(userId, result, { regionCode: listing.regionCode, segment: listing.segment, appraisedValue: listing.appraisedValue });
    if (awardDate && target.hasFullAccess) await ClosingCaseService.saveAwardDate(userId, listing.key, listing.market, awardDate);
  } catch (caught) {
    console.error("[saveHearingResultAction]", caught);
    return { ok: false, error: "unknown" };
  }
  revalidatePath(listingHref(listing.key));
  revalidatePath(CLOSING_ROUTES.results);
  return { ok: true, saved: true, won: awardDate && target.hasFullAccess ? { price: result.highestBid, date: awardDate } : undefined };
}

/** Server Action: the case dates of the task list (paid plans). */
export async function saveClosingDatesAction(_: ClosingActionState, formData: FormData): Promise<ClosingActionState> {
  const target = await authorise(formData.get("listingKey"));
  if (!target) return { ok: false, error: "auth" };
  if (!target.hasFullAccess) return { ok: false, error: "locked" };
  const dates: ClosingDates = { awardDate: null, distributionDate: null, taxNoticeDate: null, handoverDate: null };
  for (const field of CLOSING_DATE_FIELDS[target.listing.market]) {
    const value = formData.get(field);
    if (typeof value === "string" && value !== "") {
      if (!isIsoDate(value)) return { ok: false, error: "date" };
      dates[field] = value;
    }
  }
  if (!dates.awardDate) return { ok: false, error: "date" };
  try {
    const rl = await RateLimitService.hit(`closing:user:${target.userId}`, RATE_LIMITS.profileUpdate);
    if (!rl.allowed) return { ok: false, error: "unknown" };
    await ClosingCaseService.saveDates(target.userId, target.listing.key, target.listing.market, dates);
  } catch (caught) {
    console.error("[saveClosingDatesAction]", caught);
    return { ok: false, error: "unknown" };
  }
  revalidatePath(closingHref(target.listing.key));
  return { ok: true, saved: true, won: { price: null, date: dates.awardDate } };
}

/** Server Action: ticks a task off or back on. */
export async function toggleClosingTaskAction(_: ClosingActionState, formData: FormData): Promise<ClosingActionState> {
  const target = await authorise(formData.get("listingKey"));
  const taskId = formData.get("taskId");
  if (!target) return { ok: false, error: "auth" };
  if (!target.hasFullAccess) return { ok: false, error: "locked" };
  if (typeof taskId !== "string" || !closingTaskIds(target.listing.market).has(taskId)) return { ok: false, error: "unknown" };
  try {
    const rl = await RateLimitService.hit(`closing:user:${target.userId}`, RATE_LIMITS.profileUpdate);
    if (!rl.allowed) return { ok: false, error: "unknown" };
    await ClosingCaseService.setDone(target.userId, target.listing.key, target.listing.market, taskId, formData.get("done") === "1");
  } catch (caught) {
    console.error("[toggleClosingTaskAction]", caught);
    return { ok: false, error: "unknown" };
  }
  revalidatePath(closingHref(target.listing.key));
  return { ok: true, saved: true };
}
