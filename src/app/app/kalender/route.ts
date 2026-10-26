import { connection } from "next/server";
import { err } from "@/lib/api";
import { buildCalendar } from "@/lib/ics";
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

    const market = user.market === "TR" ? "TR" : "DE";
    const key = new URL(request.url).searchParams.get("key");
    const keys = key ? [key] : (await WatchlistService.list(user.id)).map((item) => item.listingId);
    const listings = await ListingService.getMany(market, keys);
    if (key && listings.length === 0) return err("Verfahren nicht gefunden", 404);

    const t = await TranslationService.GetUserTranslations();
    const body = buildCalendar(listings, t.App.Ics, Date.now());
    const filename = key ? `belowmark-${listings[0].fileNo.replace(/[^\w-]+/g, "-")}.ics` : "belowmark-merkliste.ics";

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
