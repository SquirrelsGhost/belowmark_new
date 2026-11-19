import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { BELOWMARK_ORIGIN, INDEXED_BLOG_LANGS, isIndexableArticle } from "@/lib/blog/blogSeo";
import { isSwissMultilangEligible, SWISS_HUB_PATHS } from "@/lib/pseo/swissMultilangCopy";
import { BlogService } from "@/services/BlogService";
import { PseoService } from "@/services/PseoService";

const COMPACT_EU_MARKETS = new Set(["AT", "CH", "NL", "SE"]);

/**
 * Primary Sitemap (`https://www.belowmark.com/sitemap.xml`) — Pycie Global SEO Standard (Option A):
 * Covers core conversion pages, all 12 native country auction hubs & calculators, active regional/city/court
 * directories with genuine inventory, and primary indexed blog pillars (zero unindexed clone URLs).
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

  // 1. Core Marketing, Live Search, Market Atlas, DE/TR Hubs & Calculators
  addUrl(`${BELOWMARK_ORIGIN}/`, 1.0, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/suche`, 0.95, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/atlas`, 0.92, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerungen`, 0.95, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`, 0.95, "weekly");
  addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale`, 0.95, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`, 0.95, "weekly");
  addUrl(`${BELOWMARK_ORIGIN}/blog`, 0.90, "daily");
  addUrl(`${BELOWMARK_ORIGIN}/signup`, 0.80, "monthly");
  addUrl(`${BELOWMARK_ORIGIN}/impressum`, 0.25, "yearly");
  addUrl(`${BELOWMARK_ORIGIN}/agb`, 0.25, "yearly");
  addUrl(`${BELOWMARK_ORIGIN}/datenschutz`, 0.25, "yearly");
  addUrl(`${BELOWMARK_ORIGIN}/widerruf`, 0.25, "yearly");

  // 2. German Bundesländer, Amtsgerichte & Cities (>= 2 listings, no suburb noise)
  for (const st of catalog.deStates) {
    if (st.totalCount >= 1) addUrl(`${BELOWMARK_ORIGIN}/bundesland/${st.slug}`, 0.90, "daily");
  }
  for (const court of catalog.courts) {
    if (court.totalCount >= 1) addUrl(`${BELOWMARK_ORIGIN}/amtsgericht/${court.slug}`, 0.85, "daily");
  }
  for (const city of catalog.cities) {
    if (city.totalCount >= 2 && !city.slug.includes("-ot-")) {
      addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerung/${city.slug}`, 0.80, "daily");
    }
  }

  // 3. Turkish Provinces & Dense İcra Hubs
  for (const loc of catalog.trLocations) {
    if (loc.kind === "province" && loc.totalCount >= 1) {
      addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, 0.88, "daily");
    } else if (loc.kind === "category" && loc.totalCount >= 8) {
      addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, 0.85, "daily");
    } else if ((loc.kind === "court" || loc.kind === "district") && loc.totalCount >= 5) {
      addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, 0.80, "daily");
    }
  }

  // 4. All 10 European Partner Markets (AT, CH, IT, ES, FR, GB, NL, PL, CZ, SE)
  for (const euCat of Object.values(catalog.euMarkets)) {
    addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}`, 0.95, "daily");
    addUrl(`${BELOWMARK_ORIGIN}${euCat.calcPath}`, 0.90, "weekly");
    const minLots = COMPACT_EU_MARKETS.has(euCat.market) ? 1 : 3;

    for (const reg of euCat.regions) {
      if (reg.totalCount >= 1) addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${reg.slug}`, 0.88, "daily");
    }
    for (const city of euCat.cities) {
      if (city.totalCount >= minLots) addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${city.slug}`, 0.80, "daily");
    }
    for (const court of euCat.courts) {
      if (court.totalCount >= minLots) addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${court.slug}`, 0.80, "daily");
    }
  }

  // 5. Trilingual Switzerland (FR-CH Romandie / FOSC & IT-CH Ticino / FUSC)
  const chCat = catalog.euMarkets.CH;
  for (const lang of ["fr", "it"] as const) {
    const chPrefix = SWISS_HUB_PATHS[lang];
    addUrl(`${BELOWMARK_ORIGIN}${chPrefix}`, 0.92, "daily");
    for (const reg of chCat.regions) {
      if (isSwissMultilangEligible(reg, lang)) addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${reg.slug}`, 0.86, "daily");
    }
    for (const city of chCat.cities) {
      if (isSwissMultilangEligible(city, lang)) addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${city.slug}`, 0.78, "daily");
    }
    for (const court of chCat.courts) {
      if (isSwissMultilangEligible(court, lang)) addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${court.slug}`, 0.78, "daily");
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
