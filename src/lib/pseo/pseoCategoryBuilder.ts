import { Listing } from "@/types/listing.types";
import { EuPseoMarketCode } from "@/types/pseo.types";

export interface EuCategorySpec {
  slug: string;
  aliases: string[];
  nationalTitle: string;
  comboSlugPrefix: string;
  comboTitle: (locName: string) => string;
  matches: (l: Listing) => boolean;
}

const isApt = (l: Listing) =>
  l.segment === "apartment" || /appart|wohnung|stockwerk|piso|vivienda|flat|maisonette|studio/i.test(l.segmentLabel || l.title || "");

const isHouse = (l: Listing) =>
  l.segment === "house" || /haus|villa|villino|chalet|casa|maison|pavillon|bungalow|terraced|detached|cottage/i.test(l.segmentLabel || l.title || "");

const isCommercial = (l: Listing) =>
  l.segment === "commercial" ||
  l.segment === "multiFamily" ||
  /gewerbe|mehrfamilien|zinshaus|negozio|ufficio|capannone|commercial|local|nave|immeuble|bureaux|retail|industrial/i.test(
    l.segmentLabel || l.title || "",
  );

const isLand = (l: Listing) =>
  l.segment === "land" ||
  l.segment === "farmland" ||
  /grundst|bauland|parzelle|terreno|agricol|solar|parcela|finca|terrain|land|plot/i.test(l.segmentLabel || l.title || "");

