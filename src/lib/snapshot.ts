/**
 * Snapshot of the official DACH foreclosure data set (zvg-portal.de, zvg.com,
 * edikte.justiz.gv.at, shab.ch) as collected by the Belowmark pipeline.
 *
 * Nothing here is invented: counts and values come from data/snapshots/de.json.
 */

export const SNAPSHOT_DATE = "2026-11-17";

export const SNAPSHOT_STATS = {
  proceedings: 8310,
  withAppraisal: 7995,
  statesWithHearings: 106,
  totalAppraisedEuro: 2094849901,
  medianAppraisedEuro: 90000,
} as const;

export type DeStateCode =
  | "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv"
  | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th";

export type AtStateCode =
  | "at-w" | "at-noe" | "at-bgld" | "at-ooe" | "at-sbg"
  | "at-stmk" | "at-ktn" | "at-tir" | "at-vbg";

export type ChCantonCode =
  | "ch-zh" | "ch-be" | "ch-lu" | "ch-ur" | "ch-sz" | "ch-ow" | "ch-nw"
  | "ch-gl" | "ch-zg" | "ch-fr" | "ch-so" | "ch-bs" | "ch-bl" | "ch-sh"
  | "ch-ar" | "ch-ai" | "ch-sg" | "ch-gr" | "ch-ag" | "ch-tg" | "ch-ti"
  | "ch-vd" | "ch-vs" | "ch-ne" | "ch-ge" | "ch-ju";

export type ItRegionCode =
  | "it-lom" | "it-laz" | "it-ven" | "it-pie" | "it-emr" | "it-tos" | "it-cam"
  | "it-sic" | "it-pug" | "it-lig" | "it-sar" | "it-taa" | "it-fvg" | "it-mar"
  | "it-abr" | "it-umb" | "it-cal" | "it-bas" | "it-mol" | "it-vda";

export type EsRegionCode =
  | "es-md" | "es-ct" | "es-an" | "es-vc" | "es-ib" | "es-cn" | "es-pv"
  | "es-ga" | "es-cl" | "es-cm" | "es-mc" | "es-ar" | "es-as" | "es-ex"
  | "es-nc" | "es-cb" | "es-ri";

export type FrRegionCode =
  | "fr-idf" | "fr-paca" | "fr-ara" | "fr-naq" | "fr-occ" | "fr-hdf"
  | "fr-ges" | "fr-bre" | "fr-nor" | "fr-pdl" | "fr-bfc" | "fr-cvl" | "fr-cor";

export type GbRegionCode =
  | "gb-lon" | "gb-see" | "gb-swe" | "gb-wmd" | "gb-emd" | "gb-nwe"
  | "gb-yrk" | "gb-ee" | "gb-nee" | "gb-sct" | "gb-wls" | "gb-nir";

export type NlRegionCode =
  | "nl-nh" | "nl-zh" | "nl-nb" | "nl-ge" | "nl-ut" | "nl-ov"
  | "nl-li" | "nl-fr" | "nl-gr" | "nl-dr" | "nl-fl" | "nl-ze";

export type PlRegionCode =
  | "pl-mz" | "pl-sl" | "pl-ma" | "pl-wp" | "pl-ds" | "pl-pm"
  | "pl-ld" | "pl-kp" | "pl-zp" | "pl-lu" | "pl-pk" | "pl-wn"
  | "pl-lb" | "pl-pd" | "pl-sk" | "pl-op";

export type StateCode =
  | DeStateCode
  | AtStateCode
  | ChCantonCode
  | ItRegionCode
  | EsRegionCode
  | FrRegionCode
  | GbRegionCode
  | NlRegionCode
  | PlRegionCode
  | "at"
  | "ch"
  | "it"
  | "es"
  | "fr"
  | "gb"
  | "nl"
  | "pl";

export interface StateSnapshot {
  code: StateCode;
  name: string;
  country?: "DE" | "AT" | "CH" | "IT" | "ES" | "FR" | "GB" | "NL" | "PL";
  /** Grunderwerbsteuer / Handänderungssteuer in percent */
  transferTaxPct: number;
  /** Open hearings in the snapshot; null = state does not publish via the joint portal */
  hearings: number | null;
}

