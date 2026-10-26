import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { alertSeen, searchAlerts } from "@/db/schema";
import { ALERTS } from "@/lib/alerts/alertConfig";
import { diffAlert, matchesAlert, scheduleOf } from "@/lib/alerts/alertMatch";
import { MarketCode } from "@/lib/constants";
import { AlertHit, AlertSchedule, AlertView, StoredAlertFilters } from "@/types/alert.types";
import { Listing, ListingSnapshot } from "@/types/listing.types";

/** Read fresh on every run, not from ListingService's cache — the run exists to notice a new file. */
async function readListings(market: MarketCode): Promise<Listing[]> {
  const raw =
    market === "TR"
      ? await readFile(join(process.cwd(), "data", "snapshots", "tr.json"), "utf8")
      : await readFile(join(process.cwd(), "data", "snapshots", "de.json"), "utf8");
  return (JSON.parse(raw) as ListingSnapshot).listings;
}

const VIEW_COLUMNS = {
  id: searchAlerts.id,
  market: searchAlerts.market,
  name: searchAlerts.name,
  filters: searchAlerts.filters,
  notifyNew: searchAlerts.notifyNew,
  notifyChanges: searchAlerts.notifyChanges,
  isActive: searchAlerts.isActive,
  lastCheckedAt: searchAlerts.lastCheckedAt,
  lastSentAt: searchAlerts.lastSentAt,
  createdAt: searchAlerts.createdAt,
};

type AlertRow = Omit<AlertView, "market"> & { market: string };

const toView = (row: AlertRow): AlertView => ({ ...row, market: row.market === "TR" ? "TR" : "DE" });

export interface NewAlert {
  userId: string;
  market: MarketCode;
  name: string;
  filters: StoredAlertFilters;
  notifyNew: boolean;
  notifyChanges: boolean;
}

/**
 * AlertService
 *
 * Saved searches of a user and the memory of what each one has already seen.
 * Every user-facing query is scoped to the user id.
 */
export class AlertService {
  static list = async (userId: string): Promise<AlertView[]> => {
    const rows = await db.select(VIEW_COLUMNS).from(searchAlerts).where(eq(searchAlerts.userId, userId)).orderBy(desc(searchAlerts.createdAt));
    return rows.map(toView);
  };

  static countForUser = async (userId: string): Promise<number> => {
    const [row] = await db.select({ value: count() }).from(searchAlerts).where(eq(searchAlerts.userId, userId));
    return row?.value ?? 0;
  };

  /**
   * Saves the search and remembers every proceeding that matches right now,
   * so the first mail brings what is new from here on — not the whole list.
   */
  static create = async (alert: NewAlert, now: number): Promise<string> => {
    const [row] = await db.insert(searchAlerts).values({ ...alert, lastCheckedAt: new Date(now) }).returning({ id: searchAlerts.id });
    const matches = (await readListings(alert.market)).filter((listing) => matchesAlert(listing, alert.filters, now));
    await AlertService.remember(row.id, matches);
    return row.id;
  };

  static setActive = async (userId: string, alertId: string, isActive: boolean): Promise<void> => {
    await db.update(searchAlerts).set({ isActive }).where(and(eq(searchAlerts.id, alertId), eq(searchAlerts.userId, userId)));
  };

  static remove = async (userId: string, alertId: string): Promise<void> => {
    await db.delete(searchAlerts).where(and(eq(searchAlerts.id, alertId), eq(searchAlerts.userId, userId)));
  };

  /** Active alerts of all users, oldest first — input of the runner. */
  static listActive = async () => {
    return db
      .select({ ...VIEW_COLUMNS, userId: searchAlerts.userId })
      .from(searchAlerts)
      .where(eq(searchAlerts.isActive, true))
      .orderBy(searchAlerts.createdAt);
  };

  static readListings = readListings;

  /** What has changed for one alert since its last run; nothing is stored yet. */
  static diff = async (alertId: string, matches: Listing[], now: number): Promise<AlertHit[]> => {
    const rows = await db.select({ key: alertSeen.listingKey, schedule: alertSeen.schedule }).from(alertSeen).where(eq(alertSeen.alertId, alertId));
    const seen = new Map<string, AlertSchedule>(rows.map((row) => [row.key, row.schedule]));
    return diffAlert(matches, seen, now);
  };

  /** Stores the current dates of the given proceedings for the alert (insert or update). */
  static remember = async (alertId: string, listings: Listing[]): Promise<void> => {
    for (let start = 0; start < listings.length; start += ALERTS.seedBatchSize) {
      const batch = listings.slice(start, start + ALERTS.seedBatchSize);
      await db
        .insert(alertSeen)
        .values(batch.map((listing) => ({ alertId, listingKey: listing.key, schedule: scheduleOf(listing) })))
        .onConflictDoUpdate({ target: [alertSeen.alertId, alertSeen.listingKey], set: { schedule: sql`excluded.schedule`, seenAt: sql`now()` } });
    }
  };

  static markChecked = async (alertIds: string[], sent: boolean, now: number): Promise<void> => {
    if (alertIds.length === 0) return;
    const at = new Date(now);
    await db
      .update(searchAlerts)
      .set(sent ? { lastCheckedAt: at, lastSentAt: at } : { lastCheckedAt: at })
      .where(inArray(searchAlerts.id, alertIds));
  };
}
