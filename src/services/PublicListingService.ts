import "server-only";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { PRICING_COUNTRIES, PricingCountryCode } from "@/lib/constants";
import { getListingCountry } from "@/lib/listingCountry";
import { EU_MARKET_META } from "@/lib/pseo/euMarketRegions";
import {
  buildPublicListingHref,
  countryToPseoLocale,
  extractKeyFromPublicSlug,
  sanitizePublicListingHeadline,
} from "@/lib/pseo/publicListingUrls";
import { isHoneypotListingKey, maskFileNo } from "@/lib/sicherheit/antiScrapingRules";
import { ListingService } from "@/services/ListingService";
import { PseoService, slugifyPseo } from "@/services/PseoService";
import { Listing } from "@/types/listing.types";
import { EuPseoMarketCode, PseoLocale, PseoPreviewListing } from "@/types/pseo.types";

export interface PublicListingResolved {
  key: string;
  canonicalPath: string;
  canonicalUrl: string;
  country: PricingCountryCode;
  locale: PseoLocale;
  currency: "EUR" | "CHF" | "GBP" | "TRY";
  headline: string;
  segmentLabel: string;
  cleanCity: string;
  postcode: string | null;
  regionName: string;
  authority: string;
  maskedFileNo: string;
  hearingDate: string | null;
  limitsWaived: boolean;
  hasDocs: boolean;
  appraisedValue: number | null;
  minBidValue: number | null;
  thresholdValue: number | null;
  depositValue: number | null;
  areaM2: number | null;
  rooms: string | null;
  yearBuilt: number | null;
  teaserExcerpt: string | null;
  hubHref: string;
  calcHref: string;
  cityHref: string | null;
  courtHref: string | null;
  breadcrumbs: Array<{ label: string; href: string }>;
  relatedListings: PseoPreviewListing[];
}

function currencyForCountry(country: PricingCountryCode, raw?: string | null): "EUR" | "CHF" | "GBP" | "TRY" {
  const up = (raw ?? "").toUpperCase();
  if (up === "CHF" || up === "GBP" || up === "TRY" || up === "EUR") return up;
  if (country === "CH") return "CHF";
  if (country === "GB") return "GBP";
  if (country === "TR") return "TRY";
  return "EUR";
}

function sanitizeTeaserText(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const stripped = raw
    .replace(/\b\d{1,4}\s*[A-Z]{1,3}\s*\d{1,5}\/\d{2,4}\b/gi, "•••/••••")
    .replace(/\b\d{4}\/\d+\s*(?:esas|talimat|satis|satış)\b/gi, "••••/•••")
    .replace(
      /\b([A-Za-zÄÖÜäöüßéèàùçñ.\-]+(?:straße|strasse|str\.|weg|gasse|platz|allee|ring|damm|ufer|rue|avenue|calle|via|piazza|road|street|lane))\s+\d+[a-zA-Z0-9\s/-]*/gi,
      "$1 ••",
    )
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length < 15) return null;
  return stripped.length > 220 ? `${stripped.slice(0, 217).trim()}…` : stripped;
}

function toRelatedPreview(l: Listing, country: PricingCountryCode): PseoPreviewListing {
  const val = l.appraisedValue && l.appraisedValue >= 500 ? Math.round(l.appraisedValue) : null;
  const currency = currencyForCountry(country, l.currency);
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
    areaM2: area ? Math.round(area) : null,
    rooms: l.rooms ?? l.tr?.rooms ?? null,
    discountPct: l.tr?.discountPct ?? null,
  };
}

