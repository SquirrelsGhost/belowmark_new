import type { LocaleOption, PricingCountryCode } from "./constants";

/** Multilingual search terms & currency codes so users find any of the 12 countries in any language. */
export const MARKET_SEARCH_TERMS: Record<PricingCountryCode, string> = {
  DE: "de deutschland germany allemagne alemania germania almanya zvg eur €",
  AT: "at österreich oesterreich austria autriche avusturya edikte eur €",
  CH: "ch schweiz switzerland suisse svizzera isviçre isvicre shab chf",
  IT: "it italien italy italie italia italya aste pvp eur €",
  ES: "es spanien spain espagne españa espana ispanya boe eur €",
  FR: "fr frankreich france francia fransa licitor eur €",
  GB: "gb uk united kingdom england großbritannien grossbritannien britain ingiltere gbp £",
  NL: "nl niederlande netherlands holland pays-bas países bajos hollanda executieveiling eur €",
  PL: "pl polen poland pologne polonia polonya komornik pln zł zl",
  CZ: "cz tschechien czechia czech tchéquie chequia çekya cekya dražby czk kč kc",
  SE: "se schweden sweden suède suecia svezia isveç isvec kronofogden sek kr",
  TR: "tr türkei turkei türkiye turkiye turkey uyap icra ihale try ₺ tl",
};

export const MARKET_CURRENCY_BADGES: Record<PricingCountryCode, string> = {
  DE: "EUR",
  AT: "EUR",
  CH: "CHF",
  IT: "EUR",
  ES: "EUR",
  FR: "EUR",
  GB: "GBP",
  NL: "EUR",
  PL: "PLN",
  CZ: "CZK",
  SE: "SEK",
  TR: "TRY",
};

export const MARKET_SEARCH_PLACEHOLDERS: Record<LocaleOption, string> = {
  de: "Land, Kürzel oder Währung suchen (z. B. AT, CH, TR, PLN …)",
  tr: "Ülke, kod veya para birimi ara (ör. TR, DE, AT, CH, GBP …)",
  en: "Search country, code or currency (e.g. UK, DE, CH, TR …)",
  fr: "Rechercher pays, code ou devise (ex. FR, CH, BE, TR …)",
  es: "Buscar país, código o divisa (p. ej. ES, DE, CH, TR …)",
  it: "Cerca Paese, codice o valuta (es. IT, CH, DE, TR …)",
};

export const MARKET_SEARCH_EMPTY: Record<LocaleOption, string> = {
  de: "Kein passendes Land gefunden.",
  tr: "Eşleşen ülke bulunamadı.",
  en: "No matching country found.",
  fr: "Aucun pays correspondant.",
  es: "No se encontró ningún país.",
  it: "Nessun Paese trovato.",
};

export function matchesMarketSearch(
  code: PricingCountryCode,
  label: string,
  hint: string,
  rawQuery: string,
): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;
  const haystack = `${code.toLowerCase()} ${label.toLowerCase()} ${hint.toLowerCase()} ${MARKET_SEARCH_TERMS[code]}`;
  return haystack.includes(q);
}
