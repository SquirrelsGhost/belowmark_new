import { connection } from "next/server";
import { err } from "@/lib/api";
import { buildDeadlineCalendar } from "@/lib/deadlines/deadlineIcs";
import { DeadlineService } from "@/services/DeadlineService";
import { DeadlineTimelineService } from "@/services/DeadlineTimelineService";
import { ListingService } from "@/services/ListingService";
import { SessionService } from "@/services/SessionService";
import { TranslationService } from "@/services/TranslationService";
import { getDeadlineTranslation } from "@/translations/deadlines/DeadlineTranslations";

/**
 * GET /app/termine/kalender?key=…  → the deadlines of one proceeding as .ics
 * GET /app/termine/kalender         → every followed proceeding
 *
 * Returns a calendar file instead of JSON on success; errors use err().
 */
export async function GET(request: Request): Promise<Response> {
  await connection();
  try {
    const user = await SessionService.getCurrentUser();
    if (!user) return err("Nicht angemeldet", 401);
    if (!user.hasFullAccess) return err("Nicht im Tarif enthalten", 403);

    const market = user.market === "TR" ? "TR" : "DE";
    const key = new URL(request.url).searchParams.get("key");
    const keys = key ? [key] : (await DeadlineService.list(user.id)).filter((follow) => follow.market === market).map((follow) => follow.listingKey);
    const listings = await ListingService.getMany(market, keys);
    if (key && listings.length === 0) return err("Verfahren nicht gefunden", 404);

    const locale = TranslationService.ToLocaleOption(await TranslationService.GetUserLocale());
    const now = Date.now();
    const entries = await DeadlineTimelineService.icsEntries(user.id, listings, locale, now);
    const body = buildDeadlineCalendar(entries, getDeadlineTranslation(locale).Ics, now);
    const filename = key ? `belowmark-fristen-${listings[0].fileNo.replace(/[^\w-]+/g, "-")}.ics` : "belowmark-fristen.ics";

    return new Response(body, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[GET /app/termine/kalender]", error);
    return err("Internal server error");
  }
}
