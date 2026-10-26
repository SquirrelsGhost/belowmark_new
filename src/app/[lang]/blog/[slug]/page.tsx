import { Metadata } from "next";
import { redirect } from "next/navigation";
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

const VALID_LANGS = new Set<BlogLang>(["tr", "en", "ar", "ru"]);

interface LangArticleProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: LangArticleProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const cleanLang: BlogLang = VALID_LANGS.has(lang as BlogLang) ? (lang as BlogLang) : "en";
  const [t, { cluster }] = await Promise.all([
    TranslationService.GetUserTranslations(),
    BlogService.FindClusterBySlug(cleanLang, slug),
  ]);
  const entry = cluster?.languages[cleanLang];
  return {
    ...MetaTagService.CreateMetaTags({
      ...t.HomePage.MetaTags,
      title: entry ? `${entry.title} | Belowmark Blog` : "Belowmark Blog",
      description: entry?.excerpt ?? t.HomePage.MetaTags.description,
      imgUrl: cluster ? blogArticleCoverUrl(cluster, cleanLang) : t.HomePage.MetaTags.imgUrl,
      tags: entry?.focusKeyword ? [entry.focusKeyword, cluster?.category ?? "Belowmark"] : t.HomePage.MetaTags.tags,
      url: `${BELOWMARK_ORIGIN}/${cleanLang}/blog/${slug}`,
    }),
    ...(cluster ? blogArticleSeo(cluster, cleanLang) : { robots: { index: false, follow: true } }),
  };
}

export default async function LangBlogArticlePage({ params }: LangArticleProps) {
  const { lang, slug } = await params;
  if (!VALID_LANGS.has(lang as BlogLang)) redirect("/blog");
  const cleanLang = lang as BlogLang;
  const { cluster } = await BlogService.FindClusterBySlug(cleanLang, slug);
  if (!cluster) redirect(`/${cleanLang}/blog`);

  return (
    <BlogShell lang={cleanLang}>
      <BlogArticleView lang={cleanLang} cluster={cluster} />
    </BlogShell>
  );
}
