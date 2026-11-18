export interface MarketHubItem {
  readonly code: string;
  readonly href: string;
  readonly shortLabel: string;
  readonly drawerLabel: string;
}

export interface RegionLinkItem {
  readonly href: string;
  readonly label: string;
}

export const ALL_COUNTRY_HUBS: readonly MarketHubItem[] = [
  { code: "DE", href: "/zwangsversteigerungen", shortLabel: "DE · ZVG Verzeichnis", drawerLabel: "Deutschland · ZVG (16 Länder · 530 AG)" },
  { code: "AT", href: "/oesterreich/ediktsdatei", shortLabel: "AT · Ediktsdatei", drawerLabel: "Österreich · Ediktsdatei (9 Länder)" },
  { code: "CH", href: "/schweiz/shab-versteigerungen", shortLabel: "CH · SHAB Steigerungen", drawerLabel: "Schweiz · SHAB Steigerungen (26 Kantone)" },
  { code: "IT", href: "/it/aste-giudiziarie", shortLabel: "IT · Aste Giudiziarie", drawerLabel: "Italia · Aste Giudiziarie PVP (20 Regioni)" },
  { code: "ES", href: "/es/subastas-boe", shortLabel: "ES · Subastas BOE", drawerLabel: "España · Subastas BOE (17 Comunidades)" },
  { code: "FR", href: "/fr/encheres-immobilieres", shortLabel: "FR · Enchères Licitor", drawerLabel: "France · Enchères Licitor TJ (13 Régions)" },
  { code: "GB", href: "/en/uk-property-auctions", shortLabel: "UK · Property Auctions", drawerLabel: "United Kingdom · Property Auctions (12 Regions)" },
  { code: "NL", href: "/nl/executieveiling", shortLabel: "NL · Executieveilingen", drawerLabel: "Nederland · Executieveilingen (12 Provincies)" },
  { code: "PL", href: "/pl/licytacje-komornicze", shortLabel: "PL · Licytacje Komornicze", drawerLabel: "Polska · Licytacje Komornicze (16 Woj.)" },
  { code: "CZ", href: "/cz/drazby-nemovitosti", shortLabel: "CZ · Dražby Nemovitostí", drawerLabel: "Česko · Dražby Nemovitostí (14 Krajů)" },
  { code: "SE", href: "/se/exekutiv-auktion", shortLabel: "SE · Kronofogden", drawerLabel: "Sverige · Kronofogden Auktioner (21 Län)" },
  { code: "TR", href: "/tr/icra-ihale", shortLabel: "TR · UYAP İcra & İhale", drawerLabel: "Türkiye · UYAP İcra & İhale (81 İl)" },
];

export const ALL_CALCULATORS: readonly MarketHubItem[] = [
  { code: "DE", href: "/rechner/5-10-und-7-10-grenze", shortLabel: "5/10- & 7/10-Rechner", drawerLabel: "5/10- & 7/10-Grenze (§ 74a / § 85a ZVG)" },
  { code: "AT", href: "/oesterreich/rechner/geringstes-gebot-vadium", shortLabel: "§ 151 EO & Vadium", drawerLabel: "§ 151 EO Geringstes Gebot & 10 % Vadium" },
  { code: "CH", href: "/schweiz/rechner/betreibungsamtliche-steigerung-schkg", shortLabel: "SchKG Rechner", drawerLabel: "SchKG Grundstücksteigerung & Handänderung" },
  { code: "IT", href: "/it/calcolatore/offerta-minima-75-asta-giudiziaria", shortLabel: "Offerta Minima 75%", drawerLabel: "Calcolatore Offerta Minima 75% (Art. 571)" },
  { code: "ES", href: "/es/calculadora/subasta-judicial-boe-70-por-ciento", shortLabel: "Calculadora BOE 70%", drawerLabel: "Calculadora Subasta BOE 70% / 50% (Art. 670)" },
  { code: "FR", href: "/fr/calculateur/encheres-judiciaires-licitor-frais", shortLabel: "Calculateur Licitor", drawerLabel: "Calculateur Enchères Licitor & CARPA 10%" },
  { code: "GB", href: "/en/calculator/uk-property-auction-stamp-duty-deposit", shortLabel: "Auction & SDLT", drawerLabel: "Auction 10% Deposit, Reserve & SDLT" },
  { code: "NL", href: "/nl/calculator/executieveiling-kosten-overdrachtsbelasting", shortLabel: "Executieveiling Calc", drawerLabel: "Executieveiling & Overdrachtsbelasting" },
  { code: "PL", href: "/pl/kalkulator/licytacja-komornicza-wadium", shortLabel: "Kalkulator KPC", drawerLabel: "Kalkulator Licytacji Komorniczej & Wadium" },
  { code: "CZ", href: "/cz/kalkulacka/exekucni-drazba-nejnizsi-podani-jistota", shortLabel: "Kalkulačka Dražby", drawerLabel: "Kalkulačka Exekuční Dražby & Jistota" },
  { code: "SE", href: "/se/kalkylator/kronofogden-exekutiv-auktion-handpenning", shortLabel: "Kronofogden Calc", drawerLabel: "Kronofogden Auktion & 10% Handpenning" },
  { code: "TR", href: "/tr/hesaplama/icra-ihale-teminat", shortLabel: "İcra Teminat Hesap", drawerLabel: "UYAP %50 Açılış & %10 Teminat Hesaplama" },
];