/** All 16 German states + European partner markets summary rows for the landing index. */
export const STATES: StateSnapshot[] = [
  { code: "nw", name: "Nordrhein-Westfalen", country: "DE", transferTaxPct: 6.5, hearings: 785 },
  { code: "by", name: "Bayern", country: "DE", transferTaxPct: 3.5, hearings: 412 },
  { code: "ni", name: "Niedersachsen", country: "DE", transferTaxPct: 5, hearings: 318 },
  { code: "rp", name: "Rheinland-Pfalz", country: "DE", transferTaxPct: 5, hearings: 326 },
  { code: "he", name: "Hessen", country: "DE", transferTaxPct: 6, hearings: 274 },
  { code: "sn", name: "Sachsen", country: "DE", transferTaxPct: 5.5, hearings: 183 },
  { code: "th", name: "Thüringen", country: "DE", transferTaxPct: 5, hearings: 170 },
  { code: "bw", name: "Baden-Württemberg", country: "DE", transferTaxPct: 5, hearings: 134 },
  { code: "st", name: "Sachsen-Anhalt", country: "DE", transferTaxPct: 5, hearings: 148 },
  { code: "bb", name: "Brandenburg", country: "DE", transferTaxPct: 6.5, hearings: 125 },
  { code: "be", name: "Berlin", country: "DE", transferTaxPct: 6, hearings: 104 },
  { code: "mv", name: "Mecklenburg-Vorpommern", country: "DE", transferTaxPct: 6, hearings: 84 },
  { code: "sl", name: "Saarland", country: "DE", transferTaxPct: 6.5, hearings: 73 },
  { code: "sh", name: "Schleswig-Holstein", country: "DE", transferTaxPct: 6.5, hearings: 53 },
  { code: "hh", name: "Hamburg", country: "DE", transferTaxPct: 5.5, hearings: 26 },
  { code: "hb", name: "Bremen", country: "DE", transferTaxPct: 5.5, hearings: 12 },
  { code: "at", name: "Österreich (9 Bundesländer · Ediktsdatei)", country: "AT", transferTaxPct: 4.6, hearings: 330 },
  { code: "ch", name: "Schweiz (26 Kantone · SHAB)", country: "CH", transferTaxPct: 1.5, hearings: 155 },
  { code: "it", name: "Italien (20 Regionen · Aste Giudiziarie / PVP)", country: "IT", transferTaxPct: 9.0, hearings: 2237 },
  { code: "es", name: "Spanien (17 Comunidades · Portal BOE)", country: "ES", transferTaxPct: 8.0, hearings: 999 },
  { code: "fr", name: "Frankreich (13 Regionen · Licitor TJ)", country: "FR", transferTaxPct: 5.8, hearings: 577 },
  { code: "gb", name: "England / UK (12 Regionen · RICS Auctions)", country: "GB", transferTaxPct: 5.0, hearings: 785 },
  { code: "nl", name: "Niederlande (12 Provinzen · Executieveilingen)", country: "NL", transferTaxPct: 10.4, hearings: 84 },
  { code: "pl", name: "Polen (16 Woiwodschaften · Licytacje Komornicze)", country: "PL", transferTaxPct: 2.0, hearings: 3085 },
];

/** All 9 Austrian Bundesländer (3.5% GrESt + 1.1% Grundbuchseintragungsgebühr = 4.6%). */
export const AT_STATES: StateSnapshot[] = [
  { code: "at-w", name: "Wien (AT)", country: "AT", transferTaxPct: 4.6, hearings: 102 },
  { code: "at-noe", name: "Niederösterreich (AT)", country: "AT", transferTaxPct: 4.6, hearings: 78 },
  { code: "at-bgld", name: "Burgenland (AT)", country: "AT", transferTaxPct: 4.6, hearings: 14 },
  { code: "at-ooe", name: "Oberösterreich (AT)", country: "AT", transferTaxPct: 4.6, hearings: 23 },
  { code: "at-sbg", name: "Salzburg (AT)", country: "AT", transferTaxPct: 4.6, hearings: 5 },
  { code: "at-stmk", name: "Steiermark (AT)", country: "AT", transferTaxPct: 4.6, hearings: 50 },
  { code: "at-ktn", name: "Kärnten (AT)", country: "AT", transferTaxPct: 4.6, hearings: 23 },
  { code: "at-tir", name: "Tirol (AT)", country: "AT", transferTaxPct: 4.6, hearings: 22 },
  { code: "at-vbg", name: "Vorarlberg (AT)", country: "AT", transferTaxPct: 4.6, hearings: 13 },
];

