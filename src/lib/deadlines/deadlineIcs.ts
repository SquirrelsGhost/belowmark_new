import { DEADLINE_REMIND_HOUR } from "@/lib/deadlines/deadlineConstants";
import { addDays } from "@/lib/deadlines/deadlineDates";
import { DeadlineItem } from "@/types/deadline.types";

/**
 * iCalendar (RFC 5545) for the Termin-Begleiter: one event per entry, all-day
 * when only the day is known, with one alarm per reminder offset. The same
 * text serves the download and the subscribed feed.
 */

export interface IcsEntry {
  listingKey: string;
  /** "Amtsgericht X · 12 K 3/26" — goes in front of the title */
  reference: string;
  url: string;
  item: DeadlineItem;
}

interface IcsLabels {
  CalendarName: string;
  Source: string;
}

const LINE_LIMIT = 74;
const HOUR_MS = 60 * 60 * 1000;

const utc = (iso: string): string => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const compactDay = (day: string): string => day.replace(/-/g, "");

const escape = (text: string): string => text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Folds at 74 octets (UTF-8), never inside a character — Turkish letters take two. */
function fold(line: string): string {
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = Buffer.byteLength(char);
    if (bytes + size > LINE_LIMIT) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

/** Alarm offsets. All-day events start at midnight, so the alarm moves to the reminder hour of that day. */
function trigger(offsetDays: number, allDay: boolean): string {
  if (!allDay) return offsetDays === 0 ? "-PT1H" : `-P${offsetDays}D`;
  const hours = offsetDays * 24 - DEADLINE_REMIND_HOUR;
  return hours <= 0 ? `PT${-hours}H` : `-PT${hours}H`;
}

function event(entry: IcsEntry, labels: IcsLabels, stamp: string): string[] {
  const { item } = entry;
  const allDay = !item.time;
  const when = allDay
    ? [`DTSTART;VALUE=DATE:${compactDay(item.date)}`, `DTEND;VALUE=DATE:${compactDay(addDays(item.date, 1))}`]
    : [`DTSTART:${utc(item.time as string)}`, `DTEND:${utc(new Date(Date.parse(item.time as string) + HOUR_MS).toISOString())}`];
  const source = item.law ? `\n\n${labels.Source}: ${item.law.label} — ${item.law.href}` : "";
  const alarms = item.remindDays.flatMap((offset) => ["BEGIN:VALARM", "ACTION:DISPLAY", fold(`DESCRIPTION:${escape(item.title)}`), `TRIGGER:${trigger(offset, allDay)}`, "END:VALARM"]);

  return [
    "BEGIN:VEVENT",
    fold(`UID:${encodeURIComponent(entry.listingKey)}-${item.id}@belowmark.com`),
    `DTSTAMP:${stamp}`,
    ...when,
    fold(`SUMMARY:${escape(`${item.title} · ${entry.reference}`)}`),
    fold(`DESCRIPTION:${escape(`${item.detail}${source}\n\n${entry.url}`)}`),
    fold(`URL:${entry.url}`),
    allDay ? "TRANSP:TRANSPARENT" : "TRANSP:OPAQUE",
    ...alarms,
    "END:VEVENT",
  ];
}

export function buildDeadlineCalendar(entries: IcsEntry[], labels: IcsLabels, now: number): string {
  const stamp = utc(new Date(now).toISOString());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Belowmark//Termin-Begleiter//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    fold(`X-WR-CALNAME:${escape(labels.CalendarName)}`),
    // Subscribed calendars ask again twice a day
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
  ];
  for (const entry of entries) lines.push(...event(entry, labels, stamp));
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
