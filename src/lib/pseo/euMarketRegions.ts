import { EuPseoMarketCode, PseoLocale } from "@/types/pseo.types";

export interface EuRegionSeed {
  code: string;
  snapshotRegion: string;
  nativeName: string;
  slug: string;
  taxPct: number;
}

export const EU_MARKET_META: Record<
  EuPseoMarketCode,
  {
    locale: PseoLocale;
    currency: "EUR" | "CHF" | "GBP";
    hubPath: string;
    calcPath: string;
    flag: string;
    shortLabel: string;
  }
> = {
  AT: {
    locale: "de",
    currency: "EUR",
    hubPath: "/oesterreich/ediktsdatei",
    calcPath: "/oesterreich/rechner/geringstes-gebot-vadium",
    flag: "🇦🇹",
    shortLabel: "Österreich · Edikte (9 Länder)",
  },
  CH: {
    locale: "de",
    currency: "CHF",
    hubPath: "/schweiz/shab-versteigerungen",
    calcPath: "/schweiz/rechner/betreibungsamtliche-steigerung-schkg",
    flag: "🇨🇭",
    shortLabel: "Schweiz · SHAB (26 Kantone)",
  },
  IT: {
    locale: "it",
    currency: "EUR",
    hubPath: "/it/aste-giudiziarie",
    calcPath: "/it/calcolatore/offerta-minima-75-asta-giudiziaria",
    flag: "🇮🇹",
    shortLabel: "Italia · Aste PVP (20 Regioni)",
  },
  ES: {
    locale: "es",
    currency: "EUR",
    hubPath: "/es/subastas-boe",
    calcPath: "/es/calculadora/subasta-judicial-boe-70-por-ciento",
    flag: "🇪🇸",
    shortLabel: "España · BOE Subastas (17 CCAA)",
  },
  FR: {
    locale: "fr",
    currency: "EUR",
    hubPath: "/fr/encheres-immobilieres",
    calcPath: "/fr/calculateur/encheres-judiciaires-licitor-frais",
    flag: "🇫🇷",
    shortLabel: "France · Licitor TJ (13 Régions)",
  },
  GB: {
    locale: "en",
    currency: "GBP",
    hubPath: "/en/uk-property-auctions",
    calcPath: "/en/calculator/uk-property-auction-stamp-duty-deposit",
    flag: "🇬🇧",
    shortLabel: "UK · Property Auctions (12 Regions)",
  },
};

