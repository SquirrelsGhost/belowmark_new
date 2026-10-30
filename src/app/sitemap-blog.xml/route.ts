import { BELOWMARK_ORIGIN, BLOG_LANGS, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";

const escapeXml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET(): Promise<Response> {
  try {
    const feed = await BlogService.GetFeed();

    const urls = new Set<string>([
      `${BELOWMARK_ORIGIN}/blog`,
      `${BELOWMARK_ORIGIN}/tr/blog`,
      `${BELOWMARK_ORIGIN}/en/blog`,
      `${BELOWMARK_ORIGIN}/it/blog`,
      `${BELOWMARK_ORIGIN}/es/blog`,
      `${BELOWMARK_ORIGIN}/fr/blog`,
      `${BELOWMARK_ORIGIN}/ar/blog`,
      `${BELOWMARK_ORIGIN}/ru/blog`,
    ]);

    for (const cluster of feed.clusters) {
      for (const lang of BLOG_LANGS) {
        const entry = cluster.languages[lang];
        if (isIndexableArticle(entry)) {
          urls.add(`${BELOWMARK_ORIGIN}${entry.url}`);
        }
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
      ...urls,
    ]
      .sort()
      .map((u) => `  <url><loc>${escapeXml(u)}</loc></url>`)
      .join("\n")}\n</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (error) {
    console.error("[GET /sitemap-blog.xml]", error);
    return new Response("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>", {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
