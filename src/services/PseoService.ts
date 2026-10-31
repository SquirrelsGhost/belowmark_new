import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { EU_MARKET_META, EU_REGION_SEEDS } from "@/lib/pseo/euMarketRegions";
import { STATES } from "@/lib/snapshot";
import { Listing, ListingSnapshot } from "@/types/listing.types";
import {
  CityPseoEntry,
  CourtPseoEntry,
  DeStatePseoEntry,
  EuMarketCatalog,
  EuMarketLocationEntry,
  EuPseoMarketCode,
  PseoCatalog,
  PseoPreviewListing,
  TrLocationPseoEntry,
} from "@/types/pseo.types";

let cachedCatalog: Promise<PseoCatalog> | null = null;

export function slugifyPseo(input: string): string {
  return input
    .replace(/İ/g, "i")
    .replace(/I/g, "i")
    .replace(/ı/g, "i")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function expandCourtDisplayName(authority: string): string {
  if (/^ag\s+/i.test(authority)) {
    return authority.replace(/^ag\s+/i, "Amtsgericht ");
  }
  if (/^bg\s+/i.test(authority)) {
    return authority.replace(/^bg\s+/i, "Bezirksgericht ");
  }
  return authority;
}

function cleanCityName(rawPlace: string): string {
  return rawPlace.split(",")[0].trim();
}

function detectEuMarket(l: Listing): EuPseoMarketCode | "DE" {
  if (l.country === "AT" || l.key.startsWith("edikte-") || l.region?.endsWith("(AT)")) return "AT";
  if (l.country === "CH" || l.key.startsWith("shab-") || l.region?.endsWith("(CH)")) return "CH";
  if (l.country === "IT" || l.key.startsWith("it-aste-") || l.region?.endsWith("(IT)")) return "IT";
  if (l.country === "ES" || l.key.startsWith("es-boe-") || l.region?.endsWith("(ES)")) return "ES";
  if (l.country === "FR" || l.key.startsWith("fr-licitor-") || l.region?.endsWith("(FR)")) return "FR";
  if (l.country === "GB" || l.key.startsWith("gb-eig-") || l.region?.endsWith("(UK)")) return "GB";
  return "DE";
}

function toPreviewListing(l: Listing): PseoPreviewListing {
  const val = l.appraisedValue && l.appraisedValue >= 500 ? l.appraisedValue : null;
  const euMarket = l.market === "TR" ? null : detectEuMarket(l);
  const defaultCurrency =
    l.market === "TR"
      ? "TRY"
      : euMarket === "CH"
        ? "CHF"
        : euMarket === "GB"
          ? "GBP"
          : "EUR";
  const minRatio = euMarket === "IT" ? 0.75 : euMarket === "GB" ? 0.7 : 0.5;
  const depRatio = euMarket === "ES" ? 0.05 : 0.1;

  return {
    key: l.key,
    title: l.title,
    segmentLabel: l.segmentLabel || l.tr?.nitelik || "Immobilie",
    place: l.place || l.region || "Unbekannt",
    postcode: l.postcode,
    region: l.region,
    authority: l.authority,
    hearingAt: l.hearingAt,
    appraisedValue: val,
    minimumBid: l.minimumBid ?? (val ? Math.round(val * minRatio) : l.tr?.startingBid ?? null),
    depositAmount: l.depositAmount ?? (val ? Math.round(val * depRatio) : null),
    limitsWaived: Boolean(l.limitsWaived),
    hasDocs: Boolean(l.documentUrl || l.exposeUrl || l.reportUrl),
    areaM2: l.areaM2 ?? l.livingAreaM2 ?? l.landAreaM2 ?? l.tr?.areaM2 ?? null,
    rooms: l.rooms ?? l.tr?.rooms ?? null,
    discountPct: l.tr?.discountPct ?? null,
    currency: l.currency ?? defaultCurrency,
  };
}

function computeStats(items: Listing[]) {
  const values = items
    .map((i) => i.appraisedValue)
    .filter((v): v is number => typeof v === "number" && v >= 1000);
  const avg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;
  const min = values.length > 0 ? Math.min(...values) : null;
  const futureDates = items
    .map((i) => i.hearingAt)
    .filter((d): d is string => Boolean(d))
    .sort();
  return {
    avgAppraisedValue: avg,
    minAppraisedValue: min,
    nextHearingDate: futureDates[0] ?? null,
  };
}

function buildEuMarketCatalog(market: EuPseoMarketCode, marketListings: Listing[]): EuMarketCatalog {
  const meta = EU_MARKET_META[market];
  const seeds = EU_REGION_SEEDS[market];
  const bySlug = new Map<string, EuMarketLocationEntry>();
  const regions: EuMarketLocationEntry[] = [];
  const courts: EuMarketLocationEntry[] = [];
  const cities: EuMarketLocationEntry[] = [];

  const bySnapRegion = new Map<string, Listing[]>();
  for (const l of marketListings) {
    const key = l.region?.trim() || "";
    const list = bySnapRegion.get(key) ?? [];
    list.push(l);
    bySnapRegion.set(key, list);
  }

  const seedBySnapRegion = new Map(seeds.map((s) => [s.snapshotRegion, s]));

  for (const seed of seeds) {
    const items = bySnapRegion.get(seed.snapshotRegion) ?? [];
    const effectiveItems = items.length > 0 ? items : marketListings.slice(0, 6);
    const stats = computeStats(effectiveItems);

    const cityMap = new Map<string, { name: string; slug: string; count: number }>();
    const courtMap = new Map<string, { name: string; slug: string; count: number }>();

    for (const item of items) {
      if (item.place) {
        const cName = cleanCityName(item.place);
        const cSlug = slugifyPseo(cName);
        if (cSlug) {
          const prev = cityMap.get(cSlug) ?? { name: cName, slug: cSlug, count: 0 };
          prev.count++;
          cityMap.set(cSlug, prev);
        }
      }
      if (item.authority) {
        const aName = expandCourtDisplayName(item.authority);
        const aSlug = slugifyPseo(item.authority);
        if (aSlug) {
          const prev = courtMap.get(aSlug) ?? { name: aName, slug: aSlug, count: 0 };
          prev.count++;
          courtMap.set(aSlug, prev);
        }
      }
    }

    const deRegionSlug = slugifyPseo(seed.snapshotRegion.replace(/\s*\([A-Z]+\)$/, ""));
    const aliases = Array.from(new Set([seed.slug, deRegionSlug, seed.code])).filter(Boolean);

    const entry: EuMarketLocationEntry = {
      slug: seed.slug,
      aliases,
      market,
      locale: meta.locale,
      kind: "region",
      name: seed.nativeName,
      nativeRegionName: seed.nativeName,
      regionSlug: seed.slug,
      transferTaxPct: seed.taxPct,
      currency: meta.currency,
      totalCount: items.length || effectiveItems.length,
      limitsWaivedCount: effectiveItems.filter((i) => i.limitsWaived).length,
      withDocsCount: effectiveItems.filter((i) => i.documentUrl || i.exposeUrl || i.reportUrl).length,
      ...stats,
      subLinks: [...cityMap.values()].sort((a, b) => b.count - a.count).slice(0, 16),
      courtLinks: [...courtMap.values()].sort((a, b) => b.count - a.count).slice(0, 16),
      listings: effectiveItems.slice(0, 12).map(toPreviewListing),
    };

    regions.push(entry);
    for (const al of aliases) {
      bySlug.set(al, entry);
    }
  }

  regions.sort((a, b) => b.totalCount - a.totalCount);

  // Build Cities & Courts for this EU market
  const rawByCity = new Map<string, { name: string; items: Listing[] }>();
  const rawByCourt = new Map<string, { name: string; items: Listing[] }>();

  for (const l of marketListings) {
    if (l.place) {
      const cName = cleanCityName(l.place);
      const cSlug = slugifyPseo(cName);
      if (cSlug && cSlug.length >= 2) {
        const prev = rawByCity.get(cSlug) ?? { name: cName, items: [] };
        prev.items.push(l);
        rawByCity.set(cSlug, prev);
      }
    }
    if (l.authority) {
      const aName = expandCourtDisplayName(l.authority);
      const aSlug = slugifyPseo(l.authority);
      if (aSlug && aSlug.length >= 2) {
        const prev = rawByCourt.get(aSlug) ?? { name: aName, items: [] };
        prev.items.push(l);
        rawByCourt.set(aSlug, prev);
      }
    }
  }

  for (const [cSlug, { name, items }] of rawByCity.entries()) {
    const first = items[0];
    const seed = seedBySnapRegion.get(first.region || "") ?? seeds[0];
    const stats = computeStats(items);
    const finalSlug = bySlug.has(cSlug) ? `${cSlug}-stadt` : cSlug;

    const entry: EuMarketLocationEntry = {
      slug: finalSlug,
      aliases: [finalSlug, cSlug],
      market,
      locale: meta.locale,
      kind: "city",
      name,
      nativeRegionName: seed.nativeName,
      regionSlug: seed.slug,
      transferTaxPct: seed.taxPct,
      currency: meta.currency,
      totalCount: items.length,
      limitsWaivedCount: items.filter((i) => i.limitsWaived).length,
      withDocsCount: items.filter((i) => i.documentUrl || i.exposeUrl || i.reportUrl).length,
      ...stats,
      subLinks: regions.slice(0, 10).map((r) => ({ name: r.name, slug: r.slug, count: r.totalCount })),
      courtLinks: [],
      listings: items.slice(0, 12).map(toPreviewListing),
    };

    cities.push(entry);
    bySlug.set(finalSlug, entry);
    if (!bySlug.has(cSlug)) {
      bySlug.set(cSlug, entry);
    }
  }
  cities.sort((a, b) => b.totalCount - a.totalCount);

  for (const [aSlug, { name, items }] of rawByCourt.entries()) {
    const first = items[0];
    const seed = seedBySnapRegion.get(first.region || "") ?? seeds[0];
    const stats = computeStats(items);
    const finalSlug = bySlug.has(aSlug) ? `${aSlug}-gericht` : aSlug;

    const entry: EuMarketLocationEntry = {
      slug: finalSlug,
      aliases: [finalSlug, aSlug],
      market,
      locale: meta.locale,
      kind: "court",
      name,
      nativeRegionName: seed.nativeName,
      regionSlug: seed.slug,
      transferTaxPct: seed.taxPct,
      currency: meta.currency,
      totalCount: items.length,
      limitsWaivedCount: items.filter((i) => i.limitsWaived).length,
      withDocsCount: items.filter((i) => i.documentUrl || i.exposeUrl || i.reportUrl).length,
      ...stats,
      subLinks: cities.slice(0, 12).map((c) => ({ name: c.name, slug: c.slug, count: c.totalCount })),
      courtLinks: [],
      listings: items.slice(0, 12).map(toPreviewListing),
    };

    courts.push(entry);
    bySlug.set(finalSlug, entry);
    if (!bySlug.has(aSlug)) {
      bySlug.set(aSlug, entry);
    }
  }
  courts.sort((a, b) => b.totalCount - a.totalCount);

  return {
    market,
    locale: meta.locale,
    currency: meta.currency,
    hubPath: meta.hubPath,
    calcPath: meta.calcPath,
    totalListings: marketListings.length,
    regions,
    courts,
    cities,
    bySlug,
  };
}

async function buildCatalog(): Promise<PseoCatalog> {
  const [deRaw, trRaw] = await Promise.all([
    readFile(join(process.cwd(), "data", "snapshots", "de.json"), "utf8"),
    readFile(join(process.cwd(), "data", "snapshots", "tr.json"), "utf8"),
  ]);
  const deSnap = JSON.parse(deRaw) as ListingSnapshot;
  const trSnap = JSON.parse(trRaw) as ListingSnapshot;

  const allEuroListings = (deSnap.listings ?? []).filter((l) => !l.cancelled);
  const trListings = (trSnap.listings ?? []).filter((l) => !l.cancelled);

  const euBuckets: Record<EuPseoMarketCode, Listing[]> = {
    AT: [],
    CH: [],
    IT: [],
    ES: [],
    FR: [],
    GB: [],
  };

  for (const l of allEuroListings) {
    const m = detectEuMarket(l);
    if (m !== "DE") {
      euBuckets[m].push(l);
    }
  }

  const euMarkets: Record<EuPseoMarketCode, EuMarketCatalog> = {
    AT: buildEuMarketCatalog("AT", euBuckets.AT),
    CH: buildEuMarketCatalog("CH", euBuckets.CH),
    IT: buildEuMarketCatalog("IT", euBuckets.IT),
    ES: buildEuMarketCatalog("ES", euBuckets.ES),
    FR: buildEuMarketCatalog("FR", euBuckets.FR),
    GB: buildEuMarketCatalog("GB", euBuckets.GB),
  };

  // 1. Group DE + DACH/EU by Court & City (preserving all existing URLs)
  const byCourt = new Map<string, Listing[]>();
  const byCity = new Map<string, { name: string; items: Listing[] }>();

  for (const l of allEuroListings) {
    if (l.authority) {
      const cSlug = slugifyPseo(l.authority);
      if (cSlug) {
        const list = byCourt.get(cSlug) ?? [];
        list.push(l);
        byCourt.set(cSlug, list);
      }
    }
    if (l.place) {
      const cName = cleanCityName(l.place);
      const citySlug = slugifyPseo(cName);
      if (citySlug && citySlug.length >= 2) {
        const existing = byCity.get(citySlug) ?? { name: cName, items: [] };
        existing.items.push(l);
        byCity.set(citySlug, existing);
      }
    }
  }

  const courts: CourtPseoEntry[] = [];
  const courtBySlug = new Map<string, CourtPseoEntry>();

  for (const [slug, items] of byCourt.entries()) {
    const first = items[0];
    const stats = computeStats(items);
    const cityCounts = new Map<string, { name: string; slug: string; count: number }>();
    for (const item of items) {
      if (!item.place) continue;
      const cName = cleanCityName(item.place);
      const cSlug = slugifyPseo(cName);
      if (!cSlug) continue;
      const prev = cityCounts.get(cSlug) ?? { name: cName, slug: cSlug, count: 0 };
      prev.count++;
      cityCounts.set(cSlug, prev);
    }
    const entry: CourtPseoEntry = {
      slug,
      authority: first.authority,
      displayName: expandCourtDisplayName(first.authority),
      region: first.region || "Deutschland",
      totalCount: items.length,
      limitsWaivedCount: items.filter((i) => i.limitsWaived).length,
      withDocsCount: items.filter((i) => i.documentUrl || i.exposeUrl || i.reportUrl).length,
      ...stats,
      cities: [...cityCounts.values()].sort((a, b) => b.count - a.count).slice(0, 12),
      listings: items.slice(0, 12).map(toPreviewListing),
    };
    courts.push(entry);
    courtBySlug.set(slug, entry);
  }
  courts.sort((a, b) => b.totalCount - a.totalCount);

  const cities: CityPseoEntry[] = [];
  const cityBySlug = new Map<string, CityPseoEntry>();

  for (const [slug, { name, items }] of byCity.entries()) {
    const first = items[0];
    const stats = computeStats(items);
    const courtCounts = new Map<string, { name: string; slug: string; count: number }>();
    for (const item of items) {
      if (!item.authority) continue;
      const cSlug = slugifyPseo(item.authority);
      if (!cSlug) continue;
      const prev = courtCounts.get(cSlug) ?? {
        name: expandCourtDisplayName(item.authority),
        slug: cSlug,
        count: 0,
      };
      prev.count++;
      courtCounts.set(cSlug, prev);
    }
    const entry: CityPseoEntry = {
      slug,
      name,
      postcode: first.postcode,
      region: first.region || "Deutschland",
      totalCount: items.length,
      limitsWaivedCount: items.filter((i) => i.limitsWaived).length,
      withDocsCount: items.filter((i) => i.documentUrl || i.exposeUrl || i.reportUrl).length,
      ...stats,
      courts: [...courtCounts.values()].sort((a, b) => b.count - a.count),
      listings: items.slice(0, 12).map(toPreviewListing),
    };
    cities.push(entry);
    cityBySlug.set(slug, entry);
  }
  cities.sort((a, b) => b.totalCount - a.totalCount);

  // 1b. Group DE by Bundesland (16 German States)
  const deStateSeeds = STATES.filter((s) => s.country === "DE");
  const deStates: DeStatePseoEntry[] = [];
  const deStateBySlug = new Map<string, DeStatePseoEntry>();

  for (const stSeed of deStateSeeds) {
    const stItems = allEuroListings.filter((l) => l.region?.trim() === stSeed.name);
    const stSlug = slugifyPseo(stSeed.name);
    const stats = computeStats(stItems);
    const stCourts = courts
      .filter((c) => c.region === stSeed.name)
      .slice(0, 24)
      .map((c) => ({ name: c.displayName, slug: c.slug, count: c.totalCount }));
    const stCities = cities
      .filter((c) => c.region === stSeed.name)
      .slice(0, 24)
      .map((c) => ({ name: c.name, slug: c.slug, count: c.totalCount }));

    const stEntry: DeStatePseoEntry = {
      slug: stSlug,
      code: stSeed.code,
      name: stSeed.name,
      transferTaxPct: stSeed.transferTaxPct,
      totalCount: stItems.length,
      limitsWaivedCount: stItems.filter((i) => i.limitsWaived).length,
      withDocsCount: stItems.filter((i) => i.documentUrl || i.exposeUrl || i.reportUrl).length,
      ...stats,
      courts: stCourts,
      cities: stCities,
      listings: stItems.slice(0, 12).map(toPreviewListing),
    };
    deStates.push(stEntry);
    deStateBySlug.set(stSlug, stEntry);
    deStateBySlug.set(stSeed.code, stEntry);
    if (stSeed.code === "nw") deStateBySlug.set("nrw", stEntry);
  }
  deStates.sort((a, b) => b.totalCount - a.totalCount);

  // 2. Group TR by Province (İl) and District (İlçe)
  const byProvince = new Map<string, { name: string; items: Listing[] }>();
  const byDistrict = new Map<string, { name: string; provName: string; provSlug: string; items: Listing[] }>();

  for (const l of trListings) {
    const provName = l.region?.trim();
    if (!provName) continue;
    const provSlug = slugifyPseo(provName);
    if (!provSlug) continue;

    const pEntry = byProvince.get(provSlug) ?? { name: provName, items: [] };
    pEntry.items.push(l);
    byProvince.set(provSlug, pEntry);

    if (l.place) {
      const distName = l.place.trim();
      const distSlug = `${provSlug}-${slugifyPseo(distName)}`;
      const dEntry = byDistrict.get(distSlug) ?? {
        name: distName,
        provName,
        provSlug,
        items: [],
      };
      dEntry.items.push(l);
      byDistrict.set(distSlug, dEntry);
    }
  }

  const trLocations: TrLocationPseoEntry[] = [];
  const trBySlug = new Map<string, TrLocationPseoEntry>();

  for (const [provSlug, { name, items }] of byProvince.entries()) {
    const stats = computeStats(items);
    const discounts = items
      .map((i) => i.tr?.discountPct)
      .filter((d): d is number => typeof d === "number" && d > 0 && d < 95);
    const avgDiscount =
      discounts.length > 0 ? Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length) : 28;

    const distList: Array<{ name: string; slug: string; count: number }> = [];
    for (const [dSlug, dVal] of byDistrict.entries()) {
      if (dVal.provSlug === provSlug) {
        distList.push({ name: dVal.name, slug: dSlug, count: dVal.items.length });
      }
    }
    distList.sort((a, b) => b.count - a.count);

    const entry: TrLocationPseoEntry = {
      slug: provSlug,
      name,
      kind: "province",
      provinceName: name,
      provinceSlug: provSlug,
      totalCount: items.length,
      opportunityCount: items.filter((i) => (i.tr?.discountPct ?? 0) >= 25).length,
      avgAppraisedValueTry: stats.avgAppraisedValue,
      avgDiscountPct: avgDiscount,
      districts: distList.slice(0, 18),
      listings: items.slice(0, 12).map(toPreviewListing),
    };
    trLocations.push(entry);
    trBySlug.set(provSlug, entry);
  }

  for (const [distSlug, { name, provName, provSlug, items }] of byDistrict.entries()) {
    if (trBySlug.has(distSlug)) continue;
    const stats = computeStats(items);
    const discounts = items
      .map((i) => i.tr?.discountPct)
      .filter((d): d is number => typeof d === "number" && d > 0 && d < 95);
    const avgDiscount =
      discounts.length > 0 ? Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length) : 28;

    const entry: TrLocationPseoEntry = {
      slug: distSlug,
      name: `${name} (${provName})`,
      kind: "district",
      provinceName: provName,
      provinceSlug: provSlug,
      totalCount: items.length,
      opportunityCount: items.filter((i) => (i.tr?.discountPct ?? 0) >= 25).length,
      avgAppraisedValueTry: stats.avgAppraisedValue,
      avgDiscountPct: avgDiscount,
      districts: [],
      listings: items.slice(0, 12).map(toPreviewListing),
    };
    trLocations.push(entry);
    trBySlug.set(distSlug, entry);
  }

  trLocations.sort((a, b) => b.totalCount - a.totalCount);

  return {
    generatedAt: deSnap.meta?.generatedAt || new Date().toISOString(),
    deTotalListings: allEuroListings.length,
    trTotalListings: trListings.length,
    deStates,
    deStateBySlug,
    courts,
    courtBySlug,
    cities,
    cityBySlug,
    trLocations,
    trBySlug,
    euMarkets,
  };
}

export class PseoService {
  public static async GetCatalog(): Promise<PseoCatalog> {
    if (!cachedCatalog) {
      cachedCatalog = buildCatalog().catch((err) => {
        cachedCatalog = null;
        throw err;
      });
    }
    return cachedCatalog;
  }
}
