import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG, marketCalcAlternates, marketHubAlternates } from "@/lib/blog/blogSeo";
import { EU_MARKET_COPY } from "@/lib/pseo/euMarketCopy";
import { EU_MARKET_META } from "@/lib/pseo/euMarketRegions";
import { isEuLocationIndexable } from "@/lib/pseo/seoIndexPolicy";
import { buildSwissAlternates } from "@/lib/pseo/swissMultilangCopy";
import { MetaTagService } from "@/services/MetaTagService";
import { PseoService } from "@/services/PseoService";
import {
  CityPseoEntry,
  CourtPseoEntry,
  EuMarketCatalog,
  EuMarketLocationEntry,
  EuPseoMarketCode,
  PseoCatalog,
  TrLocationPseoEntry,
} from "@/types/pseo.types";

const VALID_PSEO_SLUG_RE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const COURT_SLUG_PREFIX_RE =
  /^(?:ag|bg|lg|olg|amtsgericht|bezirksgericht|betreibungsamt|regionales-betreibungsamt|konkursamt|betreibungs-und-konkursamt|tribunale|juzgado|tribunal|komornik|sad-rejonowy|exekutor|exekucni-urad|kronofogden)-/;
const LOWERCASE_PARTICLES = new Set([
  "am",
  "an",
  "im",
  "in",
  "der",
  "des",
  "bei",
  "b",
  "und",
  "de",
  "del",
  "della",
  "di",
  "du",
  "la",
  "le",
  "les",
  "sur",
  "van",
  "aan",
  "upon",
  "on",
]);

export function isValidDormantPseoSlug(slug: string): boolean {
  if (!slug || slug.length < 3 || slug.length > 78) return false;
  if (!VALID_PSEO_SLUG_RE.test(slug)) return false;
  if (/^\d/.test(slug) || /\d{4,}/.test(slug)) return false;
  return true;
}

