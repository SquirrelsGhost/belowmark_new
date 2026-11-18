import { PricingCountryCode } from "@/lib/constants";
import { HomeCurrencyCode } from "@/lib/format";
import {
  HOME_COUNTRY_SNAPSHOTS,
  HomeCountrySnapshot,
  HomeRegionRow,
} from "@/lib/homeCountrySnapshots";

export interface GaugeMark {
  pct: number;
  label: string;
}

export interface HomeCalculatorConfig {
  country: PricingCountryCode;
  currency: HomeCurrencyCode;
  minValue: number;
  maxValue: number;
  valueStep: number;
  defaultValue: number;
  defaultBidPct: number;
  defaultRegionCode: string;
  regionGroupLabel: string;
  regions: HomeRegionRow[];
  absoluteLimit: number;
  relativeLimit: number;
  depositRatio: number;
  /** False in TR (İİK m. 129) and AT (§ 151 EO) where the 50% statutory floor applies in follow-up rounds too. */
  secondHearingWaivesLimits: boolean;
  gaugeMarks: [GaugeMark, GaugeMark];
}

export interface HomeNoticeCardConfig {
  filePrefix: string;
  fileSuffix: string;
  currencySymbol: string;
}

export interface HomeMarketBundle {
  country: PricingCountryCode;
  snapshot: HomeCountrySnapshot;
  calculator: HomeCalculatorConfig;
  noticeCard: HomeNoticeCardConfig;
}

const REGION_GROUP_LABELS: Record<PricingCountryCode, string> = {
  TR: "Türkiye · 81 İl (Tapu Harcı %4)",
  DE: "Deutschland · 16 Bundesländer (ZVG)",
  AT: "Österreich · 9 Bundesländer (EO)",
  CH: "Schweiz / Suisse / Svizzera · 26 Kantone (SchKG)",
  IT: "Italia · 20 Regioni (PVP c.p.c.)",
  ES: "España · 17 Comunidades (BOE / ITP)",
  FR: "France · 13 Régions (Licitor TJ)",
  GB: "United Kingdom · 12 Regions (SDLT)",
  NL: "Nederland · 12 Provincies (BW)",
  PL: "Polska · 16 Województw (KPC)",
  CZ: "Česko · 14 Krajů (Portál dražeb)",
  SE: "Sverige · 21 Län (Kronofogden)",
};

