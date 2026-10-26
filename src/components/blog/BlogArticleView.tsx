import BlogArticleCta from "@/components/blog/BlogArticleCta";
import BlogArticleHeader from "@/components/blog/BlogArticleHeader";
import BlogArticleSections from "@/components/blog/BlogArticleSections";
import BlogArticleTakeaways from "@/components/blog/BlogArticleTakeaways";
import BlogLangBar from "@/components/blog/BlogLangBar";
import { BLOG_COPY } from "@/lib/blog/blogCopy";
import { BELOWMARK_ORIGIN, blogArticleCoverUrl } from "@/lib/blog/blogSeo";
import { BlogClusterItem, BlogLang } from "@/types/blog.types";

interface BlogArticleViewProps {
  lang: BlogLang;
  cluster: BlogClusterItem;
}

export default function BlogArticleView({ lang, cluster }: BlogArticleViewProps) {
  const entry = cluster.languages[lang] ?? cluster.languages.de;
  if (!entry) return null;

  const isRtl = lang === "ar";
  const hubHref = lang === "de" ? "/blog" : `/${lang}/blog`;
  const copy = BLOG_COPY[lang] ?? BLOG_COPY.de;
  const takeaways = entry.takeaways ?? [];
  const sections = entry.sections ?? [];
  const faq = entry.faq ?? [];
  const coverUrl = blogArticleCoverUrl(cluster, lang);
  const canonicalUrl = `${BELOWMARK_ORIGIN}${entry.url}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: entry.title,
        description: entry.excerpt,
        image: [coverUrl],
        datePublished: cluster.publishedAt,
        inLanguage: lang,
        author: { "@type": "Organization", name: "Belowmark", url: BELOWMARK_ORIGIN },
        publisher: { "@type": "Organization", name: "Belowmark", url: BELOWMARK_ORIGIN },
        mainEntityOfPage: canonicalUrl,
      },
      ...(faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogLangBar lang={lang} backHref={hubHref} backLabel={copy.backToHub} cluster={cluster} />
      <article>
        <BlogArticleHeader cluster={cluster} lang={lang} />
        <BlogArticleTakeaways lang={lang} takeaways={takeaways} />
        <BlogArticleSections lang={lang} sections={sections} faq={faq} />
        <BlogArticleCta lang={lang} />
      </article>
    </div>
  );
}
