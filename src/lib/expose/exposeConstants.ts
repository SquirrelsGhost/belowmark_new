import { MarketCode } from "@/lib/constants";
import { ExposeCheckId, ExposeFactKey, ExposeInputs } from "@/types/expose.types";

/**
 * Constants of the resale exposé. Kept apart from the bidding and bank-file
 * constants so this feature can change on its own.
 */

/** Route of the printable exposé — outside /app so the app chrome is not printed. */
export const EXPOSE_ROUTE = "/expose";

/** URL flag that opens the print dialog right away. */
export const EXPOSE_PRINT_PARAM = "drucken";

export const exposeHref = (key: string, autoPrint = false): string =>
  `${EXPOSE_ROUTE}/${encodeURIComponent(key)}${autoPrint ? `?${EXPOSE_PRINT_PARAM}=1` : ""}`;

/** localStorage key of the seller's inputs, one per proceeding. */
export const exposeKey = (listingId: string) => `belowmark:expose:${listingId}`;

/** Written by the portfolio feature after the hearing; read here, never written. */
export const holdingKey = (listingId: string) => `belowmark:zuschlag:${listingId}`;

/** IndexedDB for the photos — too large for localStorage, and they stay on this device. */
export const PHOTO_DB = { name: "belowmark-expose", version: 1, store: "photos" } as const;

export const PHOTO_LIMIT = 12;
/** Longest edge after downscaling; enough for A4 print at a good size. */
export const PHOTO_MAX_EDGE = 1800;
export const PHOTO_QUALITY = 0.82;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const CAPTION_MAX = 80;

export const TEXT_LIMITS = { headline: 90, description: 2400, location: 1200, features: 1200, short: 120 } as const;

/** Energy classes as the Energieausweis / EKB prints them. */
export const EFFICIENCY_CLASSES: Record<MarketCode, string[]> = {
  DE: ["A+", "A", "B", "C", "D", "E", "F", "G", "H"],
  TR: ["A", "B", "C", "D", "E", "F", "G"],
};

/** Order of the facts table, per market; keys without a value are still printed as missing. */
export const FACT_ORDER: Record<MarketCode, ExposeFactKey[]> = {
  DE: ["livingArea", "plotArea", "rooms", "yearBuilt"],
  TR: ["buildingArea", "plotArea", "rooms", "yearBuilt", "parcel", "nitelik", "zoning", "share"],
};

/** The four figures on the cover. */
export const COVER_FACTS: Record<MarketCode, ExposeFactKey[]> = {
  DE: ["livingArea", "rooms", "yearBuilt", "plotArea"],
  TR: ["buildingArea", "rooms", "yearBuilt", "plotArea"],
};

/** Which checks the screen panel lists, per market. */
export const CHECK_ORDER: Record<MarketCode, ExposeCheckId[]> = {
  DE: ["price", "registered", "energy", "photos", "photoRights", "reportAge", "liability", "agent", "commission", "tenancy", "tax", "contact"],
  TR: ["price", "registered", "share", "energy", "eids", "photos", "photoRights", "reportAge", "agent", "tenancy", "tax", "contact"],
};

/** Statute pages the checks cite. */
export const EXPOSE_LAWS = {
  geg80: "https://www.gesetze-im-internet.de/geg/__80.html",
  geg87: "https://www.gesetze-im-internet.de/geg/__87.html",
  bgb434: "https://www.gesetze-im-internet.de/bgb/__434.html",
  bgb444: "https://www.gesetze-im-internet.de/bgb/__444.html",
  bgb566: "https://www.gesetze-im-internet.de/bgb/__566.html",
  bgb656c: "https://www.gesetze-im-internet.de/bgb/__656c.html",
  gewo34c: "https://www.gesetze-im-internet.de/gewo/__34c.html",
  estg23: "https://www.gesetze-im-internet.de/estg/__23.html",
  zvg90: "https://www.gesetze-im-internet.de/zvg/__90.html",
  zvg130: "https://www.gesetze-im-internet.de/zvg/__130.html",
  gbo39: "https://www.gesetze-im-internet.de/gbo/__39.html",
  gwg2: "https://www.gesetze-im-internet.de/gwg_2017/__2.html",
  urhg72: "https://www.gesetze-im-internet.de/urhg/__72.html",
  iik: "https://www.mevzuat.gov.tr/mevzuatmetin/1.3.2004.pdf",
  tbk: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6098.pdf",
  gvk: "https://www.mevzuat.gov.tr/mevzuatmetin/1.4.193.pdf",
  tmk: "https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4721.pdf",
  fsek: "https://www.mevzuat.gov.tr/mevzuatmetin/1.3.5846.pdf",
  edevlet: "https://www.turkiye.gov.tr/",
} as const;

export type ExposeLaw = keyof typeof EXPOSE_LAWS;

/** Speculation period for private sales, in years: § 23 Abs. 1 Nr. 1 EStG / GVK mükerrer 80. */
export const SPECULATION_YEARS: Record<MarketCode, number> = { DE: 10, TR: 5 };

/** Every field starts empty — no price, no text, no class is put in the seller's mouth. */
export const EMPTY_EXPOSE_INPUTS: ExposeInputs = {
  headline: "",
  description: "",
  location: "",
  features: "",
  askingPrice: null,
  priceType: null,
  sellerRole: null,
  commissionPct: null,
  livingArea: null,
  plotArea: null,
  rooms: null,
  yearBuilt: null,
  condition: null,
  occupancy: null,
  netRent: null,
  availableFrom: "",
  heating: "",
  certType: null,
  energyValue: null,
  energyCarrier: "",
  efficiencyClass: "",
  certIssued: "",
  registered: null,
  addressMode: "place",
  contactName: "",
  contactCompany: "",
  contactPhone: "",
  contactEmail: "",
  licenseNo: "",
};