export function getHomeMarketBundle(country: PricingCountryCode): HomeMarketBundle {
  const snap = HOME_COUNTRY_SNAPSHOTS[country];

  switch (country) {
    case "TR":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "TRY",
          minValue: 500_000,
          maxValue: 25_000_000,
          valueStep: 100_000,
          defaultValue: 3_200_000,
          defaultBidPct: 55,
          defaultRegionCode: "34",
          regionGroupLabel: REGION_GROUP_LABELS.TR,
          regions: snap.regions,
          absoluteLimit: 0.5,
          relativeLimit: 0.7,
          depositRatio: 0.1,
          secondHearingWaivesLimits: false,
          gaugeMarks: [
            { pct: 70, label: "%70" },
            { pct: 50, label: "%50 İİK" },
          ],
        },
        noticeCard: { filePrefix: "2026/", fileSuffix: " Esas", currencySymbol: "₺" },
      };

    case "AT":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "EUR",
          minValue: 30_000,
          maxValue: 2_000_000,
          valueStep: 5_000,
          defaultValue: 240_000,
          defaultBidPct: 55,
          defaultRegionCode: "at-w",
          regionGroupLabel: REGION_GROUP_LABELS.AT,
          regions: snap.regions,
          absoluteLimit: 0.5,
          relativeLimit: 0.7,
          depositRatio: 0.1,
          secondHearingWaivesLimits: false,
          gaugeMarks: [
            { pct: 70, label: "70 %" },
            { pct: 50, label: "§ 151 EO" },
          ],
        },
        noticeCard: { filePrefix: "E ", fileSuffix: "/25z", currencySymbol: "€" },
      };

    case "CH":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "CHF",
          minValue: 100_000,
          maxValue: 3_000_000,
          valueStep: 10_000,
          defaultValue: 565_000,
          defaultBidPct: 65,
          defaultRegionCode: "ch-zh",
          regionGroupLabel: REGION_GROUP_LABELS.CH,
          regions: snap.regions,
          absoluteLimit: 0.5,
          relativeLimit: 0.7,
          depositRatio: 0.1,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 70, label: "70 %" },
            { pct: 50, label: "SchKG" },
          ],
        },
        noticeCard: { filePrefix: "SHAB-", fileSuffix: "/2026", currencySymbol: "CHF" },
      };

    case "IT":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "EUR",
          minValue: 25_000,
          maxValue: 1_500_000,
          valueStep: 5_000,
          defaultValue: 180_000,
          defaultBidPct: 75,
          defaultRegionCode: "it-lom",
          regionGroupLabel: REGION_GROUP_LABELS.IT,
          regions: snap.regions,
          absoluteLimit: 0.75,
          relativeLimit: 1.0,
          depositRatio: 0.1,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 100, label: "Base" },
            { pct: 75, label: "75% c.p.c." },
          ],
        },
        noticeCard: { filePrefix: "R.G.E. ", fileSuffix: "/2025", currencySymbol: "€" },
      };

    case "ES":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "EUR",
          minValue: 25_000,
          maxValue: 1_500_000,
          valueStep: 5_000,
          defaultValue: 180_000,
          defaultBidPct: 70,
          defaultRegionCode: "es-md",
          regionGroupLabel: REGION_GROUP_LABELS.ES,
          regions: snap.regions,
          absoluteLimit: 0.5,
          relativeLimit: 0.7,
          depositRatio: 0.05,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 70, label: "70% LEC" },
            { pct: 50, label: "50% LEC" },
          ],
        },
        noticeCard: { filePrefix: "SUB-JA-2026-", fileSuffix: "", currencySymbol: "€" },
      };

    case "FR":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "EUR",
          minValue: 30_000,
          maxValue: 2_000_000,
          valueStep: 5_000,
          defaultValue: 220_000,
          defaultBidPct: 60,
          defaultRegionCode: "fr-idf",
          regionGroupLabel: REGION_GROUP_LABELS.FR,
          regions: snap.regions,
          absoluteLimit: 0.5,
          relativeLimit: 0.7,
          depositRatio: 0.1,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 70, label: "70 %" },
            { pct: 50, label: "Mise à prix" },
          ],
        },
        noticeCard: { filePrefix: "RG 25/", fileSuffix: "", currencySymbol: "€" },
      };

    case "GB":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "GBP",
          minValue: 40_000,
          maxValue: 1_500_000,
          valueStep: 5_000,
          defaultValue: 220_000,
          defaultBidPct: 80,
          defaultRegionCode: "gb-lon",
          regionGroupLabel: REGION_GROUP_LABELS.GB,
          regions: snap.regions,
          absoluteLimit: 0.7,
          relativeLimit: 0.85,
          depositRatio: 0.1,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 85, label: "Reserve" },
            { pct: 70, label: "Guide" },
          ],
        },
        noticeCard: { filePrefix: "Lot ", fileSuffix: " · RICS", currencySymbol: "£" },
      };

    case "NL":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "EUR",
          minValue: 50_000,
          maxValue: 2_000_000,
          valueStep: 10_000,
          defaultValue: 350_000,
          defaultBidPct: 75,
          defaultRegionCode: "nl-zh",
          regionGroupLabel: REGION_GROUP_LABELS.NL,
          regions: snap.regions,
          absoluteLimit: 0.65,
          relativeLimit: 0.8,
          depositRatio: 0.1,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 80, label: "80%" },
            { pct: 65, label: "Inzet" },
          ],
        },
        noticeCard: { filePrefix: "NL-EV-", fileSuffix: "", currencySymbol: "€" },
      };

    case "PL":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "PLN",
          minValue: 80_000,
          maxValue: 4_000_000,
          valueStep: 10_000,
          defaultValue: 450_000,
          defaultBidPct: 75,
          defaultRegionCode: "pl-mz",
          regionGroupLabel: REGION_GROUP_LABELS.PL,
          regions: snap.regions,
          absoluteLimit: 0.75,
          relativeLimit: 0.85,
          depositRatio: 0.1,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 75, label: "3/4 I lic." },
            { pct: 67, label: "2/3 II lic." },
          ],
        },
        noticeCard: { filePrefix: "Km ", fileSuffix: "/25", currencySymbol: "zł" },
      };

    case "CZ":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "CZK",
          minValue: 500_000,
          maxValue: 20_000_000,
          valueStep: 100_000,
          defaultValue: 3_500_000,
          defaultBidPct: 70,
          defaultRegionCode: "cz-pha",
          regionGroupLabel: REGION_GROUP_LABELS.CZ,
          regions: snap.regions,
          absoluteLimit: 0.67,
          relativeLimit: 0.85,
          depositRatio: 0.1,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 67, label: "2/3 1.kolo" },
            { pct: 50, label: "50% 2.kolo" },
          ],
        },
        noticeCard: { filePrefix: "EX ", fileSuffix: "/25", currencySymbol: "Kč" },
      };

    case "SE":
      return {
        country,
        snapshot: snap,
        calculator: {
          country,
          currency: "SEK",
          minValue: 300_000,
          maxValue: 12_000_000,
          valueStep: 50_000,
          defaultValue: 1_800_000,
          defaultBidPct: 75,
          defaultRegionCode: "se-ab",
          regionGroupLabel: REGION_GROUP_LABELS.SE,
          regions: snap.regions,
          absoluteLimit: 0.7,
          relativeLimit: 0.85,
          depositRatio: 0.1,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 85, label: "85 %" },
            { pct: 70, label: "Skyddsbelopp" },
          ],
        },
        noticeCard: { filePrefix: "KFM-", fileSuffix: "-2026", currencySymbol: "kr" },
      };

    case "DE":
    default:
      return {
        country: "DE",
        snapshot: HOME_COUNTRY_SNAPSHOTS.DE,
        calculator: {
          country: "DE",
          currency: "EUR",
          minValue: 10_000,
          maxValue: 2_000_000,
          valueStep: 5_000,
          defaultValue: 240_000,
          defaultBidPct: 55,
          defaultRegionCode: "nw",
          regionGroupLabel: REGION_GROUP_LABELS.DE,
          regions: HOME_COUNTRY_SNAPSHOTS.DE.regions,
          absoluteLimit: 0.5,
          relativeLimit: 0.7,
          depositRatio: 0.1,
          secondHearingWaivesLimits: true,
          gaugeMarks: [
            { pct: 70, label: "7/10" },
            { pct: 50, label: "5/10" },
          ],
        },
        noticeCard: { filePrefix: "K ", fileSuffix: "/2025", currencySymbol: "€" },
      };
  }
}
