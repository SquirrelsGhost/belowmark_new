import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Reusable audit timestamp columns for all PostgreSQL tables.
 */
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

/**
 * Core PostgreSQL Database Schema (Belowmark)
 *
 * Define all database tables, relations, and types here.
 * Run `npm run db:generate` or `npm run db:push` to sync with PostgreSQL.
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name"),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
