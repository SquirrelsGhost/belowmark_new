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

    // 3. All 530 German Amtsgerichte pSEO Pages
    for (const court of catalog.courts) {
      addUrl(`${BELOWMARK_ORIGIN}/amtsgericht/${court.slug}`, "0.85", "daily");
    }

    // 4. Top 800 German Cities pSEO Pages
    for (const city of catalog.cities.slice(0, 800)) {
      addUrl(`${BELOWMARK_ORIGIN}/zwangsversteigerung/${city.slug}`, "0.80", "daily");
    }

    // 5. All 81 Turkish Provinces + 723 Districts pSEO Pages
    for (const loc of catalog.trLocations) {
      addUrl(`${BELOWMARK_ORIGIN}/tr/icra-ihale/${loc.slug}`, loc.kind === "province" ? "0.85" : "0.75", "daily");
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
