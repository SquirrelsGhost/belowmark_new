import { MarketCode } from "@/lib/constants";

/**
 * Exposé for reselling an object bought at auction.
 *
 * Every fact carries where it comes from: the official notice, the uploaded
 * Gutachten (with page) or the seller's own entry. Nothing is filled in by
 * belowmark — a fact without a source is printed as missing.
 */

export type ExposeFactKey = "livingArea" | "plotArea" | "rooms" | "yearBuilt" | "buildingArea" | "parcel" | "nitelik" | "zoning" | "share";

/** Where a fact was read: notice, portal page of the notice, Gutachten — or the seller. */
export type ExposeFactSource = "notice" | "portal" | "report" | "own";

/** A fact the server knows before the seller typed anything, already formatted. */
export interface ExposeBaseFact {
  key: ExposeFactKey;
  value: string;
  source: Exclude<ExposeFactSource, "own">;
  /** Gutachten page, 1-based */
  page?: number;
}

/** What the server hands to the sheet: identification plus the facts with a source. */
export interface ExposeBase {
  listingKey: string;
  market: MarketCode;
  /** "Creglingen" / "Konak" */
  place: string;
  region: string | null;
  /** Street and number as the notice gives it (DE only) */
  street: string | null;
  postcode: string | null;
  mahalle: string | null;
  segmentLabel: string | null;
  facts: ExposeBaseFact[];
  /** Valuation date (Stichtag) as printed in the Gutachten */
  reportDate: string | null;
  /** The notice names a share (hisse) instead of the whole property (TR) */
  isShare: boolean;
  /** The notice text speaks of a share, but no fraction could be read (TR) */
  shareUnclear: boolean;
}

export type ExposePriceType = "fixed" | "negotiable";
export type ExposeSellerRole = "private" | "agent";
export type ExposeCondition = "new" | "renovated" | "maintained" | "needsWork";
export type ExposeOccupancy = "vacant" | "rented" | "owner";
export type ExposeCertType = "demand" | "consumption" | "none";
export type ExposeAddressMode = "exact" | "place";

/** Everything the seller types in; kept per proceeding in localStorage. Empty stays empty. */
export interface ExposeInputs {
  headline: string;
  description: string;
  location: string;
  features: string;
  askingPrice: number | null;
  priceType: ExposePriceType | null;
  sellerRole: ExposeSellerRole | null;
  /** Buyer's commission in percent of the price, VAT included */
  commissionPct: number | null;
  livingArea: number | null;
  plotArea: number | null;
  rooms: number | null;
  yearBuilt: number | null;
  condition: ExposeCondition | null;
  occupancy: ExposeOccupancy | null;
  netRent: number | null;
  availableFrom: string;
  heating: string;
  certType: ExposeCertType | null;
  energyValue: number | null;
  energyCarrier: string;
  efficiencyClass: string;
  certIssued: string;
  /** Grundbuch / tapu already shows the seller as owner */
  registered: boolean | null;
  addressMode: ExposeAddressMode;
  contactName: string;
  contactCompany: string;
  contactPhone: string;
  contactEmail: string;
  /** § 34c GewO permit authority / Taşınmaz Ticareti yetki belgesi no. */
  licenseNo: string;
}

/** One fact as printed: the winning value, its source, and a differing value of another source. */
export interface ExposeFactLine {
  key: ExposeFactKey;
  value: string | null;
  source: ExposeFactSource | null;
  page?: number;
  /** Another source says something else — printed next to it, never hidden */
  otherValue?: string;
  otherSource?: ExposeFactSource;
  otherPage?: number;
}

export interface ExposePhoto {
  id: string;
  /** Downscaled JPEG as data URL — the original never leaves the device */
  dataUrl: string;
  width: number;
  height: number;
  caption: string;
  /** When the seller confirmed the rights to the photo */
  rightsConfirmedAt: string;
}

export type ExposeCheckState = "ok" | "open" | "hint";

export type ExposeCheckId =
  | "price"
  | "registered"
  | "energy"
  | "eids"
  | "photos"
  | "photoRights"
  | "reportAge"
  | "liability"
  | "agent"
  | "commission"
  | "tenancy"
  | "share"
  | "tax"
  | "contact";

/** What the portfolio thread stores about the auction result (belowmark:zuschlag:<key>). */
export interface ExposeHolding {
  status: "won" | "lost" | "bid";
  price: number | null;
  /** yyyy-mm-dd */
  date: string | null;
}

/** What every group of the seller's form receives. */
export interface ExposeFormGroupState {
  inputs: ExposeInputs;
  setInputs: (patch: Partial<ExposeInputs>) => void;
  market: MarketCode;
  currency: string;
}