export class PublicListingService {
  static async resolveBySlug(slug: string): Promise<PublicListingResolved | null> {
    const key = extractKeyFromPublicSlug(slug);
    if (!key || isHoneypotListingKey(key)) return null;

    const listing = await ListingService.getByKey(PRICING_COUNTRIES, key);
    if (!listing) return null;

    const country = getListingCountry(listing) as PricingCountryCode;
    const locale = countryToPseoLocale(country);
    const currency = currencyForCountry(country, listing.currency);
    const cleanCity = (listing.place ?? "").split(",")[0].trim() || listing.region || "";
    const segmentLabel = listing.segmentLabel || (locale === "tr" ? "Gayrimenkul" : "Immobilie");

    const headline = sanitizePublicListingHeadline({
      rawTitle: listing.title,
      segmentLabel,
      place: listing.place,
      postcode: listing.postcode,
      country,
    });

    const canonicalPath = buildPublicListingHref({
      key: listing.key,
      country,
      place: listing.place,
      postcode: listing.postcode,
      segmentLabel,
      title: headline,
    });

    const val = listing.appraisedValue && listing.appraisedValue >= 500 ? Math.round(listing.appraisedValue) : null;
    const minRatio = country === "IT" ? 0.75 : country === "FR" ? 0.45 : 0.5;
    const threshRatio = country === "AT" || country === "IT" ? 0.75 : country === "TR" ? 0.5 : 0.7;
    const depRatio = country === "ES" ? 0.05 : 0.1;

    const minBidValue = listing.minimumBid ? Math.round(listing.minimumBid) : val ? Math.round(val * minRatio) : null;
    const thresholdValue = val ? Math.round(val * threshRatio) : null;
    const depositValue = listing.depositAmount
      ? Math.round(listing.depositAmount)
      : val
        ? Math.round(val * depRatio)
        : minBidValue
          ? Math.round(minBidValue * depRatio)
          : null;

    const areaM2 =
      listing.livingAreaM2 ??
      listing.tr?.netAreaM2 ??
      listing.tr?.buildingAreaM2 ??
      listing.usableAreaM2 ??
      listing.tr?.areaM2 ??
      listing.areaM2 ??
      listing.landAreaM2 ??
      listing.tr?.landAreaM2 ??
      null;

    const catalog = await PseoService.GetCatalog();

    let hubHref = "/zwangsversteigerungen";
    let hubLabel = "Zwangsversteigerungen";
    let calcHref = "/rechner/5-10-und-7-10-grenze";
    let cityHref: string | null = null;
    let courtHref: string | null = null;
    let relatedPool: PseoPreviewListing[] = [];

    if (country === "DE") {
      const citySlug = slugifyPseo(cleanCity);
      const courtSlug = slugifyPseo(listing.authority || "");
      const cityEntry = catalog.cityBySlug.get(citySlug);
      const courtEntry = catalog.courtBySlug.get(courtSlug);
      if (cityEntry) {
        cityHref = `/zwangsversteigerung/${cityEntry.slug}`;
        relatedPool = cityEntry.listings;
      }
      if (courtEntry) {
        courtHref = `/amtsgericht/${courtEntry.slug}`;
        if (relatedPool.length < 4) relatedPool = [...relatedPool, ...courtEntry.listings];
      }
    } else if (country === "TR") {
      hubHref = "/tr/icra-ihale";
      hubLabel = "İcra & İhale";
      calcHref = "/tr/hesaplama/icra-ihale-teminat";
      const provSlug = slugifyPseo(listing.region || "");
      const distSlug = provSlug && cleanCity ? `${provSlug}-${slugifyPseo(cleanCity)}` : slugifyPseo(cleanCity);
      const courtSlug = slugifyPseo(listing.authority || "");
      const distEntry = catalog.trBySlug.get(distSlug) ?? catalog.trBySlug.get(provSlug);
      const courtEntry = catalog.trBySlug.get(courtSlug);
      if (distEntry) {
        cityHref = `/tr/icra-ihale/${distEntry.slug}`;
        relatedPool = distEntry.listings;
      }
      if (courtEntry) {
        courtHref = `/tr/icra-ihale/${courtEntry.slug}`;
        if (relatedPool.length < 4) relatedPool = [...relatedPool, ...courtEntry.listings];
      }
    } else {
      const euCode = country as EuPseoMarketCode;
      const euCat = catalog.euMarkets[euCode];
      const euMeta = EU_MARKET_META[euCode];
      hubHref = euCat.hubPath;
      hubLabel = euMeta.shortLabel;
      calcHref = euCat.calcPath;
      const citySlug = slugifyPseo(cleanCity);
      const courtSlug = slugifyPseo(listing.authority || "");
      const cityEntry = euCat.bySlug.get(citySlug);
      const courtEntry = euCat.bySlug.get(courtSlug) ?? euCat.bySlug.get(`${courtSlug}-gericht`);
      if (cityEntry) {
        cityHref = `${euCat.hubPath}/${cityEntry.slug}`;
        relatedPool = cityEntry.listings;
      }
      if (courtEntry) {
        courtHref = `${euCat.hubPath}/${courtEntry.slug}`;
        if (relatedPool.length < 4) relatedPool = [...relatedPool, ...courtEntry.listings];
      }
    }

    const seenKeys = new Set<string>([listing.key]);
    const relatedListings: PseoPreviewListing[] = [];
    for (const item of relatedPool) {
      if (seenKeys.has(item.key)) continue;
      seenKeys.add(item.key);
      relatedListings.push(item);
      if (relatedListings.length >= 6) break;
    }

    if (relatedListings.length < 3) {
      const snap = await ListingService.getAllSnapshotListings(country === "TR" ? "TR" : "DE");
      for (const cand of snap) {
        if (seenKeys.has(cand.key)) continue;
        if (getListingCountry(cand) !== country) continue;
        seenKeys.add(cand.key);
        relatedListings.push(toRelatedPreview(cand, country));
        if (relatedListings.length >= 6) break;
      }
    }

    const breadcrumbs: Array<{ label: string; href: string }> = [
      { label: "Belowmark", href: "/" },
      { label: hubLabel, href: hubHref },
    ];
    if (cityHref && cleanCity) {
      breadcrumbs.push({ label: cleanCity, href: cityHref });
    } else if (courtHref && listing.authority) {
      breadcrumbs.push({ label: listing.authority, href: courtHref });
    }
    breadcrumbs.push({ label: headline.slice(0, 48), href: canonicalPath });

    return {
      key: listing.key,
      canonicalPath,
      canonicalUrl: `${BELOWMARK_ORIGIN}${canonicalPath}`,
      country,
      locale,
      currency,
      headline,
      segmentLabel,
      cleanCity: cleanCity || listing.authority || country,
      postcode: listing.postcode ?? null,
      regionName: listing.region || country,
      authority: listing.authority || "Vollstreckungsgericht",
      maskedFileNo: maskFileNo(listing.fileNo || "0000/0000"),
      hearingDate: listing.hearingAt ? listing.hearingAt.slice(0, 10) : null,
      limitsWaived: Boolean(listing.limitsWaived),
      hasDocs: Boolean(listing.documentUrl || listing.exposeUrl || listing.biddingNotesUrl || listing.tr?.ada),
      appraisedValue: val,
      minBidValue,
      thresholdValue,
      depositValue,
      areaM2: areaM2 ? Math.round(areaM2) : null,
      rooms: listing.rooms ?? listing.tr?.rooms ?? null,
      yearBuilt: listing.yearBuilt ?? listing.tr?.yearBuilt ?? null,
      teaserExcerpt: sanitizeTeaserText(listing.description ?? listing.tr?.excerpt),
      hubHref,
      calcHref,
      cityHref,
      courtHref,
      breadcrumbs,
      relatedListings,
    };
  }

  static async getSitemapEntries(group: "eu" | "tr"): Promise<Array<{ loc: string; lastmod: string }>> {
    const market = group === "tr" ? "TR" : "DE";
    const listings = await ListingService.getAllSnapshotListings(market);
    const today = new Date().toISOString().slice(0, 10);
    const out: Array<{ loc: string; lastmod: string }> = [];
    const seen = new Set<string>();

    for (const l of listings) {
      if (!l.key || isHoneypotListingKey(l.key)) continue;
      const country = (market === "TR" ? "TR" : getListingCountry(l)) as PricingCountryCode;
      const headline = sanitizePublicListingHeadline({
        rawTitle: l.title,
        segmentLabel: l.segmentLabel || (market === "TR" ? "Gayrimenkul" : "Immobilie"),
        place: l.place,
        postcode: l.postcode,
        country,
      });
      const href = buildPublicListingHref({
        key: l.key,
        country,
        place: l.place,
        postcode: l.postcode,
        segmentLabel: l.segmentLabel,
        title: headline,
      });
      const loc = `${BELOWMARK_ORIGIN}${href}`;
      if (seen.has(loc)) continue;
      seen.add(loc);
      out.push({ loc, lastmod: today });
    }
    return out;
  }
}
