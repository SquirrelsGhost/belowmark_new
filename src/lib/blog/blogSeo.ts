import { Metadata } from "next";
import { BlogArticleLangEntry, BlogClusterItem, BlogLang } from "@/types/blog.types";

export const BLOG_LANGS: readonly BlogLang[] = ["de", "tr", "en", "it", "es", "fr", "ar", "ru"];
export const BELOWMARK_ORIGIN = "https://belowmark.com";
export const DEFAULT_BLOG_OG = `${BELOWMARK_ORIGIN}/og/home.png`;

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
