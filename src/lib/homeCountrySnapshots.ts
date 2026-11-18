import { PricingCountryCode } from "@/lib/constants";
import { HomeCurrencyCode } from "@/lib/format";
import { EU_MARKET_META, EU_REGION_SEEDS } from "@/lib/pseo/euMarketRegions";
import {
  AT_STATES,
  CH_CANTONS,
  CZ_REGIONS,
  ES_REGIONS,
  FR_REGIONS,
  GB_REGIONS,
  IT_REGIONS,
  NL_REGIONS,
  PL_REGIONS,
  SE_REGIONS,
  SegmentKey,
  STATES,
  StateSnapshot,
} from "@/lib/snapshot";
import { EuPseoMarketCode } from "@/types/pseo.types";

export interface HomeRegionRow {
  code: string;
  name: string;
  href: string;
  transferTaxPct: number;
  hearings: number | null;
}

export interface HomeTickerItem {
  authority: string;
  segment: SegmentKey;
  regionBadge: string;
  date: string;
}

export interface HomeCountryStats {
  proceedings: number;
  withAppraisal: number;
  statesWithHearings: number;
  totalAppraised: number;
  medianAppraised: number;
}

export interface HomeCountrySnapshot {
  currency: HomeCurrencyCode;
  currencySymbol: string;
  sourcePortal: string;
  stats: HomeCountryStats;
  regions: HomeRegionRow[];
  ticker: HomeTickerItem[];
}

function mapEuRegions(market: EuPseoMarketCode, snapshots: StateSnapshot[]): HomeRegionRow[] {
  const byCode = new Map(snapshots.map((s) => [s.code, s.hearings]));
  const hubPath = EU_MARKET_META[market].hubPath;
  return EU_REGION_SEEDS[market]
    .map((seed) => ({
      code: seed.code,
      name: seed.nativeName,
      href: `${hubPath}/${seed.slug}`,
      transferTaxPct: seed.taxPct,
      hearings: byCode.get(seed.code as StateSnapshot["code"]) ?? 0,
    }))
    .sort((a, b) => (b.hearings ?? 0) - (a.hearings ?? 0));
}

export const TR_PROVINCE_ROWS: HomeRegionRow[] = [
  { code: "34", name: "İstanbul", href: "/tr/icra-ihale/istanbul", transferTaxPct: 4.0, hearings: 1312 },
  { code: "35", name: "İzmir", href: "/tr/icra-ihale/izmir", transferTaxPct: 4.0, hearings: 835 },
  { code: "06", name: "Ankara", href: "/tr/icra-ihale/ankara", transferTaxPct: 4.0, hearings: 755 },
  { code: "07", name: "Antalya", href: "/tr/icra-ihale/antalya", transferTaxPct: 4.0, hearings: 607 },
  { code: "16", name: "Bursa", href: "/tr/icra-ihale/bursa", transferTaxPct: 4.0, hearings: 581 },
  { code: "10", name: "Balıkesir", href: "/tr/icra-ihale/balikesir", transferTaxPct: 4.0, hearings: 523 },
  { code: "42", name: "Konya", href: "/tr/icra-ihale/konya", transferTaxPct: 4.0, hearings: 514 },
  { code: "20", name: "Denizli", href: "/tr/icra-ihale/denizli", transferTaxPct: 4.0, hearings: 482 },
  { code: "38", name: "Kayseri", href: "/tr/icra-ihale/kayseri", transferTaxPct: 4.0, hearings: 454 },
  { code: "03", name: "Afyonkarahisar", href: "/tr/icra-ihale/afyonkarahisar", transferTaxPct: 4.0, hearings: 448 },
  { code: "41", name: "Kocaeli", href: "/tr/icra-ihale/kocaeli", transferTaxPct: 4.0, hearings: 414 },
  { code: "54", name: "Sakarya", href: "/tr/icra-ihale/sakarya", transferTaxPct: 4.0, hearings: 400 },
  { code: "45", name: "Manisa", href: "/tr/icra-ihale/manisa", transferTaxPct: 4.0, hearings: 392 },
  { code: "17", name: "Çanakkale", href: "/tr/icra-ihale/canakkale", transferTaxPct: 4.0, hearings: 391 },
  { code: "59", name: "Tekirdağ", href: "/tr/icra-ihale/tekirdag", transferTaxPct: 4.0, hearings: 383 },
  { code: "33", name: "Mersin", href: "/tr/icra-ihale/mersin", transferTaxPct: 4.0, hearings: 360 },
];

