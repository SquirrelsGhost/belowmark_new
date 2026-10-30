import { Metadata } from "next";
import { redirect } from "next/navigation";
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
  return {
    ...MetaTagService.CreateMetaTags({
      ...t.HomePage.MetaTags,
      title: entry ? `${entry.title} | Belowmark Ratgeber` : "Belowmark Ratgeber",
      description: entry?.excerpt ?? t.HomePage.MetaTags.description,
      imgUrl: cluster ? blogArticleCoverUrl(cluster, "de") : t.HomePage.MetaTags.imgUrl,
      tags: entry
        ? [entry.focusKeyword ?? entry.title, cluster?.category ?? "Zwangsversteigerung", "Belowmark"]
        : t.HomePage.MetaTags.tags,
      url: entry?.url ? `${BELOWMARK_ORIGIN}${entry.url}` : `${BELOWMARK_ORIGIN}/blog/${slug}`,
    }),
    ...(cluster ? blogArticleSeo(cluster, "de") : { robots: { index: false, follow: true } }),
  };
}

export default async function BlogArticlePage({ params }: BlogSlugProps) {
  await connection();
  const { slug } = await params;
  const { cluster } = await BlogService.FindClusterBySlug("de", slug);
  const entry = cluster?.languages.de;
  if (!cluster || !entry) redirect("/blog");
  if (entry.slug !== slug) redirect(entry.url);

  return (
    <BlogShell lang="de">
      <BlogArticleView lang="de" cluster={cluster} />
    </BlogShell>
  );
}
