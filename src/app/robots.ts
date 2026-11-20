import type { MetadataRoute } from "next";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";

const PROTECTED_PATHS = [
  "/app/",
  "/konto/",
  "/api/",
  "/buchen",
  "/bezahlen/",
  "/mappe/",
  "/bankmappe/",
  "/expose/",
];

const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Google-Extended",
  "ClaudeBot",
  "Applebot-Extended",
];

/**
 * Search Engine & AI-Search Crawler Governance (Pycie Global SEO Standard):
 * Allows Google, Bing, and AI answer engines on all public auction directories, calculators,
 * and pillars while leaving `/[lang]/blog` and `/[lang]/atlas` crawlable so Googlebot can
 * read `X-Robots-Tag: noindex, follow` and cleanly drop unindexed clone URLs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PROTECTED_PATHS,
      },
      {
        userAgent: AI_SEARCH_BOTS,
        allow: "/",
        disallow: PROTECTED_PATHS,
      },
    ],
    host: BELOWMARK_ORIGIN,
    sitemap: [`${BELOWMARK_ORIGIN}/sitemap.xml`],
  };
}
