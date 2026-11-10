import { Metadata } from "next";
import { BELOWMARK_ORIGIN, DEFAULT_BLOG_OG } from "@/lib/blog/blogSeo";
import { MetaTagService } from "@/services/MetaTagService";
import { EuMarketLocationEntry } from "@/types/pseo.types";

export type SwissAltLang = "fr" | "it";

export const SWISS_HUB_PATHS = {
  de: "/schweiz/shab-versteigerungen",
  fr: "/fr/suisse/ventes-aux-encheres-shab",
  it: "/it/svizzera/aste-ufficio-esecuzione-fosc",
} as const;

export function buildSwissAlternates(subSlug?: string) {
  const suffix = subSlug ? `/${subSlug}` : "";
  return {
    canonical: `${BELOWMARK_ORIGIN}${SWISS_HUB_PATHS.de}${suffix}`,
    languages: {
      "de-CH": `${BELOWMARK_ORIGIN}${SWISS_HUB_PATHS.de}${suffix}`,
      "fr-CH": `${BELOWMARK_ORIGIN}${SWISS_HUB_PATHS.fr}${suffix}`,
      "it-CH": `${BELOWMARK_ORIGIN}${SWISS_HUB_PATHS.it}${suffix}`,
      "x-default": `${BELOWMARK_ORIGIN}${SWISS_HUB_PATHS.de}${suffix}`,
    },
  };
}

const CANTON_NAMES: Record<string, { fr: string; it: string }> = {
  genf: { fr: "Genève", it: "Ginevra" },
  waadt: { fr: "Vaud (Lausanne)", it: "Vaud (Losanna)" },
  wallis: { fr: "Valais", it: "Vallese" },
  freiburg: { fr: "Fribourg", it: "Friburgo" },
  neuenburg: { fr: "Neuchâtel", it: "Neuchâtel" },
  jura: { fr: "Jura", it: "Giura" },
  bern: { fr: "Berne", it: "Berna" },
  zuerich: { fr: "Zurich", it: "Zurigo" },
  tessin: { fr: "Tessin (Lugano)", it: "Ticino (Lugano / Bellinzona)" },
  graubuenden: { fr: "Grisons", it: "Grigioni" },
  "basel-stadt": { fr: "Bâle-Ville", it: "Basilea Città" },
  "basel-landschaft": { fr: "Bâle-Campagne", it: "Basilea Campagna" },
  luzern: { fr: "Lucerne", it: "Lucerna" },
  "st-gallen": { fr: "Saint-Gall", it: "San Gallo" },
  aargau: { fr: "Argovie", it: "Argovia" },
  thurgau: { fr: "Thurgovie", it: "Turgovia" },
  solothurn: { fr: "Soleure", it: "Soletta" },
  zug: { fr: "Zoug", it: "Zugo" },
  schaffhausen: { fr: "Schaffhouse", it: "Sciaffusa" },
};

export function localizeSwissEntryName(slug: string, fallbackName: string, lang: SwissAltLang): string {
  return CANTON_NAMES[slug]?.[lang] ?? fallbackName;
}

export interface SwissLangCopy {
  hubPath: string;
  eyebrow: string;
  hubTitle: (total: number) => string;
  hubLead: string;
  hubMetaTitle: (total: number) => string;
  hubMetaDesc: (total: number) => string;
  entryTitle: (name: string, count: number) => string;
  entryLead: (name: string, count: number, taxPct: number) => string;
  entryMetaTitle: (name: string, count: number) => string;
  entryMetaDesc: (name: string, count: number, taxPct: number) => string;
  ctaPrimary: string;
  ctaCalc: string;
  ctaSearch: string;
  cantonsHeading: string;
  listingsHeading: string;
  citiesHeading: string;
  officesHeading: string;
  backToHub: string;
  statLots: string;
  statCantons: string;
  statCities: string;
  taxLabel: string;
  faqs: Array<{ q: string; a: string }>;
}