/** All 26 Swiss Kantone with typical Handänderungssteuer + Grundbuchgebühr in percent. */
export const CH_CANTONS: StateSnapshot[] = [
  { code: "ch-zh", name: "Zürich (CH)", country: "CH", transferTaxPct: 0.2, hearings: 17 },
  { code: "ch-be", name: "Bern (CH)", country: "CH", transferTaxPct: 1.8, hearings: 8 },
  { code: "ch-lu", name: "Luzern (CH)", country: "CH", transferTaxPct: 1.5, hearings: 3 },
  { code: "ch-ur", name: "Uri (CH)", country: "CH", transferTaxPct: 0.3, hearings: 2 },
  { code: "ch-sz", name: "Schwyz (CH)", country: "CH", transferTaxPct: 0.2, hearings: 5 },
  { code: "ch-ow", name: "Obwalden (CH)", country: "CH", transferTaxPct: 1.5, hearings: 1 },
  { code: "ch-nw", name: "Nidwalden (CH)", country: "CH", transferTaxPct: 1.0, hearings: 2 },
  { code: "ch-gl", name: "Glarus (CH)", country: "CH", transferTaxPct: 0.3, hearings: 2 },
  { code: "ch-zg", name: "Zug (CH)", country: "CH", transferTaxPct: 0.2, hearings: 3 },
  { code: "ch-fr", name: "Freiburg (CH)", country: "CH", transferTaxPct: 1.5, hearings: 7 },
  { code: "ch-so", name: "Solothurn (CH)", country: "CH", transferTaxPct: 2.2, hearings: 8 },
  { code: "ch-bs", name: "Basel-Stadt (CH)", country: "CH", transferTaxPct: 3.0, hearings: 1 },
  { code: "ch-bl", name: "Basel-Landschaft (CH)", country: "CH", transferTaxPct: 2.5, hearings: 4 },
  { code: "ch-sh", name: "Schaffhausen (CH)", country: "CH", transferTaxPct: 0.4, hearings: 1 },
  { code: "ch-ar", name: "Appenzell Ausserrhoden (CH)", country: "CH", transferTaxPct: 2.0, hearings: 1 },
  { code: "ch-ai", name: "Appenzell Innerrhoden (CH)", country: "CH", transferTaxPct: 1.0, hearings: 1 },
  { code: "ch-sg", name: "St. Gallen (CH)", country: "CH", transferTaxPct: 1.0, hearings: 5 },
  { code: "ch-gr", name: "Graubünden (CH)", country: "CH", transferTaxPct: 2.0, hearings: 2 },
  { code: "ch-ag", name: "Aargau (CH)", country: "CH", transferTaxPct: 0.4, hearings: 13 },
  { code: "ch-tg", name: "Thurgau (CH)", country: "CH", transferTaxPct: 1.0, hearings: 8 },
  { code: "ch-ti", name: "Tessin (CH)", country: "CH", transferTaxPct: 1.1, hearings: 36 },
  { code: "ch-vd", name: "Waadt (CH)", country: "CH", transferTaxPct: 2.2, hearings: 25 },
  { code: "ch-vs", name: "Wallis (CH)", country: "CH", transferTaxPct: 1.5, hearings: 8 },
  { code: "ch-ne", name: "Neuenburg (CH)", country: "CH", transferTaxPct: 3.3, hearings: 3 },
  { code: "ch-ge", name: "Genf (CH)", country: "CH", transferTaxPct: 3.0, hearings: 2 },
  { code: "ch-ju", name: "Jura (CH)", country: "CH", transferTaxPct: 2.1, hearings: 2 },
];