export const EU_CATEGORY_SPECS: Record<EuPseoMarketCode, readonly EuCategorySpec[]> = {
  AT: [
    {
      slug: "eigentumswohnung-kaufen",
      aliases: ["eigentumswohnung", "wohnung-zwangsversteigerung"],
      nationalTitle: "Eigentumswohnung & Wohnung (Österreich)",
      comboSlugPrefix: "eigentumswohnung",
      comboTitle: (loc) => `Eigentumswohnungen in ${loc}`,
      matches: isApt,
    },
    {
      slug: "einfamilienhaus-kaufen",
      aliases: ["einfamilienhaus", "haus-zwangsversteigerung"],
      nationalTitle: "Einfamilienhaus & Wohnhaus (Österreich)",
      comboSlugPrefix: "einfamilienhaus",
      comboTitle: (loc) => `Einfamilienhäuser in ${loc}`,
      matches: isHouse,
    },
    {
      slug: "zinshaus-gewerbeimmobilie",
      aliases: ["zinshaus", "gewerbeimmobilie"],
      nationalTitle: "Zinshaus, Mehrfamilienhaus & Gewerbe (Österreich)",
      comboSlugPrefix: "gewerbe-zinshaus",
      comboTitle: (loc) => `Zinshäuser & Gewerbe in ${loc}`,
      matches: isCommercial,
    },
    {
      slug: "grundstueck-liegenschaft",
      aliases: ["grundstueck", "baugrundstueck"],
      nationalTitle: "Grundstück & Baugrund (Österreich)",
      comboSlugPrefix: "grundstueck",
      comboTitle: (loc) => `Grundstücke in ${loc}`,
      matches: isLand,
    },
  ],
  CH: [
    {
      slug: "stockwerkeigentum-wohnung",
      aliases: ["eigentumswohnung", "appartements-ppe", "appartamenti-ppp"],
      nationalTitle: "Stockwerkeigentum & Wohnung (SHAB / FOSC / FUSC)",
      comboSlugPrefix: "wohnung",
      comboTitle: (loc) => `Stockwerkeigentum & Wohnungen · ${loc}`,
      matches: isApt,
    },
    {
      slug: "einfamilienhaus-villa",
      aliases: ["einfamilienhaus", "maisons-villas", "ville-case"],
      nationalTitle: "Einfamilienhaus & Villa (SHAB / FOSC / FUSC)",
      comboSlugPrefix: "haus-villa",
      comboTitle: (loc) => `Einfamilienhäuser & Villen · ${loc}`,
      matches: isHouse,
    },
    {
      slug: "mehrfamilienhaus-renditeobjekt",
      aliases: ["mehrfamilienhaus", "immeubles-locaux", "immobili-commerciali"],
      nationalTitle: "Mehrfamilienhaus & Gewerbe (SHAB / FOSC / FUSC)",
      comboSlugPrefix: "rendite-gewerbe",
      comboTitle: (loc) => `Mehrfamilienhäuser & Gewerbe · ${loc}`,
      matches: isCommercial,
    },
    {
      slug: "grundstueck-parzelle",
      aliases: ["grundstueck", "terrains-parcelles", "terreni-fondi"],
      nationalTitle: "Grundstück, Bauland & Parzelle (SHAB)",
      comboSlugPrefix: "parzelle",
      comboTitle: (loc) => `Grundstücke & Parzellen · ${loc}`,
      matches: isLand,
    },
  ],
  IT: [
    {
      slug: "appartamenti-all-asta",
      aliases: ["appartamenti", "case-appartamenti"],
      nationalTitle: "Appartamenti all'Asta (Italia PVP)",
      comboSlugPrefix: "appartamenti",
      comboTitle: (loc) => `Appartamenti all'Asta · ${loc}`,
      matches: isApt,
    },
    {
      slug: "ville-e-case-indipendenti",
      aliases: ["ville-all-asta", "case-indipendenti"],
      nationalTitle: "Ville e Case Indipendenti all'Asta (Italia)",
      comboSlugPrefix: "ville-case",
      comboTitle: (loc) => `Ville e Case all'Asta · ${loc}`,
      matches: isHouse,
    },
    {
      slug: "immobili-commerciali-negozi",
      aliases: ["negozi-uffici-capannoni", "immobili-commerciali"],
      nationalTitle: "Negozi, Uffici e Capannoni all'Asta (Italia)",
      comboSlugPrefix: "commerciali",
      comboTitle: (loc) => `Immobili Commerciali all'Asta · ${loc}`,
      matches: isCommercial,
    },
    {
      slug: "terreni-agricoli-edificabili",
      aliases: ["terreni-all-asta", "terreni"],
      nationalTitle: "Terreni Edificabili e Agricoli all'Asta (Italia)",
      comboSlugPrefix: "terreni",
      comboTitle: (loc) => `Terreni all'Asta · ${loc}`,
      matches: isLand,
    },
  ],
  ES: [
    {
      slug: "pisos-y-viviendas-subasta-boe",
      aliases: ["pisos-subasta-boe", "viviendas-boe"],
      nationalTitle: "Pisos y Viviendas en Subasta BOE (España)",
      comboSlugPrefix: "viviendas",
      comboTitle: (loc) => `Pisos y Viviendas en Subasta BOE · ${loc}`,
      matches: isApt,
    },
    {
      slug: "chalets-y-casas-subasta-boe",
      aliases: ["chalets-subasta-boe", "casas-boe"],
      nationalTitle: "Chalets y Casas Unifamiliares en Subasta BOE",
      comboSlugPrefix: "chalets",
      comboTitle: (loc) => `Chalets y Casas en Subasta BOE · ${loc}`,
      matches: isHouse,
    },
    {
      slug: "locales-y-naves-subasta-boe",
      aliases: ["locales-comerciales-boe", "naves-industriales-boe"],
      nationalTitle: "Locales Comerciales y Naves en Subasta BOE",
      comboSlugPrefix: "locales",
      comboTitle: (loc) => `Locales y Naves en Subasta BOE · ${loc}`,
      matches: isCommercial,
    },
    {
      slug: "solares-y-fincas-rusticas-boe",
      aliases: ["terrenos-subasta-boe", "fincas-rusticas-boe"],
      nationalTitle: "Solares Urbanos y Fincas Rústicas en Subasta BOE",
      comboSlugPrefix: "terrenos",
      comboTitle: (loc) => `Solares y Fincas en Subasta BOE · ${loc}`,
      matches: isLand,
    },
  ],
  FR: [
    {
      slug: "appartements-aux-encheres",
      aliases: ["appartements", "studio-appartement"],
      nationalTitle: "Appartements aux Enchères Judiciaires (France)",
      comboSlugPrefix: "appartements",
      comboTitle: (loc) => `Appartements aux Enchères · ${loc}`,
      matches: isApt,
    },
    {
      slug: "maisons-et-villas-aux-encheres",
      aliases: ["maisons-aux-encheres", "pavillons-villas"],
      nationalTitle: "Maisons, Pavillons et Villas aux Enchères (France)",
      comboSlugPrefix: "maisons",
      comboTitle: (loc) => `Maisons et Villas aux Enchères · ${loc}`,
      matches: isHouse,
    },
    {
      slug: "immeubles-et-locaux-commerciaux",
      aliases: ["locaux-commerciaux", "immeubles-de-rapport"],
      nationalTitle: "Immeubles de Rapport & Locaux Commerciaux aux Enchères",
      comboSlugPrefix: "immeubles-locaux",
      comboTitle: (loc) => `Immeubles & Locaux aux Enchères · ${loc}`,
      matches: isCommercial,
    },
    {
      slug: "terrains-aux-encheres",
      aliases: ["terrains-a-batir", "parcelles"],
      nationalTitle: "Terrains à Bâtir & Parcelles aux Enchères (France)",
      comboSlugPrefix: "terrains",
      comboTitle: (loc) => `Terrains aux Enchères · ${loc}`,
      matches: isLand,
    },
  ],
  GB: [
    {
      slug: "flats-and-apartments-for-auction",
      aliases: ["flats-for-auction", "apartments-uk"],
      nationalTitle: "Flats & Apartments for Auction (UK)",
      comboSlugPrefix: "flats",
      comboTitle: (loc) => `Flats & Apartments for Auction in ${loc}`,
      matches: isApt,
    },
    {
      slug: "houses-for-auction-uk",
      aliases: ["houses-at-auction", "terraced-detached-houses"],
      nationalTitle: "Terraced, Semi-Detached & Detached Houses at Auction (UK)",
      comboSlugPrefix: "houses",
      comboTitle: (loc) => `Houses for Auction in ${loc}`,
      matches: isHouse,
    },
    {
      slug: "commercial-property-auctions-uk",
      aliases: ["commercial-auctions", "mixed-use-investments"],
      nationalTitle: "Commercial Property & Mixed-Use Investments at Auction (UK)",
      comboSlugPrefix: "commercial",
      comboTitle: (loc) => `Commercial Property Auctions in ${loc}`,
      matches: isCommercial,
    },
    {
      slug: "land-and-plots-for-auction-uk",
      aliases: ["land-auctions", "building-plots-uk"],
      nationalTitle: "Land, Building Plots & Development Sites at Auction (UK)",
      comboSlugPrefix: "land",
      comboTitle: (loc) => `Land & Plots for Auction in ${loc}`,
      matches: isLand,
    },
  ],
};

