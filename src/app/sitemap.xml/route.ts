import { connection } from "next/server";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";

const SUB_SITEMAPS = [
  `${BELOWMARK_ORIGIN}/sitemap-hubs.xml`,
  `${BELOWMARK_ORIGIN}/sitemap-listings-eu.xml`,
  `${BELOWMARK_ORIGIN}/sitemap-listings-tr.xml`,
  `${BELOWMARK_ORIGIN}/sitemap-blog.xml`,
] as const;

export async function GET(): Promise<Response> {
  await connection();
  const today = new Date().toISOString().slice(0, 10);
  const rows = SUB_SITEMAPS.map(
    (loc) => `  <sitemap><loc>${loc}</loc><lastmod>${today}</lastmod></sitemap>`,
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
