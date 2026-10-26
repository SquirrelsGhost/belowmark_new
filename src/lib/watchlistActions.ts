"use server";

import { revalidatePath } from "next/cache";
import { APP_ROUTES } from "@/lib/appConstants";
import { ListingService } from "@/services/ListingService";
import { SessionService } from "@/services/SessionService";
import { WatchlistService } from "@/services/WatchlistService";

/** Result of a watch list action — the UI only needs to know whether it worked. */
export interface WatchlistActionState {
  ok: boolean;
  saved?: boolean;
}

const MARKETS = { DE: "DE", TR: "TR" } as const;

/** Only signed-in users, and only keys that exist in their market. */
async function authorise(listingId: unknown): Promise<{ userId: string; listingId: string } | null> {
  const user = await SessionService.getCurrentUser();
  if (!user || typeof listingId !== "string" || listingId.length > 128) return null;
  const market = user.market === "TR" ? MARKETS.TR : MARKETS.DE;
  const listing = await ListingService.getByKey(market, listingId);
  return listing ? { userId: user.id, listingId } : null;
}

/** Server Action: puts a proceeding on the watch list or takes it off. */
export async function toggleWatchAction(_: WatchlistActionState, formData: FormData): Promise<WatchlistActionState> {
  const target = await authorise(formData.get("listingId"));
  if (!target) return { ok: false };
  const shouldSave = formData.get("save") === "1";
  try {
    if (shouldSave) await WatchlistService.add(target.userId, target.listingId);
    else await WatchlistService.remove(target.userId, target.listingId);
  } catch (error) {
    console.error("[toggleWatchAction]", error);
    return { ok: false, saved: !shouldSave };
  }
  revalidatePath(APP_ROUTES.watchlist);
  return { ok: true, saved: shouldSave };
}

/** Server Action: stores the private note of a proceeding. */
export async function saveNoteAction(_: WatchlistActionState, formData: FormData): Promise<WatchlistActionState> {
  const target = await authorise(formData.get("listingId"));
  const note = formData.get("note");
  if (!target || typeof note !== "string") return { ok: false };
  try {
    await WatchlistService.saveNote(target.userId, target.listingId, note);
  } catch (error) {
    console.error("[saveNoteAction]", error);
    return { ok: false };
  }
  revalidatePath(APP_ROUTES.watchlist);
  return { ok: true, saved: true };
}
