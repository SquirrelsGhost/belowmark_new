/**
 * Constants of the signed-in app area (/app). Kept apart from constants.ts so
 * the landing page and the app can change independently.
 */

export const APP_ROUTES = {
  search: "/app",
  listing: "/app/objekt",
  watchlist: "/app/merkliste",
  calculator: "/app/rechner",
  calendar: "/app/kalender",
  account: "/konto",
  login: "/login",
  pricing: "/#preise",
  /** Order overview; signed-out visitors are sent to the login and back */
  order: "/buchen",
} as const;

/** Builds the detail URL of a proceeding; keys contain characters like "#" and "|". */
export const listingHref = (key: string): string => `${APP_ROUTES.listing}/${encodeURIComponent(key)}`;

/** Query parameter names of the search — every filter lives in the URL. */
export const SEARCH_PARAMS = {
  query: "q",
  country: "staat",
  region: "land",
  segment: "art",
  minValue: "von_wert",
  maxValue: "bis_wert",
  from: "von",
  to: "bis",
  scope: "zeit",
  withCancelled: "aufgehoben",
  onlyOpportunity: "chance",
  onlyWithDocs: "belege",
  sort: "sort",
  view: "ansicht",
  page: "seite",
} as const;

/** URL values of the search view switch. */
export const VIEW_VALUES = { list: "liste", map: "karte" } as const;

/** URL value of the watch list's comparison view (same parameter as the search view). */
export const WATCHLIST_COMPARE_VIEW = "vergleich";

export const SEARCH = {
  pageSize: 25,
  /** Weeks shown in the hearing calendar strip */
  calendarWeeks: 12,
  /** Hearings within this many days are marked as imminent */
  imminentDays: 7,
  /** Proceedings first seen within this many days of the data snapshot count as new */
  newDays: 7,
  maxQueryLength: 80,
} as const;

/** Value presets in the filter (euros / lira). */
export const VALUE_PRESETS = {
  DE: [50_000, 100_000, 200_000, 300_000, 500_000, 1_000_000],
  TR: [500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000, 25_000_000],
} as const;

/** Turkish purchase costs on top of the bid (İİK / Harçlar Kanunu), as in the old app. Stand 13.08.2026. */
export const TR_COSTS = {
  asOf: "2026-08-13",
  /** İİK m.129 — the auction starts at half the appraised value */
  startingBidShare: 0.5,
  /** İİK m.114/7 (since Kanun 7343, 2021; m.124 no longer holds it) — deposit of a tenth of the appraised value */
  depositShare: 0.1,
  /** Harçlar Kanunu Nr. 492, Tarif 4 — net share the buyer keeps paying */
  tapuHarciPct: 2,
  /** Damga Vergisi Kanunu Nr. 488, Tabelle I, II/2 */
  damgaVergisiPct: 0.569,
  /** TKGM tariff 2026, fixed fee */
  donerSermayeTl: 6681,
} as const;

/**
 * Map tiles for the detail page. basemap.de is the official federal base map
 * (BKG, CC BY 4.0); OpenStreetMap serves Turkey and stands in if basemap.de fails.
 */
export const MAP_TILES = {
  basemap: {
    url: "https://sgx.geodatenzentrum.de/wmts_basemapde/tile/1.0.0/de_basemapde_web_raster_grau/default/GLOBAL_WEBMERCATOR/{z}/{y}/{x}.png",
    attribution: "© GeoBasis-DE / BKG (2026), CC BY 4.0",
    attributionUrl: "https://basemap.de/",
  },
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap-Mitwirkende, ODbL",
    attributionUrl: "https://www.openstreetmap.org/copyright",
  },
  tileSize: 256,
  /** Zoom steps the detail map offers, by how precise the position is */
  zooms: { postcode: [11, 13, 15], province: [7, 9, 11] },
} as const;

/** Local storage key prefix of the per-proceeding check list. */
export const CHECKLIST_STORAGE_PREFIX = "belowmark:pruefliste:";

/** Max length of a note on the watch list. */
export const NOTE_MAX_LENGTH = 2000;

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Hearings are counted in the court's local time. */
export const MARKET_TIME_ZONES = { DE: "Europe/Berlin", TR: "Europe/Istanbul" } as const;

/** id of the main landmark, target of the skip link. */
export const APP_MAIN_ID = "inhalt";
