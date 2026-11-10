import Link from "next/link";
import BlogArticleCta from "@/components/blog/BlogArticleCta";
import PseoListingPreviewCard from "@/components/pseo/PseoListingPreviewCard";
import PseoMarketComparisonTable from "@/components/pseo/PseoMarketComparisonTable";
import PseoRelatedGuides from "@/components/pseo/PseoRelatedGuides";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { ROUTES } from "@/lib/constants";
import {
  localizeSwissEntryName,
  SWISS_HUB_PATHS,
  SWISS_MULTILANG_COPY,
  SwissAltLang,
} from "@/lib/pseo/swissMultilangCopy";
import { EuMarketCatalog, EuMarketLocationEntry } from "@/types/pseo.types";

interface SwissMultilangEntryViewProps {
  catalog: EuMarketCatalog;
  entry: EuMarketLocationEntry;
  lang: SwissAltLang;
}

export default function SwissMultilangEntryView({ catalog, entry, lang }: SwissMultilangEntryViewProps) {
  const copy = SWISS_MULTILANG_COPY[lang];
  const locName = localizeSwissEntryName(entry.slug, entry.name, lang);
  const canonicalUrl = `${BELOWMARK_ORIGIN}${copy.hubPath}/${entry.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Belowmark", item: `${BELOWMARK_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: lang === "fr" ? "Enchères Suisse (FOSC)" : "Aste Svizzera (FUSC)", item: `${BELOWMARK_ORIGIN}${copy.hubPath}` },
          { "@type": "ListItem", position: 3, name: locName, item: canonicalUrl },
        ],
      },
      {
        "@type": "CollectionPage",
        name: copy.entryTitle(locName, entry.totalCount),
        description: copy.entryLead(locName, entry.totalCount, entry.transferTaxPct),
        url: canonicalUrl,
        inLanguage: lang === "fr" ? "fr-CH" : "it-CH",
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <Link href={copy.hubPath} className="font-semibold text-ink hover:text-signal">
          {copy.backToHub}
        </Link>
        <div className="flex gap-1.5 text-[11px]">
          <Link href={`${SWISS_HUB_PATHS.de}/${entry.slug}`} className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:text-ink">
            DE
          </Link>
          <Link href={`${SWISS_HUB_PATHS.fr}/${entry.slug}`} className={`border px-2.5 py-1 ${lang === "fr" ? "border-signal bg-signal font-semibold text-paper-bright" : "border-rule-strong bg-paper text-ink-soft"}`}>
            FR
          </Link>
          <Link href={`${SWISS_HUB_PATHS.it}/${entry.slug}`} className={`border px-2.5 py-1 ${lang === "it" ? "border-signal bg-signal font-semibold text-paper-bright" : "border-rule-strong bg-paper text-ink-soft"}`}>
            IT
          </Link>
        </div>
      </div>

      <header className="border-b-2 border-ink pb-8">
        <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-paper-bright">
          {copy.eyebrow}
        </span>
        <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">
          {copy.entryTitle(locName, entry.totalCount)}
        </h1>
        <p className="mt-3 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">
          {copy.entryLead(locName, entry.totalCount, entry.transferTaxPct)}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`${ROUTES.signup}?markt=CH`} className="inline-flex h-11 items-center border-2 border-signal bg-signal px-5 font-narrow text-xs font-semibold uppercase tracking-wider text-paper-bright hover:bg-signal-deep">
            {copy.ctaPrimary}
          </Link>
          <Link href="/suche?markt=CH" className="inline-flex h-11 items-center border-2 border-ink bg-paper-bright px-5 font-narrow text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ink hover:text-paper-bright">
            {copy.ctaSearch}
          </Link>
        </div>
      </header>

      <PseoMarketComparisonTable
        listings={entry.listings}
        locale={lang}
        heading={lang === "fr" ? `Comparatif des enchères à ${locName}` : `Confronto incanti a ${locName}`}
      />

      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entry.listings.map((item) => (
          <PseoListingPreviewCard key={item.key} item={item} locale={lang} />
        ))}
      </section>

      {entry.subLinks.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">{copy.citiesHeading}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.subLinks.map((sub) => (
              <Link key={sub.slug} href={`${copy.hubPath}/${sub.slug}`} className="border border-rule-strong bg-paper-bright px-3 py-1.5 font-mono text-xs text-ink hover:bg-signal hover:text-paper-bright">
                {sub.name} ({sub.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      {entry.courtLinks.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-ink">{copy.officesHeading}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.courtLinks.map((ct) => (
              <Link key={ct.slug} href={`${copy.hubPath}/${ct.slug}`} className="border border-rule bg-paper px-3 py-1.5 font-mono text-xs text-ink-soft hover:border-ink hover:text-ink">
                {ct.name} ({ct.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        {catalog.regions.slice(0, 12).map((r) => (
          <Link key={r.slug} href={`${copy.hubPath}/${r.slug}`} className="border border-rule bg-paper px-2.5 py-1 font-mono text-[11px] text-ink-soft hover:text-ink">
            {localizeSwissEntryName(r.slug, r.name, lang)} ({r.totalCount})
          </Link>
        ))}
      </div>

      <PseoRelatedGuides locale={lang} market="CH" />

      <BlogArticleCta lang={lang} />
    </div>
  );
}
