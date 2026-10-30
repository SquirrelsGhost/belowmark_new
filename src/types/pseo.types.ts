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
  currency: "EUR" | "CHF" | "TRY";
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

export interface PseoCatalog {
  generatedAt: string;
  deTotalListings: number;
  trTotalListings: number;
  courts: CourtPseoEntry[];
  courtBySlug: Map<string, CourtPseoEntry>;
  cities: CityPseoEntry[];
  cityBySlug: Map<string, CityPseoEntry>;
  trLocations: TrLocationPseoEntry[];
  trBySlug: Map<string, TrLocationPseoEntry>;
}
