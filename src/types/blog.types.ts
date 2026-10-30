export type BlogLang = "de" | "tr" | "en" | "it" | "es" | "fr" | "ar" | "ru";

export interface BlogArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogArticleFaqItem {
  q: string;
  a: string;
}

export interface BlogArticleLangEntry {
  title: string;
  slug: string;
  url: string;
  fullUrl: string;
  excerpt: string;
  readingTimeMin: number;
  keywordsCount: number;
  faqCount: number;
  hasFullBody?: boolean;
  focusKeyword?: string;
  takeaways?: string[];
  sections?: BlogArticleSection[];
  faq?: BlogArticleFaqItem[];
}

export interface BlogClusterItem {
  clusterKey: string;
  topicKey: string;
  category: string;
  dayKey: string;
  publishedAt: string;
  generationProvider: string;
  indexNowPingedAt: string | null;
  siteId?: string;
  siteDomain?: string;
  languages: Partial<Record<BlogLang, BlogArticleLangEntry>>;
}

export interface BlogBrandStrategy {
  dailyCronTime: string;
  targetPersona: string;
  corePillars: string[];
  aiSearchPositioning: string;
  conversionGoal: string;
}

export interface BelowmarkBlogFeed {
  siteId: string;
  siteName: string;
  tagline: string;
  domain: string;
  updatedAt: string;
  strategy: BlogBrandStrategy;
  clusters: BlogClusterItem[];
}
