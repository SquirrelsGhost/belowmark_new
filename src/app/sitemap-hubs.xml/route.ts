import { connection } from "next/server";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { PseoService } from "@/services/PseoService";

const escapeXml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
}

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
    for (const atlasLang of ["en", "fr", "it", "es", "tr"]) {
      addUrl(`${BELOWMARK_ORIGIN}/${atlasLang}/atlas`, "0.90", "daily", today);
    }
    addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerungen`, "0.95", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`, "0.95", "weekly");
    addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale`, "0.95", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`, "0.95", "weekly");
    addUrl(`${BELOWMARK_ORIGIN}/signup`, "0.80", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/impressum`, "0.30", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/agb`, "0.30", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/datenschutz`, "0.30", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/widerruf`, "0.30", "monthly");

    // 2. All 16 German Bundesländer Hub Pages
    for (const st of catalog.deStates) {
      addUrl(`${BELOWMARK_ORIGIN}/bundesland/${st.slug}`, "0.90", "daily");
    }

    // 3. Strictly German (DE) Amtsgerichte pSEO Pages (§ 39 ZVG)
    for (const court of catalog.courts) {
      addUrl(`${BELOWMARK_ORIGIN}/amtsgericht/${court.slug}`, "0.85", "daily");
    }

    // 4. Strictly German (DE) Cities & Categories pSEO Pages
    for (const city of catalog.cities) {
      addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerung/${city.slug}`, "0.80", "daily");
    }

    // 5. All 81 Turkish Provinces + Districts + 1,061 İcra Dairesi + Categories pSEO Pages
    for (const loc of catalog.trLocations) {
      const prio =
        loc.kind === "province" || loc.kind === "category"
          ? "0.88"
          : loc.kind === "court"
            ? "0.82"
            : "0.75";
      addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, prio, "daily", today);
    }

    // 6. All 6 European Partner Markets (AT, CH, IT, ES, FR, GB): Hubs, Calculators, Regions, Cities & Courts
    for (const euCat of Object.values(catalog.euMarkets)) {
      addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}`, "0.95", "daily");
      addUrl(`${BELOWMARK_ORIGIN}${euCat.calcPath}`, "0.90", "weekly");
      for (const reg of euCat.regions) {
        addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${reg.slug}`, "0.88", "daily");
      }
      for (const city of euCat.cities) {
        addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${city.slug}`, "0.80", "daily");
      }
      for (const court of euCat.courts) {
        addUrl(`${BELOWMARK_ORIGIN}${euCat.hubPath}/${court.slug}`, "0.80", "daily");
      }
    }

    // 7. Trilingual Switzerland (FR-CH Romandie / FOSC & IT-CH Ticino / FUSC) Hubs, Cantons, Cities & Offices
    const chCat = catalog.euMarkets.CH;
    for (const chPrefix of ["/fr/suisse/ventes-aux-encheres-shab", "/it/svizzera/aste-ufficio-esecuzione-fosc"]) {
      addUrl(`${BELOWMARK_ORIGIN}${chPrefix}`, "0.93", "daily");
      for (const reg of chCat.regions) {
        addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${reg.slug}`, "0.86", "daily");
      }
      for (const city of chCat.cities) {
        addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${city.slug}`, "0.78", "daily");
      }
      for (const court of chCat.courts) {
        addUrl(`${BELOWMARK_ORIGIN}${chPrefix}/${court.slug}`, "0.78", "daily");
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