export function humanizePseoSlug(slug: string): string {
  const words = slug.split("-");
  return words
    .map((word, idx) => {
      if (idx === 0 && word === "ag") return "Amtsgericht";
      if (idx === 0 && word === "bg") return "Bezirksgericht";
      if (idx > 0 && LOWERCASE_PARTICLES.has(word)) return word;
      if (word.length === 2 && idx === words.length - 1 && /^(sg|zh|be|lu|ag|tg|gr|vs|vd|ti|ge|bl|bs|so|sz|zg|sh|ar|ai|gl|nw|ow|ur|ju|ne|fr)$/.test(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Resolves an active EU location entry or synthesizes a clean 0-listing dormant entry
 * for valid municipality/court slugs whose auctions recently completed — preventing
 * Next.js 16 PPR in-page `permanentRedirect()` from serving headless `HTTP 200` meta-refreshes.
 */
export function resolveEuEntryOrDormant(
  catalog: EuMarketCatalog,
  slug: string,
): EuMarketLocationEntry | null {
  const existing = catalog.bySlug.get(slug);
  if (existing) return existing;
  if (!isValidDormantPseoSlug(slug)) return null;

  const fallbackRegion = catalog.regions[0];
  const isCourt = COURT_SLUG_PREFIX_RE.test(slug);
  return {
    slug,
    aliases: [],
    market: catalog.market,
    locale: catalog.locale,
    kind: isCourt ? "court" : "city",
    name: humanizePseoSlug(slug),
    nativeRegionName: fallbackRegion?.name ?? EU_MARKET_META[catalog.market].shortLabel,
    regionSlug: fallbackRegion?.slug ?? slug,
    transferTaxPct: fallbackRegion?.transferTaxPct ?? 3.5,
    currency: catalog.currency,
    totalCount: 0,
    limitsWaivedCount: 0,
    withDocsCount: 0,
    avgAppraisedValue: null,
    minAppraisedValue: null,
    nextHearingDate: null,
    subLinks: catalog.cities.slice(0, 12).map((c) => ({ name: c.name, slug: c.slug, count: c.totalCount })),
    courtLinks: catalog.courts.slice(0, 12).map((c) => ({ name: c.name, slug: c.slug, count: c.totalCount })),
    listings: [],
  };
}

export function resolveDeCityOrDormant(catalog: PseoCatalog, slug: string): CityPseoEntry | null {
  const existing = catalog.cityBySlug.get(slug);
  if (existing) return existing;
  if (!isValidDormantPseoSlug(slug)) return null;
  return {
    slug,
    name: humanizePseoSlug(slug),
    postcode: null,
    region: "Deutschland",
    totalCount: 0,
    limitsWaivedCount: 0,
    withDocsCount: 0,
    avgAppraisedValue: null,
    minAppraisedValue: null,
    nextHearingDate: null,
    courts: catalog.courts.slice(0, 8).map((c) => ({ name: c.displayName, slug: c.slug, count: c.totalCount })),
    listings: [],
  };
}

export function resolveDeCourtOrDormant(catalog: PseoCatalog, slug: string): CourtPseoEntry | null {
  const existing = catalog.courtBySlug.get(slug);
  if (existing) return existing;
  if (!isValidDormantPseoSlug(slug)) return null;
  const displayName = humanizePseoSlug(slug);
  return {
    slug,
    authority: displayName,
    displayName,
    region: "Deutschland",
    totalCount: 0,
    limitsWaivedCount: 0,
    withDocsCount: 0,
    avgAppraisedValue: null,
    minAppraisedValue: null,
    nextHearingDate: null,
    cities: catalog.cities.slice(0, 12).map((c) => ({ name: c.name, slug: c.slug, count: c.totalCount })),
    listings: [],
  };
}

export function resolveTrEntityOrDormant(catalog: PseoCatalog, slug: string): TrLocationPseoEntry | null {
  const existing = catalog.trBySlug.get(slug);
  if (existing) return existing;
  if (!isValidDormantPseoSlug(slug)) return null;
  const fallbackProv = catalog.trLocations.find((l) => l.kind === "province");
  const isCourt = slug.includes("icra") || slug.includes("sulh") || slug.includes("mahkeme");
  return {
    slug,
    name: humanizePseoSlug(slug),
    kind: isCourt ? "court" : "district",
    provinceName: fallbackProv?.name ?? "Türkiye",
    provinceSlug: fallbackProv?.slug ?? "istanbul",
    totalCount: 0,
    opportunityCount: 0,
    avgAppraisedValueTry: null,
    avgDiscountPct: null,
    districts: catalog.trLocations
      .filter((l) => l.kind === "province")
      .slice(0, 12)
      .map((p) => ({ name: p.name, slug: p.slug, count: p.totalCount })),
    listings: [],
  };
}

export async function getEuStaticRegionParams(market: EuPseoMarketCode): Promise<Array<{ slug: string }>> {
  const catalog = (await PseoService.GetCatalog()).euMarkets[market];
  return catalog.regions.slice(0, 24).map((r) => ({ slug: r.slug }));
}

export async function buildEuHubMetadata(market: EuPseoMarketCode): Promise<Metadata> {
  const catalog = (await PseoService.GetCatalog()).euMarkets[market];
  const copy = EU_MARKET_COPY[market];
  const meta = EU_MARKET_META[market];
  return {
    ...MetaTagService.CreateMetaTags({
      title: copy.hubMetaTitle(catalog.totalListings, catalog.regions.length),
      description: copy.hubMetaDesc(catalog.totalListings, catalog.regions.length),
      imgUrl: DEFAULT_BLOG_OG,
      tags: [meta.shortLabel, copy.hubEyebrow, "Belowmark"],
      url: `${BELOWMARK_ORIGIN}${catalog.hubPath}`,
    }),
    alternates: marketHubAlternates(catalog.hubPath),
  };
}

export async function buildEuEntryMetadata(market: EuPseoMarketCode, slug: string): Promise<Metadata> {
  const catalog = (await PseoService.GetCatalog()).euMarkets[market];
  const copy = EU_MARKET_COPY[market];
  const entry = resolveEuEntryOrDormant(catalog, slug);
  if (!entry) {
    notFound();
  }
  const shouldIndex = isEuLocationIndexable(entry);
  return {
    ...MetaTagService.CreateMetaTags({
      title: copy.entryMetaTitle(entry),
      description: copy.entryMetaDesc(entry),
      imgUrl: DEFAULT_BLOG_OG,
      tags: [entry.name, entry.nativeRegionName, copy.hubEyebrow, "Belowmark"],
      url: `${BELOWMARK_ORIGIN}${catalog.hubPath}/${entry.slug}`,
    }),
    ...(market === "CH" && shouldIndex ? { alternates: buildSwissAlternates(entry.slug, entry) } : {}),
    ...(shouldIndex ? {} : { robots: { index: false, follow: true } }),
  };
}

export function buildEuCalcMetadata(market: EuPseoMarketCode): Metadata {
  const copy = EU_MARKET_COPY[market];
  const meta = EU_MARKET_META[market];
  return {
    ...MetaTagService.CreateMetaTags({
      title: copy.calcMetaTitle,
      description: copy.calcMetaDesc,
      imgUrl: DEFAULT_BLOG_OG,
      tags: [meta.shortLabel, copy.calcMetaTitle, "Belowmark"],
      url: `${BELOWMARK_ORIGIN}${meta.calcPath}`,
    }),
    alternates: marketCalcAlternates(meta.calcPath),
  };
}
