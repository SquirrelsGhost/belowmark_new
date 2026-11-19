import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { DAY_MS } from "@/lib/appConstants";
import { MarketCode } from "@/lib/constants";
import { countryMarket } from "@/lib/listingCountry";
import { hasPermission } from "@/lib/permissions";
import { CountryAccessService } from "@/services/CountryAccessService";
import { SessionService } from "@/services/SessionService";
import { ListingCountry } from "@/types/listing.types";

/** Access level inside the app. "free" sees the list, but values stay blacked out. */
export type AppPlan = "free" | "investor";

/** Why the viewer has (or lacks) full access — shown in the account menu. */
export type AppAccess = "admin" | "plan" | "team" | "trial" | "free";

/** What the app needs to know about the signed-in person. */
export interface AppViewer {
  id: string;
  email: string;
  market: MarketCode;
  /** The account's country: search, map, calendar and every listing read are cut to it */
  country: ListingCountry;
  /** Countries the viewer may open (one, all of the market for superusers) — pass to ListingService */
  countries: readonly ListingCountry[];
  plan: AppPlan;
  access: AppAccess;
  /** Whole days left in the trial, null without a trial date */
  trialDaysLeft: number | null;
  /** Request time — read once here, after the session, so every component agrees on "now" */
  now: number;
}

/**
 * AppSessionService
 *
 * Thin layer over SessionService for the /app area. Access is determined via
 * pure capability-based permissions (`hasPermission(user.permissions, ...)`).
 */
export class AppSessionService {
  /** The viewer, or a redirect to the login that brings them back to `returnTo`. */
  static requireViewer = async (returnTo: string): Promise<AppViewer> => {
    await connection();
    const user = await SessionService.getCurrentUser();
    if (!user) redirect(`${AUTH_ROUTES.login}?${AUTH_PARAMS.next}=${encodeURIComponent(returnTo)}`);

    const now = Date.now();
    const { country, countries } = await CountryAccessService.forUser(user);
    const trialEndsAt = user.trialEndsAt?.getTime() ?? null;
    const isSuperuser = hasPermission(user.permissions, "*");
    const isTrialOnly = user.plan === null && !isSuperuser && !user.teamSeat && user.hasFullAccess;
    return {
      id: user.id,
      email: user.email,
      market: countryMarket(country),
      country,
      countries,
      plan: user.hasFullAccess ? "investor" : "free",
      access: isSuperuser ? "admin" : user.plan ? "plan" : user.teamSeat ? "team" : user.hasFullAccess ? "trial" : "free",
      // Booked plans, team seats and superusers have no trial countdown
      trialDaysLeft: trialEndsAt === null || !isTrialOnly ? null : Math.max(0, Math.ceil((trialEndsAt - now) / DAY_MS)),
      now,
    };
  };
}
