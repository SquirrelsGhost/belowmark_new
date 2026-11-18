import { LocaleOption, PricingCountryCode } from "@/lib/constants";
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

export interface CalculatorCopyOverrides {
  subtitle?: string;
  limitAbsolute?: string;
  limitRelative?: string;
  deposit?: string;
  transferTax?: string;
  verdictRefused?: string;
  verdictContestable?: string;
  verdictClear?: string;
  verdictWaived?: string;
  footnote?: string;
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
  /** In Turkey (İİK m. 129), the 50% minimum threshold applies in BOTH 1st and 2nd auctions! */
  secondHearingWaivesLimits: boolean;
  gaugeMarks: [GaugeMark, GaugeMark];
  copyOverrides?: CalculatorCopyOverrides;
}

export interface HomeNoticeCardConfig {
  filePrefix: string;
  fileSuffix: string;
  currencySymbol: string;
  courtOverride?: string;
  stateValueOverride?: string;
  limitLabelOverride?: string;
  taxHintOverride?: string;
  portalLinkOverride?: string;
}

export interface HomeStatesCopyOverride {
  title?: string;
  description?: string;
  colState?: string;
  footnote?: string;
}

export interface HomeMarketBundle {
  country: PricingCountryCode;
  snapshot: HomeCountrySnapshot;
  heroNoteOverride?: string;
  calculator: HomeCalculatorConfig;
  noticeCard: HomeNoticeCardConfig;
  statesOverride?: HomeStatesCopyOverride;
}

const REGION_GROUP_LABELS: Record<PricingCountryCode, string> = {
  TR: "Türkiye · İller (Tapu Harcı %4)",
  DE: "Deutschland · 16 Bundesländer (ZVG)",
  AT: "Österreich · 9 Bundesländer (EO)",
  CH: "Schweiz · 26 Kantone (SchKG)",
  IT: "Italia · 20 Regioni (PVP c.p.c.)",
  ES: "España · 17 Comunidades (BOE / ITP)",
  FR: "France · 13 Régions (Licitor TJ)",
  GB: "United Kingdom · 12 Regions (SDLT)",
  NL: "Nederland · 12 Provincies (BW)",
  PL: "Polska · 16 Województw (KPC)",
  CZ: "Česko · 14 Krajů (Portál dražeb)",
  SE: "Sverige · 21 Län (Kronofogden)",
};

