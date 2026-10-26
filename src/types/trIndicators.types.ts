/** Consumer price index of Turkey as written by scripts/fetch-tufe.mjs (data/tr/tufe.json). */
export interface TufeSeries {
  meta: { series: string; label: string; source: string; fetchedAt: string; from: string; to: string };
  /** "yyyy-mm" → index value */
  months: Record<string, number>;
}

/** TCMB euro rate as written by scripts/fetch-tcmb-kurs.mjs (data/tr/kurs.json). */
export interface TcmbEuroRate {
  meta: { source: string; url: string; bulletin: string; date: string; fetchedAt: string };
  eur: { buying: number; selling: number | null };
}

/** How much purchasing power a notice's nominal value lost since its file year. */
export interface ValueAge {
  year: number;
  /** December of the file year — the latest plausible valuation date */
  fromMonth: string;
  toMonth: string;
  /** Price level now / then, rounded to two decimals */
  factor: number;
  /** Purchasing power lost, percent with one decimal */
  lostPct: number;
}
