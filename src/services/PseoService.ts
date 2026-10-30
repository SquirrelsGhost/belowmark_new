import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Listing, ListingSnapshot } from "@/types/listing.types";
import {
  CityPseoEntry,
  CourtPseoEntry,
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

function toPreviewListing(l: Listing): PseoPreviewListing {
  const val = l.appraisedValue && l.appraisedValue >= 500 ? l.appraisedValue : null;
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
    minimumBid: l.minimumBid ?? (val ? Math.round(val * 0.5) : l.tr?.startingBid ?? null),
    depositAmount: l.depositAmount ?? (val ? Math.round(val * 0.1) : null),
    limitsWaived: Boolean(l.limitsWaived),
    hasDocs: Boolean(l.documentUrl || l.exposeUrl || l.reportUrl),
    areaM2: l.areaM2 ?? l.livingAreaM2 ?? l.landAreaM2 ?? l.tr?.areaM2 ?? null,
    rooms: l.rooms ?? l.tr?.rooms ?? null,
    discountPct: l.tr?.discountPct ?? null,
    currency: l.currency ?? (l.market === "TR" ? "TRY" : "EUR"),
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

async function buildCatalog(): Promise<PseoCatalog> {
  const [deRaw, trRaw] = await Promise.all([
    readFile(join(process.cwd(), "data", "snapshots", "de.json"), "utf8"),
    readFile(join(process.cwd(), "data", "snapshots", "tr.json"), "utf8"),
  ]);
  const deSnap = JSON.parse(deRaw) as ListingSnapshot;
  const trSnap = JSON.parse(trRaw) as ListingSnapshot;

  const deListings = (deSnap.listings ?? []).filter((l) => !l.cancelled);
  const trListings = (trSnap.listings ?? []).filter((l) => !l.cancelled);

  // 1. Group DE by Court (Amtsgericht)
  const byCourt = new Map<string, Listing[]>();
  const byCity = new Map<string, { name: string; items: Listing[] }>();

  for (const l of deListings) {
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
    deTotalListings: deListings.length,
    trTotalListings: trListings.length,
    courts,
    courtBySlug,
    cities,
    cityBySlug,
    trLocations,
    trBySlug,
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
