import rawBoosts from "@/data/seoLearnedBoosts.json";
import { PricingCountryCode } from "@/lib/constants";
import { PseoLocale } from "@/types/pseo.types";

export interface CtrBoostEntry {
  topQuery: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

interface LearnedBoostsData {
  updatedAt: string;
  source: string;
  markets: Record<string, string[]>;
  pages: Record<string, string[]>;
  ctrBoosts?: Record<string, CtrBoostEntry>;
}

const BOOSTS = rawBoosts as LearnedBoostsData;

interface LearnedFaqInput {
  locale: PseoLocale;
  marketCode: PricingCountryCode;
  locationName: string;
  canonicalUrl: string;
  existingFaqs: ReadonlyArray<{ q: string; a: string }>;
}

const QUESTION_TEMPLATES: Record<PseoLocale, (kw: string, loc: string) => { q: string; a: string }> = {
  de: (kw, loc) => ({
    q: `Was bedeutet „${kw}“ konkret für Käufer in ${loc}?`,
    a: `Für „${kw}“ in ${loc} fasst Belowmark amtliche Bekanntmachungen, Verkehrswerte, 5/10- und 7/10-Wertgrenzen (§ 74a / § 85a ZVG) sowie direkte Gerichtstermine tagesaktuell zusammen.`,
  }),
  tr: (kw, loc) => ({
    q: `${loc} bölgesinde “${kw}” arayanlar için güncel ihale şartları nelerdir?`,
    a: `${loc} içindeki “${kw}” ilanları için Belowmark muhammen bedel, %50 açılış sınırı, %10 teminat tutarı ve resmi ihale tarihlerini tek tabloda doğrular.`,
  }),
  en: (kw, loc) => ({
    q: `How does "${kw}" work for property buyers in ${loc}?`,
    a: `For "${kw}" in ${loc}, Belowmark tracks official court/auction notices, guide prices, statutory deposit requirements, and upcoming auction dates.`,
  }),
  it: (kw, loc) => ({
    q: `Come funziona "${kw}" per le aste immobiliari a ${loc}?`,
    a: `Per "${kw}" a ${loc}, Belowmark aggrega avvisi ufficiali di vendita, prezzo base, offerta minima al 75% e cauzione del 10% con date d'udienza aggiornate.`,
  }),
  es: (kw, loc) => ({
    q: `¿Cómo funciona "${kw}" en las subastas judiciales de ${loc}?`,
    a: `Para "${kw}" en ${loc}, Belowmark reúne anuncios oficiales del BOE, valor de subasta, umbral del 70% LEC y depósito del 5% con fechas actualizadas.`,
  }),
  fr: (kw, loc) => ({
    q: `Comment fonctionne « ${kw} » pour les ventes aux enchères à ${loc} ?`,
    a: `Pour « ${kw} » à ${loc}, Belowmark centralise les annonces officielles, la mise à prix, la consignation CARPA de 10 % et les dates d'audience à venir.`,
  }),
};

function formatQueryHeading(query: string): string {
  return query
    .trim()
    .split(/\s+/)
    .map((w) => (w.length > 2 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/**
 * Rewrites <title> (<= 65c) & meta description (<= 156c) when a page has >= 50 GSC impressions
 * and < 1% CTR by weaving the #1 verified GSC query directly into the SERP snippet.
 */
export function applyCtrBoostMeta(
  canonicalUrl: string,
  baseTitle: string,
  baseDescription: string,
): { title: string; description: string; extraKeyword?: string } {
  let pathname = "/";
  try {
    pathname = new URL(canonicalUrl).pathname;
  } catch {
    pathname = canonicalUrl;
  }
  const striker = BOOSTS.ctrBoosts?.[pathname];
  if (!striker?.topQuery) {
    return { title: baseTitle, description: baseDescription };
  }

  const cleanKw = striker.topQuery.trim();
  const formattedKw = formatQueryHeading(cleanKw);

  let nextTitle = baseTitle;
  if (!baseTitle.toLowerCase().includes(cleanKw.toLowerCase())) {
    const combined = `${formattedKw} · ${baseTitle}`;
    if (combined.length <= 65) {
      nextTitle = combined;
    } else {
      const compactCore = baseTitle.split(/[:|·—–]/)[0]?.trim() || "Belowmark";
      const alt = `${formattedKw} | ${compactCore}`;
      nextTitle = alt.length <= 65 ? alt : `${formattedKw.slice(0, 52).trim()} | Belowmark`;
    }
  }

  let nextDesc = baseDescription;
  if (!baseDescription.toLowerCase().includes(cleanKw.toLowerCase())) {
    const prefixed = `${formattedKw}: ${baseDescription}`;
    nextDesc = prefixed.length <= 156 ? prefixed : `${prefixed.slice(0, 153).replace(/\s+\S*$/, "")}…`;
  }

  return { title: nextTitle, description: nextDesc, extraKeyword: cleanKw };
}

export function getMergedLearnedFaqs({
  locale,
  marketCode,
  locationName,
  canonicalUrl,
  existingFaqs,
}: LearnedFaqInput): Array<{ q: string; a: string }> {
  let pathname = "/";
  try {
    pathname = new URL(canonicalUrl).pathname;
  } catch {
    pathname = canonicalUrl;
  }

  const pageQueries = BOOSTS.pages?.[pathname] ?? [];
  const marketQueries = BOOSTS.markets?.[marketCode] ?? [];
  const combined = Array.from(new Set([...pageQueries, ...marketQueries])).slice(0, 3);
  if (combined.length === 0) return [...existingFaqs];

  const existingSet = new Set(existingFaqs.map((f) => f.q.toLowerCase()));
  const builder = QUESTION_TEMPLATES[locale] ?? QUESTION_TEMPLATES.de;
  const learned = combined
    .map((kw) => builder(kw, locationName))
    .filter((item) => !existingSet.has(item.q.toLowerCase()));

  return [...existingFaqs, ...learned];
}
