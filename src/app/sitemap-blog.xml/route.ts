import { connection } from "next/server";
import { BELOWMARK_ORIGIN, BLOG_LANGS, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";

const escapeXml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

interface BlogSitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly";
  priority: string;
}

export async function GET(): Promise<Response> {
  await connection();
  try {
    const feed = await BlogService.GetFeed();
    const today = new Date().toISOString().slice(0, 10);

    const latestPub =
      feed.clusters
        .map((c) => c.publishedAt?.slice(0, 10))
        .filter((d): d is string => Boolean(d))
        .sort()
        .at(-1) ?? today;

    const byLoc = new Map<string, BlogSitemapEntry>();
    const addUrl = (loc: string, priority: string, changefreq: "daily" | "weekly", lastmod: string) => {
      if (!byLoc.has(loc)) {
        byLoc.set(loc, { loc, lastmod, changefreq, priority });
      }
    };

    addUrl(`${BELOWMARK_ORIGIN}/blog`, "0.90", "daily", latestPub);
    for (const lang of BLOG_LANGS) {
      if (lang === "de") continue;
      addUrl(`${BELOWMARK_ORIGIN}/${lang}/blog`, lang === "tr" ? "0.90" : "0.85", "daily", latestPub);
    }

    for (const cluster of feed.clusters) {
      const modDate = (cluster.publishedAt ?? latestPub).slice(0, 10);
      for (const lang of BLOG_LANGS) {
        const entry = cluster.languages[lang];
        if (isIndexableArticle(entry)) {
          addUrl(`${BELOWMARK_ORIGIN}${entry.url}`, "0.85", "weekly", modDate);
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
    console.error("[GET /sitemap-blog.xml]", error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