export function getHomeMarketBundle(country: PricingCountryCode, locale: LocaleOption): HomeMarketBundle {
  const snap = HOME_COUNTRY_SNAPSHOTS[country];

  switch (country) {
    case "TR":
      return {
        country,
        snapshot: snap,
        heroNoteOverride:
          locale === "tr"
            ? "Ücretsiz: tüm icra ilan listesi görünür, rakamlar kilitli. Tam erişim aylık 599 TL'den."
            : undefined,
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
          copyOverrides:
            locale === "tr"
              ? undefined
              : {
                  subtitle: "Per İİK Art. 129 · UYAP E-İhale",
                  limitAbsolute: "50% minimum bid · İİK Art. 129",
                  limitRelative: "70% safe competitive band",
                  deposit: "10% electronic deposit · İİK Art. 124",
                  transferTax: "Title deed fee (Tapu Harcı)",
                  verdictRefused:
                    "Below 50%: Under İİK Art. 129, bids below 50% of appraised value (+ sale costs) cannot win.",
                  verdictContestable:
                    "50% to 70%: Statutorily valid opening range on UYAP E-Satış (+ execution sale expenses).",
                  verdictClear: "70% and above: Strong competitive range above opening UYAP bids.",
                  verdictWaived:
                    "2nd Auction (İİK Art. 129): The 50% appraised value + sale expenses floor still applies in Türkiye.",
                  footnote:
                    "Plus stamp duty (0.569%), VAT (1% / 10% / 20% depending on property class) and delivery fees. Zero broker commission.",
                },
        },
        noticeCard: {
          filePrefix: "2026/",
          fileSuffix: " Esas",
          currencySymbol: "₺",
          courtOverride: locale === "tr" ? undefined : "İcra Dairesi / Satış Memurluğu",
          stateValueOverride: locale === "tr" ? undefined : "İstanbul / Kadıköy",
          limitLabelOverride: locale === "tr" ? undefined : "50% İİK Floor",
          taxHintOverride: locale === "tr" ? undefined : "Tapu Harcı (title fee): 4.0%",
          portalLinkOverride: "UYAP E-Satış",
        },
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
          copyOverrides:
            locale === "it"
              ? {
                  subtitle: "Art. 571 c.p.c. · PVP Aste Giudiziarie",
                  limitAbsolute: "Offerta minima 75% · Art. 571 c.p.c.",
                  limitRelative: "Prezzo base d'asta (100%)",
                  deposit: "Cauzione · 10% (Art. 571 c.p.c.)",
                  transferTax: "Imposta di registro (2ª casa / ordinaria)",
                  verdictRefused:
                    "Sotto il 75%: Offerta inefficace ai sensi dell'Art. 571 c.p.c. se inferiore di oltre 1/4 al prezzo base.",
                  verdictContestable:
                    "Tra 75% e 100%: Offerta minima valida; in presenza di istanze di assegnazione dei creditori prevale il prezzo base.",
                  verdictClear:
                    "100% del prezzo base: Offerta piena senza rischio di assegnazione ai creditori.",
                  verdictWaived:
                    "Esperimento successivo: Il giudice può disporre un ribasso fino al 25% sul prezzo base precedente (Art. 591 c.p.c.).",
                }
              : {
                  subtitle: "Art. 571 c.p.c. · Italian PVP Judicial Auctions",
                  limitAbsolute: "75% Offerta Minima · Art. 571 c.p.c.",
                  limitRelative: "100% Prezzo Base",
                  deposit: "10% Cauzione deposit",
                },
        },
        noticeCard: {
          filePrefix: "R.G.E. ",
          fileSuffix: "/2025",
          currencySymbol: "€",
          stateValueOverride: "Lombardia (Milano)",
          limitLabelOverride: locale === "it" ? "Offerta minima 75%" : "75% Offerta Minima",
          taxHintOverride: locale === "it" ? "Imposta di registro: 9% (2% prima casa)" : "Registration tax: 9% (2% prima casa)",
          portalLinkOverride: "PVP Giustizia",
        },
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
          copyOverrides:
            locale === "es"
              ? {
                  subtitle: "Art. 670 LEC · Portal de Subastas BOE",
                  limitAbsolute: "Suelo general 50% · Art. 670.4 LEC",
                  limitRelative: "Adjudicación firme 70% · Art. 670.1 LEC",
                  deposit: "Depósito BOE 5% · Art. 647 LEC",
                  transferTax: "ITP autonómico",
                }
              : {
                  subtitle: "Art. 670 LEC · Spain BOE Judicial Portal",
                  limitAbsolute: "50% floor · Art. 670.4 LEC",
                  limitRelative: "70% firm award · Art. 670.1 LEC",
                  deposit: "5% BOE deposit · Art. 647 LEC",
                },
        },
        noticeCard: {
          filePrefix: "SUB-JA-2026-",
          fileSuffix: "",
          currencySymbol: "€",
          stateValueOverride: "Comunidad de Madrid",
          limitLabelOverride: "70% Art. 670 LEC",
          taxHintOverride: locale === "es" ? "ITP Comunidad de Madrid: 6,0 %" : "Madrid ITP transfer tax: 6.0%",
          portalLinkOverride: "Portal BOE",
        },
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
            { pct: 70, label: "70%" },
            { pct: 50, label: "Mise à prix" },
          ],
          copyOverrides:
            locale === "fr"
              ? {
                  subtitle: "Art. R. 322-40 CPCE · Tribunaux Judiciaires",
                  limitAbsolute: "Mise à prix indicative (~50 %)",
                  limitRelative: "Seuil hors surenchère (~70 %)",
                  deposit: "Consignation CARPA · 10 %",
                  transferTax: "Droits d'enregistrement",
                }
              : undefined,
        },
        noticeCard: {
          filePrefix: "RG 25/",
          fileSuffix: "",
          currencySymbol: "€",
          courtOverride: locale === "fr" ? "Tribunal Judiciaire" : undefined,
          stateValueOverride: "Île-de-France (Paris)",
          limitLabelOverride: "Mise à prix",
          taxHintOverride: locale === "fr" ? "Droits d'enregistrement : 5,8 %" : "Registration duties: 5.8%",
          portalLinkOverride: "Licitor / TJ",
        },
      };

    case "GB":
      return {
        country,
        snapshot: snap,
        heroNoteOverride:
          locale === "en"
            ? "Free tier: full UK auction lot list visible, guide prices locked. Full access from £35 per month."
            : undefined,
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
          copyOverrides: {
            subtitle: "RICS UK Property Auctions · SDLT & 10% Deposit",
            limitAbsolute: "Guide Price baseline (70%)",
            limitRelative: "Typical Reserve threshold (85%)",
            deposit: "10% Exchange Deposit (on gavel)",
            transferTax: "Stamp Duty (SDLT / LBTT / LTT)",
            verdictRefused: "Below Guide baseline: Typically below the seller's undisclosed auction reserve.",
            verdictContestable: "Guide to Reserve band (70%–85%): Within the standard +10% ASA guide-to-reserve tolerance.",
            verdictClear: "85% and above: Clears typical RICS auction reserve thresholds; 28-day completion applies.",
            verdictWaived: "Unsold / Post-Auction Lot: Direct post-auction treaty offers below reserve are open.",
            footnote: "Plus auction house administration fee and solicitor conveyancing. 10% deposit due immediately upon fall of gavel.",
          },
        },
        noticeCard: {
          filePrefix: "Lot ",
          fileSuffix: " · RICS",
          currencySymbol: "£",
          courtOverride: "RICS Regulated Auctioneer",
          stateValueOverride: "Greater London",
          limitLabelOverride: "Guide Price",
          taxHintOverride: "SDLT investor surcharge estimate: 5.0%",
          portalLinkOverride: "Auction Catalogue",
        },
        statesOverride:
          locale === "en"
            ? {
                title: "All 12 UK regions indexed. Live RICS auction lots.",
                description: "Open receivership, repossession and auction lots by UK region plus typical investor Stamp Duty.",
                colState: "UK Region",
                footnote: "Covers England, Wales, Scotland (LBTT) and Northern Ireland across RICS-regulated auction houses.",
              }
            : undefined,
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
            { pct: 70, label: "70%" },
            { pct: 50, label: "§ 151 EO" },
          ],
          copyOverrides: {
            subtitle: "Nach § 151 EO · Österreichische Ediktsdatei",
            limitAbsolute: "Geringstes Gebot 50 % · § 151 EO",
            limitRelative: "Richtwert 70 % Schätzwert",
            deposit: "Vadium 10 % · § 147 EO (Sparbuch)",
            transferTax: "GrESt (3,5 %) + Grundbuch (1,1 %)",
          },
        },
        noticeCard: {
          filePrefix: "E ",
          fileSuffix: "/25z",
          currencySymbol: "€",
          courtOverride: "Bezirksgericht",
          stateValueOverride: "Wien",
          limitLabelOverride: "Geringstes Gebot (50 %)",
          taxHintOverride: "3,5 % GrESt + 1,1 % Grundbuchgebühr: 4,6 %",
          portalLinkOverride: "Ediktsdatei Justiz",
        },
        statesOverride:
          locale === "de"
            ? {
                title: "Alle 9 Bundesländer abgefragt. Live aus der Ediktsdatei.",
                description: "Offene gerichtliche Liegenschaftsversteigerungen je Bundesland sowie Grunderwerbsteuer inkl. Grundbuchgebühr.",
                colState: "Bundesland",
                footnote: "Quelle: edikte.justiz.gv.at (BMJ Österreich). Nebenkosten: 3,5 % GrESt + 1,1 % Eintragungsgebühr.",
              }
            : undefined,
      };

    case "CH":
      return {
        country,
        snapshot: snap,
        heroNoteOverride:
          locale === "de"
            ? "Kostenlos: Objektliste sichtbar, Schätzwerte gesperrt. Vollzugang ab 49 CHF im Monat."
            : undefined,
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
            { pct: 70, label: "70%" },
            { pct: 50, label: "Deckung" },
          ],
          copyOverrides:
            locale === "de"
              ? {
                  subtitle: "Nach SchKG Art. 126 / 142a · SHAB Steigerungen",
                  limitAbsolute: "Deckungsprinzip · Vorrangige Pfandrechte",
                  limitRelative: "70 % Betreibungsamtliche Schätzung",
                  deposit: "Anzahlung ~10 % (Steigerungsbedingungen)",
                  transferTax: "Kantonale Handänderungssteuer",
                }
              : undefined,
        },
        noticeCard: {
          filePrefix: "SHAB-",
          fileSuffix: "/2026",
          currencySymbol: "CHF",
          courtOverride: "Betreibungs- / Konkursamt",
          stateValueOverride: "Kanton Zürich",
          limitLabelOverride: "Deckungsprinzip",
          taxHintOverride: "Kanton Zürich: keine Handänderungssteuer (~0,2 % Grundbuch)",
          portalLinkOverride: "SHAB / FOSC",
        },
        statesOverride:
          locale === "de"
            ? {
                title: "Alle 26 Schweizer Kantone abgefragt. Live aus dem SHAB.",
                description: "Offene betreibungs- und konkursamtliche Grundstücksteigerungen je Kanton sowie Handänderungssteuer.",
                colState: "Kanton",
                footnote: "Quelle: Schweizerisches Handelsamtsblatt (shab.ch) & kantonale Amtsblätter.",
              }
            : undefined,
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
          copyOverrides: {
            subtitle: "Art. 3:268 BW · Dutch Executieveilingen",
            limitAbsolute: "Typical Inzet floor (65%)",
            limitRelative: "Gunning / bank acceptance band (80%)",
            deposit: "10% Waarborgsom (notary escrow)",
            transferTax: "Overdrachtsbelasting (10.4% investor / 2% home)",
          },
        },
        noticeCard: {
          filePrefix: "NL-EV-",
          fileSuffix: "",
          currencySymbol: "€",
          courtOverride: "Veilingnotaris",
          stateValueOverride: "Zuid-Holland (Rotterdam)",
          limitLabelOverride: "Inzet / Afslag",
          portalLinkOverride: "Veilingnotaris.nl",
        },
        statesOverride: {
          title: "All 12 Dutch provinces indexed. Official notary executieveilingen.",
          description: "Active forced mortgage auctions (Art. 3:268 BW) across the Netherlands plus investor transfer tax.",
          colState: "Province",
          footnote: "Source: veilingnotaris.nl & vastgoedveiling.nl. Owner-occupiers pay 2% Overdrachtsbelasting (0% starter exemption).",
        },
      };

    case "PL":
      return {
        country,
        snapshot: snap,
        heroNoteOverride: "Free tier: all 16 voivodeship bailiff notices visible, values locked. Full access from 129 zł/month.",
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
          copyOverrides: {
            subtitle: "Art. 965 & 983 KPC · Licytacje Komornicze",
            limitAbsolute: "I Licytacja statutory floor · 3/4 (75%)",
            limitRelative: "Competitive bidding band (85%)",
            deposit: "10% Rękojmia / Wadium · Art. 962 KPC",
            transferTax: "PCC civil transfer tax (2.0%)",
          },
        },
        noticeCard: {
          filePrefix: "Km ",
          fileSuffix: "/25",
          currencySymbol: "zł",
          courtOverride: "Komornik Sądowy",
          stateValueOverride: "Woj. Mazowieckie (Warszawa)",
          limitLabelOverride: "Cena wywołania (3/4)",
          portalLinkOverride: "e-Licytacje Komornicze",
        },
        statesOverride: {
          title: "All 16 Polish voivodeships indexed. Official KPC bailiff auctions.",
          description: "Open judicial bailiff real estate auctions (licytacje komornicze) by voivodeship plus 2% PCC tax.",
          colState: "Voivodeship",
          footnote: "Source: licytacje.komornik.pl (Krajowa Rada Komornicza). 1st auction starts at 3/4, 2nd auction at 2/3 of appraised value.",
        },
      };

    case "CZ":
      return {
        country,
        snapshot: snap,
        heroNoteOverride: "Free tier: all 14 Czech regions visible, values locked. Full access from 790 Kč/month.",
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
          copyOverrides: {
            subtitle: "OSŘ / Exekuční řád · Portál dražeb EKČR",
            limitAbsolute: "Nejnižší podání · 2/3 (66.7%)",
            limitRelative: "Competitive bidding threshold (85%)",
            deposit: "Dražební jistota (~10%)",
            transferTax: "Katastr fee (0% property transfer tax)",
          },
        },
        noticeCard: {
          filePrefix: "EX ",
          fileSuffix: "/25",
          currencySymbol: "Kč",
          courtOverride: "Exekutorský úřad",
          stateValueOverride: "Hlavní město Praha",
          limitLabelOverride: "Nejnižší podání (2/3)",
          portalLinkOverride: "Portál dražeb EKČR",
        },
        statesOverride: {
          title: "All 14 Czech regions (Kraje) indexed. Live EKČR bailiff auctions.",
          description: "Active judicial enforcement auctions across Czechia — 0% real estate acquisition tax since 2020.",
          colState: "Region (Kraj)",
          footnote: "Source: portaldrazeb.cz (Exekutorská komora ČR). Opening bid in 1st round is 2/3 of appraised value.",
        },
      };

    case "SE":
      return {
        country,
        snapshot: snap,
        heroNoteOverride: "Free tier: all 21 Swedish counties visible, values locked. Full access from 390 kr/month.",
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
            { pct: 85, label: "85%" },
            { pct: 70, label: "Skyddsbelopp" },
          ],
          copyOverrides: {
            subtitle: "Utsökningsbalken (12 kap.) · Kronofogden",
            limitAbsolute: "Skyddsbelopp / acceptance floor (~70%)",
            limitRelative: "Market clearance threshold (85%)",
            deposit: "10% Handpenning (on auction day)",
            transferTax: "Stämpelskatt / Lagfart (1.5%)",
          },
        },
        noticeCard: {
          filePrefix: "KFM-",
          fileSuffix: "-2026",
          currencySymbol: "kr",
          courtOverride: "Kronofogdemyndigheten",
          stateValueOverride: "Stockholms län",
          limitLabelOverride: "Skyddsbelopp",
          portalLinkOverride: "Kronofogden Auktionstorget",
        },
        statesOverride: {
          title: "All 21 Swedish counties (Län) indexed. Official Kronofogden auctions.",
          description: "Active forced real estate & bostadsrätt sales by county plus 1.5% Stämpelskatt.",
          colState: "County (Län)",
          footnote: "Source: kronofogden.se (Auktionstorget). Private buyers pay 1.5% lagfart/stämpelskatt (4.25% for corporate buyers).",
        },
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
        noticeCard: {
          filePrefix: "K ",
          fileSuffix: "/2025",
          currencySymbol: "€",
        },
      };
  }
}