export const SWISS_MULTILANG_COPY: Record<SwissAltLang, SwissLangCopy> = {
  fr: {
    hubPath: SWISS_HUB_PATHS.fr,
    eyebrow: "SUISSE ROMANDE & 26 CANTONS · FOSC / SHAB · LP ART. 126",
    hubTitle: (n) => `Ventes aux enchères immobilières en Suisse (FOSC / Offices des poursuites) — ${n} publications actives`,
    hubLead:
      "Répertoire en direct des ventes aux enchères forcées des Offices des poursuites et des faillites (LP / FOSC) à Genève, Vaud (Lausanne), Valais, Fribourg, Neuchâtel, Jura et dans les 26 cantons suisses en CHF.",
    hubMetaTitle: (n) => `Ventes aux enchères immobilières Suisse (FOSC / Poursuites): ${n} biens en CHF`,
    hubMetaDesc: (n) =>
      `${n} ventes aux enchères immobilières officielles des Offices des poursuites et faillites (FOSC/SHAB) à Genève, Vaud, Valais, Fribourg et dans toute la Suisse.`,
    entryTitle: (name, n) => `Ventes aux enchères Office des poursuites ${name} — ${n} biens actifs (CHF)`,
    entryLead: (name, n, tax) =>
      `${n} réalisations forcées d'immeubles publiées dans la FOSC pour ${name}. Estimation officielle, état des charges, principe de couverture (art. 126 LP) et droits de mutation env. ${tax} %.`,
    entryMetaTitle: (name, n) => `Enchères immobilières ${name} (Office des poursuites / FOSC) · ${n} biens`,
    entryMetaDesc: (name, n, tax) =>
      `Consultez ${n} ventes aux enchères forcées des poursuites et faillites à ${name} (Suisse). Estimation en CHF, PDF officiel FOSC et droits de mutation (${tax} %).`,
    ctaPrimary: "Débloquer 1 dossier gratuit (sans carte) →",
    ctaCalc: "Calculateur LP / Droits de mutation (CHF)",
    ctaSearch: "Rechercher en Suisse (CHF)",
    cantonsHeading: "Les 26 cantons suisses (Suisse romande, alémanique & Tessin)",
    listingsHeading: "Prochaines ventes aux enchères FOSC / Offices des poursuites",
    citiesHeading: "Villes et communes suisses actives",
    officesHeading: "Offices des poursuites et des faillites",
    backToHub: "← Toutes les enchères en Suisse (FOSC)",
    statLots: "Publications FOSC",
    statCantons: "Cantons",
    statCities: "Communes",
    taxLabel: "Mutation",
    faqs: [
      {
        q: "Comment fonctionne une vente aux enchères de l'Office des poursuites en Suisse (LP) ?",
        a: "Selon la Loi fédérale sur la poursuite pour dettes et la faillite (art. 125 ss LP), l'immeuble est adjugé au plus offrant si l'offre dépasse les créances garanties par gage préférables au poursuivant (principe de couverture, art. 126 LP).",
      },
      {
        q: "Quel acompte faut-il prévoir le jour des enchères ?",
        a: "Les conditions de vente exigent généralement un acompte immédiat de 10 % à 20 % (chèque bancaire d'une banque suisse ou virement préalable) ainsi qu'une attestation de financement.",
      },
    ],
  },
  it: {
    hubPath: SWISS_HUB_PATHS.it,
    eyebrow: "SVIZZERA ITALIANA (TICINO / GRIGIONI) & 26 CANTONI · FUSC / LEF",
    hubTitle: (n) => `Aste immobiliari Ufficio esecuzione e fallimenti in Svizzera (FUSC) — ${n} incanti attivi`,
    hubLead:
      "Elenco aggiornato degli incanti immobiliari ufficiali degli Uffici d'esecuzione e dei fallimenti (LEF / FUSC) in Ticino (Lugano, Bellinzona, Locarno, Mendrisio), Grigioni e in tutti i 26 cantoni svizzeri in CHF.",
    hubMetaTitle: (n) => `Aste immobiliari Svizzera & Ticino (Ufficio esecuzione / FUSC): ${n} immobili`,
    hubMetaDesc: (n) =>
      `${n} aste immobiliari ufficiali degli Uffici d'esecuzione e fallimenti (FUSC/SHAB) in Ticino, Grigioni e in tutti i 26 cantoni svizzeri con stima in CHF.`,
    entryTitle: (name, n) => `Aste immobiliari Ufficio esecuzione ${name} — ${n} incanti attivi (CHF)`,
    entryLead: (name, n, tax) =>
      `${n} aste forzate immobiliari pubblicate nel FUSC per ${name}. Stima peritale, elenco oneri, principio di copertura (art. 126 LEF) e imposta di trapasso ca. ${tax} %.`,
    entryMetaTitle: (name, n) => `Aste immobiliari ${name} (Ufficio esecuzione / FUSC) · ${n} incanti`,
    entryMetaDesc: (name, n, tax) =>
      `Scopri ${n} incanti immobiliari ufficiali dell'Ufficio esecuzione e fallimenti a ${name} (Svizzera). Valore di stima in CHF, PDF FUSC e imposta (${tax} %).`,
    ctaPrimary: "Sblocca 1 dossier gratuito (senza carta) →",
    ctaCalc: "Calcolatore LEF / Imposta cantonale (CHF)",
    ctaSearch: "Cerca aste in Svizzera (CHF)",
    cantonsHeading: "Tutti i 26 cantoni svizzeri (Ticino, Grigioni, Romandia e Svizzera tedesca)",
    listingsHeading: "Prossimi incanti immobiliari FUSC / Uffici esecuzione",
    citiesHeading: "Comuni e città svizzere attive",
    officesHeading: "Uffici d'esecuzione e dei fallimenti",
    backToHub: "← Tutte le aste in Svizzera (FUSC)",
    statLots: "Incanti FUSC",
    statCantons: "Cantoni",
    statCities: "Comuni",
    taxLabel: "Imposta",
    faqs: [
      {
        q: "Come funziona un'asta immobiliare dell'Ufficio esecuzione in Ticino e Svizzera (LEF)?",
        a: "Secondo l'art. 126 LEF (Legge federale sulla esecuzione e sul fallimento), l'immobile viene deliberato al miglior offerente se l'offerta supera i crediti garantiti da pegno poziori rispetto al creditore procedente (principio di copertura).",
      },
      {
        q: "Quale cauzione è richiesta per partecipare all'incanto?",
        a: "Le condizioni d'incanto prevedono di norma un acconto immediato del 10 %–20 % tramite assegno bancario di una banca svizzera o bonifico anticipato sul conto dell'Ufficio.",
      },
    ],
  },
};

