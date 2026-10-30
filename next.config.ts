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
    ];
  },
};

export default nextConfig;
