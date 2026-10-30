import { fill } from "@/lib/appFormat";
import { getHearingStatus } from "@/lib/listingMath";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing } from "@/types/listing.types";

/**
 * Minimal iCalendar (RFC 5545) writer for hearing dates. Times are written in
 * UTC, so every calendar shows them in the reader's own time zone correctly.
 */

const LINE_LIMIT = 74;

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escape = (text: string) => text.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Long lines are folded by UTF-8 octets (RFC 5545 § 3.1: max 75 octets per line, never splitting a multi-byte char). */
function fold(line: string): string {
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = Buffer.byteLength(ch, "utf8");
    const limit = parts.length === 0 ? 75 : LINE_LIMIT;
    if (bytes + size > limit && current.length > 0) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  if (current.length > 0 || parts.length === 0) {
    parts.push(current);
  }
  return parts.join("\r\n ");
}

/** One event per upcoming round (DE: the hearing; TR: each Artırma). */
function events(listing: Listing, labels: IAppTranslation["Ics"], now: number, createdAt: string): string[] {
  const status = getHearingStatus(listing, now);
  if (status.state === "cancelled" || status.state === "past" || status.state === "unknown") return [];
  const rounds = listing.rounds.length > 0 ? listing.rounds : listing.hearingAt ? [{ round: 1, start: listing.hearingAt, end: listing.hearingAt }] : [];
  const values = { fileNo: listing.fileNo, place: listing.place ?? listing.region ?? "", authority: listing.authority, url: listing.officialUrl };

  return rounds
    .filter((round) => Date.parse(round.end) >= now)
    .flatMap((round) => [
      "BEGIN:VEVENT",
      fold(`UID:${encodeURIComponent(listing.key)}-${round.round}@belowmark.com`),
      `DTSTAMP:${stamp(createdAt)}`,
      `DTSTART:${stamp(round.start)}`,
      `DTEND:${stamp(round.end === round.start ? new Date(Date.parse(round.start) + 60 * 60 * 1000).toISOString() : round.end)}`,
      fold(`SUMMARY:${escape(fill(labels.Summary, values))}`),
      fold(`DESCRIPTION:${escape(fill(labels.Description, values))}`),
      fold(`LOCATION:${escape(listing.authority)}`),
      fold(`URL:${listing.officialUrl}`),
      "END:VEVENT",
    ]);
}

export function buildCalendar(listings: Listing[], labels: IAppTranslation["Ics"], now: number): string {
  const createdAt = new Date(now).toISOString();
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Belowmark//Termine//DE", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
  for (const listing of listings) lines.push(...events(listing, labels, now, createdAt));
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
