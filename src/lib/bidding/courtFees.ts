/**
 * German court fees by value, as the statutes define them — no rounding tricks,
 * no estimates. Both tables are in force since 01.06.2025 (KostBRÄG 2025,
 * BGBl. 2025 I Nr. 109).
 */

/** One step of a fee table: up to `upTo`, every started `step` adds `add` euros. */
interface FeeBand {
  upTo: number;
  step: number;
  add: number;
}

interface FeeTable {
  /** Fee for a value up to 500 € */
  base: number;
  bands: FeeBand[];
}

/** § 34 Abs. 1 GKG (Anlage 2 GKG) — court fees, e.g. the Zuschlag fee. */
const GKG_TABLE: FeeTable = {
  base: 40,
  bands: [
    { upTo: 2_000, step: 500, add: 21 },
    { upTo: 10_000, step: 1_000, add: 22.5 },
    { upTo: 25_000, step: 3_000, add: 30.5 },
    { upTo: 50_000, step: 5_000, add: 40.5 },
    { upTo: 200_000, step: 15_000, add: 140 },
    { upTo: 500_000, step: 30_000, add: 210 },
    { upTo: Number.POSITIVE_INFINITY, step: 50_000, add: 210 },
  ],
};

/** § 34 Abs. 2 GNotKG, Tabelle B — land register fees, e.g. entering the new owner. */
const GNOTKG_TABLE_B: FeeTable = {
  base: 15,
  bands: [
    { upTo: 2_000, step: 500, add: 4 },
    { upTo: 10_000, step: 1_000, add: 6 },
    { upTo: 25_000, step: 3_000, add: 8 },
    { upTo: 50_000, step: 5_000, add: 10 },
    { upTo: 200_000, step: 15_000, add: 27 },
    { upTo: 500_000, step: 30_000, add: 50 },
    { upTo: 5_000_000, step: 50_000, add: 80 },
    { upTo: 10_000_000, step: 200_000, add: 130 },
    { upTo: 20_000_000, step: 250_000, add: 150 },
    { upTo: 30_000_000, step: 500_000, add: 280 },
    { upTo: Number.POSITIVE_INFINITY, step: 1_000_000, add: 120 },
  ],
};

/** Full (1,0) fee for `value` from a table: the base plus every started step above 500 €. */
function fullFee(table: FeeTable, value: number): number {
  let fee = table.base;
  let lower = 500;
  for (const band of table.bands) {
    if (value <= lower) break;
    const covered = Math.min(value, band.upTo) - lower;
    fee += Math.ceil(covered / band.step) * band.add;
    lower = band.upTo;
  }
  return fee;
}

/** GKG fee at a rate, e.g. 0.5 for the Zuschlag (KV 2214 GKG). */
export function gkgFee(value: number, rate: number): number {
  return fullFee(GKG_TABLE, Math.max(0, value)) * rate;
}

/** GNotKG Tabelle B fee at a rate, e.g. 1.0 for entering the owner (KV 14110 GNotKG). */
export function gnotkgFeeB(value: number, rate: number): number {
  return fullFee(GNOTKG_TABLE_B, Math.max(0, value)) * rate;
}
