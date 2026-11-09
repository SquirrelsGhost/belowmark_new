import Link from "next/link";
import BlogArticleCta from "@/components/blog/BlogArticleCta";
import PseoListingPreviewCard from "@/components/pseo/PseoListingPreviewCard";
import PseoRelatedGuides from "@/components/pseo/PseoRelatedGuides";
import PseoStatsBanner from "@/components/pseo/PseoStatsBanner";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { ROUTES } from "@/lib/constants";
import { EU_MARKET_COPY } from "@/lib/pseo/euMarketCopy";
import { EU_MARKET_META } from "@/lib/pseo/euMarketRegions";
import { EuMarketCatalog, EuPseoMarketCode } from "@/types/pseo.types";

interface PseoEuHubViewProps {
  catalog: EuMarketCatalog;
}

const ALL_MARKETS: ReadonlyArray<{ code: EuPseoMarketCode; href: string }> = [
  { code: "AT", href: "/oesterreich/ediktsdatei" },
  { code: "CH", href: "/schweiz/shab-versteigerungen" },
  { code: "IT", href: "/it/aste-giudiziarie" },
  { code: "ES", href: "/es/subastas-boe" },
  { code: "FR", href: "/fr/encheres-immobilieres" },
  { code: "GB", href: "/en/uk-property-auctions" },
];

const HUB_STAT_LABELS: Record<
  EuPseoMarketCode,
  { lots: string; regions: string; cities: string; currency: string; homeLabel: string }
> = {
  AT: { lots: "Aktive Edikte", regions: "Bundesländer", cities: "Orte & Städte", currency: "Währung", homeLabel: "Belowmark" },
  CH: { lots: "Aktive SHAB-Termine", regions: "Kantone", cities: "Orte & Gemeinden", currency: "Währung", homeLabel: "Belowmark" },
  IT: { lots: "Lotti PVP Attivi", regions: "Regioni", cities: "Comuni", currency: "Valuta", homeLabel: "Belowmark" },
  ES: { lots: "Subastas BOE Activas", regions: "Comunidades", cities: "Municipios", currency: "Moneda", homeLabel: "Belowmark" },
  FR: { lots: "Enchères Actives", regions: "Régions", cities: "Villes", currency: "Devise", homeLabel: "Belowmark" },
  GB: { lots: "Live Auction Lots", regions: "UK Regions", cities: "Cities & Towns", currency: "Currency", homeLabel: "Belowmark" },
};

