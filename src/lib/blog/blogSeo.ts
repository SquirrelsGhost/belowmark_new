import { Metadata } from "next";
import { BlogArticleLangEntry, BlogClusterItem, BlogLang } from "@/types/blog.types";

export const BLOG_LANGS: readonly BlogLang[] = ["de", "tr", "en", "it", "es", "fr", "ar", "ru"];
export const BELOWMARK_ORIGIN = "https://www.belowmark.com";
export const DEFAULT_BLOG_OG = `${BELOWMARK_ORIGIN}/og/home.png`;

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
