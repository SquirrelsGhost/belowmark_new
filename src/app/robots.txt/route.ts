import { err } from "@/lib/api";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";

const DISALLOWED_PATHS = [
  "Disallow: /app/",
  "Disallow: /konto/",
  "Disallow: /api/",
  "Disallow: /buchen",
  "Disallow: /bezahlen/",
  "Disallow: /mappe/",
  "Disallow: /bankmappe/",
  "Disallow: /expose/",
] as const;

const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Google-Extended",
  "ClaudeBot",
  "Applebot-Extended",
] as const;

export async function GET(): Promise<Response> {
  try {
    const aiBlocks = AI_SEARCH_BOTS.flatMap((bot) => [
      `User-agent: ${bot}`,
      "Allow: /",
      ...DISALLOWED_PATHS,
      "",
    ]);

    const body = [
      "User-agent: *",
      "Allow: /",
      ...DISALLOWED_PATHS,
      "",
      ...aiBlocks,
      `Sitemap: ${BELOWMARK_ORIGIN}/sitemap.xml`,
      `Sitemap: ${BELOWMARK_ORIGIN}/sitemap-blog.xml`,
    ].join("\n");

    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[GET /robots.txt]", error);
    return err("Internal server error");
  }
}
