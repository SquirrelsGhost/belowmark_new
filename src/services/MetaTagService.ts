import { Metadata } from "next";
import { formatSeoDescription, formatSeoTitle, normalizeCanonicalUrl } from "@/lib/blog/blogSeo";
import { APP_NAME } from "@/lib/constants";

/**
 * Shape of the meta tag data each page translation must provide.
 * Stored inside the translation files so meta tags are localised too.
 */
export interface IMetaTags {
  url: string;
  title: string;
  description: string;
  imgUrl: string;
  tags: string[];
}

/**
 * MetaTagService
 *
 * Converts an IMetaTags object (coming from translations) into a
 * fully-formed Next.js Metadata object covering title, description,
 * keywords, Open Graph and Twitter card.
 *
 * Usage in a page:
 *
 *   export async function generateMetadata(): Promise<Metadata> {
 *     const t = await TranslationService.GetUserTranslations();
 *     return MetaTagService.CreateMetaTags(t.HomePage.MetaTags);
 *   }
 */
export class MetaTagService {
  static CreateMetaTags = (props: IMetaTags): Metadata => {
    const canonicalUrl = normalizeCanonicalUrl(props.url);
    const normalizedImgUrl = props.imgUrl.replace(/^https?:\/\/belowmark\.com(?=\/|$)/i, "https://www.belowmark.com");
    const seoTitle = formatSeoTitle(props.title, 65);
    const seoDescription = formatSeoDescription(props.description, 158);

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: props.tags,
      alternates: {
        canonical: canonicalUrl,
      },

      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        siteName: APP_NAME,
        images: [
          {
            url: normalizedImgUrl,
            width: 1200,
            height: 630,
            alt: APP_NAME,
          },
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: [normalizedImgUrl],
      },
    };
  };
}
