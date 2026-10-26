import { connection } from "next/server";
import { err } from "@/lib/api";
import { buildDeadlineCalendar } from "@/lib/deadlines/deadlineIcs";
import { DeadlineService } from "@/services/DeadlineService";
import { DeadlineTimelineService } from "@/services/DeadlineTimelineService";
import { ListingService } from "@/services/ListingService";
import { getDeadlineTranslation } from "@/translations/deadlines/DeadlineTranslations";

const TOKEN = /^[A-Za-z0-9_-]{43}$/;

/**
 * GET /api/termine/feed/<token>.ics — the calendar subscription of one user.
 * Calendar apps fetch it without a session, so the secret token in the path
 * is the only key; only its hash is stored. Returns .ics on success, err() otherwise.
 */
export async function GET(_: Request, { params }: RouteContext<"/api/termine/feed/[token]">): Promise<Response> {
  await connection();
  try {
    const token = (await params).token.replace(/\.ics$/, "");
    if (!TOKEN.test(token)) return err("Not found", 404);
    const userId = await DeadlineService.userForFeed(token);
    if (!userId) return err("Not found", 404);
    const recipient = (await DeadlineTimelineService.recipients([userId])).get(userId);
    if (!recipient) return err("Not found", 404);
    // A lapsed plan keeps the address but the calendar stays empty until the plan is back
    const follows = recipient.hasFullAccess ? await DeadlineService.list(userId) : [];
    const now = Date.now();
    const listings = (
      await Promise.all((["DE", "TR"] as const).map((market) => ListingService.getMany(market, follows.filter((follow) => follow.market === market).map((follow) => follow.listingKey))))
    ).flat();
    const entries = await DeadlineTimelineService.icsEntries(userId, listings, recipient.locale, now);
    const body = buildDeadlineCalendar(entries, getDeadlineTranslation(recipient.locale).Ics, now);
    return new Response(body, {
      headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
    });
  } catch (error) {
    console.error("[GET /api/termine/feed]", error);
    return err("Internal server error");
  }
}
