import Link from "next/link";
import AtlasEmbedBox from "@/components/pseo/AtlasEmbedBox";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { ATLAS_COPY } from "@/lib/pseo/atlasCopy";
import { PseoCatalog, PseoLocale } from "@/types/pseo.types";

interface PublicAtlasViewProps {
  catalog: PseoCatalog;
  locale?: PseoLocale;
}

const LANG_SWITCH_ITEMS: ReadonlyArray<{ locale: PseoLocale; label: string; href: string }> = [
  { locale: "de", label: "🇩🇪 DE", href: "/atlas" },
  { locale: "en", label: "🇬🇧 EN", href: "/en/atlas" },
  { locale: "fr", label: "🇫🇷 FR", href: "/fr/atlas" },
  { locale: "it", label: "🇮🇹 IT", href: "/it/atlas" },
  { locale: "es", label: "🇪🇸 ES", href: "/es/atlas" },
  { locale: "tr", label: "🇹🇷 TR", href: "/tr/atlas" },
];

export default function PublicAtlasView({ catalog, locale = "de" }: PublicAtlasViewProps) {
  const copy = ATLAS_COPY[locale];
  const fmt = (n: number) => n.toLocaleString(copy.numLocale);
  const euRows = Object.values(catalog.euMarkets).map((m) => ({
    code: m.market,
    name: copy.euNames[m.market].name,
    portal: copy.euNames[m.market].portal,
    rule: copy.euNames[m.market].rule,
    count: m.totalListings,
    courts: m.courts.length,
    href: m.hubPath,
  }));

  const grandTotal = catalog.deTotalListings + catalog.trTotalListings + euRows.reduce((s, r) => s + r.count, 0);
  const regionChips =
    locale === "tr"
      ? catalog.trLocations.filter((l) => l.kind === "province").slice(0, 18).map((p) => ({ key: p.slug, href: `/tr/icra-ihale/${p.slug}`, label: `${p.name} (${p.totalCount})` }))
      : locale === "it"
        ? catalog.euMarkets.IT.regions.map((r) => ({ key: r.slug, href: `/it/aste-giudiziarie/${r.slug}`, label: `${r.name} (${r.totalCount})` }))
        : locale === "es"
          ? catalog.euMarkets.ES.regions.map((r) => ({ key: r.slug, href: `/es/subastas-boe/${r.slug}`, label: `${r.name} (${r.totalCount})` }))
          : locale === "fr"
            ? catalog.euMarkets.FR.regions.map((r) => ({ key: r.slug, href: `/fr/encheres-immobilieres/${r.slug}`, label: `${r.name} (${r.totalCount})` }))
            : locale === "en"
              ? catalog.euMarkets.GB.regions.map((r) => ({ key: r.slug, href: `/en/uk-property-auctions/${r.slug}`, label: `${r.name} (${r.totalCount})` }))
              : catalog.deStates.map((s) => ({ key: s.slug, href: `/bundesland/${s.slug}`, label: `${s.name} (${s.totalCount})` }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: copy.metaTitle(fmt(grandTotal)),
    description: copy.metaDesc(fmt(grandTotal)),
    url: `${BELOWMARK_ORIGIN}${copy.path}`,
    inLanguage: locale,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "Belowmark", url: `${BELOWMARK_ORIGIN}/` },
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b-2 border-ink pb-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-paper-bright">
            {copy.eyebrow}
          </span>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {LANG_SWITCH_ITEMS.map((item) => (
              <Link
                key={item.locale}
                href={item.href}
                className={`border px-2 py-0.5 ${item.locale === locale ? "border-signal bg-signal font-semibold text-paper-bright" : "border-rule-strong bg-paper text-ink-soft hover:border-ink hover:text-ink"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">{copy.h1(fmt(grandTotal))}</h1>
        <p className="mt-3 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">{copy.lead}</p>
      </header>

      <div className="mt-8 overflow-x-auto border-2 border-ink bg-paper-bright p-5">
        <h2 className="font-display text-2xl text-ink">{copy.tableHeading}</h2>
        <table className="mt-4 w-full border-collapse text-left font-mono text-xs">
          <thead>
            <tr className="border-b-2 border-ink bg-paper-deep text-[11px] uppercase tracking-wider text-ink">
              <th className="px-3 py-2.5">{copy.colCountry}</th>
              <th className="px-3 py-2.5">{copy.colSource}</th>
              <th className="px-3 py-2.5 text-right">{copy.colActive}</th>
              <th className="px-3 py-2.5 text-right">{copy.colCourts}</th>
              <th className="px-3 py-2.5">{copy.colRule}</th>
              <th className="px-3 py-2.5 text-right">{copy.colDir}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            <tr className="hover:bg-paper">
              <td className="px-3 py-2.5 font-bold text-ink">{copy.deName}</td>
              <td className="px-3 py-2.5 text-ink-soft">{copy.deSource}</td>
              <td className="px-3 py-2.5 text-right font-bold text-signal">{fmt(catalog.deTotalListings)}</td>
              <td className="px-3 py-2.5 text-right text-ink">{catalog.courts.length}</td>
              <td className="px-3 py-2.5 text-ink-soft">{copy.deRule}</td>
              <td className="px-3 py-2.5 text-right">
                <Link href="/zwangsversteigerungen" className="font-semibold text-ink underline hover:text-signal">{copy.openBtn}</Link>
              </td>
            </tr>
            {euRows.map((r) => (
              <tr key={r.code} className="hover:bg-paper">
                <td className="px-3 py-2.5 font-bold text-ink">{r.name}</td>
                <td className="px-3 py-2.5 text-ink-soft">{r.portal}</td>
                <td className="px-3 py-2.5 text-right font-bold text-signal">{fmt(r.count)}</td>
                <td className="px-3 py-2.5 text-right text-ink">{r.courts}</td>
                <td className="px-3 py-2.5 text-ink-soft">{r.rule}</td>
                <td className="px-3 py-2.5 text-right">
                  <Link href={r.href} className="font-semibold text-ink underline hover:text-signal">{copy.openBtn}</Link>
                </td>
              </tr>
            ))}
            <tr className="hover:bg-paper">
              <td className="px-3 py-2.5 font-bold text-ink">{copy.trName}</td>
              <td className="px-3 py-2.5 text-ink-soft">{copy.trSource}</td>
              <td className="px-3 py-2.5 text-right font-bold text-signal">{fmt(catalog.trTotalListings)}</td>
              <td className="px-3 py-2.5 text-right text-ink">{catalog.trLocations.filter((l) => l.kind === "court").length}</td>
              <td className="px-3 py-2.5 text-ink-soft">{copy.trRule}</td>
              <td className="px-3 py-2.5 text-right">
                <Link href="/tr/icra-ihale" className="font-semibold text-ink underline hover:text-signal">{copy.openBtn}</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="border-2 border-ink bg-paper-bright p-6">
          <h2 className="font-display text-2xl text-ink">{copy.regionsBoxHeading}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {regionChips.map((chip) => (
              <Link key={chip.key} href={chip.href} className="border border-ink bg-paper px-3 py-1.5 font-mono text-xs text-ink hover:border-signal hover:bg-signal hover:text-paper-bright">
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
        <AtlasEmbedBox locale={locale} />
      </div>
    </section>
  );
}
