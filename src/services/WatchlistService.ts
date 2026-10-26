import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { watchlist } from "@/db/schema";
import { NOTE_MAX_LENGTH } from "@/lib/appConstants";

export interface WatchlistItem {
  listingId: string;
  note: string | null;
  createdAt: Date;
}

/**
 * WatchlistService
 *
 * The user's saved proceedings ("Merkliste") with a private note each.
 * Every query is scoped to the user id — nobody reads someone else's list.
 */
export class WatchlistService {
  static list = async (userId: string): Promise<WatchlistItem[]> => {
    return db
      .select({ listingId: watchlist.listingId, note: watchlist.note, createdAt: watchlist.createdAt })
      .from(watchlist)
      .where(eq(watchlist.userId, userId))
      .orderBy(desc(watchlist.createdAt));
  };

  static keys = async (userId: string): Promise<Set<string>> => {
    const rows = await db.select({ listingId: watchlist.listingId }).from(watchlist).where(eq(watchlist.userId, userId));
    return new Set(rows.map((row) => row.listingId));
  };

  static get = async (userId: string, listingId: string): Promise<WatchlistItem | null> => {
    const [row] = await db
      .select({ listingId: watchlist.listingId, note: watchlist.note, createdAt: watchlist.createdAt })
      .from(watchlist)
      .where(and(eq(watchlist.userId, userId), eq(watchlist.listingId, listingId)));
    return row ?? null;
  };

  static add = async (userId: string, listingId: string): Promise<void> => {
    await db.insert(watchlist).values({ userId, listingId }).onConflictDoNothing();
  };

  static remove = async (userId: string, listingId: string): Promise<void> => {
    await db.delete(watchlist).where(and(eq(watchlist.userId, userId), eq(watchlist.listingId, listingId)));
  };

  /** Saves the note and puts the proceeding on the list if it was not there yet. */
  static saveNote = async (userId: string, listingId: string, note: string): Promise<void> => {
    const value = note.trim().slice(0, NOTE_MAX_LENGTH) || null;
    await db
      .insert(watchlist)
      .values({ userId, listingId, note: value })
      .onConflictDoUpdate({ target: [watchlist.userId, watchlist.listingId], set: { note: value } });
  };
}
