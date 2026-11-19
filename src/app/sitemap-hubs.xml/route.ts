import { connection } from "next/server";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { isSwissMultilangEligible, SWISS_HUB_PATHS } from "@/lib/pseo/swissMultilangCopy";
import { PseoService } from "@/services/PseoService";

const escapeXml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
}

const COMPACT_EU_MARKETS = new Set(["AT", "CH", "NL", "SE"]);

export async function GET(): Promise<Response> {
  await connection();
  try {
    const catalog = await PseoService.GetCatalog();
    const today = new Date().toISOString().slice(0, 10);

    const byLoc = new Map<string, SitemapEntry>();
    const addUrl = (loc: string, priority: string, changefreq: "daily" | "weekly" | "monthly" = "daily", lastmod = today) => {
      if (!byLoc.has(loc)) {
        byLoc.set(loc, { loc, lastmod, changefreq, priority });
      }
    };

    // 1. Core Marketing, Live Search, Market Atlas, Country Hubs & Calculators
    addUrl(`${BELOWMARK_ORIGIN}/`, "1.0", "daily", today);
    addUrl(`${BELOWMARK_ORIGIN}/suche`, "0.95", "daily", today);
    addUrl(`${BELOWMARK_ORIGIN}/atlas`, "0.92", "daily", today);
    addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerungen`, "0.95", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`, "0.95", "weekly");
    addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale`, "0.95", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`, "0.95", "weekly");
    addUrl(`${BELOWMARK_ORIGIN}/signup`, "0.80", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/impressum`, "0.30", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/agb`, "0.30", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/datenschutz`, "0.30", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/widerruf`, "0.30", "monthly");

    // 2. German Bundesländer Hub Pages (active inventory only)
    for (const st of catalog.deStates) {
      if (st.totalCount >= 1) {
        addUrl(`${BELOWMARK_ORIGIN}/bundesland/${st.slug}`, "0.90", "daily");
      }
    }

    // 3. Strictly German (DE) Amtsgerichte pSEO Pages (§ 39 ZVG)
    for (const court of catalog.courts) {
      if (court.totalCount >= 1) {
        addUrl(`${BELOWMARK_ORIGIN}/amtsgericht/${court.slug}`, "0.85", "daily");
      }
    }

    // 4. German (DE) Cities & Categories — require >= 2 listings & skip "-ot-" suburb noise to protect crawl budget
    for (const city of catalog.cities) {
      if (city.totalCount >= 2 && !city.slug.includes("-ot-")) {
        addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerung/${city.slug}`, "0.80", "daily");
      }
    }

    // 5. Turkish Provinces, High-Volume Districts, Major İcra Daireleri & Categories (dense hubs only)
    for (const loc of catalog.trLocations) {
      if (loc.kind === "province" && loc.totalCount >= 1) {
        addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, "0.88", "daily", today);
      } else if (loc.kind === "category" && loc.totalCount >= 8) {
        addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, "0.85", "daily", today);
      } else if (loc.kind === "court" && loc.totalCount >= 5) {
        addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, "0.82", "daily", today);
      } else if (loc.kind === "district" && loc.totalCount >= 5) {
        addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, "0.78", "daily", today);
      }
    }

    // 6. All 10 European Partner Markets (AT, CH, IT, ES, FR, GB, NL, PL, CZ, SE)
    for (const euCat of Object.values(catalog.euMarkets)) {
      addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}`, "0.95", "daily");
      addUrl(`${BELOWMARK_ORIGIN}${euCat.calcPath}`, "0.90", "weekly");
      const minCityLots = COMPACT_EU_MARKETS.has(euCat.market) ? 1 : 3;
      const minCourtLots = COMPACT_EU_MARKETS.has(euCat.market) ? 1 : 3;

      for (const reg of euCat.regions) {
        if (reg.totalCount >= 1) {
          addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${reg.slug}`, "0.88", "daily");
        }
      }
      for (const city of euCat.cities) {
        if (city.totalCount >= minCityLots) {
          addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${city.slug}`, "0.80", "daily");
        }
      }
      for (const court of euCat.courts) {
        if (court.totalCount >= minCourtLots) {
          addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${court.slug}`, "0.80", "daily");
        }
      }
    }

    // 7. Trilingual Switzerland (FR-CH Romandie / FOSC & IT-CH Ticino / FUSC) — only native language cantons/communes
    const chCat = catalog.euMarkets.CH;
    for (const lang of ["fr", "it"] as const) {
      const chPrefix = SWISS_HUB_PATHS[lang];
      addUrl(`${BELOWMARK_ORIGIN}${chPrefix}`, "0.93", "daily");
      for (const reg of chCat.regions) {
        if (isSwissMultilangEligible(reg, lang)) {
          addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${reg.slug}`, "0.86", "daily");
        }
      }
      for (const city of chCat.cities) {
        if (isSwissMultilangEligible(city, lang)) {
          addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${city.slug}`, "0.78", "daily");
        }
      }
      for (const court of chCat.courts) {
        if (isSwissMultilangEligible(court, lang)) {
          addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${court.slug}`, "0.78", "daily");
        }
      }
    }

    const rows = [...byLoc.values()].map(
      (u) =>
        `  <url><loc>${escapeXml(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (error) {
    console.error("[GET /sitemap-hubs.xml]", error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
