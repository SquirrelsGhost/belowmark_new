import { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import BlogClusterCard from "@/components/blog/BlogClusterCard";
import BlogHubGrid from "@/components/blog/BlogHubGrid";
import BlogHubHero from "@/components/blog/BlogHubHero";
import BlogHubSection from "@/components/blog/BlogHubSection";
import BlogLangBar from "@/components/blog/BlogLangBar";
import BlogShell from "@/components/blog/BlogShell";
import { BLOG_COPY } from "@/lib/blog/blogCopy";
import { BELOWMARK_ORIGIN, blogHubAlternates } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { BlogLang } from "@/types/blog.types";

// This page reads request-time data (cookies/headers) for locale detection and live feed updates.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

const VALID_LANGS = new Set<BlogLang>(["tr", "en", "it", "es", "fr", "ar", "ru"]);

interface LangBlogProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LangBlogProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await TranslationService.GetUserTranslations();
  const cleanLang: BlogLang = VALID_LANGS.has(lang as BlogLang) ? (lang as BlogLang) : "en";
  const copy = BLOG_COPY[cleanLang];
  return {
    ...MetaTagService.CreateMetaTags({
      ...t.HomePage.MetaTags,
      title: `Belowmark Blog (${cleanLang.toUpperCase()}) — ${copy.defaultH1Top} ${copy.defaultH1Below}`,
      description: copy.sub,
      url: `${BELOWMARK_ORIGIN}/${cleanLang}/blog`,
    }),
    alternates: blogHubAlternates(cleanLang, BELOWMARK_ORIGIN),
  };
}

export default async function LangBlogHubPage({ params }: LangBlogProps) {
  await connection();
  const { lang } = await params;
  if (!VALID_LANGS.has(lang as BlogLang)) redirect("/blog");
  const cleanLang = lang as BlogLang;
  const feed = await BlogService.GetFeed();

  return (
    <BlogShell lang={cleanLang}>
      <BlogHubSection lang={cleanLang}>
        <BlogLangBar lang={cleanLang} />
        <BlogHubHero lang={cleanLang} totalArticlesCount={feed.clusters.length * 8} />
        <BlogHubGrid>
          {feed.clusters.map((cluster, idx) => (
            <BlogClusterCard key={cluster.clusterKey} cluster={cluster} lang={cleanLang} index={idx} />
          ))}
        </BlogHubGrid>
      </BlogHubSection>
    </BlogShell>
  );
}
