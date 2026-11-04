import "server-only";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { isPricingCountry, LocaleOption, PricingCountryCode } from "@/lib/constants";
import { AlertService } from "@/services/AlertService";
import { CountryAccessService } from "@/services/CountryAccessService";
import { PseoService } from "@/services/PseoService";
import { WatchlistService } from "@/services/WatchlistService";
import { PseoPreviewListing } from "@/types/pseo.types";

export const SIGNUP_CTX_COOKIE = "bm_signup_ctx";
const SIGNUP_CTX_MAX_AGE = 7 * 24 * 60 * 60;

export interface StoredSignupContext {
  key?: string;
  city?: string;
  market?: PricingCountryCode;
}

export interface ResolvedSignupPageContext {
  market: PricingCountryCode;
  initialEmail?: string;
  targetKey?: string;
  targetCity?: string;
  previewListing?: PseoPreviewListing;
}

function firstParam(val: string | string[] | undefined): string {
  if (typeof val === "string") return val.trim();
  if (Array.isArray(val) && typeof val[0] === "string") return val[0].trim();
  return "";
}

async function findPreviewListingByKey(key: string): Promise<PseoPreviewListing | undefined> {
  if (!key) return undefined;
  const catalog = await PseoService.GetCatalog();

  for (const state of catalog.deStates) {
    const found = state.listings.find((l) => l.key === key);
    if (found) return found;
  }
  for (const city of catalog.cities) {
    const found = city.listings.find((l) => l.key === key);
    if (found) return found;
  }
  for (const loc of catalog.trLocations) {
    const found = loc.listings.find((l) => l.key === key);
    if (found) return found;
  }
  for (const euMarket of Object.values(catalog.euMarkets)) {
    for (const region of euMarket.regions) {
      const found = region.listings.find((l) => l.key === key);
      if (found) return found;
    }
  }
  return undefined;
}

function sanitizeSignupCity(raw: string | undefined, previewListing?: PseoPreviewListing): string | undefined {
  const candidate = (raw || "").split(/[,/\r\n]/)[0].trim();
  const isBogus = (val: string) =>
    !val ||
    /\b(?:Wertquote|Miteigentum\w*|ME|Superficie|Ubicazione|Valore|Quota|RFD|Registro|COPERTURA|DESCRIZIONE|Plan|Gartenanlage|CHF|Fr)\b/i.test(val);
  if (candidate && !isBogus(candidate)) return candidate;
  if (previewListing) {
    const placeFirst = (previewListing.place || "").split(/[,/\r\n]/)[0].trim();
    if (placeFirst && !isBogus(placeFirst)) return placeFirst;
    const authCity = (previewListing.authority || "")
      .replace(/^(?:Amtsgericht|Bezirksgericht|Betreibungsamt|Konkursamt|Betreibungs-\s*und\s*Konkursamt)\s+/i, "")
      .trim();
    if (authCity && !isBogus(authCity)) return authCity;
  }
  return undefined;
}

export async function resolveSignupPageContext(
  rawParams: Record<string, string | string[] | undefined>,
  fallbackMarket: PricingCountryCode,
): Promise<ResolvedSignupPageContext> {
  const rawMarket = firstParam(rawParams.markt || rawParams.market).toUpperCase();
  const targetKey = firstParam(rawParams.objekt || rawParams.key).slice(0, 128) || undefined;
  const rawCity = firstParam(rawParams.stadt || rawParams.city).slice(0, 80) || undefined;
  const initialEmail = firstParam(rawParams.email).slice(0, 254) || undefined;

  const previewListing = targetKey ? await findPreviewListingByKey(targetKey) : undefined;
  const targetCity = sanitizeSignupCity(rawCity, previewListing);
  const market: PricingCountryCode = isPricingCountry(rawMarket) ? rawMarket : fallbackMarket;

  return {
    market,
    initialEmail,
    targetKey,
    targetCity,
    previewListing,
  };
}

export async function saveSignupContextCookie(ctx: StoredSignupContext): Promise<void> {
  if (!ctx.key && !ctx.city && !ctx.market) return;
  const store = await cookies();
  store.set(SIGNUP_CTX_COOKIE, JSON.stringify(ctx), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SIGNUP_CTX_MAX_AGE,
  });
}

function buildDefaultAlertName(locale: LocaleOption, city: string | undefined, country: string): string {
  if (locale === "tr") {
    return city ? `${city} İcra & E-İhale Alarmı` : `Türkiye (${country}) Yeni İhale Alarmı`;
  }
  if (locale === "en") {
    return city ? `${city} Auction Alert` : `${country} Property Auction Alert`;
  }
  return city ? `Such-Alert ${city}` : `Alle neuen Termine (${country})`;
}

/**
 * Runs automatically upon email verification:
 * 1. Saves the clicked property (`ctx.key`) onto the user's `watchlist` (`Merkliste`).
 * 2. Creates the user's first active `search_alerts` entry so daily 06:15 alerts bring them back.
 * 3. Returns the exact destination URL (`/app/objekt/[key]` when a property was clicked).
 */
export async function completePostSignupOnboarding(userId: string): Promise<string> {
  let ctx: StoredSignupContext = {};
  try {
    const store = await cookies();
    const raw = store.get(SIGNUP_CTX_COOKIE)?.value;
    if (raw) {
      ctx = JSON.parse(raw) as StoredSignupContext;
      store.delete(SIGNUP_CTX_COOKIE);
    }
  } catch {
    // Ignore malformed cookie
  }

  try {
    if (ctx.key) {
      await WatchlistService.add(userId, ctx.key);
    }

    const [userRow] = await db
      .select({
        market: users.market,
        country: users.country,
        locale: users.locale,
        permissions: users.permissions,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (userRow) {
      const existingAlerts = await AlertService.countForUser(userId);
      if (existingAlerts === 0) {
        const { country, countries } = await CountryAccessService.forUser({
          id: userId,
          market: userRow.market,
          country: userRow.country,
          permissions: [],
          teamSeat: false,
        });
        const previewListing = ctx.key ? await findPreviewListingByKey(ctx.key) : undefined;
        const cleanCity = sanitizeSignupCity(ctx.city, previewListing) || "";
        const locale = (userRow.locale || "de") as LocaleOption;
        await AlertService.create(
          {
            userId,
            market: userRow.market === "TR" ? "TR" : "DE",
            name: buildDefaultAlertName(locale, cleanCity || undefined, country),
            filters: {
              query: cleanCity,
              region: "",
              regionName: cleanCity || null,
              segment: "",
              minValue: null,
              maxValue: null,
            },
            notifyNew: true,
            notifyChanges: true,
          },
          countries,
          Date.now(),
        );
      }
    }
  } catch (err) {
    console.error("[completePostSignupOnboarding]", err);
  }

  if (ctx.key) {
    return `/app/objekt/${encodeURIComponent(ctx.key)}`;
  }
  return `${AUTH_ROUTES.account}?${AUTH_PARAMS.status}=verified`;
}
