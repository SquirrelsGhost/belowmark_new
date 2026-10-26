import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";

export async function GET(): Promise<Response> {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /app/",
    "Disallow: /konto/",
    "Disallow: /api/",
    "",
    `Sitemap: ${BELOWMARK_ORIGIN}/sitemap.xml`,
    `Sitemap: ${BELOWMARK_ORIGIN}/sitemap-blog.xml`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
