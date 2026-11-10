import { Metadata } from "next";
import { connection } from "next/server";
import BlogShell from "@/components/blog/BlogShell";
import PublicSearchView from "@/components/pseo/PublicSearchView";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { isPricingCountry, PricingCountryCode } from "@/lib/constants";
import { DEFAULT_FILTERS, SEGMENT_KEYS } from "@/lib/listingFilters";
import { countryToPseoLocale, sanitizePublicListingHeadline } from "@/lib/pseo/publicListingUrls";
import { PUBLIC_SEARCH_COPY } from "@/lib/pseo/publicSearchCopy";
import { SegmentKey } from "@/lib/snapshot";
import { ListingService } from "@/services/ListingService";
import { MetaTagService } from "@/services/MetaTagService";
import { RegionService } from "@/services/RegionService";
import { Listing } from "@/types/listing.types";
import { PseoPreviewListing } from "@/types/pseo.types";

// Reads request-time headers/cookies for default country detection.
export const instant = false;

interface SuchePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstParam(val: string | string[] | undefined): string {
  return typeof val === "string" ? val.trim() : "";
}

function toPreview(l: Listing, country: PricingCountryCode): PseoPreviewListing {
  const val = l.appraisedValue && l.appraisedValue >= 500 ? Math.round(l.appraisedValue) : null;
  const currency =
    country === "CH" ? "CHF" : country === "GB" ? "GBP" : country === "TR" ? "TRY" : "EUR";
  const ratio = country === "IT" ? 0.75 : country === "FR" ? 0.45 : 0.5;
  const depRatio = country === "ES" ? 0.05 : 0.1;
  const area = l.livingAreaM2 ?? l.tr?.netAreaM2 ?? l.areaM2 ?? l.landAreaM2 ?? null;
  return {
    key: l.key,
    title: sanitizePublicListingHeadline({
      rawTitle: l.title,
      segmentLabel: l.segmentLabel || "Immobilie",
      place: l.place,
      postcode: l.postcode,
      country,
    }),
    place: l.place || l.region || "",
    postcode: l.postcode ?? null,
    region: l.region ?? null,
    authority: l.authority || "",
    segmentLabel: l.segmentLabel || "Immobilie",
    hearingAt: l.hearingAt ?? null,
    appraisedValue: val,
    minimumBid: l.minimumBid ? Math.round(l.minimumBid) : val ? Math.round(val * ratio) : null,
    depositAmount: l.depositAmount ? Math.round(l.depositAmount) : val ? Math.round(val * depRatio) : null,
    currency,
    limitsWaived: Boolean(l.limitsWaived),
    hasDocs: Boolean(l.documentUrl || l.exposeUrl || l.biddingNotesUrl || l.tr?.ada),
    discountPct: l.tr?.discountPct ?? null,
    areaM2: area ? Math.round(area) : null,
    rooms: l.rooms ?? l.tr?.rooms ?? null,
  };
}

export async function generateMetadata({ searchParams }: SuchePageProps): Promise<Metadata> {
  const raw = await searchParams;
  const region = await RegionService.GetRegion();
  const rawMarket = firstParam(raw.markt).toUpperCase();
  const country: PricingCountryCode = isPricingCountry(rawMarket) ? rawMarket : region.pricingCountry;
  const locale = countryToPseoLocale(country);
  const copy = PUBLIC_SEARCH_COPY[locale];
  const hasFilter = Boolean(firstParam(raw.q) || firstParam(raw.typ) || firstParam(raw.seite) || firstParam(raw.markt));

  return {
    ...MetaTagService.CreateMetaTags({
      title: `${copy.title} | Belowmark`,
      description: copy.lead.slice(0, 158),
      imgUrl: DEFAULT_BLOG_OG,
      tags: ["Zwangsversteigerung Suche", "İcra İhale Arama", "Subastas BOE Buscador", "Property Auction Search"],
      url: `${BELOWMARK_ORIGIN}/suche`,
    }),
    robots: { index: !hasFilter, follow: true },
  };
}

async function queryPublicListings(country: PricingCountryCode, query: string, segment: SegmentKey | "", pageNum: number) {
  await connection();
  return ListingService.search(
    country,
    {
      ...DEFAULT_FILTERS,
      query,
      segment,
      page: pageNum,
      scope: "upcoming",
      sort: "hearing",
    },
    Date.now(),
  );
}

export default async function PublicSuchePage({ searchParams }: SuchePageProps) {
  const [raw, region] = await Promise.all([searchParams, RegionService.GetRegion()]);
  const rawMarket = firstParam(raw.markt).toUpperCase();
  const country: PricingCountryCode = isPricingCountry(rawMarket) ? rawMarket : region.pricingCountry;
  const locale = countryToPseoLocale(country);

  const query = firstParam(raw.q).slice(0, 80);
  const rawTyp = firstParam(raw.typ);
  const segment: SegmentKey | "" = SEGMENT_KEYS.includes(rawTyp as SegmentKey) ? (rawTyp as SegmentKey) : "";
  const pageNum = firstParam(raw.seite) === "2" ? 2 : 1;

  const result = await queryPublicListings(country, query, segment, pageNum);

  const items = result.items.slice(0, 24).map((l) => toPreview(l, country));

  return (
    <BlogShell lang={locale}>
      <PublicSearchView
        country={country}
        locale={locale}
        query={query}
        segment={segment}
        page={pageNum}
        total={result.total}
        items={items}
      />
    </BlogShell>
  );
}
