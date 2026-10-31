export type EuPseoMarketCode = "AT" | "CH" | "IT" | "ES" | "FR" | "GB";
export type PseoLocale = "de" | "tr" | "en" | "it" | "es" | "fr";

export interface PseoPreviewListing {
  key: string;
  title: string;
  segmentLabel: string;
  place: string;
  postcode: string | null;
  region: string | null;
  authority: string;
  hearingAt: string | null;
  appraisedValue: number | null;
  minimumBid: number | null;
  depositAmount: number | null;
  limitsWaived: boolean;
  hasDocs: boolean;
  areaM2: number | null;
  rooms: string | null;
  discountPct: number | null;
  currency: "EUR" | "CHF" | "GBP" | "TRY";
}

export interface CourtPseoEntry {
  slug: string;
  authority: string;
  displayName: string;
  region: string;
  totalCount: number;
  limitsWaivedCount: number;
  withDocsCount: number;
  avgAppraisedValue: number | null;
  minAppraisedValue: number | null;
  nextHearingDate: string | null;
  cities: Array<{ name: string; slug: string; count: number }>;
  listings: PseoPreviewListing[];
}

export interface CityPseoEntry {
  slug: string;
  name: string;
  postcode: string | null;
  region: string;
  totalCount: number;
  limitsWaivedCount: number;
  withDocsCount: number;
  avgAppraisedValue: number | null;
  minAppraisedValue: number | null;
  nextHearingDate: string | null;
  courts: Array<{ name: string; slug: string; count: number }>;
  listings: PseoPreviewListing[];
}

export interface TrLocationPseoEntry {
  slug: string;
  name: string;
  kind: "province" | "district";
  provinceName: string;
  provinceSlug: string;
  totalCount: number;
  opportunityCount: number;
  avgAppraisedValueTry: number | null;
  avgDiscountPct: number | null;
  districts: Array<{ name: string; slug: string; count: number }>;
  listings: PseoPreviewListing[];
}

export interface EuMarketLocationEntry {
  slug: string;
  aliases: string[];
  market: EuPseoMarketCode;
  locale: PseoLocale;
  kind: "region" | "court" | "city";
  name: string;
  nativeRegionName: string;
  regionSlug: string;
  transferTaxPct: number;
  currency: "EUR" | "CHF" | "GBP";
  totalCount: number;
  limitsWaivedCount: number;
  withDocsCount: number;
  avgAppraisedValue: number | null;
  minAppraisedValue: number | null;
  nextHearingDate: string | null;
  subLinks: Array<{ name: string; slug: string; count: number }>;
  courtLinks: Array<{ name: string; slug: string; count: number }>;
  listings: PseoPreviewListing[];
}

export interface EuMarketCatalog {
  market: EuPseoMarketCode;
  locale: PseoLocale;
  currency: "EUR" | "CHF" | "GBP";
  hubPath: string;
  calcPath: string;
  totalListings: number;
  regions: EuMarketLocationEntry[];
  courts: EuMarketLocationEntry[];
  cities: EuMarketLocationEntry[];
  bySlug: Map<string, EuMarketLocationEntry>;
}

export interface DeStatePseoEntry {
  slug: string;
  code: string;
  name: string;
  transferTaxPct: number;
  totalCount: number;
  limitsWaivedCount: number;
  withDocsCount: number;
  avgAppraisedValue: number | null;
  minAppraisedValue: number | null;
  nextHearingDate: string | null;
  courts: Array<{ name: string; slug: string; count: number }>;
  cities: Array<{ name: string; slug: string; count: number }>;
  listings: PseoPreviewListing[];
}

export interface PseoCatalog {
  generatedAt: string;
  deTotalListings: number;
  trTotalListings: number;
  deStates: DeStatePseoEntry[];
  deStateBySlug: Map<string, DeStatePseoEntry>;
  courts: CourtPseoEntry[];
  courtBySlug: Map<string, CourtPseoEntry>;
  cities: CityPseoEntry[];
  cityBySlug: Map<string, CityPseoEntry>;
  trLocations: TrLocationPseoEntry[];
  trBySlug: Map<string, TrLocationPseoEntry>;
  euMarkets: Record<EuPseoMarketCode, EuMarketCatalog>;
}
