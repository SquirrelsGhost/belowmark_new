import Link from "next/link";
import AtlasEmbedBox from "@/components/pseo/AtlasEmbedBox";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { EU_MARKET_META } from "@/lib/pseo/euMarketRegions";
import { EuPseoMarketCode, PseoCatalog } from "@/types/pseo.types";

interface PublicAtlasViewProps {
  catalog: PseoCatalog;
}

const EU_ATLAS_META: Record<EuPseoMarketCode, { name: string; portal: string }> = {
  AT: { name: "🇦🇹 Österreich", portal: "Ediktsdatei der Justiz" },
  CH: { name: "🇨🇭 Schweiz", portal: "SHAB / Betreibungsämter" },
  IT: { name: "🇮🇹 Italien", portal: "Portale Vendite Pubbliche (PVP)" },
  ES: { name: "🇪🇸 Spanien", portal: "Portal de Subastas BOE" },
  FR: { name: "🇫🇷 Frankreich", portal: "Licitor & Tribunaux Judiciaires" },
  GB: { name: "🇬🇧 Großbritannien", portal: "UK Property Auction Catalogues" },
};

export default function PublicAtlasView({ catalog }: PublicAtlasViewProps) {
  const euRows = Object.values(catalog.euMarkets).map((m) => ({
    code: m.market,
    name: EU_ATLAS_META[m.market].name || EU_MARKET_META[m.market].shortLabel,
    portal: EU_ATLAS_META[m.market].portal,
    count: m.totalListings,
    regions: m.regions.length,
    courts: m.courts.length,
    href: m.hubPath,
    calcHref: m.calcPath,
    rule:
      m.market === "AT"
        ? "50 % § 151 EO · 10 % Vadium"
        : m.market === "CH"
          ? "Deckungsprinzip Art. 126 SchKG"
          : m.market === "IT"
            ? "75 % Offerta Minima (art. 571 c.p.c.)"
            : m.market === "ES"
              ? "70 % / 50 % Art. 670 LEC · 5 % BOE"
              : m.market === "FR"
                ? "Mise à prix TJ · 10 % CARPA"
                : "Guide Price · 10 % Exchange Deposit",
  }));

  const grandTotal =
    catalog.deTotalListings +
    catalog.trTotalListings +
    euRows.reduce((sum, r) => sum + r.count, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Europäischer Zwangsversteigerungs- & Gerichtsauktions-Atlas 2026",
    description: `Länderübergreifende Auswertung von ${grandTotal} aktiven gerichtlichen Immobilienversteigerungen in Deutschland, Österreich, der Schweiz, der Türkei, Italien, Spanien, Frankreich und Großbritannien.`,
    url: `${BELOWMARK_ORIGIN}/atlas`,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "Belowmark", url: `${BELOWMARK_ORIGIN}/` },
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b-2 border-ink pb-7">
        <span className="inline-block bg-signal px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-paper-bright">
          DATENREPORT & MARKTATLAS 2026 · 8 LÄNDER LIVE
        </span>
        <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-5xl">
          Europäischer Zwangsversteigerungs-Atlas: {grandTotal.toLocaleString("de-DE")} aktive Gerichtsverfahren im Vergleich
        </h1>
        <p className="mt-3 max-w-3xl font-serif text-lg leading-relaxed text-ink-soft">
          Tagesaktuelle Primärdaten-Auswertung amtlicher Vollstreckungsportale in 8 Märkten — Wertgrenzen, Kautionsregeln, Gerichtsstandorte und regionale Schwerpunkte für Investoren, Redaktionen und Finanzierungsberater.
        </p>
      </header>

      <div className="mt-8 overflow-x-auto border-2 border-ink bg-paper-bright p-5">
        <h2 className="font-display text-2xl text-ink">Ländervergleich: Verfahren, Portale & gesetzliche Mindestgebote</h2>
        <table className="mt-4 w-full border-collapse text-left font-mono text-xs">
          <thead>
            <tr className="border-b-2 border-ink bg-paper-deep text-[11px] uppercase tracking-wider text-ink">
              <th className="px-3 py-2.5">Land</th>
              <th className="px-3 py-2.5">Amtliche Quelle</th>
              <th className="px-3 py-2.5 text-right">Aktive Verfahren</th>
              <th className="px-3 py-2.5 text-right">Gerichte / Ämter</th>
              <th className="px-3 py-2.5">Gesetzliche Schwelle & Sicherheit</th>
              <th className="px-3 py-2.5 text-right">Verzeichnis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            <tr className="hover:bg-paper">
              <td className="px-3 py-2.5 font-bold text-ink">🇩🇪 Deutschland</td>
              <td className="px-3 py-2.5 text-ink-soft">ZVG-Portal der Länder</td>
              <td className="px-3 py-2.5 text-right font-bold text-signal">{catalog.deTotalListings.toLocaleString("de-DE")}</td>
              <td className="px-3 py-2.5 text-right text-ink">{catalog.courts.length}</td>
              <td className="px-3 py-2.5 text-ink-soft">5/10 & 7/10 ZVG · 10 % Sicherheit</td>
              <td className="px-3 py-2.5 text-right">
                <Link href="/zwangsversteigerungen" className="font-semibold text-ink underline hover:text-signal">Öffnen →</Link>
              </td>
            </tr>
            {euRows.map((r) => (
              <tr key={r.code} className="hover:bg-paper">
                <td className="px-3 py-2.5 font-bold text-ink">{r.name}</td>
                <td className="px-3 py-2.5 text-ink-soft">{r.portal}</td>
                <td className="px-3 py-2.5 text-right font-bold text-signal">{r.count.toLocaleString("de-DE")}</td>
                <td className="px-3 py-2.5 text-right text-ink">{r.courts}</td>
                <td className="px-3 py-2.5 text-ink-soft">{r.rule}</td>
                <td className="px-3 py-2.5 text-right">
                  <Link href={r.href} className="font-semibold text-ink underline hover:text-signal">Öffnen →</Link>
                </td>
              </tr>
            ))}
            <tr className="hover:bg-paper">
              <td className="px-3 py-2.5 font-bold text-ink">🇹🇷 Türkei</td>
              <td className="px-3 py-2.5 text-ink-soft">UYAP E-Satış / İlan.gov.tr</td>
              <td className="px-3 py-2.5 text-right font-bold text-signal">{catalog.trTotalListings.toLocaleString("de-DE")}</td>
              <td className="px-3 py-2.5 text-right text-ink">{catalog.trLocations.filter((l) => l.kind === "court").length}</td>
              <td className="px-3 py-2.5 text-ink-soft">50 % Muhammen Bedel · 10 % Teminat</td>
              <td className="px-3 py-2.5 text-right">
                <Link href="/tr/icra-ihale" className="font-semibold text-ink underline hover:text-signal">Öffnen →</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="border-2 border-ink bg-paper-bright p-6">
          <h2 className="font-display text-2xl text-ink">Top-Bundesländer in Deutschland (ZVG)</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {catalog.deStates.map((s) => (
              <Link key={s.slug} href={`/bundesland/${s.slug}`} className="border border-ink bg-paper px-3 py-1.5 font-mono text-xs text-ink hover:bg-signal hover:border-signal hover:text-paper-bright">
                {s.name} ({s.totalCount})
              </Link>
            ))}
          </div>
        </div>
        <AtlasEmbedBox />
      </div>
    </section>
  );
}
