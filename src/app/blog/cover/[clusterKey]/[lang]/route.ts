import { connection } from "next/server";
import { BLOG_LANGS } from "@/lib/blog/blogSeo";
import { BlogLang } from "@/types/blog.types";

interface CoverRouteContext {
  params: Promise<{ clusterKey: string; lang: string }>;
}

const UPSTREAM_ORIGINS = ["https://pycie.de", "https://www.pycie.com"] as const;
const UPSTREAM_COOLDOWN_MS = 60 * 1000;
let upstreamDownUntil = -Infinity;

export async function GET(_req: Request, context: CoverRouteContext): Promise<Response> {
  await connection();
  const { clusterKey, lang } = await context.params;
  const cleanLang: BlogLang = BLOG_LANGS.includes(lang as BlogLang) ? (lang as BlogLang) : "de";

  if (performance.now() >= upstreamDownUntil) {
    let anySucceeded = false;
    for (const origin of UPSTREAM_ORIGINS) {
      const upstreamUrl = `${origin}/blog/cover/${encodeURIComponent(clusterKey)}/${cleanLang}?v=2`;
      try {
        const res = await fetch(upstreamUrl, {
          headers: {
            "x-seo-brand-domain": "belowmark.com",
          },
          cache: "no-store",
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          anySucceeded = true;
          const buf = await res.arrayBuffer();
          return new Response(buf, {
            status: 200,
            headers: {
              "Content-Type": res.headers.get("content-type") || "image/png",
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
        }
      } catch (error) {
        console.error(`[GET /blog/cover] upstream failed (${origin})`, error);
      }
    }
    if (!anySucceeded) {
      upstreamDownUntil = performance.now() + UPSTREAM_COOLDOWN_MS;
    }
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
