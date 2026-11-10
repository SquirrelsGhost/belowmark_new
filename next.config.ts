import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
  experimental: {
    agentUpgrade: "security",
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
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
    ];
  },
  async redirects() {
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
