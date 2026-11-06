import { BELOWMARK_ORIGIN, blogHubUrl, formatSeoDescription, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogClusterItem, BlogLang } from "@/types/blog.types";

interface BlogHubJsonLdProps {
  lang: BlogLang;
  clusters: BlogClusterItem[];
  title: string;
  description: string;
}

export default function BlogHubJsonLd({ lang, clusters, title, description }: BlogHubJsonLdProps) {
  const hubUrl = blogHubUrl(lang, BELOWMARK_ORIGIN);
  const articles = clusters
    .map((cluster) => ({
      cluster,
      entry: cluster.languages[lang],
    }))
    .filter((item): item is { cluster: BlogClusterItem; entry: NonNullable<typeof item.entry> } =>
      isIndexableArticle(item.entry),
    );

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["CollectionPage", "Blog"],
        "@id": `${hubUrl}#blog`,
        name: title,
        description: formatSeoDescription(description, 158),
        url: hubUrl,
        inLanguage: lang,
        publisher: {
          "@type": "Organization",
          name: "Belowmark",
          url: BELOWMARK_ORIGIN,
        },
        blogPost: articles.slice(0, 20).map(({ cluster, entry }) => ({
          "@type": "BlogPosting",
          headline: entry.title,
          url: `${BELOWMARK_ORIGIN}${entry.url}`,
          datePublished: cluster.publishedAt,
          inLanguage: lang,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Belowmark",
            item: `${BELOWMARK_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: hubUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
