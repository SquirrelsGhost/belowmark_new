"use server";

import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  COUNTRY_COOKIE_NAME,
  GEO_COUNTRY_HEADERS,
  isLocaleOption,
  isPricingCountry,
  LEGACY_MARKET_COOKIE_NAME,
  LOCALE_COOKIE_NAME,
  LocaleOption,
  MARKET_COOKIE_NAME,
  PricingCountryCode,
  pricingCountryToLocale,
  pricingCountryToMarket,
  REGION_COOKIE_MAX_AGE,
} from "@/lib/constants";
import { hasPermission } from "@/lib/permissions";
import { formatGeoScopedCookie, normalizeGeoCountryCode } from "@/lib/regionLocale";
import { SessionService } from "@/services/SessionService";

const PERSISTENT_COUNTRY_COOKIE = { path: "/", maxAge: REGION_COOKIE_MAX_AGE, sameSite: "lax" } as const;
const SESSION_SCOPED_COOKIE = { path: "/", sameSite: "lax" } as const;

async function currentLocationScope(): Promise<string | null> {
  const headersList = await headers();
  const cookieStore = await cookies();
  const geo = GEO_COUNTRY_HEADERS.map((name) => normalizeGeoCountryCode(headersList.get(name))).find(Boolean) ?? null;
  if (geo) return geo;
  return normalizeGeoCountryCode(cookieStore.get(COUNTRY_COOKIE_NAME)?.value);
}

/** Server Action: stores the 2-letter ISO country <RegionDetector /> derived from the browser time zone. */
export async function setDetectedCountryAction(country: string): Promise<void> {
  const normalized = normalizeGeoCountryCode(country);
  if (!normalized) return;
  const cookieStore = await cookies();
  cookieStore.set(COUNTRY_COOKIE_NAME, normalized, PERSISTENT_COUNTRY_COOKIE);
  cookieStore.delete(LEGACY_MARKET_COOKIE_NAME);
}

const LOCALE_TO_DEFAULT_MARKET: Record<LocaleOption, PricingCountryCode> = {
  tr: "TR",
  de: "DE",
  en: "GB",
  it: "IT",
  es: "ES",
  fr: "FR",
};

/** Server Action: stores the UI language + matching flagship market picked in the top navigation bar. */
export async function setLocaleAction(locale: LocaleOption): Promise<void> {
  if (!isLocaleOption(locale)) return;
  const scope = await currentLocationScope();
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, formatGeoScopedCookie(scope, locale), SESSION_SCOPED_COOKIE);
  cookieStore.set(
    MARKET_COOKIE_NAME,
    formatGeoScopedCookie(scope, LOCALE_TO_DEFAULT_MARKET[locale]),
    SESSION_SCOPED_COOKIE,
  );
  cookieStore.delete(LEGACY_MARKET_COOKIE_NAME);
}

/**
 * Server Action: stores the country/market picked in the pricing section or on /buchen.
 * Session-scoped to the current physical country so traveling never gets stuck on an old market.
 */
export async function setMarketAction(country: PricingCountryCode): Promise<void> {
  if (!isPricingCountry(country)) return;
  const scope = await currentLocationScope();
  const cookieStore = await cookies();
  cookieStore.set(MARKET_COOKIE_NAME, formatGeoScopedCookie(scope, country), SESSION_SCOPED_COOKIE);
  cookieStore.set(
    LOCALE_COOKIE_NAME,
    formatGeoScopedCookie(scope, pricingCountryToLocale(country)),
    SESSION_SCOPED_COOKIE,
  );
  cookieStore.delete(LEGACY_MARKET_COOKIE_NAME);

  const market = pricingCountryToMarket(country);
  const user = await SessionService.getCurrentUser();
  if (!user || user.market === market) return;
  const canSwitch = !user.plan || hasPermission(user.permissions, "*");
  if (canSwitch && !user.teamSeat) {
    await db.update(users).set({ market }).where(eq(users.id, user.id));
  }
}