export const TOP_REGIONS_AND_CITIES: readonly RegionLinkItem[] = [
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
  { href: "/fr/encheres-immobilieres/ile-de-france-paris", label: "Enchères Paris & Île-de-France" },
  { href: "/en/uk-property-auctions/greater-london", label: "UK Property Auctions London" },
  { href: "/en/uk-property-auctions/north-west-england", label: "Property Auctions Manchester & North West" },
  { href: "/tr/icra-ihale/istanbul", label: "İstanbul İcra İhale" },
  { href: "/tr/icra-ihale/ankara", label: "Ankara İcra İhale" },
  { href: "/tr/icra-ihale/izmir", label: "İzmir İcra İhale" },
  { href: "/tr/icra-ihale/antalya", label: "Antalya İcra İhale" },
];

export const BLOG_HUBS: readonly MarketHubItem[] = [
  { code: "DE", href: "/blog", shortLabel: "Ratgeber DE/AT/CH", drawerLabel: "Ratgeber DE/AT/CH (ZVG, Edikte, SHAB)" },
  { code: "TR", href: "/tr/blog", shortLabel: "Rehber TR", drawerLabel: "Rehber TR (UYAP E-İhale)" },
  { code: "EN", href: "/en/blog", shortLabel: "Guide EN", drawerLabel: "Guide EN (UK Property Auctions)" },
  { code: "IT", href: "/it/blog", shortLabel: "Guida IT", drawerLabel: "Guida IT (Aste Giudiziarie PVP)" },
  { code: "ES", href: "/es/blog", shortLabel: "Guía ES", drawerLabel: "Guía ES (Subastas Judiciales BOE)" },
  { code: "FR", href: "/fr/blog", shortLabel: "Guide FR", drawerLabel: "Guide FR (Enchères Licitor & TJ)" },
  { code: "AR", href: "/ar/blog", shortLabel: "دليل AR", drawerLabel: "دليل المستثمر بالعربية (AR)" },
  { code: "RU", href: "/ru/blog", shortLabel: "Гид RU", drawerLabel: "Гид инвестора на русском (RU)" },
];

const DEFAULT_FEATURED_CODES = ["DE", "AT", "CH", "IT", "ES", "TR"] as const;

/** Returns 6 clean single-line market hubs, prioritizing the visitor's active country first. */
export function getFeaturedMarketHubs(activeCountry?: string): readonly MarketHubItem[] {
  const defaultList = DEFAULT_FEATURED_CODES.map((c) => ALL_COUNTRY_HUBS.find((h) => h.code === c)).filter(
    (h): h is MarketHubItem => h !== undefined,
  );
  if (!activeCountry) return defaultList;
  const active = ALL_COUNTRY_HUBS.find((h) => h.code === activeCountry);
  if (!active) return defaultList;
  const rest = defaultList.filter((h) => h.code !== active.code);
  return [active, ...rest].slice(0, 6);
}
