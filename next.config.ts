import type { NextConfig } from "next";

// Targeted SEO & AI-Search crawler regex for synchronous `<head>` metadata rendering in Next.js 16:
// Guarantees `<title>`, `<link rel="canonical">`, hreflang & OpenGraph inside `<head>` for Googlebot,
// Bingbot, AI bots (OAI-SearchBot, GPTBot, PerplexityBot, ClaudeBot) and social preview crawlers,
// WITHOUT wildcarding all user agents (which would inject `experimentalBypassFor` and break `X-Vercel-Cache: HIT`).
const SEO_AND_AI_BOT_UA_RE =
  /Googlebot|GoogleOther|Google-Extended|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|OAI-SearchBot|GPTBot|ChatGPT-User|PerplexityBot|ClaudeBot|Applebot|Bingbot|BingPreview|DuckDuckBot|Slurp|baiduspider|yandex|sogou|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|SkypeUriPreview|redditbot|bitlybot|tumblr|vkShare|quora link preview|ia_archiver|Yeti|googleweblight|AhrefsBot|SemrushBot|Screaming Frog/i;

const NOINDEX_FOLLOW_HEADER = [{ key: "X-Robots-Tag", value: "noindex, follow" }];

const nextConfig: NextConfig = {
  htmlLimitedBots: SEO_AND_AI_BOT_UA_RE,
  cacheComponents: true,
  poweredByHeader: false,
  partialPrefetching: true,
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
  outputFileTracingExcludes: {
    "*": ["./.data/**"],
  },
  experimental: {
    agentUpgrade: "security",
    staleTimes: {
      dynamic: 180,
      static: 300,
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors *" }],
      },
      // Translated blog & atlas clones stay live for UX/outreach, sealed from diluting crawl budget
      {
        source: "/:lang(tr|en|it|es|fr|ar|ru)/blog",
        headers: NOINDEX_FOLLOW_HEADER,
      },
      {
        source: "/:lang(tr|en|it|es|fr|ar|ru)/blog/:path*",
        headers: NOINDEX_FOLLOW_HEADER,
      },
      {
        source: "/:lang(en|fr|it|es|tr)/atlas",
        headers: NOINDEX_FOLLOW_HEADER,
      },
      // Ephemeral redacted single-lot preview routes funnel PageRank to evergreen City/Court hubs
      {
        source: "/objekt/:path*",
        headers: NOINDEX_FOLLOW_HEADER,
      },
      {
        source: "/lot/:path*",
        headers: NOINDEX_FOLLOW_HEADER,
      },
      {
        source: "/tr/ilan/:path*",
        headers: NOINDEX_FOLLOW_HEADER,
      },
    ];
  },
  async redirects() {
    // Strictly relative paths ONLY (never host/domain redirects!) for true Edge HTTP 308 responses
    return [
      {
        source: "/anmelden",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/registrieren",
        destination: "/signup",
        permanent: false,
      },
      {
        source: "/de/blog",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/de/blog/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/de/atlas",
        destination: "/atlas",
        permanent: true,
      },
      {
        source: "/zwangsversteigerung",
        destination: "/zwangsversteigerungen",
        permanent: true,
      },
      {
        source: "/rechner/zvg-verkehrswert-50-70-grenze",
        destination: "/rechner/5-10-und-7-10-grenze",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