export function buildSwissMultilangMetadata(params: {
  lang: SwissAltLang;
  totalCount: number;
  entry?: EuMarketLocationEntry;
}): Metadata {
  const { lang, totalCount, entry } = params;
  const copy = SWISS_MULTILANG_COPY[lang];
  const canonicalPath = entry ? `${copy.hubPath}/${entry.slug}` : copy.hubPath;
  const alts = buildSwissAlternates(entry?.slug);
  const locName = entry ? localizeSwissEntryName(entry.slug, entry.name, lang) : "Suisse / Svizzera";

  const title = entry ? copy.entryMetaTitle(locName, entry.totalCount) : copy.hubMetaTitle(totalCount);
  const description = entry
    ? copy.entryMetaDesc(locName, entry.totalCount, entry.transferTaxPct)
    : copy.hubMetaDesc(totalCount);

  return {
    ...MetaTagService.CreateMetaTags({
      title,
      description,
      imgUrl: DEFAULT_BLOG_OG,
      tags: [locName, "FOSC", "FUSC", "SHAB", "CHF", "Belowmark"],
      url: `${BELOWMARK_ORIGIN}${canonicalPath}`,
    }),
    alternates: {
      canonical: `${BELOWMARK_ORIGIN}${canonicalPath}`,
      languages: alts.languages,
    },
  };
}
