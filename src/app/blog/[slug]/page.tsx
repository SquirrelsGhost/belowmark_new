import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { connection } from "next/server";
import BlogArticleView from "@/components/blog/BlogArticleView";
import BlogShell from "@/components/blog/BlogShell";
import { BELOWMARK_ORIGIN, blogArticleCoverUrl, blogArticleSeo } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";

// This page reads request-time data (cookies/headers) for locale detection and live feed updates.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

interface BlogSlugProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogSlugProps): Promise<Metadata> {
  const { slug } = await params;
  const [t, { cluster }] = await Promise.all([
    TranslationService.GetUserTranslations(),
    BlogService.FindClusterBySlug("de", slug),
  ]);
  const entry = cluster?.languages.de;
  if (!cluster || !entry) {
    permanentRedirect("/blog");
  }
  if (entry.slug !== slug) {
    permanentRedirect(entry.url);
  }
  return {
    ...MetaTagService.CreateMetaTags({
      ...t.HomePage.MetaTags,
      title: `${entry.title} | Belowmark`,
      description: entry.excerpt,
      imgUrl: blogArticleCoverUrl(cluster, "de"),
      tags: [entry.focusKeyword ?? entry.title, cluster.category ?? "Zwangsversteigerung", "Belowmark"],
      url: `${BELOWMARK_ORIGIN}${entry.url}`,
    }),
    ...blogArticleSeo(cluster, "de"),
  };
}

export default async function BlogArticlePage({ params }: BlogSlugProps) {
  await connection();
  const { slug } = await params;
  const { cluster } = await BlogService.FindClusterBySlug("de", slug);
  const entry = cluster?.languages.de;
  if (!cluster || !entry) permanentRedirect("/blog");
  if (entry.slug !== slug) permanentRedirect(entry.url);

  return (
    <BlogShell lang="de">
      <BlogArticleView lang="de" cluster={cluster} />
    </BlogShell>
  );
}
