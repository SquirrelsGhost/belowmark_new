import { MarketCode } from "@/lib/constants";
import { SegmentKey } from "@/lib/snapshot";

export type DachCountry = "DE" | "AT" | "CH";
export type ListingCountry = DachCountry | "TR";
export type ListingCurrency = "EUR" | "CHF" | "TRY";

/** One bidding window. DE: the hearing itself; TR: one e-auction round (1. / 2. Artırma). */
export interface ListingRound {
  round: number;
  start: string;
  end: string;
}

/** A remark the notice itself gives reason for, with its rank deduction. */
export interface ListingCaveat {
  points: number;
  short: string;
  long: string;
}

/**
 * Where the map puts a proceeding. Never the parcel itself: the middle of the
 * postcode area (DE) or the province centre (TR) — the precision says which.
 */
export interface ListingGeo {
  lat: number;
  lng: number;
  precision: "postcode" | "province";
}

/** Fields only Turkish notices (ilan.gov.tr) carry. */
export interface TrListingDetails {
  adType: string;
  source: string;
  mahalle: string | null;
  ada: string | null;
  parsel: string | null;
  isCondo: boolean;
  landAreaM2: number | null;
  buildingAreaM2: number | null;
  netAreaM2?: number | null;
  /** KDV rate from the notice, in percent */
  vatRate: number | null;
  startingBid: number | null;
  areaM2: number | null;
  areaKind: string | null;
  marketMedianPerM2: number | null;
  marketSampleSize: number | null;
  discountPct: number | null;
  confidence: string | null;
  hitCount: number | null;
  nitelik?: string | null;
  zoning?: string | null;
  ownershipShare?: string | null;
  excerpt?: string | null;
  rooms?: string | null;
  floor?: string | null;
  yearBuilt?: number | null;
  unitNo?: string | null;
  arsaPayi?: string | null;
}

export interface OfficialAttachment {
  id: string;
  kind: "announcement" | "report" | "expose" | "photos" | "notes";
  label: string;
  fileName: string;
  proxyUrl: string;
  directUrl: string;
}

export interface OfficialPortalDetails {
  sourcePortal: string;
  portalEntryUrl: string;
  proceedingKind: string | null;
  grundbuch: string | null;
  description: string | null;
  hearingPlace: string | null;
  creditor: string | null;
  courtUrl: string | null;
  geoServerUrl: string | null;
  livingAreaM2: number | null;
  usableAreaM2?: number | null;
  landAreaM2: number | null;
  netAreaM2?: number | null;
  rooms?: string | null;
  yearBuilt?: number | null;
  floor?: string | null;
  unitNo?: string | null;
  arsaPayi?: string | null;
  zoning?: string | null;
  ownershipShare?: string | null;
  attachments: OfficialAttachment[];
  galleryUrls: string[];
  tkgmParcelUrl: string | null;
}

/**
 * A single proceeding as the app shows it — the same shape for both markets.
 * Every value comes from the official notice; null means the notice does not say.
 */
export interface Listing {
  key: string;
  market: MarketCode;
  /** Country of the proceeding ("DE" | "AT" | "CH" | "TR") */
  country?: ListingCountry;
  /** Currency of appraisedValue / bids ("EUR" | "CHF" | "TRY") */
  currency?: ListingCurrency;
  sourcePortal?: string;
  title: string;
  segment: SegmentKey;
  segmentLabel: string | null;
  /** Bundesland / Kanton / İl */
  region: string | null;
  regionCode: string | null;
  /** City or district (İlçe) */
  place: string | null;
  postcode: string | null;
  street: string | null;
  /** Amtsgericht / Bezirksgericht / Betreibungsamt / İcra Dairesi */
  authority: string;
  fileNo: string;
  fileYear: number | null;
  rounds: ListingRound[];
  hearingAt: string | null;
  cancelled: boolean;
  limitsWaived: boolean;
  appraisedValue: number | null;
  /** Statutory minimum bid from the notice (AT: Geringstes Gebot § 151 EO; CH: Ausrufpreis; DE: 5/10) */
  minimumBid?: number | null;
  /** Statutory deposit from the notice (AT: Vadium § 147 EO; CH: Anzahlung; DE: 10% Sicherheitsleistung) */
  depositAmount?: number | null;
  transferTaxPct: number | null;
  /** Primary living/floor area in m² (Wohnfläche / Brüt alan) */
  livingAreaM2?: number | null;
  /** Usable/commercial area in m² (Nutz-/Gewerbefläche) */
  usableAreaM2?: number | null;
  /** Plot/parcel area in m² (Grundstücksgröße / Yüzölçümü) */
  landAreaM2?: number | null;
  /** Best single area in m² for €/m² calculations */
  areaM2?: number | null;
  /** Kind of areaM2 ("Wohnfläche" | "Wohn-/Nutzfläche" | "Nutzfläche" | "Grundstücksfläche") */
  areaKind?: string | null;
  /** Room count from the notice ("3 Zimmer", "3+1", etc.) */
  rooms?: string | null;
  /** Construction year from the notice */
  yearBuilt?: number | null;
  /** Land register reference (Grundbuchblatt / Flurstück or Ada / Parsel) */
  grundbuch?: string | null;
  /** Proceeding type (Zwangsversteigerung, Teilungsversteigerung, İCRA, İHALE, etc.) */
  proceedingKind?: string | null;
  /** Official property description from the notice */
  description?: string | null;
  /** Courtroom / auction venue */
  hearingPlace?: string | null;
  /** Creditor / representative stated in the notice */
  creditor?: string | null;
  officialUrl: string;
  imageUrl?: string | null;
  zvgComId?: string | null;
  mapUrl: string | null;
  /** Official announcement PDF on the portal (DE) */
  documentUrl: string | null;
  exposeUrl?: string | null;
  reportUrl?: string | null;
  biddingNotesUrl?: string | null;
  courtUrl?: string | null;
  geoServerUrl?: string | null;
  geo: ListingGeo | null;
  /** Changes the portal made since the proceeding was first seen, as the notice words them */
  history: string[];
  geoportalUrl: string | null;
  geoportalName: string | null;
  caveats: ListingCaveat[];
  firstSeenAt: string | null;
  tr?: TrListingDetails;
}