export const IT_REGIONS: StateSnapshot[] = [
  { code: "it-lom", name: "Lombardei (IT)", country: "IT", transferTaxPct: 9.0, hearings: 211 },
  { code: "it-laz", name: "Latium / Rom (IT)", country: "IT", transferTaxPct: 9.0, hearings: 229 },
  { code: "it-ven", name: "Venetien (IT)", country: "IT", transferTaxPct: 9.0, hearings: 19 },
  { code: "it-pie", name: "Piemont (IT)", country: "IT", transferTaxPct: 9.0, hearings: 287 },
  { code: "it-emr", name: "Emilia-Romagna (IT)", country: "IT", transferTaxPct: 9.0, hearings: 76 },
  { code: "it-tos", name: "Toskana (IT)", country: "IT", transferTaxPct: 9.0, hearings: 151 },
  { code: "it-cam", name: "Kampanien (IT)", country: "IT", transferTaxPct: 9.0, hearings: 101 },
  { code: "it-sic", name: "Sizilien (IT)", country: "IT", transferTaxPct: 9.0, hearings: 432 },
  { code: "it-pug", name: "Apulien (IT)", country: "IT", transferTaxPct: 9.0, hearings: 158 },
  { code: "it-lig", name: "Ligurien (IT)", country: "IT", transferTaxPct: 9.0, hearings: 23 },
  { code: "it-sar", name: "Sardinien (IT)", country: "IT", transferTaxPct: 9.0, hearings: 83 },
  { code: "it-taa", name: "Südtirol / Trentino (IT)", country: "IT", transferTaxPct: 9.0, hearings: 1 },
  { code: "it-fvg", name: "Friaul-Julisch Venetien (IT)", country: "IT", transferTaxPct: 9.0, hearings: 9 },
  { code: "it-mar", name: "Marken (IT)", country: "IT", transferTaxPct: 9.0, hearings: 68 },
  { code: "it-abr", name: "Abruzzen (IT)", country: "IT", transferTaxPct: 9.0, hearings: 123 },
  { code: "it-umb", name: "Umbrien (IT)", country: "IT", transferTaxPct: 9.0, hearings: 38 },
  { code: "it-cal", name: "Kalabrien (IT)", country: "IT", transferTaxPct: 9.0, hearings: 145 },
  { code: "it-bas", name: "Basilikata (IT)", country: "IT", transferTaxPct: 9.0, hearings: 67 },
  { code: "it-mol", name: "Molise (IT)", country: "IT", transferTaxPct: 9.0, hearings: 11 },
  { code: "it-vda", name: "Aostatal (IT)", country: "IT", transferTaxPct: 9.0, hearings: 5 },
];

export const ES_REGIONS: StateSnapshot[] = [
  { code: "es-md", name: "Madrid (ES)", country: "ES", transferTaxPct: 6.0, hearings: 107 },
  { code: "es-ct", name: "Katalonien (ES)", country: "ES", transferTaxPct: 10.0, hearings: 200 },
  { code: "es-an", name: "Andalusien (ES)", country: "ES", transferTaxPct: 7.0, hearings: 189 },
  { code: "es-vc", name: "Valencia (ES)", country: "ES", transferTaxPct: 10.0, hearings: 163 },
  { code: "es-ib", name: "Balearen / Mallorca (ES)", country: "ES", transferTaxPct: 8.0, hearings: 18 },
  { code: "es-cn", name: "Kanarische Inseln (ES)", country: "ES", transferTaxPct: 6.5, hearings: 39 },
  { code: "es-pv", name: "Baskenland (ES)", country: "ES", transferTaxPct: 4.0, hearings: 22 },
  { code: "es-ga", name: "Galicien (ES)", country: "ES", transferTaxPct: 8.0, hearings: 25 },
  { code: "es-cl", name: "Kastilien und León (ES)", country: "ES", transferTaxPct: 8.0, hearings: 43 },
  { code: "es-cm", name: "Kastilien-La Mancha (ES)", country: "ES", transferTaxPct: 9.0, hearings: 42 },
  { code: "es-mc", name: "Murcia (ES)", country: "ES", transferTaxPct: 8.0, hearings: 59 },
  { code: "es-ar", name: "Aragonien (ES)", country: "ES", transferTaxPct: 8.0, hearings: 29 },
  { code: "es-as", name: "Asturien (ES)", country: "ES", transferTaxPct: 8.0, hearings: 19 },
  { code: "es-ex", name: "Extremadura (ES)", country: "ES", transferTaxPct: 8.0, hearings: 10 },
  { code: "es-nc", name: "Navarra (ES)", country: "ES", transferTaxPct: 6.0, hearings: 11 },
  { code: "es-cb", name: "Kantabrien (ES)", country: "ES", transferTaxPct: 9.0, hearings: 16 },
  { code: "es-ri", name: "La Rioja (ES)", country: "ES", transferTaxPct: 7.0, hearings: 7 },
];

