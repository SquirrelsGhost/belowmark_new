import fallbackData from "@/lib/blog/belowmarkBlogFallback.json";
import { DACH_EDITORIAL_CLUSTERS } from "@/lib/blog/dachEditorialClusters";
import { BelowmarkBlogFeed, BlogClusterItem, BlogLang } from "@/types/blog.types";

const FEED_URLS = [
  "https://pycie.de/api/seo-blog/feed?siteId=belowmark",
  "https://www.pycie.com/api/seo-blog/feed?siteId=belowmark",
] as const;

const FALLBACK_FEED = fallbackData as BelowmarkBlogFeed;
const LIVE_CACHE_TTL_MS = 5 * 60 * 1000;
const FALLBACK_RETRY_TTL_MS = 15 * 1000;

let cachedFeed: BelowmarkBlogFeed | null = null;
let cachedAt = -Infinity;
let cachedTtlMs = LIVE_CACHE_TTL_MS;
let refreshInFlight: Promise<BelowmarkBlogFeed> | null = null;

interface FeedApiEnvelope {
  success?: boolean;
  data?: BelowmarkBlogFeed;
}

function mergeWithFallback(liveFeed: BelowmarkBlogFeed): BelowmarkBlogFeed {
  const mergedByKey = new Map<string, BlogClusterItem>();
  for (const c of FALLBACK_FEED.clusters) {
    mergedByKey.set(c.clusterKey, c);
  }
  for (const c of DACH_EDITORIAL_CLUSTERS) {
    mergedByKey.set(c.clusterKey, c);
  }
  for (const c of liveFeed.clusters) {
    const prev = mergedByKey.get(c.clusterKey);
    if (prev) {
      mergedByKey.set(c.clusterKey, {
        ...prev,
        ...c,
        languages: {
          ...prev.languages,
          ...c.languages,
        },
      });
    } else {
      mergedByKey.set(c.clusterKey, c);
    }
  }

  const sortedClusters = Array.from(mergedByKey.values()).sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );

  return {
    ...liveFeed,
    clusters: sortedClusters,
  };
}

async function fetchAndMergeFeed(): Promise<BelowmarkBlogFeed> {
  for (const url of FEED_URLS) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) continue;
      const json = (await res.json()) as FeedApiEnvelope;
      if (json.success && json.data && Array.isArray(json.data.clusters) && json.data.clusters.length > 0) {
        const merged = mergeWithFallback(json.data);
        cachedFeed = merged;
        cachedAt = performance.now();
        cachedTtlMs = LIVE_CACHE_TTL_MS;
        return merged;
      }
    } catch {
      // Try next upstream endpoint before falling back to embedded snapshot
    }
  }

  cachedFeed ??= mergeWithFallback(FALLBACK_FEED);
  cachedAt = performance.now();
  cachedTtlMs = FALLBACK_RETRY_TTL_MS;
  return cachedFeed;
}

export class BlogService {
  /**
   * Fetches the live Belowmark 8-language SEO clusters from the central PYCIE SEO Autopilot VPS bridge,
   * merging them newest-first with the embedded fallback clusters so daily new articles appear automatically.
   */
  public static async GetFeed(): Promise<BelowmarkBlogFeed> {
    const now = performance.now();
    if (cachedFeed && now - cachedAt < cachedTtlMs) {
      return cachedFeed;
    }
    if (!refreshInFlight) {
      refreshInFlight = fetchAndMergeFeed().finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  }

  public static async FindClusterBySlug(lang: BlogLang, slug: string): Promise<{
    feed: BelowmarkBlogFeed;
    cluster: BlogClusterItem | undefined;
  }> {
    const feed = await BlogService.GetFeed();
    const cluster =
      feed.clusters.find((c) => c.languages[lang]?.slug === slug) ??
      feed.clusters.find((c) => Object.values(c.languages).some((entry) => entry?.slug === slug));
    return { feed, cluster };
  }
}
