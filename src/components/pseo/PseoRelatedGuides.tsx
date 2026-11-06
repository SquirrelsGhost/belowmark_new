import Link from "next/link";
import { formatSeoDescription, isIndexableArticle } from "@/lib/blog/blogSeo";
import { BlogService } from "@/services/BlogService";
import { PseoLocale } from "@/types/pseo.types";

interface PseoRelatedGuidesProps {
  locale: PseoLocale;
}

interface GuidesCopy {
  heading: string;
  allLabel: string;
  readLabel: string;
  hubHref: string;
}

const GUIDES_COPY: Record<PseoLocale, GuidesCopy> = {
  de: {
    heading: "Praxis-Ratgeber & Rechtsleitfäden zur Zwangsversteigerung",
    allLabel: "Alle Ratgeber ansehen →",
    readLabel: "Min. Lesezeit",
    hubHref: "/blog",
  },
  tr: {
    heading: "İcra İhale ve UYAP E-Satış Hukuki Rehberleri",
    allLabel: "Tüm rehberleri incele →",
    readLabel: "dk okuma",
    hubHref: "/tr/blog",
  },
  en: {
    heading: "UK & European Property Auction Practical Guides",
    allLabel: "View all auction guides →",
    readLabel: "min read",
    hubHref: "/en/blog",
  },
  it: {
    heading: "Guide Pratiche e Legali alle Aste Giudiziarie (PVP)",
    allLabel: "Tutte le guide →",
    readLabel: "min lettura",
    hubHref: "/it/blog",
  },
  es: {
    heading: "Guías Prácticas y Legales sobre Subastas BOE (LEC)",
    allLabel: "Ver todas las guías →",
    readLabel: "min lectura",
    hubHref: "/es/blog",
  },
  fr: {
    heading: "Guides Pratiques des Enchères Immobilières Judiciaires",
    allLabel: "Voir tous les guides →",
    readLabel: "min lecture",
    hubHref: "/fr/blog",
  },
};

const CARD_CLASS =
  "group flex flex-col justify-between border border-rule-strong bg-paper-bright p-4 transition-colors hover:border-ink";

export default async function PseoRelatedGuides({ locale }: PseoRelatedGuidesProps) {
  const feed = await BlogService.GetFeed();
  const copy = GUIDES_COPY[locale];

  const items = feed.clusters
    .map((cluster) => cluster.languages[locale])
    .filter(isIndexableArticle)
    .slice(0, 4);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t-2 border-ink pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">{copy.heading}</h2>
        <Link href={copy.hubHref} className="font-mono text-xs font-semibold uppercase text-signal hover:underline">
          {copy.allLabel}
        </Link>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((article) => (
          <Link key={article.slug} href={article.url} className={CARD_CLASS}>
            <div>
              <h3 className="font-display text-base leading-snug text-ink group-hover:text-signal">
                {article.title}
              </h3>
              <p className="mt-1.5 font-serif text-xs leading-relaxed text-ink-soft">
                {formatSeoDescription(article.excerpt, 125)}
              </p>
            </div>
            <span className="mt-3 inline-block font-mono text-[11px] uppercase text-ink-muted">
              {article.readingTimeMin} {copy.readLabel} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
