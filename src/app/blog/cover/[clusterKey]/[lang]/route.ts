import { BLOG_LANGS } from "@/lib/blog/blogSeo";
import { BlogLang } from "@/types/blog.types";

interface CoverRouteContext {
  params: Promise<{ clusterKey: string; lang: string }>;
}

export async function GET(_req: Request, context: CoverRouteContext): Promise<Response> {
  const { clusterKey, lang } = await context.params;
  const cleanLang: BlogLang = BLOG_LANGS.includes(lang as BlogLang) ? (lang as BlogLang) : "de";
  const upstreamUrl = `https://pycie.com/blog/cover/${encodeURIComponent(clusterKey)}/${cleanLang}?v=2`;

  try {
    const res = await fetch(upstreamUrl, {
      headers: {
        "x-seo-brand-domain": "belowmark.com",
      },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const buf = await res.arrayBuffer();
      return new Response(buf, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }
  } catch {
    // Fallback to branded SVG below
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#eeeae1" />
    <rect x="48" y="48" width="1104" height="534" fill="#f7f4ee" stroke="#12110f" stroke-width="4" />
    <line x1="96" y1="210" x2="1104" y2="210" stroke="#c8362b" stroke-width="6" />
    <text x="96" y="165" font-family="Arial Narrow, sans-serif" font-size="56" font-weight="800" fill="#12110f">BELOWMARK</text>
    <text x="96" y="295" font-family="Georgia, serif" font-size="38" fill="#12110f">Amtliches Fachverzeichnis · ZVG &amp; UYAP</text>
    <text x="96" y="360" font-family="Courier New, monospace" font-size="24" fill="#c8362b">${cleanLang.toUpperCase()} · belowmark.com/blog</text>
  </svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
