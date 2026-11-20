export const SEO_RECOVERY_THRESHOLDS = {
  deStateMinLots: 1,
  deCityMinLots: 15,
  deCourtMinLots: 15,
  trProvinceMinLots: 10,
  euRegionMinLots: 5,
  chMultilangRegionMinLots: 5,
} as const;

const ROMANDIE_CANTON_SLUGS = new Set([
  "genf",
  "waadt",
  "neuenburg",
  "jura",
  "freiburg",
  "wallis",
  "bern",
]);

const ITALIAN_CH_CANTON_SLUGS = new Set(["tessin", "graubuenden"]);

export function isDeStateIndexable(entry: { totalCount: number }): boolean {
  return entry.totalCount >= SEO_RECOVERY_THRESHOLDS.deStateMinLots;
}

export function isDeCityIndexable(entry: { slug: string; totalCount: number }): boolean {
  return entry.totalCount >= SEO_RECOVERY_THRESHOLDS.deCityMinLots && !entry.slug.includes("-ot-");
}

export function isDeCourtIndexable(entry: { totalCount: number }): boolean {
  return entry.totalCount >= SEO_RECOVERY_THRESHOLDS.deCourtMinLots;
}

export function isTrLocationIndexable(entry: { kind: string; totalCount: number }): boolean {
  return entry.kind === "province" && entry.totalCount >= SEO_RECOVERY_THRESHOLDS.trProvinceMinLots;
}

export function isEuLocationIndexable(entry: { kind: string; totalCount: number }): boolean {
  return entry.kind === "region" && entry.totalCount >= SEO_RECOVERY_THRESHOLDS.euRegionMinLots;
}

export function isSwissMultilangIndexable(
  entry: { kind: string; slug: string; regionSlug?: string; totalCount: number },
  lang: "fr" | "it",
): boolean {
  if (entry.kind !== "region" || entry.totalCount < SEO_RECOVERY_THRESHOLDS.chMultilangRegionMinLots) {
    return false;
  }
  const regionKey = entry.regionSlug || entry.slug;
  return lang === "fr"
    ? ROMANDIE_CANTON_SLUGS.has(entry.slug) || ROMANDIE_CANTON_SLUGS.has(regionKey)
    : ITALIAN_CH_CANTON_SLUGS.has(entry.slug) || ITALIAN_CH_CANTON_SLUGS.has(regionKey);
}