export const FR_REGIONS: StateSnapshot[] = [
  { code: "fr-idf", name: "Île-de-France / Paris (FR)", country: "FR", transferTaxPct: 5.8, hearings: 110 },
  { code: "fr-paca", name: "Provence-Alpes-Côte d'Azur (FR)", country: "FR", transferTaxPct: 5.8, hearings: 90 },
  { code: "fr-ara", name: "Auvergne-Rhône-Alpes (FR)", country: "FR", transferTaxPct: 5.8, hearings: 56 },
  { code: "fr-naq", name: "Nouvelle-Aquitaine (FR)", country: "FR", transferTaxPct: 5.8, hearings: 55 },
  { code: "fr-occ", name: "Okzitanien (FR)", country: "FR", transferTaxPct: 5.8, hearings: 60 },
  { code: "fr-hdf", name: "Hauts-de-France (FR)", country: "FR", transferTaxPct: 5.8, hearings: 47 },
  { code: "fr-ges", name: "Grand Est / Elsass (FR)", country: "FR", transferTaxPct: 5.8, hearings: 29 },
  { code: "fr-bre", name: "Bretagne (FR)", country: "FR", transferTaxPct: 5.8, hearings: 25 },
  { code: "fr-nor", name: "Normandie (FR)", country: "FR", transferTaxPct: 5.8, hearings: 30 },
  { code: "fr-pdl", name: "Pays de la Loire (FR)", country: "FR", transferTaxPct: 5.8, hearings: 24 },
  { code: "fr-bfc", name: "Burgund-Franche-Comté (FR)", country: "FR", transferTaxPct: 5.8, hearings: 22 },
  { code: "fr-cvl", name: "Centre-Val de Loire (FR)", country: "FR", transferTaxPct: 5.8, hearings: 29 },
  { code: "fr-cor", name: "Korsika (FR)", country: "FR", transferTaxPct: 5.8, hearings: 2 },
];

export const GB_REGIONS: StateSnapshot[] = [
  { code: "gb-lon", name: "Greater London (UK)", country: "GB", transferTaxPct: 5.0, hearings: 26 },
  { code: "gb-see", name: "South East England (UK)", country: "GB", transferTaxPct: 5.0, hearings: 79 },
  { code: "gb-swe", name: "South West England (UK)", country: "GB", transferTaxPct: 5.0, hearings: 72 },
  { code: "gb-wmd", name: "West Midlands (UK)", country: "GB", transferTaxPct: 5.0, hearings: 68 },
  { code: "gb-emd", name: "East Midlands (UK)", country: "GB", transferTaxPct: 5.0, hearings: 142 },
  { code: "gb-nwe", name: "North West England (UK)", country: "GB", transferTaxPct: 5.0, hearings: 132 },
  { code: "gb-yrk", name: "Yorkshire & Humber (UK)", country: "GB", transferTaxPct: 5.0, hearings: 146 },
  { code: "gb-ee", name: "East of England (UK)", country: "GB", transferTaxPct: 5.0, hearings: 41 },
  { code: "gb-nee", name: "North East England (UK)", country: "GB", transferTaxPct: 5.0, hearings: 47 },
  { code: "gb-sct", name: "Schottland (UK)", country: "GB", transferTaxPct: 4.5, hearings: 11 },
  { code: "gb-wls", name: "Wales (UK)", country: "GB", transferTaxPct: 4.5, hearings: 20 },
  { code: "gb-nir", name: "Nordirland (UK)", country: "GB", transferTaxPct: 5.0, hearings: 1 },
];

