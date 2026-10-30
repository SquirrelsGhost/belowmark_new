import { Metadata } from "next";
import { connection } from "next/server";
import BlogClusterCard from "@/components/blog/BlogClusterCard";
import BlogHubGrid from "@/components/blog/BlogHubGrid";
import BlogHubHero from "@/components/blog/BlogHubHero";
import BlogHubSection from "@/components/blog/BlogHubSection";
import BlogLangBar from "@/components/blog/BlogLangBar";
import BlogShell from "@/components/blog/BlogShell";
import { BELOWMARK_ORIGIN, blogHubAlternates } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";

// This page reads request-time data (cookies/headers) for locale detection and live feed updates.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const [t, feed] = await Promise.all([
    TranslationService.GetUserTranslations(),
    BlogService.GetFeed(),
  ]);
  return {
    ...MetaTagService.CreateMetaTags({
      ...t.HomePage.MetaTags,
      title: `Belowmark Ratgeber & Fachverzeichnis — ${feed.tagline}`,
      description: feed.strategy.aiSearchPositioning,
      url: `${BELOWMARK_ORIGIN}/blog`,
    }),
    alternates: blogHubAlternates("de", BELOWMARK_ORIGIN),
  };
}

export default async function BlogPage() {
  await connection();
  const feed = await BlogService.GetFeed();

  return (
    <BlogShell lang="de">
      <BlogHubSection lang="de">
        <BlogLangBar lang="de" />
        <BlogHubHero lang="de" totalArticlesCount={feed.clusters.length * 8} />
        <BlogHubGrid>
          {feed.clusters.map((cluster, idx) => (
            <BlogClusterCard key={cluster.clusterKey} cluster={cluster} lang="de" index={idx} />
          ))}
        </BlogHubGrid>
      </BlogHubSection>
    </BlogShell>
  );
}
