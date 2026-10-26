/**
 * Snapshot of the official ZVG data set (zvg-portal.de) as collected by the
 * previous Belowmark pipeline. Shown on the landing page with its date —
 * replace with live queries once the data pipeline is migrated.
 *
 * Nothing here is invented: counts and values come from dataset-de.json.
 */

export const SNAPSHOT_DATE = "2026-10-26";

export const SNAPSHOT_STATS = {
  proceedings: 3544,
  withAppraisal: 3147,
  statesWithHearings: 16,
  totalAppraisedEuro: 1_155_630_310,
  medianAppraisedEuro: 165_000,
} as const;

export type StateCode =
  | "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv"
  | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th";

export interface StateSnapshot {
  code: StateCode;
  name: string;
  /** Grunderwerbsteuer in percent */
  transferTaxPct: number;
  /** Open hearings in the snapshot; null = state does not publish via the joint portal */
  hearings: number | null;
}

/** All 16 states, sorted by open hearings (zvg-portal.de + zvg.com). */
export const STATES: StateSnapshot[] = [
  { code: "nw", name: "Nordrhein-Westfalen", transferTaxPct: 6.5, hearings: 903 },
  { code: "by", name: "Bayern", transferTaxPct: 3.5, hearings: 450 },
  { code: "ni", name: "Niedersachsen", transferTaxPct: 5, hearings: 353 },
  { code: "rp", name: "Rheinland-Pfalz", transferTaxPct: 5, hearings: 330 },
  { code: "he", name: "Hessen", transferTaxPct: 6, hearings: 309 },
  { code: "sn", name: "Sachsen", transferTaxPct: 5.5, hearings: 207 },
  { code: "th", name: "Thüringen", transferTaxPct: 5, hearings: 180 },
  { code: "bw", name: "Baden-Württemberg", transferTaxPct: 5, hearings: 166 },
  { code: "st", name: "Sachsen-Anhalt", transferTaxPct: 5, hearings: 156 },
  { code: "bb", name: "Brandenburg", transferTaxPct: 6.5, hearings: 124 },
  { code: "be", name: "Berlin", transferTaxPct: 6, hearings: 113 },
  { code: "mv", name: "Mecklenburg-Vorpommern", transferTaxPct: 6, hearings: 86 },
  { code: "sl", name: "Saarland", transferTaxPct: 6.5, hearings: 65 },
  { code: "sh", name: "Schleswig-Holstein", transferTaxPct: 6.5, hearings: 62 },
  { code: "hh", name: "Hamburg", transferTaxPct: 5.5, hearings: 25 },
  { code: "hb", name: "Bremen", transferTaxPct: 5.5, hearings: 15 },
];

export type SegmentKey = "house" | "apartment" | "land" | "commercial" | "multiFamily" | "farmland" | "other";

export interface TickerEntry {
  court: string;
  segment: SegmentKey;
  state: StateCode;
  /** Hearing date, ISO */
  date: string;
}

/** Real hearings from the snapshot — values deliberately left out (access only). */
export const TICKER_ENTRIES: TickerEntry[] = [
  { court: "Cloppenburg", segment: "other", state: "ni", date: "2026-10-15" },
  { court: "Idar-Oberstein", segment: "house", state: "rp", date: "2026-10-19" },
  { court: "Bremen", segment: "apartment", state: "hb", date: "2026-09-09" },
  { court: "Blomberg", segment: "house", state: "nw", date: "2026-10-14" },
  { court: "Leipzig", segment: "commercial", state: "sn", date: "2026-11-10" },
  { court: "Solingen", segment: "apartment", state: "nw", date: "2026-11-25" },
  { court: "Saarlouis", segment: "house", state: "sl", date: "2026-10-20" },
  { court: "Landshut", segment: "farmland", state: "by", date: "2026-11-10" },
  { court: "Regensburg", segment: "house", state: "by", date: "2026-09-10" },
  { court: "Gelsenkirchen", segment: "apartment", state: "nw", date: "2026-11-24" },
  { court: "Braunschweig", segment: "apartment", state: "ni", date: "2026-11-11" },
  { court: "Neuwied", segment: "house", state: "rp", date: "2026-10-30" },
  { court: "Geestland", segment: "commercial", state: "ni", date: "2026-10-13" },
  { court: "Bad Hersfeld", segment: "house", state: "he", date: "2026-11-11" },
  { court: "Dortmund", segment: "multiFamily", state: "nw", date: "2026-11-24" },
  { court: "Crailsheim", segment: "other", state: "bw", date: "2026-09-07" },
];
