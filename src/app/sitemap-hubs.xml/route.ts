const GONE_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "X-Robots-Tag": "noindex",
  "Cache-Control": "public, max-age=86400",
};

export async function GET(): Promise<Response> {
  return new Response("Gone — consolidated into /sitemap.xml", {
    status: 410,
    headers: GONE_HEADERS,
  });
}