export default function PseoEuHubView({ catalog }: PseoEuHubViewProps) {
  const copy = EU_MARKET_COPY[catalog.market];
  const meta = EU_MARKET_META[catalog.market];
  const statLabels = HUB_STAT_LABELS[catalog.market];
  const topListings = catalog.regions.flatMap((r) => r.listings).slice(0, 9);
  const topCities = catalog.cities.slice(0, 60);
  const topCourts = catalog.courts.slice(0, 48);

  const validBids = topListings
    .map((l) => l.minimumBid ?? l.appraisedValue)
    .filter((v): v is number => typeof v === "number" && v >= 10_000);
  const lowPrice = validBids.length > 0 ? Math.min(...validBids) : null;
  const highPrice = validBids.length > 0 ? Math.max(...validBids) : null;
  const hubTitle = copy.hubTitle(catalog.totalListings, catalog.regions.length, catalog.courts.length);
  const canonicalUrl = `${BELOWMARK_ORIGIN}${catalog.hubPath}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: statLabels.homeLabel, item: `${BELOWMARK_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: meta.shortLabel, item: canonicalUrl },
        ],
      },
      {
        "@type": "CollectionPage",
        name: hubTitle,
        description: copy.hubLead,
        url: canonicalUrl,
      },
      {
        "@type": "Dataset",
        name: hubTitle,
        description: copy.hubLead,
        url: canonicalUrl,
        creator: { "@type": "Organization", name: "Belowmark", url: `${BELOWMARK_ORIGIN}/` },
        isAccessibleForFree: true,
        ...(lowPrice && highPrice
          ? {
              offers: {
                "@type": "AggregateOffer",
                lowPrice,
                highPrice,
                priceCurrency: meta.currency,
                offerCount: catalog.totalListings,
              },
            }
          : {}),
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
        <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-paper-bright">
          {copy.hubEyebrow}
        </span>
        <h1 className="mt-4 font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
          {hubTitle}
        </h1>
        <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">{copy.hubLead}</p>

        <PseoStatsBanner
          stats={[
            { label: statLabels.lots, value: String(catalog.totalListings), accent: true },
            { label: statLabels.regions, value: String(catalog.regions.length) },
            { label: statLabels.cities, value: String(catalog.cities.length) },
            { label: statLabels.currency, value: meta.currency },
          ]}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`${ROUTES.signup}?markt=${catalog.market}`}
            className="inline-flex h-11 items-center border-2 border-signal bg-signal px-5 font-narrow text-xs font-semibold uppercase tracking-[0.08em] text-paper-bright transition-colors hover:bg-signal-deep"
          >
            {copy.ctaButtonLabel}
          </Link>
          <Link
            href={catalog.calcPath}
            className="inline-flex h-11 items-center border-2 border-ink bg-paper-bright px-5 font-narrow text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper-bright"
          >
            {copy.calcButtonLabel}
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 pt-2 font-mono text-[11px]">
          <Link href="/zwangsversteigerungen" className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:border-ink hover:text-ink">
            🇩🇪 DE · ZVG (16 Länder)
          </Link>
          {ALL_MARKETS.map((m) => (
            <Link
              key={m.code}
              href={m.href}
              className={`border px-2.5 py-1 ${
                m.code === catalog.market
                  ? "border-signal bg-signal font-semibold text-paper-bright"
                  : "border-rule-strong bg-paper text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {EU_MARKET_META[m.code].flag} {EU_MARKET_META[m.code].shortLabel}
            </Link>
          ))}
          <Link href="/tr/icra-ihale" className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:border-ink hover:text-ink">
            🇹🇷 TR · UYAP (81 İl)
          </Link>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">{copy.regionsHeading(catalog.regions.length)}</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {catalog.regions.map((reg) => (
            <Link
              key={reg.slug}
              href={`${catalog.hubPath}/${reg.slug}`}
              className="flex items-center justify-between border-2 border-ink bg-paper-bright px-4 py-3 transition-colors hover:bg-paper-deep"
            >
              <div className="min-w-0 pr-2">
                <span className="block truncate font-display text-base text-ink">{reg.name}</span>
                <span className="block font-mono text-[10px] uppercase text-ink-muted">Tax: {reg.transferTaxPct}%</span>
              </div>
              <span className="shrink-0 bg-signal px-2 py-0.5 font-mono text-xs font-semibold text-paper-bright">
                {reg.totalCount}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">{copy.listingsHeading}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topListings.map((item) => (
            <PseoListingPreviewCard key={item.key} item={item} locale={catalog.locale} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">{copy.citiesHeading(catalog.cities.length)}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {topCities.map((c) => (
            <Link key={c.slug} href={`${catalog.hubPath}/${c.slug}`} className="border border-rule-strong bg-paper-bright px-3 py-1.5 font-mono text-xs text-ink hover:border-signal hover:bg-signal hover:text-paper-bright">
              {c.name} ({c.totalCount})
            </Link>
          ))}
        </div>
      </section>

      {topCourts.length > 1 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-ink">{copy.courtsHeading(catalog.courts.length)}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {topCourts.map((ct) => (
              <Link key={ct.slug} href={`${catalog.hubPath}/${ct.slug}`} className="border border-rule bg-paper px-3 py-1.5 font-mono text-xs text-ink-soft hover:border-ink hover:text-ink">
                {ct.name} ({ct.totalCount})
              </Link>
            ))}
          </div>
        </section>
      )}

      <PseoRelatedGuides locale={catalog.locale} />

      <BlogArticleCta lang={catalog.locale} />
    </div>
  );
}
