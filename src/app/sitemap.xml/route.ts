import { BELOWMARK_ORIGIN, BLOG_LANGS, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";
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
  try {
    const [feed, catalog] = await Promise.all([BlogService.GetFeed(), PseoService.GetCatalog()]);
    const today = new Date().toISOString().slice(0, 10);

    const byLoc = new Map<string, SitemapEntry>();
    const addUrl = (loc: string, priority: string, changefreq: "daily" | "weekly" | "monthly" = "daily", lastmod = today) => {
      if (!byLoc.has(loc)) {
        byLoc.set(loc, { loc, lastmod, changefreq, priority });
      }
    };

    // 1. Core Marketing & Hub Pages
    addUrl(`${BELOWMARK_ORIGIN}/`, "1.0", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerungen`, "0.95", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`, "0.95", "weekly");
    addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale`, "0.95", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`, "0.95", "weekly");
    addUrl(`${BELOWMARK_ORIGIN}/blog`, "0.9", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/tr/blog`, "0.9", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/en/blog`, "0.85", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/it/blog`, "0.85", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/es/blog`, "0.85", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/fr/blog`, "0.85", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/ar/blog`, "0.85", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/ru/blog`, "0.85", "daily");
    addUrl(`${BELOWMARK_ORIGIN}/login`, "0.5", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/signup`, "0.8", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/impressum`, "0.3", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/agb`, "0.3", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/datenschutz`, "0.3", "monthly");
    addUrl(`${BELOWMARK_ORIGIN}/widerruf`, "0.3", "monthly");

    // 2. Multilingual Blog Articles
    for (const cluster of feed.clusters) {
      const modDate = (cluster.publishedAt ?? today).slice(0, 10);
      for (const lang of BLOG_LANGS) {
        const entry = cluster.languages[lang];
        if (isIndexableArticle(entry)) {
          addUrl(`${BELOWMARK_ORIGIN}${entry.url}`, "0.85", "weekly", modDate);
        }
      }
    }

    // 2b. All 16 German Bundesländer Hub Pages
    for (const st of catalog.deStates) {
      addUrl(`${BELOWMARK_ORIGIN}/bundesland/${st.slug}`, "0.90", "daily");
    }

    // 3. All German / DACH Amtsgerichte pSEO Pages
    for (const court of catalog.courts) {
      addUrl(`${BELOWMARK_ORIGIN}/amtsgericht/${court.slug}`, "0.85", "daily");
    }

    // 4. All German / DACH Cities pSEO Pages (Full 3,039 City Coverage)
    for (const city of catalog.cities) {
      addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerung/${city.slug}`, "0.80", "daily");
    }

    // 5. All 81 Turkish Provinces + 723 Districts pSEO Pages
    for (const loc of catalog.trLocations) {
      addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, loc.kind === "province" ? "0.85" : "0.75", "daily");
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
    console.error("[GET /sitemap.xml]", error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
