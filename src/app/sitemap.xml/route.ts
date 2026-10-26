import { BELOWMARK_ORIGIN, BLOG_LANGS, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";

export async function GET(): Promise<Response> {
  const feed = await BlogService.GetFeed();

  const urls = new Set<string>([
    `${BELOWMARK_ORIGIN}/`,
    `${BELOWMARK_ORIGIN}/blog`,
    `${BELOWMARK_ORIGIN}/tr/blog`,
    `${BELOWMARK_ORIGIN}/en/blog`,
    `${BELOWMARK_ORIGIN}/ar/blog`,
    `${BELOWMARK_ORIGIN}/ru/blog`,
    `${BELOWMARK_ORIGIN}/login`,
    `${BELOWMARK_ORIGIN}/signup`,
    `${BELOWMARK_ORIGIN}/impressum`,
    `${BELOWMARK_ORIGIN}/agb`,
    `${BELOWMARK_ORIGIN}/datenschutz`,
    `${BELOWMARK_ORIGIN}/widerruf`,
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
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
