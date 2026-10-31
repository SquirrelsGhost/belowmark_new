import Link from "next/link";
import PseoStatsBanner from "@/components/pseo/PseoStatsBanner";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { ROUTES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { PseoCatalog } from "@/types/pseo.types";

interface PseoDeHubViewProps {
  catalog: PseoCatalog;
}

export default function PseoDeHubView({ catalog }: PseoDeHubViewProps) {
  const topCities = catalog.cities.slice(0, 120);
  const courtCount = catalog.courts.length;
  const cityCount = catalog.cities.length;
  const waivedTotal = catalog.courts.reduce((acc, c) => acc + c.limitsWaivedCount, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Zwangsversteigerung Deutschland — Alle ${courtCount} Amtsgerichte & ${catalog.deTotalListings} Objekte`,
    description: `Tagesaktuelles Verzeichnis aller ${catalog.deTotalListings} laufenden Zwangsversteigerungen (§ 39 ZVG) an ${courtCount} deutschen Amtsgerichten und in ${cityCount} Städten.`,
    url: `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b-2 border-ink pb-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-muted">
          <Link href="/" className="hover:text-ink">Belowmark</Link>
          <span>/</span>
          <span className="font-semibold text-signal">Zwangsversteigerungen Deutschland</span>
        </div>
        <h1 className="mt-4 font-display text-3xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
          Zwangsversteigerung Deutschland: Alle {formatNumber(courtCount, "de")} Amtsgerichte &amp; {formatNumber(catalog.deTotalListings, "de")} Termine
        </h1>
        <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">
          Vollständiges Verzeichnis aller amtlich veröffentlichten Immobilien-Zwangsversteigerungen und Teilungsversteigerungen (§ 39 ZVG) aus allen 16 Bundesländern — inklusive 5/10- und 7/10-Wertgrenzen, Sicherheitsleistung (§ 68 ZVG) und Verkehrswert-Auswertung.
        </p>

        <PseoStatsBanner
          stats={[
            { label: "Aktive Verfahren", value: formatNumber(catalog.deTotalListings, "de"), accent: true },
            { label: "Amtsgerichte", value: formatNumber(courtCount, "de") },
            { label: "Städte & Gemeinden", value: formatNumber(cityCount, "de") },
            { label: "Wertgrenzen entfallen", value: formatNumber(waivedTotal, "de") },
          ]}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={ROUTES.signup}
            className="inline-flex h-11 items-center border-2 border-signal bg-signal px-5 font-narrow text-xs font-semibold uppercase tracking-[0.08em] text-paper-bright transition-colors hover:bg-signal-deep"
          >
            Alle Aktenzeichen &amp; Gutachten-KI freischalten →
          </Link>
          <Link
            href="/rechner/5-10-und-7-10-grenze"
            className="inline-flex h-11 items-center border-2 border-ink bg-paper-bright px-5 font-narrow text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper-bright"
          >
            5/10- &amp; 7/10-Grenze Rechner öffnen
          </Link>
          <Link
            href="/tr/icra-ihale"
            className="inline-flex h-11 items-center border border-rule-strong bg-paper px-4 font-mono text-xs text-ink-soft hover:border-ink hover:text-ink"
          >
            🇹🇷 Türkei İcra &amp; E-İhale ({formatNumber(catalog.trTotalListings, "de")} Objekte)
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 pt-2 font-mono text-[11px]">
          <Link href="/oesterreich/ediktsdatei" className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:border-ink hover:text-ink">🇦🇹 Österreich · Ediktsdatei (9 Länder)</Link>
          <Link href="/schweiz/shab-versteigerungen" className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:border-ink hover:text-ink">🇨🇭 Schweiz · SHAB (26 Kantone)</Link>
          <Link href="/it/aste-giudiziarie" className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:border-ink hover:text-ink">🇮🇹 Italia · Aste PVP (20 Regioni)</Link>
          <Link href="/es/subastas-boe" className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:border-ink hover:text-ink">🇪🇸 España · BOE (17 CCAA)</Link>
          <Link href="/fr/encheres-immobilieres" className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:border-ink hover:text-ink">🇫🇷 France · Licitor (13 Régions)</Link>
          <Link href="/en/uk-property-auctions" className="border border-rule-strong bg-paper px-2.5 py-1 text-ink-soft hover:border-ink hover:text-ink">🇬🇧 UK · Property Auctions (12 Regions)</Link>
        </div>
      </header>

      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule-strong pb-3">
          <h2 className="font-display text-2xl text-ink">Alle 16 Bundesländer (Zwangsversteigerung &amp; Grunderwerbsteuer)</h2>
          <span className="font-mono text-xs text-ink-muted">Direkt zum Bundesland-Verzeichnis</span>
        </div>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
          {catalog.deStates.map((st) => (
            <Link
              key={st.slug}
              href={`/bundesland/${st.slug}`}
              className="flex items-center justify-between border-2 border-ink bg-paper-bright px-3.5 py-2.5 transition-colors hover:bg-paper-deep"
            >
              <div className="min-w-0 pr-2">
                <span className="block truncate font-display text-sm text-ink">{st.name}</span>
                <span className="block font-mono text-[10px] uppercase text-ink-muted">GrESt: {st.transferTaxPct} %</span>
              </div>
              <span className="shrink-0 bg-signal px-2 py-0.5 font-mono text-xs font-semibold text-paper-bright">
                {st.totalCount}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule-strong pb-3">
          <h2 className="font-display text-2xl text-ink">
            Top-Städte nach aktiven Zwangsversteigerungen ({formatNumber(cityCount, "de")} Orte gesamt)
          </h2>
          <span className="font-mono text-xs text-ink-muted">Direkt zum lokalen Objektverzeichnis</span>
        </div>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {topCities.map((city) => (
            <Link
              key={city.slug}
              href={`/zwangsversteigerung/${city.slug}`}
              className="flex items-center justify-between border border-rule-strong bg-paper-bright px-3.5 py-2.5 transition-colors hover:border-ink"
            >
              <div className="min-w-0 pr-2">
                <span className="block truncate font-display text-sm text-ink">{city.name}</span>
                <span className="block font-mono text-[10px] uppercase text-ink-muted">{city.region}</span>
              </div>
              <span className="shrink-0 bg-paper-deep px-2 py-0.5 font-mono text-xs font-semibold text-signal">
                {city.totalCount}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule-strong pb-3">
          <h2 className="font-display text-2xl text-ink">
            Alle {formatNumber(courtCount, "de")} deutschen Amtsgerichte (Vollständiges ZVG-Verzeichnis)
          </h2>
          <span className="font-mono text-xs text-ink-muted">Sortiert nach Terminanzahl</span>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {catalog.courts.map((court) => (
            <Link
              key={court.slug}
              href={`/amtsgericht/${court.slug}`}
              className="flex items-center justify-between border border-rule bg-paper px-3 py-2 text-xs transition-colors hover:border-ink hover:bg-paper-bright"
            >
              <span className="truncate font-serif font-medium text-ink">{court.displayName}</span>
              <span className="ml-2 shrink-0 font-mono text-[11px] font-semibold text-ink-muted">
                {court.totalCount}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
