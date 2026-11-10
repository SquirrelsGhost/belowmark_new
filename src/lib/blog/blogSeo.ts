import { Metadata } from "next";
import { BlogArticleLangEntry, BlogClusterItem, BlogLang } from "@/types/blog.types";

export const BLOG_LANGS: readonly BlogLang[] = ["de", "tr", "en", "it", "es", "fr", "ar", "ru"];
export const BELOWMARK_ORIGIN = "https://www.belowmark.com";
export const DEFAULT_BLOG_OG = `${BELOWMARK_ORIGIN}/og/home.png`;

const DIRECT_ANSWER_PREFIX_RE =
  /^(?:Direktantwort|Direct\s+Answer|Doğrudan\s+(?:Yanıt|Cevap)|Risposta\s+diretta|Respuesta\s+directa|Réponse\s+directe|الإجابة\s+المباشرة|Прямой\s+ответ)\s*[:：—–-]\s*/iu;

export function formatSeoTitle(rawTitle: string, maxLen = 65): string {
  const clean = rawTitle.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;

  const core = clean.replace(/\s*[|—–-]\s*Belowmark(?:\s+(?:Ratgeber|Blog))?$/i, "").trim();
  if (`${core} | Belowmark`.length <= maxLen) {
    return `${core} | Belowmark`;
  }
  if (core.length <= maxLen) {
    return core;
  }

  const withoutTrailingPrice = core
    .replace(/\s*(?:ab|desde|da|dès|from)\s+(?:€\s*|CHF\s*|£\s*)?[\d.,\s]+(?:€|CHF|£|₺)?\s*(?:\([^()]*\))?\s*$/iu, "")
    .trim();
  if (withoutTrailingPrice.length >= 28 && withoutTrailingPrice.length <= maxLen) {
    return `${withoutTrailingPrice} | Belowmark`.length <= maxLen
      ? `${withoutTrailingPrice} | Belowmark`
      : withoutTrailingPrice;
  }

  const withoutTrailingParens = core.replace(/\s*\([^()]*\)\s*$/, "").trim();
  if (withoutTrailingParens.length >= 32 && `${withoutTrailingParens} | Belowmark`.length <= maxLen) {
    return `${withoutTrailingParens} | Belowmark`;
  }
  if (withoutTrailingParens.length >= 32 && withoutTrailingParens.length <= maxLen) {
    return withoutTrailingParens;
  }

  const slice = core.slice(0, maxLen - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = (lastSpace >= 28 ? slice.slice(0, lastSpace) : slice).replace(/[\s,:;—–\-·&/|]+$/u, "");
  return `${cut}…`;
}

export function formatSeoDescription(rawDescription: string, maxLen = 158): string {
  const clean = rawDescription.replace(DIRECT_ANSWER_PREFIX_RE, "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;

  const windowSlice = clean.slice(0, maxLen);
  const sentenceMatches = [...windowSlice.matchAll(/[.!?](?=\s|$)/g)];
  const lastSentence = sentenceMatches.at(-1);
  if (lastSentence && lastSentence.index !== undefined && lastSentence.index >= 105) {
    return windowSlice.slice(0, lastSentence.index + 1).trim();
  }

  const hardSlice = clean.slice(0, maxLen - 1);
  const lastSpace = hardSlice.lastIndexOf(" ");
  const cut = (lastSpace >= 80 ? hardSlice.slice(0, lastSpace) : hardSlice).replace(/[\s,:;—–\-·&/|]+$/u, "");
  return `${cut}…`;
}

export function normalizeCanonicalUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim().replace(/^https?:\/\/belowmark\.com(?=\/|$)/i, BELOWMARK_ORIGIN);
  if (trimmed === BELOWMARK_ORIGIN || trimmed === `${BELOWMARK_ORIGIN}/`) {
    return `${BELOWMARK_ORIGIN}/`;
  }
  return trimmed.replace(/\/+$/, "");
}

export type HtmlLangCode = "de" | "tr" | "en" | "it" | "es" | "fr" | "ar" | "ru";

export function resolveHtmlLang(pathname: string, fallbackLocale: string): HtmlLangCode {
  const prefixMatch = /^\/(tr|en|it|es|fr|ar|ru)(\/|$)/.exec(pathname);
  if (prefixMatch) {
    return prefixMatch[1] as HtmlLangCode;
  }
  if (/^\/(de\/blog|blog|zwangsversteigerungen|zwangsversteigerung|bundesland|amtsgericht|rechner|oesterreich|schweiz)(\/|$)/.test(pathname)) {
    return "de";
  }
  if (fallbackLocale === "tr" || fallbackLocale === "en" || fallbackLocale === "it" || fallbackLocale === "es" || fallbackLocale === "fr") {
    return fallbackLocale;
  }
  return "de";
}

const MARKET_HUB_LANGUAGES: Readonly<Record<string, string>> = {
  "de-DE": `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
  "de-AT": `${BELOWMARK_ORIGIN}/oesterreich/ediktsdatei`,
  "de-CH": `${BELOWMARK_ORIGIN}/schweiz/shab-versteigerungen`,
  "fr-CH": `${BELOWMARK_ORIGIN}/fr/suisse/ventes-aux-encheres-shab`,
  "it-CH": `${BELOWMARK_ORIGIN}/it/svizzera/aste-ufficio-esecuzione-fosc`,
  "it-IT": `${BELOWMARK_ORIGIN}/it/aste-giudiziarie`,
  "es-ES": `${BELOWMARK_ORIGIN}/es/subastas-boe`,
  "fr-FR": `${BELOWMARK_ORIGIN}/fr/encheres-immobilieres`,
  "en-GB": `${BELOWMARK_ORIGIN}/en/uk-property-auctions`,
  "tr-TR": `${BELOWMARK_ORIGIN}/tr/icra-ihale`,
  "x-default": `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
};

const MARKET_CALC_LANGUAGES: Readonly<Record<string, string>> = {
  "de-DE": `${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`,
  "de-AT": `${BELOWMARK_ORIGIN}/oesterreich/rechner/geringstes-gebot-vadium`,
  "de-CH": `${BELOWMARK_ORIGIN}/schweiz/rechner/betreibungsamtliche-steigerung-schkg`,
  "it-IT": `${BELOWMARK_ORIGIN}/it/calcolatore/offerta-minima-75-asta-giudiziaria`,
  "es-ES": `${BELOWMARK_ORIGIN}/es/calculadora/subasta-judicial-boe-70-por-ciento`,
  "fr-FR": `${BELOWMARK_ORIGIN}/fr/calculateur/encheres-judiciaires-licitor-frais`,
  "en-GB": `${BELOWMARK_ORIGIN}/en/calculator/uk-property-auction-stamp-duty-deposit`,
  "tr-TR": `${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`,
  "x-default": `${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`,
};

export function marketHubAlternates(canonicalPath: string): Metadata["alternates"] {
  return {
    canonical: normalizeCanonicalUrl(`${BELOWMARK_ORIGIN}${canonicalPath}`),
    languages: { ...MARKET_HUB_LANGUAGES },
  };
}

export function marketCalcAlternates(canonicalPath: string): Metadata["alternates"] {
  return {
    canonical: normalizeCanonicalUrl(`${BELOWMARK_ORIGIN}${canonicalPath}`),
    languages: { ...MARKET_CALC_LANGUAGES },
  };
}

export function isIndexableArticle(entry: BlogArticleLangEntry | undefined): entry is BlogArticleLangEntry {
  return Boolean(entry?.hasFullBody);
}

export const blogHubUrl = (lang: BlogLang, origin = BELOWMARK_ORIGIN): string =>
  `${origin}${lang === "de" ? "" : `/${lang}`}/blog`;

export const blogArticleCoverPath = (clusterKey: string, lang: BlogLang): string =>
  `/blog/cover/${encodeURIComponent(clusterKey)}/${lang}?v=2`;

export const blogArticleCoverUrl = (cluster: BlogClusterItem, lang: BlogLang): string =>
  `${BELOWMARK_ORIGIN}${blogArticleCoverPath(cluster.clusterKey, lang)}`;

export function blogHubAlternates(lang: BlogLang, origin = BELOWMARK_ORIGIN): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  BLOG_LANGS.forEach((l) => {
    languages[l] = blogHubUrl(l, origin);
  });
  languages["x-default"] = blogHubUrl("de", origin);
  return { canonical: blogHubUrl(lang, origin), languages };
}

export function blogArticleSeo(
  cluster: BlogClusterItem,
  lang: BlogLang,
): Pick<Metadata, "alternates" | "robots"> {
  const entry = cluster.languages[lang];
  if (!isIndexableArticle(entry)) {
    return { robots: { index: false, follow: true } };
  }
  const languages: Record<string, string> = {};
  BLOG_LANGS.forEach((l) => {
    const e = cluster.languages[l];
    if (isIndexableArticle(e)) {
      languages[l] = `${BELOWMARK_ORIGIN}${e.url}`;
    }
  });
  if (languages.de) languages["x-default"] = languages.de;
  return {
    alternates: {
      canonical: `${BELOWMARK_ORIGIN}${entry.url}`,
      languages,
    },
  };
}
