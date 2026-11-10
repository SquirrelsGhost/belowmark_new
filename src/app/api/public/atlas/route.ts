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

export async function GET(): Promise<Response> {
  try {
    const catalog = await PseoService.GetCatalog();
    const euMarkets: AtlasMarketStat[] = Object.values(catalog.euMarkets).map((m) => ({
      country: m.market,
      currency: m.currency,
      activeListings: m.totalListings,
      courtsCount: m.courts.length,
      statutoryRule:
        m.market === "AT"
          ? "50% minimum bid (§ 151 EO), 10% Vadium"
          : m.market === "CH"
            ? "Deckungsprinzip (Art. 126 SchKG)"
            : m.market === "IT"
              ? "75% Offerta Minima (Art. 571 c.p.c.), 10% Cauzione"
              : m.market === "ES"
                ? "70% / 50% rule (Art. 670 LEC), 5% BOE deposit"
                : m.market === "FR"
                  ? "Mise à prix Tribunal Judiciaire, 10% CARPA"
                  : "Guide Price / Reserve Price, 10% Exchange Deposit",
      directoryUrl: `${BELOWMARK_ORIGIN}${m.hubPath}`,
      calculatorUrl: `${BELOWMARK_ORIGIN}${m.calcPath}`,
    }));

    const markets: AtlasMarketStat[] = [
      {
        country: "DE",
        currency: "EUR",
        activeListings: catalog.deTotalListings,
        courtsCount: catalog.courts.length,
        statutoryRule: "5/10 & 7/10 limits (§§ 74a, 85a ZVG), 10% security deposit (§ 68 ZVG)",
        directoryUrl: `${BELOWMARK_ORIGIN}/zwangsversteigerungen`,
        calculatorUrl: `${BELOWMARK_ORIGIN}/rechner/5-10-und-7-10-grenze`,
      },
      ...euMarkets,
      {
        country: "TR",
        currency: "TRY",
        activeListings: catalog.trTotalListings,
        courtsCount: catalog.trLocations.filter((l) => l.kind === "court").length,
        statutoryRule: "50% starting bid + costs (UYAP E-Satış), 10% electronic deposit",
        directoryUrl: `${BELOWMARK_ORIGIN}/tr/icra-ihale`,
        calculatorUrl: `${BELOWMARK_ORIGIN}/tr/hesaplama/icra-ihale-teminat`,
      },
    ];

    const payload: AtlasApiResponse = {
      title: "Belowmark European Foreclosure & Court Auction Atlas",
      sourceUrl: `${BELOWMARK_ORIGIN}/atlas`,
      embedCalculatorUrl: `${BELOWMARK_ORIGIN}/embed/rechner?country=DE`,
      updatedAt: catalog.generatedAt,
      totalActiveListings: markets.reduce((sum, item) => sum + item.activeListings, 0),
      marketsCount: markets.length,
      markets,
    };

    const res = ok(payload);
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Cache-Control", "public, max-age=900, stale-while-revalidate=3600");
    return res;
  } catch (error) {
    console.error("[GET /api/public/atlas]", error);
    return err("Internal server error");
  }
}
