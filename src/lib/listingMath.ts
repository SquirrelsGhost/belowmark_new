import { DAY_MS, MARKET_TIME_ZONES, SEARCH, TR_COSTS } from "@/lib/appConstants";
import { ZVG } from "@/lib/constants";
import { HearingStatus, Listing, ListingRound } from "@/types/listing.types";

/**
 * Pure calculations on a proceeding. Only legal fixed rates are applied —
 * anything the notice does not state stays null instead of being estimated.
 */

/** Where the proceeding stands at `now`: running, next round ahead, or over. */
export function getHearingStatus(listing: Listing, now: number): HearingStatus {
  const { state, round } = getHearingState(listing, now);
  if (state !== "upcoming" && state !== "running") return { state, round, days: null };
  const zone = MARKET_TIME_ZONES[listing.market];
  const target = round ? Date.parse(state === "running" ? round.end : round.start) : now;
  return { state, round, days: daysBetween(now, target, zone) };
}

/**
 * getHearingStatus without the day count. The day count needs a time zone
 * conversion; the search asks for state and date of every proceeding several
 * times per request, so it uses this one.
 */
export function getHearingState(listing: Listing, now: number): Omit<HearingStatus, "days"> {
  if (listing.cancelled) return { state: "cancelled", round: listing.rounds[0] ?? null };
  if (listing.rounds.length === 0) {
    if (!listing.hearingAt) return { state: "unknown", round: null };
    const at = Date.parse(listing.hearingAt);
    const round = { round: 1, start: listing.hearingAt, end: listing.hearingAt };
    return at >= now ? { state: "upcoming", round } : { state: "past", round };
  }

  for (const round of listing.rounds) {
    const [start, end] = roundTimes(round);
    if (now < start) return { state: "upcoming", round };
    if (now <= end) return { state: "running", round };
  }
  return { state: "past", round: listing.rounds[listing.rounds.length - 1] };
}

/** Parsed start and end of a round, kept per round object — snapshot rounds never change. */
const parsedRounds = new WeakMap<ListingRound, [number, number]>();

function roundTimes(round: ListingRound): [number, number] {
  let times = parsedRounds.get(round);
  if (!times) {
    times = [Date.parse(round.start), Date.parse(round.end)];
    parsedRounds.set(round, times);
  }
  return times;
}

/** Calendar days between two instants in the court's time zone — tomorrow 08:00 is "1", not "0". */
const dayFormatters = new Map<string, Intl.DateTimeFormat>();

/** Midnight (as UTC) of the calendar day `time` falls on in `timeZone`. */
function calendarDay(time: number, timeZone: string): number {
  let formatter = dayFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", { timeZone });
    dayFormatters.set(timeZone, formatter);
  }
  return Date.parse(formatter.format(time));
}

function daysBetween(from: number, to: number, timeZone: string): number {
  return Math.max(0, Math.round((calendarDay(to, timeZone) - calendarDay(from, timeZone)) / DAY_MS));
}

/** Next relevant moment: end of a running round, else start of the next one. Used for sorting and the calendar. */
export function getNextDate(listing: Listing, now: number): string | null {
  const status = getHearingState(listing, now);
  if (status.state === "running") return status.round?.end ?? listing.hearingAt;
  return status.round?.start ?? listing.hearingAt;
}

export function isNewListing(listing: Listing, snapshotDate: string): boolean {
  if (!listing.firstSeenAt) return false;
  return Date.parse(snapshotDate) - Date.parse(listing.firstSeenAt) <= SEARCH.newDays * DAY_MS;
}

export interface ZvgFigures {
  /** § 85a ZVG — below this the bid is refused ex officio (first hearing only) */
  half: number;
  /** § 74a ZVG — below this an entitled party may apply for refusal */
  sevenTenths: number;
  /** § 68 Abs. 1 ZVG */
  deposit: number;
  /** Grunderwerbsteuer on the 5/10 bid */
  taxOnHalf: number | null;
  /** 5/10 bid plus transfer tax */
  entryAtHalf: number | null;
}

export function getZvgFigures(
  value: number,
  transferTaxPct: number | null,
  minimumBidOverride?: number | null,
  depositOverride?: number | null,
): ZvgFigures {
  const half = minimumBidOverride ?? value * ZVG.absoluteLimit;
  const taxOnHalf = transferTaxPct === null ? null : (half * transferTaxPct) / 100;
  return {
    half,
    sevenTenths: value * ZVG.relativeLimit,
    deposit: depositOverride ?? value * ZVG.deposit,
    taxOnHalf,
    entryAtHalf: taxOnHalf === null ? null : half + taxOnHalf,
  };
}

export interface IcraCostItem {
  code: "kdv" | "tapuHarci" | "damgaVergisi" | "donerSermaye";
  pct: number | null;
  amount: number;
}

export interface IcraFigures {
  startingBid: number;
  deposit: number;
  items: IcraCostItem[];
  allIn: number;
  /** false when the notice gives no KDV rate — the sum is then explicitly incomplete */
  vatKnown: boolean;
}

/** Starting bid, deposit and purchase costs of a Turkish proceeding (costs.mjs of the old app). */
export function getIcraFigures(value: number, vatRate: number | null, bid?: number): IcraFigures {
  const startingBid = value * TR_COSTS.startingBidShare;
  const base = bid ?? startingBid;
  const vatKnown = vatRate !== null;
  const items: IcraCostItem[] = [];
  if (vatKnown && vatRate > 0) items.push({ code: "kdv", pct: vatRate, amount: (base * vatRate) / 100 });
  items.push({ code: "tapuHarci", pct: TR_COSTS.tapuHarciPct, amount: (base * TR_COSTS.tapuHarciPct) / 100 });
  items.push({ code: "damgaVergisi", pct: TR_COSTS.damgaVergisiPct, amount: (base * TR_COSTS.damgaVergisiPct) / 100 });
  items.push({ code: "donerSermaye", pct: null, amount: TR_COSTS.donerSermayeTl });
  const costs = items.reduce((sum, item) => sum + item.amount, 0);
  return { startingBid, deposit: value * TR_COSTS.depositShare, items, allIn: base + costs, vatKnown };
}

/** Lowest amount you can win with in the first hearing / first round. */
export function getEntryBid(listing: Listing): number | null {
  if (listing.minimumBid && listing.minimumBid > 0) return listing.minimumBid;
  if (listing.appraisedValue === null) return null;
  if (listing.market === "TR") return listing.tr?.startingBid ?? listing.appraisedValue * TR_COSTS.startingBidShare;
  return listing.limitsWaived ? null : listing.appraisedValue * ZVG.absoluteLimit;
}
