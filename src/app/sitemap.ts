import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { BELOWMARK_ORIGIN, INDEXED_BLOG_LANGS, isIndexableArticle } from "@/lib/blog/blogSeo";
import {
  isDeCityIndexable,
  isDeCourtIndexable,
  isDeStateIndexable,
  isEuLocationIndexable,
  isSwissMultilangIndexable,
  isTrLocationIndexable,
} from "@/lib/pseo/seoIndexPolicy";
import { SWISS_HUB_PATHS } from "@/lib/pseo/swissMultilangCopy";
import { BlogService } from "@/services/BlogService";
import { PseoService } from "@/services/PseoService";

/**
 * Primary Sitemap (`https://www.belowmark.com/sitemap.xml`) — Pycie Global SEO Standard (Recovery Mode):
 * Focuses exclusively on ~415 highest-density pillar hubs, calculators, core country/region hubs,
 * major German cities & courts (>= 15 lots), active Turkish provinces (>= 10 lots), and DE editorial guides.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const [catalog, feed] = await Promise.all([
    PseoService.GetCatalog(),
    BlogService.GetFeed(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();

  const addUrl = (
    url: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "daily",
    lastModified: string = today,
  ) => {
    if (!byUrl.has(url)) {
      byUrl.set(url, { url, lastModified, changeFrequency, priority });
    }
  };

  // 1. Core Marketing, Live Search, Market Atlas, DE/TR Hubs, Calculators & Blog Hub
  addUrl(`${BELOWMARK_ORIGIN}/`, 1.0, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/suche`, 0.95, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/atlas`, 0.92, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerungen`, 0.95, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`, 0.95, "weekly");
  addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale`, 0.95, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`, 0.95, "weekly");
  addUrl(`${BELOWMARK_ORIGIN}/blog`, 0.90, "daily");

  // 2. German Bundesländer, High-Volume Amtsgerichte & Major Cities
  for (const st of catalog.deStates) {
    if (isDeStateIndexable(st)) addUrl(`${BELOWMARK_ORIGIN}/bundesland/${st.slug}`, 0.90, "daily");
  }
  for (const court of catalog.courts) {
    if (isDeCourtIndexable(court)) addUrl(`${BELOWMARK_ORIGIN}/amtsgericht/${court.slug}`, 0.85, "daily");
  }
  for (const city of catalog.cities) {
    if (isDeCityIndexable(city)) addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerung/${city.slug}`, 0.80, "daily");
  }

  // 3. Turkish Active Provinces (>= 10 lots; zero thin districts, courts, or categories)
  for (const loc of catalog.trLocations) {
    if (isTrLocationIndexable(loc)) {
      addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, 0.88, "daily");
    }
  }

  // 4. All 10 European Partner Markets (AT, CH, IT, ES, FR, GB, NL, PL, CZ, SE) — Hubs, Calculators & Dense Regions
  for (const euCat of Object.values(catalog.euMarkets)) {
    addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}`, 0.95, "daily");
    addUrl(`${BELOWMARK_ORIGIN}${euCat.calcPath}`, 0.90, "weekly");

    for (const reg of euCat.regions) {
      if (isEuLocationIndexable(reg)) addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${reg.slug}`, 0.88, "daily");
    }
  }

  // 5. Trilingual Switzerland (FR-CH Romandie / FOSC & IT-CH Ticino / FUSC) — Hubs & Dense Cantons
  const chCat = catalog.euMarkets.CH;
  for (const lang of ["fr", "it"] as const) {
    const chPrefix = SWISS_HUB_PATHS[lang];
    addUrl(`${BELOWMARK_ORIGIN}${chPrefix}`, 0.92, "daily");
    for (const reg of chCat.regions) {
      if (isSwissMultilangIndexable(reg, lang)) addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${reg.slug}`, 0.86, "daily");
    }
  }

  // 6. Indexed Blog Pillars (`INDEXED_BLOG_LANGS` = DE only)
  for (const cluster of feed.clusters) {
    const modDate = (cluster.publishedAt ?? today).slice(0, 10);
    for (const lang of INDEXED_BLOG_LANGS) {
      const entry = cluster.languages[lang];
      if (isIndexableArticle(entry)) {
        addUrl(`${BELOWMARK_ORIGIN}${entry.url}`, 0.85, "weekly", modDate);
      }
    }
  }

  return [...byUrl.values()];
}
