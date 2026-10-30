import fallbackData from "@/lib/blog/belowmarkBlogFallback.json";
import { BelowmarkBlogFeed, BlogClusterItem, BlogLang } from "@/types/blog.types";

const FEED_URL = "https://pycie.com/api/seo-blog/feed?siteId=belowmark";
const FALLBACK_FEED = fallbackData as BelowmarkBlogFeed;

interface FeedApiEnvelope {
  success?: boolean;
  data?: BelowmarkBlogFeed;
}

export class BlogService {
  /**
   * Fetches the live Belowmark 5-language SEO clusters from the central PYCIE SEO Autopilot,
   * merging them with the embedded fallback clusters so daily new articles appear automatically
   * and the blog remains 100% resilient during builds or network hiccups.
   */
  public static async GetFeed(): Promise<BelowmarkBlogFeed> {
    try {
      const res = await fetch(FEED_URL, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(4500),
      });
      if (res.ok) {
        const json = (await res.json()) as FeedApiEnvelope;
        if (json.success && json.data && Array.isArray(json.data.clusters) && json.data.clusters.length > 0) {
          const mergedByKey = new Map<string, BlogClusterItem>();
          for (const c of FALLBACK_FEED.clusters) {
            mergedByKey.set(c.clusterKey, c);
          }
          for (const c of json.data.clusters) {
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
          return {
            ...json.data,
            clusters: Array.from(mergedByKey.values()),
          };
        }
      }
    } catch {
      // Fallback to embedded snapshot when offline or during static/edge cold start
    }
    return FALLBACK_FEED;
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
