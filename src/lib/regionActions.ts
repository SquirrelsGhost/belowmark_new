"use server";

import { cookies } from "next/headers";
import { COUNTRY_COOKIE_NAME, MARKET_COOKIE_NAME, MARKETS, MarketCode, REGION_COOKIE_MAX_AGE } from "@/lib/constants";

const COOKIE_OPTIONS = { path: "/", maxAge: REGION_COOKIE_MAX_AGE, sameSite: "lax" } as const;

/** Server Action: stores the country <RegionDetector /> derived from the browser time zone. */
export async function setDetectedCountryAction(country: MarketCode): Promise<void> {
  if (!MARKETS.includes(country)) return;
  const cookieStore = await cookies();
  cookieStore.set(COUNTRY_COOKIE_NAME, country, COOKIE_OPTIONS);
}

/** Server Action: stores the market picked in the pricing section. */
export async function setMarketAction(market: MarketCode): Promise<void> {
  if (!MARKETS.includes(market)) return;
  const cookieStore = await cookies();
  cookieStore.set(MARKET_COOKIE_NAME, market, COOKIE_OPTIONS);
}