export interface DeComboSpec {
  prefix: string;
  label: (locName: string) => string;
  matches: (l: Listing) => boolean;
}

export const DE_COMBO_SPECS: readonly DeComboSpec[] = [
  {
    prefix: "eigentumswohnung",
    label: (loc) => `Eigentumswohnung in ${loc}`,
    matches: (l) => l.segment === "apartment",
  },
  {
    prefix: "einfamilienhaus",
    label: (loc) => `Einfamilienhaus in ${loc}`,
    matches: (l) => l.segment === "house",
  },
  {
    prefix: "grundstueck",
    label: (loc) => `Grundstück & Ackerland in ${loc}`,
    matches: (l) => l.segment === "land" || l.segment === "farmland",
  },
  {
    prefix: "mehrfamilienhaus",
    label: (loc) => `Mehrfamilienhaus & Gewerbe in ${loc}`,
    matches: (l) => l.segment === "commercial" || l.segment === "multiFamily",
  },
  {
    prefix: "ohne-wertgrenzen",
    label: (loc) => `Ohne Wertgrenzen (5/10 entfallen) · ${loc}`,
    matches: (l) => Boolean(l.limitsWaived),
  },
];

export interface TrComboSpec {
  suffix: string;
  label: (provName: string) => string;
  matches: (l: Listing) => boolean;
}

export const TR_COMBO_SPECS: readonly TrComboSpec[] = [
  {
    suffix: "icradan-satilik-daire",
    label: (prov) => `${prov} İcradan Satılık Daire & Konut`,
    matches: (l) => l.segment === "apartment" || /daire|konut|mesken/i.test(l.tr?.nitelik || l.title || ""),
  },
  {
    suffix: "icradan-satilik-arsa-tarla",
    label: (prov) => `${prov} İcradan Satılık Arsa, Tarla & Arazi`,
    matches: (l) => l.segment === "land" || l.segment === "farmland" || /arsa|tarla|arazi|bahçe|zeytinlik/i.test(l.tr?.nitelik || l.title || ""),
  },
  {
    suffix: "icradan-satilik-mustakil-ev",
    label: (prov) => `${prov} İcradan Satılık Müstakil Ev, Bina & Villa`,
    matches: (l) => l.segment === "house" || l.segment === "multiFamily" || /müstakil|villa|bina|ev/i.test(l.tr?.nitelik || l.title || ""),
  },
  {
    suffix: "icradan-satilik-dukkan-isyeri",
    label: (prov) => `${prov} İcradan Satılık Dükkan & İşyeri`,
    matches: (l) => l.segment === "commercial" || /dükkan|işyeri|depo|fabrika|ofis|ticari/i.test(l.tr?.nitelik || l.title || ""),
  },
];
