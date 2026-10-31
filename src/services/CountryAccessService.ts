import "server-only";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { billingOrders, users } from "@/db/schema";
import { MarketCode } from "@/lib/constants";
import { accountCountry, isListingCountry, LISTING_COUNTRIES } from "@/lib/listingCountry";
import { effectiveUserPermissions, hasFullAppAccess, hasPermission } from "@/lib/permissions";
import { activePlanSql } from "@/services/billing/activePlanSql";
import { SessionService } from "@/services/SessionService";
import { TeamSeatService } from "@/services/team/TeamSeatService";
import { CurrentUser } from "@/types/auth.types";
import { ListingCountry } from "@/types/listing.types";

/** Which countries a signed-in account may see. */
export interface CountryAccess {
  /** The account's active country — what search, map and calendar show */
  country: ListingCountry;
  /** Every country the account may open (multiple paid countries, or all countries for superusers). */
  countries: readonly ListingCountry[];
}

type AccessUser = Pick<CurrentUser, "id" | "market" | "country" | "permissions" | "teamSeat">;

/**
 * CountryAccessService
 *
 * Resolves the active country and all countries an account holds (from active
 * paid orders, team seat, or superuser capabilities).
 */
export class CountryAccessService {
  static forUser = cache(async (user: AccessUser): Promise<CountryAccess> => {
    const market: MarketCode = user.market === "TR" ? "TR" : "DE";
    const own = isListingCountry(user.country) ? user.country : accountCountry(user.country, market);
    if (hasPermission(user.permissions, "*")) {
      return { country: own, countries: LISTING_COUNTRIES };
    }

    const paidRows = await db
      .select({ market: billingOrders.market })
      .from(billingOrders)
      .where(
        and(
          eq(billingOrders.userId, user.id),
          eq(billingOrders.status, "paid"),
          or(isNull(billingOrders.accessEndsAt), gt(billingOrders.accessEndsAt, new Date())),
        ),
      );
    const held = new Set<ListingCountry>([own]);
    for (const row of paidRows) {
      if (isListingCountry(row.market)) held.add(row.market);
    }

    if (user.teamSeat) {
      const seat = await TeamSeatService.seatCountry(user.id);
      if (seat) {
        const seatCountry = isListingCountry(seat.country)
          ? seat.country
          : accountCountry(seat.country, seat.market === "TR" ? "TR" : "DE");
        held.add(seatCountry);
        if (held.size === 1) return { country: seatCountry, countries: [seatCountry] };
      }
    }

    const countries = LISTING_COUNTRIES.filter((c) => held.has(c));
    const active = held.has(own) ? own : (countries[0] ?? own);
    return { country: active, countries: countries.length > 0 ? countries : [active] };
  });

  /** Scope of whoever is signed in for this request; null without a session. For server actions and routes. */
  static current = async (): Promise<CountryAccess | null> => {
    const user = await SessionService.getCurrentUser();
    return user ? CountryAccessService.forUser(user) : null;
  };

  /** Same answer for jobs without a session (calendar feed, mail runners). null when the account is gone. */
  static forUserId = async (userId: string): Promise<CountryAccess | null> => {
    const [row] = await db
      .select({ market: users.market, country: users.country, permissions: users.permissions, plan: activePlanSql, trialEndsAt: users.trialEndsAt, bannedAt: users.gesperrtAm })
      .from(users)
      .where(eq(users.id, userId));
    if (!row) return null;
    const permissions = effectiveUserPermissions(row);
    const teamSeat = !hasFullAppAccess(permissions) && (await TeamSeatService.has(userId));
    return CountryAccessService.forUser({ id: userId, market: row.market, country: row.country, permissions, teamSeat });
  };
}
