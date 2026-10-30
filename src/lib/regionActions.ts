"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  COUNTRY_COOKIE_NAME,
  isPricingCountry,
  MARKET_COOKIE_NAME,
  PricingCountryCode,
  pricingCountryToMarket,
  REGION_COOKIE_MAX_AGE,
} from "@/lib/constants";
import { hasPermission } from "@/lib/permissions";
import { SessionService } from "@/services/SessionService";

const COOKIE_OPTIONS = { path: "/", maxAge: REGION_COOKIE_MAX_AGE, sameSite: "lax" } as const;

/** Server Action: stores the country <RegionDetector /> derived from the browser time zone. */
export async function setDetectedCountryAction(country: PricingCountryCode): Promise<void> {
  if (!isPricingCountry(country)) return;
  const cookieStore = await cookies();
  cookieStore.set(COUNTRY_COOKIE_NAME, country, COOKIE_OPTIONS);
}

/**
 * Server Action: stores the country/market picked in the pricing section or on /buchen.
 * If the signed-in user has no locked paid subscription (free/trial) or is an admin,
 * their account market is also updated immediately.
 */
export async function setMarketAction(country: PricingCountryCode): Promise<void> {
  if (!isPricingCountry(country)) return;
  const cookieStore = await cookies();
  cookieStore.set(MARKET_COOKIE_NAME, country, COOKIE_OPTIONS);

  const market = pricingCountryToMarket(country);
  const user = await SessionService.getCurrentUser();
  if (!user || user.market === market) return;
  const canSwitch = !user.plan || hasPermission(user.permissions, "*");
  if (canSwitch && !user.teamSeat) {
    await db.update(users).set({ market }).where(eq(users.id, user.id));
  }
}
