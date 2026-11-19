import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ok, err } from "@/lib/api";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { PseoService } from "@/services/PseoService";

interface AtlasMarketStat {
  country: string;
  currency: string;
  activeListings: number;
  courtsCount: number;
  statutoryRule: string;
  directoryUrl: string;
  calculatorUrl: string;
}

interface AtlasApiResponse {
  title: string;
  sourceUrl: string;
  embedCalculatorUrl: string;
  updatedAt: string;
  totalActiveListings: number;
  marketsCount: number;
  markets: AtlasMarketStat[];
}

interface AtlasSummaryFile {
  generatedAt: string;
  deTotalListings: number;
  deCourtsCount: number;
  trTotalListings: number;
  trCourtsCount: number;
  euMarkets: Record<
    string,
    {
      market: string;
      currency: string;
      hubPath: string;
      calcPath: string;
      totalListings: number;
      courtsCount: number;
    }
  >;
}

function statutoryRuleForEuMarket(market: string): string {
  switch (market) {
    case "AT":
      return "50% minimum bid (§ 151 EO), 10% Vadium";
    case "CH":
      return "Deckungsprinzip (Art. 126 SchKG)";
    case "IT":
      return "75% Offerta Minima (Art. 571 c.p.c.), 10% Cauzione";
    case "ES":
      return "70% / 50% rule (Art. 670 LEC), 5% BOE deposit";
    case "FR":
      return "Mise à prix Tribunal Judiciaire, 10% CARPA";
    case "NL":
      return "Executieveiling (Art. 3:268 BW), 10% Waarborgsom";
    case "PL":
      return "3/4 & 2/3 valuation limits (Art. 965 / 983 KPC), 10% Wadium";
    case "CZ":
      return "2/3 lowest bid (OSŘ / Exekuční řád), up to 15% Jistota";
    case "SE":
      return "Kronofogden Exekutiv Auktion (Utsökningsbalken), 10% Handpenning";
    default:
      return "Guide Price / Reserve Price, 10% Exchange Deposit";
  }
}

async function loadAtlasSummary(): Promise<AtlasSummaryFile> {
  try {
    const raw = await readFile(join(process.cwd(), "data", "snapshots", "atlas-summary.json"), "utf8");
    const parsed = JSON.parse(raw) as AtlasSummaryFile;
    if (parsed && typeof parsed.deTotalListings === "number" && parsed.euMarkets) {
      return parsed;
    }
  } catch {
    // Fall back to full PseoService catalog if summary has not been generated yet
  }
  const catalog = await PseoService.GetCatalog();
  const euMarkets: AtlasSummaryFile["euMarkets"] = {};
  for (const m of Object.values(catalog.euMarkets)) {
    euMarkets[m.market] = {
      market: m.market,
      currency: m.currency,
      hubPath: m.hubPath,
      calcPath: m.calcPath,
      totalListings: m.totalListings,
      courtsCount: m.courts.length,
    };
  }
  return {
    generatedAt: catalog.generatedAt,
    deTotalListings: catalog.deTotalListings,
    deCourtsCount: catalog.courts.length,
    trTotalListings: catalog.trTotalListings,
    trCourtsCount: catalog.trLocations.filter((l) => l.kind === "court").length,
    euMarkets,
  };
}

export async function GET(): Promise<Response> {
  try {
    const summary = await loadAtlasSummary();
    const euMarkets: AtlasMarketStat[] = Object.values(summary.euMarkets).map((m) => ({
      country: m.market,
      currency: m.currency,
      activeListings: m.totalListings,
      courtsCount: m.courtsCount,
      statutoryRule: statutoryRuleForEuMarket(m.market),
      directoryUrl: `${BELOWMARK_ORIGIN}${m.hubPath}`,
      calculatorUrl: `${BELOWMARK_ORIGIN}${m.calcPath}`,
    }));

    const markets: AtlasMarketStat[] = [
      {
        country: "DE",
        currency: "EUR",
        activeListings: summary.deTotalListings,
        courtsCount: summary.deCourtsCount,
        statutoryRule: "5/10 & 7/10 limits (§§ 74a, 85a ZVG), 10% security deposit (§ 68 ZVG)",
        directoryUrl: `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
        calculatorUrl: `${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`,
      },
      ...euMarkets,
      {
        country: "TR",
        currency: "TRY",
        activeListings: summary.trTotalListings,
        courtsCount: summary.trCourtsCount,
        statutoryRule: "50% starting bid + costs (UYAP E-Satış), 10% electronic deposit",
        directoryUrl: `${BELOWMARK_ORIGIN}/tr/icra-ihale`,
        calculatorUrl: `${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`,
      },
    ];

    const payload: AtlasApiResponse = {
      title: "Belowmark European Foreclosure & Court Auction Atlas",
      sourceUrl: `${BELOWMARK_ORIGIN}/atlas`,
      embedCalculatorUrl: `${BELOWMARK_ORIGIN}/embed/rechner?country=DE`,
      updatedAt: summary.generatedAt,
      totalActiveListings: markets.reduce((sum, item) => sum + item.activeListings, 0),
      marketsCount: markets.length,
      markets,
    };

    const res = ok(payload);
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Cache-Control", "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400");
    return res;
  } catch (error) {
    console.error("[GET /api/public/atlas]", error);
    return err("Internal server error");
  }
}