export const NL_REGIONS: StateSnapshot[] = [
  { code: "nl-nh", name: "Noord-Holland (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-zh", name: "Zuid-Holland (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-nb", name: "Noord-Brabant (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-ge", name: "Gelderland (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-ut", name: "Utrecht (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-ov", name: "Overijssel (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-li", name: "Limburg (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-fr", name: "Friesland (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-gr", name: "Groningen (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-dr", name: "Drenthe (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-fl", name: "Flevoland (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
  { code: "nl-ze", name: "Zeeland (NL)", country: "NL", transferTaxPct: 10.4, hearings: 0 },
];

export const PL_REGIONS: StateSnapshot[] = [
  { code: "pl-mz", name: "Mazowieckie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-sl", name: "Śląskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-ma", name: "Małopolskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-wp", name: "Wielkopolskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-ds", name: "Dolnośląskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-pm", name: "Pomorskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-ld", name: "Łódzkie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-kp", name: "Kujawsko-Pomorskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-zp", name: "Zachodniopomorskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-lu", name: "Lubelskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-pk", name: "Podkarpackie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-wn", name: "Warmińsko-Mazurskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-lb", name: "Lubuskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-pd", name: "Podlaskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-sk", name: "Świętokrzyskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
  { code: "pl-op", name: "Opolskie (PL)", country: "PL", transferTaxPct: 2.0, hearings: 0 },
];

export const DACH_STATES: StateSnapshot[] = [
  ...STATES.filter((s) => s.country === "DE"),
  ...AT_STATES,
  ...CH_CANTONS,
  ...IT_REGIONS,
  ...ES_REGIONS,
  ...FR_REGIONS,
  ...GB_REGIONS,
  ...NL_REGIONS,
  ...PL_REGIONS,
];

export type SegmentKey = "house" | "apartment" | "land" | "commercial" | "multiFamily" | "farmland" | "other";

export interface TickerEntry {
  court: string;
  segment: SegmentKey;
  state: StateCode;
  /** Hearing date, ISO */
  date: string;
}

/** Real hearings from the snapshot — values deliberately left out (access only). */
export const TICKER_ENTRIES: TickerEntry[] = [
  { court: "Cloppenburg", segment: "other", state: "ni", date: "2026-10-15" },
  { court: "Leopoldstadt (Wien)", segment: "apartment", state: "at-w", date: "2026-11-03" },
  { court: "Dorneck-Thierstein (SO)", segment: "house", state: "ch-so", date: "2027-01-29" },
  { court: "Blomberg", segment: "house", state: "nw", date: "2026-10-14" },
  { court: "Leipzig", segment: "commercial", state: "sn", date: "2026-11-10" },
  { court: "Solingen", segment: "apartment", state: "nw", date: "2026-11-25" },
  { court: "Baden (NÖ)", segment: "house", state: "at-noe", date: "2026-11-18" },
  { court: "Lugano (TI)", segment: "apartment", state: "ch-ti", date: "2026-11-19" },
  { court: "Regensburg", segment: "house", state: "by", date: "2026-09-10" },
  { court: "Gelsenkirchen", segment: "apartment", state: "nw", date: "2026-11-24" },
  { court: "Graz-Ost", segment: "multiFamily", state: "at-stmk", date: "2026-11-12" },
  { court: "Neuwied", segment: "house", state: "rp", date: "2026-10-30" },
  { court: "Zürich", segment: "apartment", state: "ch-zh", date: "2026-11-26" },
  { court: "Bad Hersfeld", segment: "house", state: "he", date: "2026-11-11" },
  { court: "Dortmund", segment: "multiFamily", state: "nw", date: "2026-11-24" },
  { court: "Crailsheim", segment: "other", state: "bw", date: "2026-09-07" },
];
