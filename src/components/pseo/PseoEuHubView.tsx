import Link from "next/link";
import BlogArticleCta from "@/components/blog/BlogArticleCta";
import PseoListingPreviewCard from "@/components/pseo/PseoListingPreviewCard";
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

export default function PseoEuHubView({ catalog }: PseoEuHubViewProps) {
  const copy = EU_MARKET_COPY[catalog.market];
  const meta = EU_MARKET_META[catalog.market];
  const topListings = catalog.regions.flatMap((r) => r.listings).slice(0, 9);
  const topCities = catalog.cities.slice(0, 60);
  const topCourts = catalog.courts.slice(0, 48);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: copy.hubTitle(catalog.totalListings, catalog.regions.length, catalog.courts.length),
        description: copy.hubLead,
        url: `${BELOWMARK_ORIGIN}${catalog.hubPath}`,
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
          {copy.hubTitle(catalog.totalListings, catalog.regions.length, catalog.courts.length)}
        </h1>
        <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">{copy.hubLead}</p>

        <PseoStatsBanner
          stats={[
            { label: "Active Lots / Edikte", value: String(catalog.totalListings), accent: true },
            { label: "Regions / States", value: String(catalog.regions.length) },
            { label: "Cities / Towns", value: String(catalog.cities.length) },
            { label: "Currency", value: meta.currency },
          ]}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={ROUTES.signup}
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

      <BlogArticleCta lang={catalog.locale} />
    </div>
  );
}
