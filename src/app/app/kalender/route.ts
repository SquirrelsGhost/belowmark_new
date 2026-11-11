import { connection } from "next/server";
import { err } from "@/lib/api";
import { buildCalendar } from "@/lib/ics";
import { CountryAccessService } from "@/services/CountryAccessService";
import { FreeUnlockService } from "@/services/FreeUnlockService";
import { ListingService } from "@/services/ListingService";
import { SessionService } from "@/services/SessionService";
import { TranslationService } from "@/services/TranslationService";
import { WatchlistService } from "@/services/WatchlistService";

/**
 * GET /app/kalender           → every hearing on the watch list as .ics
 * GET /app/kalender?key=…     → one proceeding as .ics
 *
 * Returns a calendar file instead of JSON on success; errors use err().
 */
export async function GET(request: Request): Promise<Response> {
  // Per-user file: never prerendered, always rendered for the request.
  await connection();
  try {
    const user = await SessionService.getCurrentUser();
    if (!user) return err("Nicht angemeldet", 401);

    const key = new URL(request.url).searchParams.get("key");
    const keys = key ? [key] : (await WatchlistService.list(user.id)).map((item) => item.listingId);
    const { countries } = await CountryAccessService.forUser(user);
    const rawListings = await ListingService.getMany(countries, keys);
    if (key && rawListings.length === 0) return err("Verfahren nicht gefunden", 404);
    const listings = await FreeUnlockService.redactForViewer(user.id, !user.hasFullAccess, rawListings);

    const t = await TranslationService.GetUserTranslations();
    const body = buildCalendar(listings, t.App.Ics, Date.now());
    const safeSlug = key ? (user.hasFullAccess ? listings[0].fileNo : listings[0].key).replace(/[^\w-]+/g, "-") : "merkliste";
    const filename = `belowmark-${safeSlug}.ics`;

    return new Response(body, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[GET /app/kalender]", error);
    return err("Internal server error");
  }
}