export const EU_REGION_SEEDS: Record<EuPseoMarketCode, EuRegionSeed[]> = {
  AT: [
    { code: "at-w", snapshotRegion: "Wien (AT)", nativeName: "Wien", slug: "wien", taxPct: 4.6 },
    { code: "at-noe", snapshotRegion: "Niederösterreich (AT)", nativeName: "Niederösterreich", slug: "niederoesterreich", taxPct: 4.6 },
    { code: "at-stmk", snapshotRegion: "Steiermark (AT)", nativeName: "Steiermark", slug: "steiermark", taxPct: 4.6 },
    { code: "at-ooe", snapshotRegion: "Oberösterreich (AT)", nativeName: "Oberösterreich", slug: "oberoesterreich", taxPct: 4.6 },
    { code: "at-tir", snapshotRegion: "Tirol (AT)", nativeName: "Tirol", slug: "tirol", taxPct: 4.6 },
    { code: "at-bgld", snapshotRegion: "Burgenland (AT)", nativeName: "Burgenland", slug: "burgenland", taxPct: 4.6 },
    { code: "at-sbg", snapshotRegion: "Salzburg (AT)", nativeName: "Salzburg", slug: "salzburg", taxPct: 4.6 },
    { code: "at-ktn", snapshotRegion: "Kärnten (AT)", nativeName: "Kärnten", slug: "kaernten", taxPct: 4.6 },
    { code: "at-vbg", snapshotRegion: "Vorarlberg (AT)", nativeName: "Vorarlberg", slug: "vorarlberg", taxPct: 4.6 },
  ],
  CH: [
    { code: "ch-zh", snapshotRegion: "Zürich (CH)", nativeName: "Kanton Zürich", slug: "zuerich", taxPct: 0.2 },
    { code: "ch-be", snapshotRegion: "Bern (CH)", nativeName: "Kanton Bern", slug: "bern", taxPct: 1.8 },
    { code: "ch-ti", snapshotRegion: "Tessin (CH)", nativeName: "Kanton Tessin (Ticino)", slug: "tessin", taxPct: 1.1 },
    { code: "ch-vd", snapshotRegion: "Waadt (CH)", nativeName: "Kanton Waadt (Vaud)", slug: "waadt", taxPct: 2.2 },
    { code: "ch-vs", snapshotRegion: "Wallis (CH)", nativeName: "Kanton Wallis (Valais)", slug: "wallis", taxPct: 1.5 },
    { code: "ch-ag", snapshotRegion: "Aargau (CH)", nativeName: "Kanton Aargau", slug: "aargau", taxPct: 0.4 },
    { code: "ch-fr", snapshotRegion: "Freiburg (CH)", nativeName: "Kanton Freiburg (Fribourg)", slug: "freiburg", taxPct: 1.5 },
    { code: "ch-so", snapshotRegion: "Solothurn (CH)", nativeName: "Kanton Solothurn", slug: "solothurn", taxPct: 2.2 },
    { code: "ch-sg", snapshotRegion: "St. Gallen (CH)", nativeName: "Kanton St. Gallen", slug: "st-gallen", taxPct: 1.0 },
    { code: "ch-gr", snapshotRegion: "Graubünden (CH)", nativeName: "Kanton Graubünden", slug: "graubuenden", taxPct: 2.0 },
    { code: "ch-bl", snapshotRegion: "Basel-Landschaft (CH)", nativeName: "Kanton Basel-Landschaft", slug: "basel-landschaft", taxPct: 2.5 },
    { code: "ch-bs", snapshotRegion: "Basel-Stadt (CH)", nativeName: "Kanton Basel-Stadt", slug: "basel-stadt", taxPct: 3.0 },
    { code: "ch-tg", snapshotRegion: "Thurgau (CH)", nativeName: "Kanton Thurgau", slug: "thurgau", taxPct: 1.0 },
    { code: "ch-ne", snapshotRegion: "Neuenburg (CH)", nativeName: "Kanton Neuenburg (Neuchâtel)", slug: "neuenburg", taxPct: 3.3 },
    { code: "ch-ge", snapshotRegion: "Genf (CH)", nativeName: "Kanton Genf (Genève)", slug: "genf", taxPct: 3.0 },
    { code: "ch-lu", snapshotRegion: "Luzern (CH)", nativeName: "Kanton Luzern", slug: "luzern", taxPct: 1.5 },
    { code: "ch-ju", snapshotRegion: "Jura (CH)", nativeName: "Kanton Jura", slug: "jura", taxPct: 2.1 },
    { code: "ch-sh", snapshotRegion: "Schaffhausen (CH)", nativeName: "Kanton Schaffhausen", slug: "schaffhausen", taxPct: 0.4 },
    { code: "ch-ar", snapshotRegion: "Appenzell Ausserrhoden (CH)", nativeName: "Kanton Appenzell Ausserrhoden", slug: "appenzell-ausserrhoden", taxPct: 2.0 },
    { code: "ch-sz", snapshotRegion: "Schwyz (CH)", nativeName: "Kanton Schwyz", slug: "schwyz", taxPct: 0.2 },
    { code: "ch-zg", snapshotRegion: "Zug (CH)", nativeName: "Kanton Zug", slug: "zug", taxPct: 0.2 },
    { code: "ch-ow", snapshotRegion: "Obwalden (CH)", nativeName: "Kanton Obwalden", slug: "obwalden", taxPct: 1.5 },
    { code: "ch-nw", snapshotRegion: "Nidwalden (CH)", nativeName: "Kanton Nidwalden", slug: "nidwalden", taxPct: 1.0 },
    { code: "ch-ur", snapshotRegion: "Uri (CH)", nativeName: "Kanton Uri", slug: "uri", taxPct: 0.3 },
    { code: "ch-gl", snapshotRegion: "Glarus (CH)", nativeName: "Kanton Glarus", slug: "glarus", taxPct: 0.3 },
    { code: "ch-ai", snapshotRegion: "Appenzell Innerrhoden (CH)", nativeName: "Kanton Appenzell Innerrhoden", slug: "appenzell-innerrhoden", taxPct: 1.0 },
  ],
  IT: [
    { code: "it-lom", snapshotRegion: "Lombardei (IT)", nativeName: "Lombardia (Milano)", slug: "lombardia", taxPct: 9.0 },
    { code: "it-laz", snapshotRegion: "Latium / Rom (IT)", nativeName: "Lazio (Roma)", slug: "lazio-roma", taxPct: 9.0 },
    { code: "it-sic", snapshotRegion: "Sizilien (IT)", nativeName: "Sicilia (Palermo / Catania)", slug: "sicilia", taxPct: 9.0 },
    { code: "it-tos", snapshotRegion: "Toskana (IT)", nativeName: "Toscana (Firenze)", slug: "toscana", taxPct: 9.0 },
    { code: "it-pie", snapshotRegion: "Piemont (IT)", nativeName: "Piemonte (Torino)", slug: "piemonte", taxPct: 9.0 },
    { code: "it-ven", snapshotRegion: "Venetien (IT)", nativeName: "Veneto (Venezia / Verona)", slug: "veneto", taxPct: 9.0 },
    { code: "it-emr", snapshotRegion: "Emilia-Romagna (IT)", nativeName: "Emilia-Romagna (Bologna)", slug: "emilia-romagna", taxPct: 9.0 },
    { code: "it-cam", snapshotRegion: "Kampanien (IT)", nativeName: "Campania (Napoli)", slug: "campania", taxPct: 9.0 },
    { code: "it-pug", snapshotRegion: "Apulien (IT)", nativeName: "Puglia (Bari / Lecce)", slug: "puglia", taxPct: 9.0 },
    { code: "it-mar", snapshotRegion: "Marken (IT)", nativeName: "Marche (Ancona)", slug: "marche", taxPct: 9.0 },
    { code: "it-abr", snapshotRegion: "Abruzzen (IT)", nativeName: "Abruzzo (Pescara / L'Aquila)", slug: "abruzzo", taxPct: 9.0 },
    { code: "it-cal", snapshotRegion: "Kalabrien (IT)", nativeName: "Calabria (Catanzaro / Reggio)", slug: "calabria", taxPct: 9.0 },
    { code: "it-lig", snapshotRegion: "Ligurien (IT)", nativeName: "Liguria (Genova)", slug: "liguria", taxPct: 9.0 },
    { code: "it-sar", snapshotRegion: "Sardinien (IT)", nativeName: "Sardegna (Cagliari / Olbia)", slug: "sardegna", taxPct: 9.0 },
    { code: "it-fvg", snapshotRegion: "Friaul-Julisch Venetien (IT)", nativeName: "Friuli-Venezia Giulia (Trieste)", slug: "friuli-venezia-giulia", taxPct: 9.0 },
    { code: "it-taa", snapshotRegion: "Südtirol / Trentino (IT)", nativeName: "Trentino-Alto Adige (Bolzano / Trento)", slug: "trentino-alto-adige", taxPct: 9.0 },
    { code: "it-umb", snapshotRegion: "Umbrien (IT)", nativeName: "Umbria (Perugia)", slug: "umbria", taxPct: 9.0 },
    { code: "it-bas", snapshotRegion: "Basilikata (IT)", nativeName: "Basilicata (Potenza / Matera)", slug: "basilicata", taxPct: 9.0 },
    { code: "it-mol", snapshotRegion: "Molise (IT)", nativeName: "Molise (Campobasso)", slug: "molise", taxPct: 9.0 },
    { code: "it-vda", snapshotRegion: "Aostatal (IT)", nativeName: "Valle d'Aosta", slug: "valle-d-aosta", taxPct: 9.0 },
  ],
  ES: [
    { code: "es-an", snapshotRegion: "Andalusien (ES)", nativeName: "Andalucía (Málaga / Sevilla)", slug: "andalucia", taxPct: 7.0 },
    { code: "es-ct", snapshotRegion: "Katalonien (ES)", nativeName: "Cataluña (Barcelona / Girona)", slug: "cataluna", taxPct: 10.0 },
    { code: "es-md", snapshotRegion: "Madrid (ES)", nativeName: "Comunidad de Madrid", slug: "madrid", taxPct: 6.0 },
    { code: "es-vc", snapshotRegion: "Valencia (ES)", nativeName: "Comunidad Valenciana (Valencia / Alicante)", slug: "valencia", taxPct: 10.0 },
    { code: "es-cl", snapshotRegion: "Kastilien und León (ES)", nativeName: "Castilla y León (Valladolid)", slug: "castilla-y-leon", taxPct: 8.0 },
    { code: "es-cm", snapshotRegion: "Kastilien-La Mancha (ES)", nativeName: "Castilla-La Mancha (Toledo)", slug: "castilla-la-mancha", taxPct: 9.0 },
    { code: "es-ga", snapshotRegion: "Galicien (ES)", nativeName: "Galicia (A Coruña / Vigo)", slug: "galicia", taxPct: 8.0 },
    { code: "es-cn", snapshotRegion: "Kanarische Inseln (ES)", nativeName: "Islas Canarias (Tenerife / Gran Canaria)", slug: "canarias", taxPct: 6.5 },
    { code: "es-ib", snapshotRegion: "Balearen / Mallorca (ES)", nativeName: "Illes Balears (Mallorca / Ibiza)", slug: "baleares-mallorca", taxPct: 8.0 },
    { code: "es-as", snapshotRegion: "Asturien (ES)", nativeName: "Principado de Asturias (Oviedo)", slug: "asturias", taxPct: 8.0 },
    { code: "es-mc", snapshotRegion: "Murcia (ES)", nativeName: "Región de Murcia", slug: "murcia", taxPct: 8.0 },
    { code: "es-ex", snapshotRegion: "Extremadura (ES)", nativeName: "Extremadura (Badajoz / Cáceres)", slug: "extremadura", taxPct: 8.0 },
    { code: "es-pv", snapshotRegion: "Baskenland (ES)", nativeName: "País Vasco / Euskadi (Bilbao)", slug: "pais-vasco", taxPct: 4.0 },
    { code: "es-ar", snapshotRegion: "Aragonien (ES)", nativeName: "Aragón (Zaragoza)", slug: "aragon", taxPct: 8.0 },
    { code: "es-cb", snapshotRegion: "Kantabrien (ES)", nativeName: "Cantabria (Santander)", slug: "cantabria", taxPct: 9.0 },
    { code: "es-nc", snapshotRegion: "Navarra (ES)", nativeName: "Comunidad Foral de Navarra", slug: "navarra", taxPct: 6.0 },
    { code: "es-ri", snapshotRegion: "La Rioja (ES)", nativeName: "La Rioja (Logroño)", slug: "la-rioja", taxPct: 7.0 },
  ],
  FR: [
    { code: "fr-idf", snapshotRegion: "Île-de-France / Paris (FR)", nativeName: "Île-de-France (Paris / Versailles)", slug: "ile-de-france-paris", taxPct: 5.8 },
    { code: "fr-hdf", snapshotRegion: "Hauts-de-France (FR)", nativeName: "Hauts-de-France (Lille / Amiens)", slug: "hauts-de-france", taxPct: 5.8 },
    { code: "fr-bfc", snapshotRegion: "Burgund-Franche-Comté (FR)", nativeName: "Bourgogne-Franche-Comté (Dijon / Besançon)", slug: "bourgogne-franche-comte", taxPct: 5.8 },
    { code: "fr-ges", snapshotRegion: "Grand Est / Elsass (FR)", nativeName: "Grand Est / Alsace (Strasbourg / Metz)", slug: "grand-est-alsace", taxPct: 5.8 },
    { code: "fr-bre", snapshotRegion: "Bretagne (FR)", nativeName: "Bretagne (Rennes / Brest)", slug: "bretagne", taxPct: 5.8 },
    { code: "fr-nor", snapshotRegion: "Normandie (FR)", nativeName: "Normandie (Rouen / Caen)", slug: "normandie", taxPct: 5.8 },
    { code: "fr-pdl", snapshotRegion: "Pays de la Loire (FR)", nativeName: "Pays de la Loire (Nantes / Angers)", slug: "pays-de-la-loire", taxPct: 5.8 },
    { code: "fr-cvl", snapshotRegion: "Centre-Val de Loire (FR)", nativeName: "Centre-Val de Loire (Orléans / Tours)", slug: "centre-val-de-loire", taxPct: 5.8 },
    { code: "fr-ara", snapshotRegion: "Auvergne-Rhône-Alpes (FR)", nativeName: "Auvergne-Rhône-Alpes (Lyon / Grenoble)", slug: "auvergne-rhone-alpes", taxPct: 5.8 },
    { code: "fr-naq", snapshotRegion: "Nouvelle-Aquitaine (FR)", nativeName: "Nouvelle-Aquitaine (Bordeaux)", slug: "nouvelle-aquitaine", taxPct: 5.8 },
    { code: "fr-paca", snapshotRegion: "Provence-Alpes-Côte d'Azur (FR)", nativeName: "Provence-Alpes-Côte d'Azur (Marseille / Nice)", slug: "provence-alpes-cote-d-azur", taxPct: 5.8 },
    { code: "fr-occ", snapshotRegion: "Okzitanien (FR)", nativeName: "Occitanie (Toulouse / Montpellier)", slug: "occitanie", taxPct: 5.8 },
    { code: "fr-cor", snapshotRegion: "Korsika (FR)", nativeName: "Corse (Ajaccio / Bastia)", slug: "corse", taxPct: 5.8 },
  ],
  GB: [
    { code: "gb-yrk", snapshotRegion: "Yorkshire & Humber (UK)", nativeName: "Yorkshire & the Humber (Leeds / Sheffield)", slug: "yorkshire-humber", taxPct: 5.0 },
    { code: "gb-emd", snapshotRegion: "East Midlands (UK)", nativeName: "East Midlands (Nottingham / Leicester)", slug: "east-midlands", taxPct: 5.0 },
    { code: "gb-nwe", snapshotRegion: "North West England (UK)", nativeName: "North West England (Manchester / Liverpool)", slug: "north-west-england", taxPct: 5.0 },
    { code: "gb-wmd", snapshotRegion: "West Midlands (UK)", nativeName: "West Midlands (Birmingham / Coventry)", slug: "west-midlands", taxPct: 5.0 },
    { code: "gb-lon", snapshotRegion: "Greater London (UK)", nativeName: "Greater London", slug: "greater-london", taxPct: 5.0 },
    { code: "gb-see", snapshotRegion: "South East England (UK)", nativeName: "South East England (Brighton / Oxford)", slug: "south-east-england", taxPct: 5.0 },
    { code: "gb-ee", snapshotRegion: "East of England (UK)", nativeName: "East of England (Cambridge / Norwich)", slug: "east-of-england", taxPct: 5.0 },
    { code: "gb-swe", snapshotRegion: "South West England (UK)", nativeName: "South West England (Bristol / Exeter)", slug: "south-west-england", taxPct: 5.0 },
    { code: "gb-nee", snapshotRegion: "North East England (UK)", nativeName: "North East England (Newcastle / Durham)", slug: "north-east-england", taxPct: 5.0 },
    { code: "gb-wls", snapshotRegion: "Wales (UK)", nativeName: "Wales (Cardiff / Swansea)", slug: "wales", taxPct: 4.5 },
    { code: "gb-sct", snapshotRegion: "Schottland (UK)", nativeName: "Scotland (Edinburgh / Glasgow)", slug: "scotland", taxPct: 4.5 },
    { code: "gb-nir", snapshotRegion: "Nordirland (UK)", nativeName: "Northern Ireland (Belfast)", slug: "northern-ireland", taxPct: 5.0 },
  ],
};
