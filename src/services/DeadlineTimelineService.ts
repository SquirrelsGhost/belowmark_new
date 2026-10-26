import "server-only";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { listingHref } from "@/lib/appConstants";
import { LocaleOption } from "@/lib/constants";
import { buildDeadlines, sortDeadlines } from "@/lib/deadlines/buildDeadlines";
import { AFTER_AWARD_PROVIDERS } from "@/lib/deadlines/deadlineProviders";
import { IcsEntry } from "@/lib/deadlines/deadlineIcs";
import { env } from "@/lib/env";
import { effectiveUserPermissions, hasFullAppAccess } from "@/lib/permissions";
import { activePlanSql } from "@/services/billing/activePlanSql";
import { TeamSeatService } from "@/services/team/TeamSeatService";
import { TranslationService } from "@/services/TranslationService";
import { getDeadlineTranslation } from "@/translations/deadlines/DeadlineTranslations";
import { DeadlineContext, DeadlineItem } from "@/types/deadline.types";
import { Listing } from "@/types/listing.types";

/** What the run and the feed need to know about a user without a session. */
export interface DeadlineRecipient {
  id: string;
  email: string;
  locale: LocaleOption;
  hasFullAccess: boolean;
}

/**
 * DeadlineTimelineService
 *
 * The full timeline of one proceeding for one user: the entries computed from
 * notice and law, plus whatever the after-award modules deliver. A failing
 * provider is logged and left out — the own entries still show.
 */
export class DeadlineTimelineService {
  static forListing = async (ctx: DeadlineContext): Promise<DeadlineItem[]> => {
    const own = buildDeadlines(ctx, getDeadlineTranslation(ctx.locale).Items);
    if (ctx.listing.cancelled) return own;
    const extra = await Promise.all(
      AFTER_AWARD_PROVIDERS.map((provider) =>
        provider(ctx).catch((error: unknown) => {
          console.error("[DeadlineTimelineService] provider failed", error);
          return [] as DeadlineItem[];
        }),
      ),
    );
    return sortDeadlines([...own, ...extra.flat()]);
  };

  /** Calendar entries for several proceedings of one user. */
  static icsEntries = async (userId: string, listings: Listing[], locale: LocaleOption, now: number): Promise<IcsEntry[]> => {
    const perListing = await Promise.all(
      listings.map(async (listing) => {
        const items = await DeadlineTimelineService.forListing({ userId, listing, locale, now, hideAmounts: false });
        const url = new URL(listingHref(listing.key), env.appUrl).toString();
        return items.map((item) => ({ listingKey: listing.key, reference: `${listing.authority} · ${listing.fileNo}`, url, item }));
      }),
    );
    return perListing.flat();
  };

  static recipients = async (userIds: string[]): Promise<Map<string, DeadlineRecipient>> => {
    if (userIds.length === 0) return new Map();
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        locale: users.locale,
        plan: activePlanSql,
        permissions: users.permissions,
        trialEndsAt: users.trialEndsAt,
        gesperrtAm: users.gesperrtAm,
      })
      .from(users)
      .where(inArray(users.id, userIds));
    const seats = await TeamSeatService.holders(userIds);

    return new Map(
      rows
        .filter((row) => !row.gesperrtAm)
        .map((row) => {
          const permissions = effectiveUserPermissions({ permissions: row.permissions, plan: row.plan, trialEndsAt: row.trialEndsAt, bannedAt: row.gesperrtAm, teamSeat: seats.has(row.id) });
          const locale = TranslationService.ToLocaleOption(TranslationService.NormalizeLocale(row.locale));
          return [row.id, { id: row.id, email: row.email, locale, hasFullAccess: hasFullAppAccess(permissions) }];
        }),
    );
  };
}