export interface SnapshotRegion {
  code: string;
  name: string;
  status: string;
  included: number;
}

export interface ListingSnapshot {
  meta: {
    market: MarketCode;
    generatedAt: string;
    source: string;
    sourceUrl: string;
    states: SnapshotRegion[];
  };
  listings: Listing[];
}

export type SearchView = "list" | "map";

export type ListingSort = "hearing" | "discount" | "valueAsc" | "valueDesc" | "newest";

/** Which proceedings the list shows by date. */
export type ListingScope = "upcoming" | "all" | "past";

export interface ListingFilters {
  query: string;
  country?: "" | DachCountry;
  region: string;
  segment: SegmentKey | "";
  minValue: number | null;
  maxValue: number | null;
  /** ISO date (yyyy-mm-dd), inclusive */
  from: string;
  /** ISO date (yyyy-mm-dd), inclusive */
  to: string;
  scope: ListingScope;
  withCancelled: boolean;
  onlyOpportunity: boolean;
  onlyWithDocs: boolean;
  sort: ListingSort;
  view: SearchView;
  page: number;
}

/** Status of the proceeding relative to now. */
export type HearingState = "running" | "upcoming" | "past" | "cancelled" | "unknown";

export interface HearingStatus {
  state: HearingState;
  /** The round that is running or comes next (last round once all are past) */
  round: ListingRound | null;
  /** Whole days until the round starts (upcoming) or ends (running) */
  days: number | null;
}

export interface CalendarWeek {
  /** Monday of the week, yyyy-mm-dd */
  start: string;
  /** Sunday of the week, yyyy-mm-dd */
  end: string;
  count: number;
}

export interface RegionFacet {
  code: string;
  name: string;
  count: number;
}

export interface ListingSearchResult {
  items: Listing[];
  total: number;
  page: number;
  pageCount: number;
  calendar: CalendarWeek[];
  regions: RegionFacet[];
  /** Hearings in the next 7 days among the filtered results */
  nextSevenDays: number;
  /** Top opportunities (DE: Wertgrenzen entfallen; TR: >= 25% discount or non-İCRA) */
  opportunitiesCount: number;
  /** Proceedings with official PDF (DE) or verified market median (TR) */
  withDocsCount: number;
  /** All filtered results grouped by map position — only filled for the map view */
  places: MapPlace[];
  /** Filtered results per region, ignoring the region filter itself */
  regionCounts: Record<string, number>;
  /** Filtered results per DACH country, ignoring the country filter itself */
  countryCounts?: Record<DachCountry, number>;
}

/** Proceedings that share one map position (same postcode / same province). */
export interface MapPlace {
  id: string;
  lat: number;
  lng: number;
  precision: ListingGeo["precision"];
  /** Postcode or province name the position stands for */
  label: string;
  regionCode: string | null;
  count: number;
  /** Of those, how many have their next date within the imminent window */
  imminent: number;
  /** Set when exactly one proceeding sits here */
  single: { key: string; title: string; nextDate: string | null; value: number | null; segment: SegmentKey } | null;
}

/** One region outline, already projected into the map's SVG coordinates. */
export interface GeoRegion {
  code: string;
  name: string;
  path: string;
  /** minX, minY, maxX, maxY */
  bbox: [number, number, number, number];
}

export interface GeoProjection {
  minLng: number;
  maxLat: number;
  k: number;
  scale: number;
  pad: number;
  width: number;
  height: number;
}

export interface GeoSource {
  label: string;
  by: string;
  license: string;
  url: string;
}

export interface MarketGeo {
  market: MarketCode;
  projection: GeoProjection;
  regions: GeoRegion[];
  sources: GeoSource[];
}
