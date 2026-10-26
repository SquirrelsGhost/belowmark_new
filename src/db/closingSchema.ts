import { bigint, boolean, date, index, integer, jsonb, pgTable, primaryKey, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
// Circular on purpose: schema.ts re-exports this file. `users` is only read lazily inside references().
import { users } from "./schema";

/** Same audit columns as `timestamps` in schema.ts — copied, because that constant is not initialised yet when this file runs. */
const auditColumns = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * Hearing results reported by users (Terminergebnisse) — the portals publish none.
 * Anonymous by design: no names of bidders, buyers or owners are asked or stored.
 * Notice facts (region, segment, Verkehrswert) are frozen at the time of the entry.
 * Only rows with `shared` count in the statistics, and only in groups of five or more.
 */
export const hearingResults = pgTable(
  "hearing_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingKey: varchar("listing_key", { length: 128 }).notNull(),
    market: varchar("market", { length: 2 }).notNull(),
    regionCode: varchar("region_code", { length: 16 }),
    segment: varchar("segment", { length: 16 }).notNull(),
    appraisedValue: bigint("appraised_value", { mode: "number" }),
    /** yyyy-mm-dd, court time */
    hearingDate: date("hearing_date", { mode: "string" }).notNull(),
    outcome: varchar("outcome", { length: 16 }).notNull(),
    highestBid: bigint("highest_bid", { mode: "number" }),
    retainedRights: bigint("retained_rights", { mode: "number" }),
    bidderCount: integer("bidder_count"),
    source: varchar("source", { length: 16 }).notNull(),
    isBuyer: boolean("is_buyer").notNull().default(false),
    shared: boolean("shared").notNull().default(true),
    ...auditColumns(),
  },
  (table) => [
    uniqueIndex("hearing_results_user_hearing_idx").on(table.userId, table.listingKey, table.hearingDate),
    index("hearing_results_market_idx").on(table.market, table.outcome),
  ],
);

export type HearingResultRow = typeof hearingResults.$inferSelect;

/** The buyer's own case after the Zuschlag: the dates the task list counts from and the ticked tasks. */
export const closingCases = pgTable(
  "closing_cases",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingKey: varchar("listing_key", { length: 128 }).notNull(),
    market: varchar("market", { length: 2 }).notNull(),
    awardDate: date("award_date", { mode: "string" }),
    distributionDate: date("distribution_date", { mode: "string" }),
    taxNoticeDate: date("tax_notice_date", { mode: "string" }),
    handoverDate: date("handover_date", { mode: "string" }),
    done: jsonb("done").$type<string[]>().notNull().default([]),
    ...auditColumns(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.listingKey] })],
);

export type ClosingCaseRow = typeof closingCases.$inferSelect;
