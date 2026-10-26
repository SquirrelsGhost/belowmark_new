import { getHearingStatus, getNextDate } from "@/lib/listingMath";
import { AlertHit, AlertSchedule, StoredAlertFilters } from "@/types/alert.types";
import { Listing, ListingFilters } from "@/types/listing.types";

/**
 * Pure matching of saved searches against a snapshot. An alert looks ahead:
 * it ignores date ranges and past proceedings, and only the open ones
 * (upcoming, running — or cancelled, so a cancellation can be reported) count.
 */

/** Lower case, no accents, Turkish dotless i folded — same rule as the search. */
function normalize(value: string): string {
  return value.replace(/İ/g, "i").replace(/ı/g, "i").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");
}

function haystack(listing: Listing): string {
  const parts = [
    listing.title,
    listing.place,
    listing.postcode,
    listing.street,
    listing.authority,
    listing.fileNo,
    listing.region,
    listing.segmentLabel,
    listing.tr?.mahalle,
    listing.tr?.ada && listing.tr?.parsel ? `${listing.tr.ada}/${listing.tr.parsel}` : null,
  ];
  return normalize(parts.filter(Boolean).join(" "));
}

/** The part of the search filters an alert keeps. */
export function toStoredFilters(filters: ListingFilters, regionName: string | null): StoredAlertFilters {
  return {
    query: filters.query,
    region: filters.region,
    regionName: filters.region ? regionName : null,
    segment: filters.segment,
    minValue: filters.minValue,
    maxValue: filters.maxValue,
  };
}

export function matchesAlert(listing: Listing, filters: StoredAlertFilters, now: number): boolean {
  if (filters.region && listing.regionCode !== filters.region) return false;
  if (filters.segment && listing.segment !== filters.segment) return false;
  if (filters.minValue !== null && (listing.appraisedValue ?? -1) < filters.minValue) return false;
  if (filters.maxValue !== null && (listing.appraisedValue ?? Infinity) > filters.maxValue) return false;
  const state = getHearingStatus(listing, now).state;
  if (state === "past" || state === "unknown") return false;
  const terms = normalize(filters.query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const text = haystack(listing);
  return terms.every((term) => text.includes(term));
}

export function scheduleOf(listing: Listing): AlertSchedule {
  return {
    hearingAt: listing.hearingAt,
    rounds: listing.rounds.map((round) => `${round.start}/${round.end}`),
    cancelled: listing.cancelled,
  };
}

const sameSchedule = (a: AlertSchedule, b: AlertSchedule): boolean =>
  a.hearingAt === b.hearingAt && a.cancelled === b.cancelled && a.rounds.join("|") === b.rounds.join("|");

/** First date of a remembered schedule — the round start or the hearing. */
const firstDate = (schedule: AlertSchedule): string | null => schedule.rounds[0]?.split("/")[0] ?? schedule.hearingAt;

/**
 * Compares the current matches with what the alert remembered. New keys are
 * only reported while the proceeding is not cancelled — a cancelled newcomer
 * is no offer. Keys that left the snapshot are not reported: the source did
 * not say why.
 */
export function diffAlert(matches: Listing[], seen: Map<string, AlertSchedule>, now: number): AlertHit[] {
  const hits: AlertHit[] = [];
  for (const listing of matches) {
    const current = scheduleOf(listing);
    const before = seen.get(listing.key);
    if (!before) {
      if (!listing.cancelled) hits.push({ listingKey: listing.key, kind: "new", before: null, after: getNextDate(listing, now) });
      continue;
    }
    if (sameSchedule(before, current)) continue;
    const kind = current.cancelled && !before.cancelled ? "cancelled" : !current.cancelled && before.cancelled ? "reinstated" : "rescheduled";
    hits.push({ listingKey: listing.key, kind, before: firstDate(before), after: firstDate(current) });
  }
  return hits;
}
