import { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { connection } from "next/server";
import BlogArticleView from "@/components/blog/BlogArticleView";
import BlogShell from "@/components/blog/BlogShell";
import { BELOWMARK_ORIGIN, blogArticleCoverUrl, blogArticleSeo } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { BlogLang } from "@/types/blog.types";

// This page reads request-time data (cookies/headers) for locale detection and live feed updates.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

const VALID_LANGS = new Set<BlogLang>(["tr", "en", "it", "es", "fr", "ar", "ru"]);

interface LangArticleProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: LangArticleProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!VALID_LANGS.has(lang as BlogLang)) {
    permanentRedirect("/blog");
  }
  const cleanLang = lang as BlogLang;
  const [t, { cluster }] = await Promise.all([
    TranslationService.GetUserTranslations(),
    BlogService.FindClusterBySlug(cleanLang, slug),
  ]);
  const entry = cluster?.languages[cleanLang];
  if (!cluster || !entry) {
    permanentRedirect(`/${cleanLang}/blog`);
  }
  if (entry.slug !== slug) {
    permanentRedirect(entry.url);
  }
  return {
    ...MetaTagService.CreateMetaTags({
      ...t.HomePage.MetaTags,
      title: `${entry.title} | Belowmark`,
      description: entry.excerpt,
      imgUrl: blogArticleCoverUrl(cluster, cleanLang),
      tags: [entry.focusKeyword ?? entry.title, cluster.category ?? "Belowmark", "Belowmark"],
      url: `${BELOWMARK_ORIGIN}${entry.url}`,
    }),
    ...blogArticleSeo(cluster, cleanLang),
  };
}

export default async function LangBlogArticlePage({ params }: LangArticleProps) {
  await connection();
  const { lang, slug } = await params;
  if (!VALID_LANGS.has(lang as BlogLang)) permanentRedirect("/blog");
  const cleanLang = lang as BlogLang;
  const { cluster } = await BlogService.FindClusterBySlug(cleanLang, slug);
  const entry = cluster?.languages[cleanLang];
  if (!cluster || !entry) permanentRedirect(`/${cleanLang}/blog`);
  if (entry.slug !== slug) permanentRedirect(entry.url);

  return (
    <BlogShell lang={cleanLang}>
      <BlogArticleView lang={cleanLang} cluster={cluster} />
    </BlogShell>
  );
}
