import Link from "next/link";

const COUNTRY_HUBS = [
  { href: "/zwangsversteigerungen", label: "🇩🇪 Deutschland · ZVG (16 Länder · 530 AG)" },
  { href: "/oesterreich/ediktsdatei", label: "🇦🇹 Österreich · Ediktsdatei (9 Länder)" },
  { href: "/schweiz/shab-versteigerungen", label: "🇨🇭 Schweiz · SHAB Steigerungen (26 Kantone)" },
  { href: "/it/aste-giudiziarie", label: "🇮🇹 Italia · Aste Giudiziarie PVP (20 Regioni)" },
  { href: "/es/subastas-boe", label: "🇪🇸 España · Subastas BOE (17 Comunidades)" },
  { href: "/fr/encheres-immobilieres", label: "🇫🇷 France · Enchères Licitor TJ (13 Régions)" },
  { href: "/en/uk-property-auctions", label: "🇬🇧 England / UK · Property Auctions (12 Regions)" },
  { href: "/tr/icra-ihale", label: "🇹🇷 Türkiye · UYAP İcra & İhale (81 İl)" },
] as const;

const CALCULATORS = [
  { href: "/rechner/5-10-und-7-10-grenze", label: "🧮 DE · 5/10- & 7/10-Grenze Rechner (§ 74a / § 85a ZVG)" },
  { href: "/oesterreich/rechner/geringstes-gebot-vadium", label: "🧮 AT · § 151 EO Geringstes Gebot & 10 % Vadium" },
  { href: "/schweiz/rechner/betreibungsamtliche-steigerung-schkg", label: "🧮 CH · SchKG Grundstücksteigerung & Handänderungssteuer" },
  { href: "/it/calcolatore/offerta-minima-75-asta-giudiziaria", label: "🧮 IT · Calcolatore Offerta Minima 75% (Art. 571 c.p.c.)" },
  { href: "/es/calculadora/subasta-judicial-boe-70-por-ciento", label: "🧮 ES · Calculadora Subasta BOE 70% / 50% (Art. 670 LEC)" },
  { href: "/fr/calculateur/encheres-judiciaires-licitor-frais", label: "🧮 FR · Calculateur Enchères Licitor & CARPA 10%" },
  { href: "/en/calculator/uk-property-auction-stamp-duty-deposit", label: "🧮 UK · Auction 10% Deposit, Reserve & Stamp Duty (SDLT)" },
  { href: "/tr/hesaplama/icra-ihale-teminat", label: "🧮 TR · UYAP %50 Açılış & %10 Teminat Hesaplama" },
] as const;

const TOP_REGIONS_AND_CITIES = [
  { href: "/bundesland/nordrhein-westfalen", label: "Zwangsversteigerung NRW" },
  { href: "/bundesland/bayern", label: "Zwangsversteigerung Bayern" },
  { href: "/bundesland/niedersachsen", label: "Zwangsversteigerung Niedersachsen" },
  { href: "/bundesland/baden-wuerttemberg", label: "Zwangsversteigerung Baden-Württemberg" },
  { href: "/bundesland/hessen", label: "Zwangsversteigerung Hessen" },
  { href: "/bundesland/berlin", label: "Zwangsversteigerung Berlin" },
  { href: "/bundesland/sachsen", label: "Zwangsversteigerung Sachsen" },
  { href: "/bundesland/rheinland-pfalz", label: "Zwangsversteigerung Rheinland-Pfalz" },
  { href: "/oesterreich/ediktsdatei/wien", label: "Ediktsdatei Wien" },
  { href: "/oesterreich/ediktsdatei/niederoesterreich", label: "Ediktsdatei Niederösterreich" },
  { href: "/schweiz/shab-versteigerungen/zuerich", label: "SHAB Steigerung Zürich" },
  { href: "/schweiz/shab-versteigerungen/tessin", label: "Aste SHAB Ticino" },
  { href: "/it/aste-giudiziarie/lombardia", label: "Aste Giudiziarie Lombardia (Milano)" },
  { href: "/it/aste-giudiziarie/lazio-roma", label: "Aste Giudiziarie Roma & Lazio" },
  { href: "/es/subastas-boe/madrid", label: "Subastas BOE Madrid" },
  { href: "/es/subastas-boe/cataluna", label: "Subastas BOE Cataluña (Barcelona)" },
  { href: "/es/subastas-boe/andalucia", label: "Subastas BOE Andalucía" },
  { href: "/fr/encheres-immobilieres/ile-de-france-paris", label: "Enchères Immobilières Paris & Île-de-France" },
  { href: "/en/uk-property-auctions/greater-london", label: "UK Property Auctions London" },
  { href: "/en/uk-property-auctions/north-west-england", label: "Property Auctions Manchester & North West" },
  { href: "/tr/icra-ihale/istanbul", label: "İstanbul İcra İhale" },
  { href: "/tr/icra-ihale/ankara", label: "Ankara İcra İhale" },
  { href: "/tr/icra-ihale/izmir", label: "İzmir İcra İhale" },
  { href: "/tr/icra-ihale/antalya", label: "Antalya İcra İhale" },
] as const;

const BLOG_HUBS = [
  { href: "/blog", label: "🇩🇪 Ratgeber DE/AT/CH (ZVG, Edikte, SHAB)" },
  { href: "/tr/blog", label: "🇹🇷 Rehber TR (UYAP E-İhale)" },
  { href: "/en/blog", label: "🇬🇧 Guide EN (UK Property Auctions)" },
  { href: "/it/blog", label: "🇮🇹 Guida IT (Aste Giudiziarie PVP)" },
  { href: "/es/blog", label: "🇪🇸 Guía ES (Subastas Judiciales BOE)" },
  { href: "/fr/blog", label: "🇫🇷 Guide FR (Enchères Licitor & TJ)" },
  { href: "/ar/blog", label: "🇸🇦 دليل المستثمر بالعربية (AR)" },
  { href: "/ru/blog", label: "🇷🇺 Гид инвестора на русском (RU)" },
] as const;

export default function HomeSeoDirectorySection() {
  return (
    <section aria-label="Offizielle Länderverzeichnisse & Gebotsrechner" className="border-t-2 border-ink bg-paper-bright">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="border-b border-rule-strong pb-5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-signal">
            08 · DIREKTZUGANG · ALLE 8 MÄRKTE, GEBOTSRECHNER &amp; RECHTS-GUIDES
          </span>
          <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
            Amtliche Versteigerungsverzeichnisse &amp; Kostenlose Gebotsrechner (DE · AT · CH · IT · ES · FR · UK · TR)
          </h2>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTRY_HUBS.map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="border-2 border-ink bg-paper px-4 py-3 font-mono text-xs font-semibold text-ink transition-colors hover:bg-ink hover:text-paper-bright"
            >
              {hub.label} →
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CALCULATORS.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="border border-rule-strong bg-paper-deep px-3.5 py-2.5 font-mono text-xs text-ink hover:border-signal hover:text-signal"
            >
              {calc.label}
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Meistgesuchte Bundesländer, Kantone, Regionen &amp; Metropolen
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOP_REGIONS_AND_CITIES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-rule bg-paper px-2.5 py-1 font-mono text-[11px] text-ink-soft hover:border-ink hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-rule pt-5">
          <div className="flex flex-wrap gap-2">
            {BLOG_HUBS.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className="border border-rule-strong bg-paper-bright px-3 py-1 font-mono text-[11px] font-medium text-ink hover:border-signal hover:bg-signal hover:text-paper-bright"
              >
                {b.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