const DE_STATE_SLUGS: Record<string, string> = {
  nw: "nordrhein-westfalen",
  by: "bayern",
  ni: "niedersachsen",
  rp: "rheinland-pfalz",
  he: "hessen",
  sn: "sachsen",
  th: "thueringen",
  bw: "baden-wuerttemberg",
  st: "sachsen-anhalt",
  bb: "brandenburg",
  be: "berlin",
  mv: "mecklenburg-vorpommern",
  sl: "saarland",
  sh: "schleswig-holstein",
  hh: "hamburg",
  hb: "bremen",
};

const DE_STATE_ROWS: HomeRegionRow[] = STATES.filter((s) => s.country === "DE").map((s) => ({
  code: s.code,
  name: s.name,
  href: `/bundesland/${DE_STATE_SLUGS[s.code] ?? s.code}`,
  transferTaxPct: s.transferTaxPct,
  hearings: s.hearings,
}));

export const HOME_COUNTRY_SNAPSHOTS: Record<PricingCountryCode, HomeCountrySnapshot> = {
  TR: {
    currency: "TRY",
    currencySymbol: "₺",
    sourcePortal: "esatis.uyap.gov.tr · ilan.gov.tr",
    stats: {
      proceedings: 17148,
      withAppraisal: 16941,
      statesWithHearings: 81,
      totalAppraised: 140_005_182_698,
      medianAppraised: 3_200_000,
    },
    regions: TR_PROVINCE_ROWS,
    ticker: [
      { authority: "İstanbul Anadolu Gayrimenkul Satış İcra Dairesi", segment: "apartment", regionBadge: "İSTANBUL", date: "2026-12-04" },
      { authority: "Ankara Gayrimenkul Satış İcra Dairesi", segment: "apartment", regionBadge: "ANKARA", date: "2026-12-09" },
      { authority: "İzmir Gayrimenkul Satış İcra Dairesi", segment: "house", regionBadge: "İZMİR", date: "2026-12-11" },
      { authority: "Bursa Gayrimenkul Satış İcra Dairesi", segment: "apartment", regionBadge: "BURSA", date: "2027-01-13" },
      { authority: "Antalya Gayrimenkul Satış İcra Dairesi", segment: "commercial", regionBadge: "ANTALYA", date: "2026-12-16" },
      { authority: "Balıkesir Satış Memurluğu", segment: "farmland", regionBadge: "BALIKESİR", date: "2027-01-13" },
      { authority: "Denizli İcra Dairesi Müdürlüğü", segment: "apartment", regionBadge: "DENİZLİ", date: "2027-02-18" },
      { authority: "Karacabey İcra Dairesi", segment: "apartment", regionBadge: "BURSA", date: "2026-12-03" },
    ],
  },
  DE: {
    currency: "EUR",
    currencySymbol: "€",
    sourcePortal: "zvg-portal.de",
    stats: {
      proceedings: 3416,
      withAppraisal: 3162,
      statesWithHearings: 16,
      totalAppraised: 1_115_043_596,
      medianAppraised: 165_060,
    },
    regions: DE_STATE_ROWS,
    ticker: [
      { authority: "AG Mannheim", segment: "multiFamily", regionBadge: "BW", date: "2026-11-18" },
      { authority: "AG Nürnberg", segment: "land", regionBadge: "BY", date: "2026-11-18" },
      { authority: "AG Dortmund", segment: "multiFamily", regionBadge: "NW", date: "2026-11-24" },
      { authority: "AG Solingen", segment: "apartment", regionBadge: "NW", date: "2026-11-25" },
      { authority: "AG Offenburg", segment: "apartment", regionBadge: "BW", date: "2026-11-27" },
      { authority: "AG Biberach", segment: "house", regionBadge: "BW", date: "2026-11-24" },
      { authority: "AG Kehl", segment: "apartment", regionBadge: "BW", date: "2027-01-20" },
      { authority: "AG Tuttlingen", segment: "house", regionBadge: "BW", date: "2027-01-28" },
    ],
  },
  AT: {
    currency: "EUR",
    currencySymbol: "€",
    sourcePortal: "edikte.justiz.gv.at",
    stats: {
      proceedings: 357,
      withAppraisal: 333,
      statesWithHearings: 9,
      totalAppraised: 154_027_471,
      medianAppraised: 236_000,
    },
    regions: mapEuRegions("AT", AT_STATES),
    ticker: [
      { authority: "BG Leopoldstadt (Wien)", segment: "apartment", regionBadge: "AT-W", date: "2026-11-25" },
      { authority: "BG Eisenstadt", segment: "house", regionBadge: "AT-BGLD", date: "2026-11-24" },
      { authority: "BG Wels", segment: "apartment", regionBadge: "AT-OOE", date: "2026-12-01" },
      { authority: "BG Grieskirchen", segment: "apartment", regionBadge: "AT-OOE", date: "2026-12-03" },
      { authority: "BG Oberwart", segment: "house", regionBadge: "AT-BGLD", date: "2026-12-04" },
      { authority: "BG Traun", segment: "apartment", regionBadge: "AT-OOE", date: "2026-12-09" },
      { authority: "BG Braunau am Inn", segment: "house", regionBadge: "AT-OOE", date: "2026-12-15" },
      { authority: "BG Güssing", segment: "house", regionBadge: "AT-BGLD", date: "2026-12-21" },
    ],
  },
  CH: {
    currency: "CHF",
    currencySymbol: "CHF",
    sourcePortal: "shab.ch",
    stats: {
      proceedings: 160,
      withAppraisal: 143,
      statesWithHearings: 20,
      totalAppraised: 136_412_694,
      medianAppraised: 565_000,
    },
    regions: mapEuRegions("CH", CH_CANTONS),
    ticker: [
      { authority: "Betreibungsamt Pfannenstiel", segment: "house", regionBadge: "CH-ZH", date: "2027-01-25" },
      { authority: "Konkursamt Emmental-Oberaargau", segment: "apartment", regionBadge: "CH-BE", date: "2027-01-28" },
      { authority: "Betreibungsamt Region Solothurn", segment: "house", regionBadge: "CH-SO", date: "2027-01-29" },
      { authority: "Betreibungsamt Pizol", segment: "house", regionBadge: "CH-SG", date: "2027-02-17" },
      { authority: "Offices des poursuites Broye-Vully", segment: "commercial", regionBadge: "CH-VD", date: "2027-02-19" },
      { authority: "Office des faillites Neuchâtel", segment: "commercial", regionBadge: "CH-NE", date: "2027-02-19" },
      { authority: "Betreibungsamt Küsnacht-Zollikon", segment: "house", regionBadge: "CH-ZH", date: "2027-02-24" },
      { authority: "Betreibungsamt Basel-Landschaft", segment: "apartment", regionBadge: "CH-BL", date: "2027-03-10" },
    ],
  },
  IT: {
    currency: "EUR",
    currencySymbol: "€",
    sourcePortal: "pvp.giustizia.it · astegiudiziarie.it",
    stats: {
      proceedings: 2237,
      withAppraisal: 2237,
      statesWithHearings: 20,
      totalAppraised: 66_226_386,
      medianAppraised: 27_500,
    },
    regions: mapEuRegions("IT", IT_REGIONS),
    ticker: [
      { authority: "Tribunale di Pavia", segment: "apartment", regionBadge: "IT-LOM", date: "2026-11-24" },
      { authority: "Tribunale di Asti", segment: "house", regionBadge: "IT-PIE", date: "2026-12-10" },
      { authority: "Tribunale di Terni", segment: "apartment", regionBadge: "IT-UMB", date: "2026-12-10" },
      { authority: "Tribunale di Pescara", segment: "house", regionBadge: "IT-ABR", date: "2026-12-11" },
      { authority: "Tribunale di Tivoli (Roma)", segment: "house", regionBadge: "IT-LAZ", date: "2026-12-14" },
      { authority: "Tribunale di Cuneo", segment: "farmland", regionBadge: "IT-PIE", date: "2026-12-22" },
      { authority: "Tribunale di Velletri (Roma)", segment: "apartment", regionBadge: "IT-LAZ", date: "2027-02-15" },
    ],
  },
  ES: {
    currency: "EUR",
    currencySymbol: "€",
    sourcePortal: "subastas.boe.es",
    stats: {
      proceedings: 1090,
      withAppraisal: 1090,
      statesWithHearings: 17,
      totalAppraised: 296_221_681,
      medianAppraised: 128_158,
    },
    regions: mapEuRegions("ES", ES_REGIONS),
    ticker: [
      { authority: "U.R. Subastas Madrid (AEAT)", segment: "apartment", regionBadge: "ES-MD", date: "2026-11-23" },
      { authority: "Juzgado 1ª Instancia 3 Oviedo", segment: "commercial", regionBadge: "ES-AS", date: "2026-11-26" },
      { authority: "U.R. Subastas Cataluña · Barcelona", segment: "land", regionBadge: "ES-CT", date: "2026-11-30" },
      { authority: "Sección Civil TI Rubí (Barcelona)", segment: "apartment", regionBadge: "ES-CT", date: "2026-12-01" },
      { authority: "Juzgado 1ª Instancia 1 Torremolinos", segment: "land", regionBadge: "ES-AN", date: "2026-12-03" },
      { authority: "Juzgado 1ª Instancia 3 Güímar", segment: "apartment", regionBadge: "ES-CN", date: "2026-11-19" },
    ],
  },
  FR: {
    currency: "EUR",
    currencySymbol: "€",
    sourcePortal: "licitor.com · Tribunaux Judiciaires",
    stats: {
      proceedings: 574,
      withAppraisal: 574,
      statesWithHearings: 12,
      totalAppraised: 184_485_482,
      medianAppraised: 165_000,
    },
    regions: mapEuRegions("FR", FR_REGIONS),
    ticker: [
      { authority: "Tribunal Judiciaire de Paris", segment: "apartment", regionBadge: "FR-IDF", date: "2026-11-19" },
      { authority: "Tribunal Judiciaire d'Arras", segment: "house", regionBadge: "FR-HDF", date: "2026-11-19" },
      { authority: "Tribunal Judiciaire d'Évry", segment: "house", regionBadge: "FR-IDF", date: "2026-11-25" },
      { authority: "Tribunal Judiciaire de Créteil", segment: "house", regionBadge: "FR-IDF", date: "2026-11-26" },
      { authority: "Tribunal Judiciaire de Lille", segment: "house", regionBadge: "FR-HDF", date: "2026-12-02" },
      { authority: "Tribunal Judiciaire de Meaux", segment: "apartment", regionBadge: "FR-IDF", date: "2026-12-03" },
      { authority: "Tribunal Judiciaire de Pontoise", segment: "apartment", regionBadge: "FR-IDF", date: "2026-12-08" },
    ],
  },
  GB: {
    currency: "GBP",
    currencySymbol: "£",
    sourcePortal: "RICS Regulated Property Auctions",
    stats: {
      proceedings: 789,
      withAppraisal: 789,
      statesWithHearings: 12,
      totalAppraised: 159_111_140,
      medianAppraised: 122_000,
    },
    regions: mapEuRegions("GB", GB_REGIONS),
    ticker: [
      { authority: "SDL Property Auctions · London", segment: "house", regionBadge: "GB-LON", date: "2026-11-25" },
      { authority: "SDL Property Auctions · Manchester", segment: "apartment", regionBadge: "GB-NWE", date: "2026-11-25" },
      { authority: "BTG Eddisons · Leeds & Yorkshire", segment: "house", regionBadge: "GB-YRK", date: "2026-11-23" },
      { authority: "SDL Property Auctions · Birmingham", segment: "house", regionBadge: "GB-WMD", date: "2026-11-25" },
      { authority: "SDL Property Auctions · East Midlands", segment: "house", regionBadge: "GB-EMD", date: "2026-11-25" },
      { authority: "SDL Property Auctions · Bristol & SW", segment: "commercial", regionBadge: "GB-SWE", date: "2026-11-25" },
    ],
  },
  NL: {
    currency: "EUR",
    currencySymbol: "€",
    sourcePortal: "veilingnotaris.nl · vastgoedveiling.nl",
    stats: {
      proceedings: 68,
      withAppraisal: 68,
      statesWithHearings: 10,
      totalAppraised: 44_935_970,
      medianAppraised: 454_250,
    },
    regions: mapEuRegions("NL", NL_REGIONS),
    ticker: [
      { authority: "De Randamie & Verstoep Notarissen", segment: "house", regionBadge: "NL-ZH", date: "2026-11-19" },
      { authority: "Westvaer Notarissen", segment: "house", regionBadge: "NL-NH", date: "2026-11-24" },
      { authority: "Quadrant Notarissen", segment: "house", regionBadge: "NL-LI", date: "2026-11-19" },
      { authority: "Vastgoed Veiling · Utrecht", segment: "apartment", regionBadge: "NL-UT", date: "2026-11-19" },
      { authority: "RoX Legal Notarissen", segment: "commercial", regionBadge: "NL-LI", date: "2026-11-24" },
    ],
  },
  PL: {
    currency: "PLN",
    currencySymbol: "zł",
    sourcePortal: "licytacje.komornik.pl · e-licytacje",
    stats: {
      proceedings: 2756,
      withAppraisal: 2756,
      statesWithHearings: 16,
      totalAppraised: 1_595_928_931,
      medianAppraised: 216_000,
    },
    regions: mapEuRegions("PL", PL_REGIONS),
    ticker: [
      { authority: "Komornik Sądowy · Warszawa", segment: "apartment", regionBadge: "PL-MZ", date: "2026-11-25" },
      { authority: "Komornik Sądowy · Katowice", segment: "house", regionBadge: "PL-SL", date: "2026-11-26" },
      { authority: "Komornik Sądowy · Wrocław", segment: "apartment", regionBadge: "PL-DS", date: "2026-11-27" },
      { authority: "Komornik Sądowy · Kraków", segment: "house", regionBadge: "PL-MA", date: "2026-12-02" },
      { authority: "Komornik Sądowy · Poznań", segment: "land", regionBadge: "PL-WP", date: "2026-12-04" },
    ],
  },
  CZ: {
    currency: "CZK",
    currencySymbol: "Kč",
    sourcePortal: "portaldrazeb.cz · EKČR",
    stats: {
      proceedings: 672,
      withAppraisal: 672,
      statesWithHearings: 14,
      totalAppraised: 2_486_400_864,
      medianAppraised: 1_200_000,
    },
    regions: mapEuRegions("CZ", CZ_REGIONS),
    ticker: [
      { authority: "Exekutorský úřad Praha 10", segment: "house", regionBadge: "CZ-PHA", date: "2026-11-25" },
      { authority: "Exekutorský úřad Ostrava", segment: "house", regionBadge: "CZ-MSK", date: "2026-11-26" },
      { authority: "Exekutorský úřad Plzeň-město", segment: "land", regionBadge: "CZ-PLK", date: "2026-11-27" },
      { authority: "Exekutorský úřad České Budějovice", segment: "land", regionBadge: "CZ-JHC", date: "2026-12-01" },
      { authority: "Exekutorský úřad Kolín", segment: "apartment", regionBadge: "CZ-STC", date: "2026-12-03" },
    ],
  },
  SE: {
    currency: "SEK",
    currencySymbol: "kr",
    sourcePortal: "kronofogden.se · Auktionstorget",
    stats: {
      proceedings: 193,
      withAppraisal: 193,
      statesWithHearings: 20,
      totalAppraised: 398_143_000,
      medianAppraised: 1_000_000,
    },
    regions: mapEuRegions("SE", SE_REGIONS),
    ticker: [
      { authority: "Kronofogden · Stockholm", segment: "apartment", regionBadge: "SE-AB", date: "2026-12-02" },
      { authority: "Kronofogden · Göteborg", segment: "commercial", regionBadge: "SE-O", date: "2026-12-09" },
      { authority: "Kronofogden · Malmö", segment: "commercial", regionBadge: "SE-M", date: "2026-12-01" },
      { authority: "Kronofogden · Örebro", segment: "house", regionBadge: "SE-T", date: "2026-12-10" },
      { authority: "Kronofogden · Karlstad", segment: "commercial", regionBadge: "SE-S", date: "2026-12-08" },
    ],
  },
};
