import Link from "next/link";
import BlogArticleCta from "@/components/blog/BlogArticleCta";
import PseoListingPreviewCard from "@/components/pseo/PseoListingPreviewCard";
import PseoStatsBanner from "@/components/pseo/PseoStatsBanner";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { ROUTES } from "@/lib/constants";
import {
  localizeSwissEntryName,
  SWISS_HUB_PATHS,
  SWISS_MULTILANG_COPY,
  SwissAltLang,
} from "@/lib/pseo/swissMultilangCopy";
import { EuMarketCatalog } from "@/types/pseo.types";

interface SwissMultilangHubViewProps {
  catalog: EuMarketCatalog;
  lang: SwissAltLang;
}

const ROMANDIE_SLUGS = new Set(["genf", "waadt", "wallis", "freiburg", "neuenburg", "jura", "bern"]);
const ITALIANA_SLUGS = new Set(["tessin", "graubuenden", "wallis"]);

export default function SwissMultilangHubView({ catalog, lang }: SwissMultilangHubViewProps) {
  const copy = SWISS_MULTILANG_COPY[lang];
  const prioritySet = lang === "fr" ? ROMANDIE_SLUGS : ITALIANA_SLUGS;

  const sortedRegions = [...catalog.regions].sort((a, b) => {
    const aPrio = prioritySet.has(a.slug) ? 1 : 0;
    const bPrio = prioritySet.has(b.slug) ? 1 : 0;
    if (aPrio !== bPrio) return bPrio - aPrio;
    return b.totalCount - a.totalCount;
  });

  const topListings = sortedRegions.flatMap((r) => r.listings).slice(0, 9);
  const canonicalUrl = `${BELOWMARK_ORIGIN}${copy.hubPath}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: copy.hubTitle(catalog.totalListings),
        description: copy.hubLead,
        url: canonicalUrl,
        inLanguage: lang === "fr" ? "fr-CH" : "it-CH",
      },
      {
        "@type": "FAQPage",
        mainEntity: copy.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b-2 border-ink pb-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-paper-bright">
            {copy.eyebrow}
          </span>
          <div className="flex gap-1.5 font-mono text-[11px]">
            <Link href={SWISS_HUB_PATHS.de} className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:border-ink hover:text-ink">
              🇨🇭 Deutsch (SHAB)
            </Link>
            <Link
              href={SWISS_HUB_PATHS.fr}
              className={`border px-2.5 py-1 ${lang === "fr" ? "border-signal bg-signal font-semibold text-paper-bright" : "border-rule-strong bg-paper text-ink-soft hover:border-ink hover:text-ink"}`}
            >
              🇨🇭 Français (FOSC)
            </Link>
            <Link
              href={SWISS_HUB_PATHS.it}
              className={`border px-2.5 py-1 ${lang === "it" ? "border-signal bg-signal font-semibold text-paper-bright" : "border-rule-strong bg-paper text-ink-soft hover:border-ink hover:text-ink"}`}
            >
              🇨🇭 Italiano (FUSC)
            </Link>
          </div>
        </div>

        <h1 className="mt-4 font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
          {copy.hubTitle(catalog.totalListings)}
        </h1>
        <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">{copy.hubLead}</p>

        <PseoStatsBanner
          stats={[
            { label: copy.statLots, value: String(catalog.totalListings), accent: true },
            { label: copy.statCantons, value: String(catalog.regions.length) },
            { label: copy.statCities, value: String(catalog.cities.length) },
            { label: "CHF", value: "LP / LEF" },
          ]}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`${ROUTES.signup}?markt=CH`} className="inline-flex h-11 items-center border-2 border-signal bg-signal px-5 font-narrow text-xs font-semibold uppercase tracking-wider text-paper-bright hover:bg-signal-deep">
            {copy.ctaPrimary}
          </Link>
          <Link href="/suche?markt=CH" className="inline-flex h-11 items-center border-2 border-ink bg-paper-bright px-5 font-narrow text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ink hover:text-paper-bright">
            {copy.ctaSearch}
          </Link>
          <Link href={catalog.calcPath} className="inline-flex h-11 items-center border-2 border-rule-strong bg-paper px-4 font-narrow text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink">
            {copy.ctaCalc}
          </Link>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">{copy.cantonsHeading}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedRegions.map((reg) => (
            <Link key={reg.slug} href={`${copy.hubPath}/${reg.slug}`} className="flex items-center justify-between border-2 border-ink bg-paper-bright px-4 py-3 hover:bg-paper-deep">
              <div className="min-w-0 pr-2">
                <span className="block truncate font-display text-base text-ink">{localizeSwissEntryName(reg.slug, reg.name, lang)}</span>
                <span className="block font-mono text-[10px] uppercase text-ink-muted">{copy.taxLabel}: {reg.transferTaxPct}%</span>
              </div>
              <span className="shrink-0 bg-signal px-2 py-0.5 font-mono text-xs font-semibold text-paper-bright">{reg.totalCount}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">{copy.listingsHeading}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topListings.map((item) => (
            <PseoListingPreviewCard key={item.key} item={item} locale={lang} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">{copy.citiesHeading}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {catalog.cities.slice(0, 48).map((c) => (
            <Link key={c.slug} href={`${copy.hubPath}/${c.slug}`} className="border border-rule-strong bg-paper-bright px-3 py-1.5 font-mono text-xs text-ink hover:bg-signal hover:text-paper-bright">
              {c.name} ({c.totalCount})
            </Link>
          ))}
        </div>
      </section>

      <BlogArticleCta lang={lang} />
    </div>
  );
}
