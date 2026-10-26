import { MARKET_TIME_ZONES } from "@/lib/appConstants";
import { Listing } from "@/types/listing.types";

/** yyyy-mm-dd of an instant in the court's calendar. */
function courtDate(iso: string, zone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
}

/**
 * The hearing a result most likely belongs to: DE the hearing day, TR the end of
 * the last e-auction round that is over. null while nothing has taken place yet.
 */
export function lastHearingDate(listing: Listing, now: number): string | null {
  const zone = MARKET_TIME_ZONES[listing.market];
  const ends = listing.rounds.length ? listing.rounds.map((round) => round.end) : listing.hearingAt ? [listing.hearingAt] : [];
  const past = ends.filter((end) => Date.parse(end) <= now).sort();
  const last = past[past.length - 1];
  return last ? courtDate(last, zone) : null;
}
