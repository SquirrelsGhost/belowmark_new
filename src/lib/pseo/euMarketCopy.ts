import { EuMarketLocationEntry, EuPseoMarketCode } from "@/types/pseo.types";

function fmtMinEntry(e: EuMarketLocationEntry, ratio: number, locale: string, currency: "EUR" | "CHF" | "GBP" | "PLN"): string {
  if (!e.minAppraisedValue || e.minAppraisedValue < 15000) return "";
  const val = Math.round(e.minAppraisedValue * ratio);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    useGrouping: "always",
  }).format(val);
}

export interface EuMarketCopyConfig {
  hubEyebrow: string;
  hubTitle: (total: number, regionCount: number, courtCount: number) => string;
  hubLead: string;
  hubMetaTitle: (total: number, regionCount: number) => string;
  hubMetaDesc: (total: number, regionCount: number) => string;
  calcButtonLabel: string;
  ctaButtonLabel: string;
  regionsHeading: (count: number) => string;
  citiesHeading: (count: number) => string;
  courtsHeading: (count: number) => string;
  listingsHeading: string;
  faqHeading: string;
  valueLabel: string;
  minBidLabel: string;
  depositLabel: string;
  thresholdLabel: string;
  taxLabel: string;
  repairLabel: string;
  totalCostLabel: string;
  discountLabel: string;
  defaultValue: number;
  defaultTaxPct: number;
  defaultRepair: number;
  minBidRatio: number;
  thresholdRatio: number;
  depositRatio: number;
  courtFeeRatio: number;
  calcPageTitle: string;
  calcPageLead: string;
  calcMetaTitle: string;
  calcMetaDesc: string;
  faqs: ReadonlyArray<{ q: string; a: string }>;
  entryTitle: (e: EuMarketLocationEntry) => string;
  entryLead: (e: EuMarketLocationEntry) => string;
  entryMetaTitle: (e: EuMarketLocationEntry) => string;
  entryMetaDesc: (e: EuMarketLocationEntry) => string;
}

export const EU_MARKET_COPY: Record<EuPseoMarketCode, EuMarketCopyConfig> = {
  AT: {
    hubEyebrow: "ÖSTERREICH · EDIKTSDATEI DER JUSTIZ · 9 BUNDESLÄNDER",
    hubTitle: (total, rCount, cCount) =>
      `Zwangsversteigerung Österreich (Ediktsdatei): Alle ${rCount} Bundesländer, ${cCount} Bezirksgerichte & ${total} Termine`,
    hubLead:
      "Tagesaktuelles Verzeichnis aller gerichtlichen Liegenschaftsversteigerungen (Exekutionsordnung EO) aus der amtlichen Ediktsdatei der österreichischen Justiz — inklusive Schätzwert (§ 140 EO), Geringstem Gebot (50 % nach § 151 EO), 10 % Vadium (§ 147 EO) und 3/4-Überbotsgrenze (§ 195 EO).",
    hubMetaTitle: (total) =>
      `Zwangsversteigerung Österreich (Ediktsdatei): ${total} Termine`,
    hubMetaDesc: (total, rCount) =>
      `Alle ${total} gerichtlichen Zwangsversteigerungen in Österreich (${rCount} Bundesländer, Ediktsdatei Justiz): Schätzwert, 50 % Geringstes Gebot (§ 151 EO) & Vadium.`,
    calcButtonLabel: "🧮 Kostenloser Österreich Edikte-Rechner (Geringstes Gebot & 10 % Vadium) →",
    ctaButtonLabel: "🎁 1 Gratis-Dossier: Edikt, Langgutachten & PDF kostenlos öffnen →",
    regionsHeading: (c) => `Alle ${c} österreichischen Bundesländer (Ediktsdatei)`,
    citiesHeading: (c) => `Städte & Gemeinden in Österreich (${c} Orte)`,
    courtsHeading: (c) => `Österreichische Bezirksgerichte (${c} Gerichte)`,
    listingsHeading: "Aktuelle Versteigerungsedikte & Liegenschaften",
    faqHeading: "Häufig gestellte Fragen zur Zwangsversteigerung in Österreich (EO)",
    valueLabel: "Gerichtlicher Schätzwert (§ 140 EO in EUR)",
    minBidLabel: "Geringstes Gebot (50 % nach § 151 EO)",
    depositLabel: "10 % Vadium / Sicherheitsleistung (§ 147 EO)",
    thresholdLabel: "3/4-Überbotsgrenze (75 % nach § 195 EO)",
    taxLabel: "Grunderwerbsteuer (3,5 %) + Grundbuch (1,1 %) = 4,6 %",
    repairLabel: "Geplantes Sanierungs- & Räumungsbudget (EUR)",
    totalCostLabel: "Gesamtkapitalbedarf bei 75 % Gebot inkl. Gebühren",
    discountLabel: "Rechnerischer Abschlag beim Geringsten Gebot (50 %)",
    defaultValue: 340000,
    defaultTaxPct: 4.6,
    defaultRepair: 25000,
    minBidRatio: 0.5,
    thresholdRatio: 0.75,
    depositRatio: 0.1,
    courtFeeRatio: 0.012,
    calcPageTitle: "Zwangsversteigerung Österreich Rechner: Geringstes Gebot (§ 151 EO), 10 % Vadium & Überbot",
    calcPageLead:
      "Berechnen Sie für jede Liegenschaft aus der österreichischen Ediktsdatei das Geringste Gebot (50 % des Schätzwerts nach § 151 EO), das verpflichtende 10 % Vadium (§ 147 EO als Sparbuch/Bankgarantie), die 3/4-Überbotsgrenze (§ 195 EO) sowie 3,5 % Grunderwerbsteuer und 1,1 % Grundbuchseintragungsgebühr.",
    calcMetaTitle: "Ediktsdatei Rechner Österreich: § 151 EO & 10 % Vadium",
    calcMetaDesc:
      "Kostenloser Rechner für gerichtliche Versteigerungen (Ediktsdatei Österreich): 50 % Geringstes Gebot (§ 151 EO), 10 % Vadium (§ 147 EO) & 3/4-Überbot.",
    faqs: [
      {
        q: "Wie hoch ist das Geringste Gebot bei einer Zwangsversteigerung in Österreich?",
        a: "Nach § 151 Abs. 1 der österreichischen Exekutionsordnung (EO) beträgt das Geringste Gebot bei Häusern und Eigentumswohnungen in der Regel die Hälfte (50 %) des gerichtlich festgesetzten Schätzwerts. Unter diesem Betrag darf der Zuschlag nicht erteilt werden.",
      },
      {
        q: "Was ist das Vadium (§ 147 EO) und wie muss es beim Bezirksgericht hinterlegt werden?",
        a: "Jeder Bieter muss im Versteigerungstermin eine Sicherheitsleistung (Vadium) in Höhe von 10 % des Schätzwerts vorweisen — in Österreich typischerweise durch eine Sparurkunde (Sparbuch) oder Bankgarantie. Bargeld ist im Gerichtssaal ausgeschlossen.",
      },
      {
        q: "Was bedeutet die 3/4-Grenze für ein Überbot (§ 195 EO)?",
        a: "Erreicht das Meistgebot im Termin nicht mindestens 75 % (drei Viertel) des Schätzwerts, kann innerhalb von 14 Tagen ab Bekanntmachung des Zuschlags beim Exekutionsgericht ein Überbot abgegeben werden, das mindestens ein Viertel höher ist als das Meistgebot. Ab 75 % des Schätzwerts ist ein Überbot ausgeschlossen.",
      },
    ],
    entryTitle: (e) =>
      e.kind === "court"
        ? `${e.name}: ${e.totalCount} aktuelle Zwangsversteigerungen & Edikte`
        : `Zwangsversteigerung ${e.name} (Ediktsdatei Österreich): ${e.totalCount} aktuelle Liegenschaften & Termine`,
    entryLead: (e) =>
      `Amtlich veröffentlichte gerichtliche Immobilienversteigerungen (Edikte) für ${e.name} (${e.nativeRegionName}) — mit Schätzwert (§ 140 EO), 50 % Geringstem Gebot (§ 151 EO), 10 % Vadium (§ 147 EO) und ${e.transferTaxPct} % Kaufnebenkosten.`,
    entryMetaTitle: (e) => {
      const low = fmtMinEntry(e, 0.5, "de-AT", "EUR");
      if (e.kind === "court") {
        const bgShort = e.name.startsWith("Bezirksgericht ") ? ` (BG ${e.name.slice(15)})` : "";
        const withBg = `${e.name}${bgShort}: ${e.totalCount} Edikte & Termine${low ? ` ab ${low}` : ""}`;
        if (withBg.length <= 65) return withBg;
        return `${e.name}: ${e.totalCount} Edikte & Versteigerungen${low ? ` ab ${low}` : ""}`;
      }
      return `Zwangsversteigerung ${e.name}: ${e.totalCount} Edikte${low ? ` ab ${low}` : ""}`;
    },
    entryMetaDesc: (e) => {
      const low = fmtMinEntry(e, 0.5, "de-AT", "EUR");
      if (e.kind === "court") {
        const bgShort = e.name.startsWith("Bezirksgericht ") ? ` (BG ${e.name.slice(15)})` : "";
        return `Alle ${e.totalCount} aktuellen Zwangsversteigerungen & Edikte am ${e.name}${bgShort}${low ? ` ab ${low} (50 % § 151 EO)` : ""} — Schätzwert, 10 % Vadium & Gutachten.`;
      }
      return `Aktuelle Zwangsversteigerungen (Ediktsdatei) in ${e.name}: ${e.totalCount} Liegenschaften${low ? ` ab ${low} (50 % § 151 EO)` : ""} inkl. Schätzwert, Vadium & Gutachten.`;
    },
  },
  CH: {
    hubEyebrow: "SCHWEIZ · SHAB & BETREIBUNGSÄMTER · 26 KANTONE",
    hubTitle: (total, rCount, cCount) =>
      `Betreibungsamtliche Grundstücksteigerungen Schweiz (SHAB): Alle ${rCount} Kantone, ${cCount} Ämter & ${total} Auktionen`,
    hubLead:
      "Zentrales Verzeichnis aller im Schweizerischen Handelsamtsblatt (SHAB / FOSC / FUSC) publizierten betreibungs- und konkursamtlichen Grundstücksteigerungen nach SchKG aus allen 26 Kantonen — mit betreibungsamtlicher Schätzung (CHF), Deckungsprinzip (Art. 126 / 142a SchKG), Sicherheitsleistung und kantonaler Handänderungssteuer.",
    hubMetaTitle: (total) =>
      `Zwangsversteigerung & Grundstücksteigerung Schweiz: ${total} SHAB-Termine`,
    hubMetaDesc: (total, rCount) =>
      `Alle ${total} betreibungsamtlichen Grundstücksteigerungen & Zwangsversteigerungen in der Schweiz (${rCount} Kantone, SHAB / SchKG): Schätzung in CHF & Termine.`,
    calcButtonLabel: "🧮 Kostenloser Schweiz SchKG-Steigerungsrechner (CHF & Kantonssteuer) →",
    ctaButtonLabel: "🎁 1 Gratis-Dossier: SHAB-Publikation, Lastenverzeichnis & PDF öffnen →",
    regionsHeading: (c) => `Alle ${c} Schweizer Kantone (SHAB Grundstücksteigerungen)`,
    citiesHeading: (c) => `Städte & Gemeinden in der Schweiz (${c} Orte)`,
    courtsHeading: (c) => `Betreibungs- & Konkursämter (${c} Ämter)`,
    listingsHeading: "Aktuelle SHAB-Grundstücksteigerungen (CHF)",
    faqHeading: "Häufig gestellte Fragen zu Grundstücksteigerungen in der Schweiz (SchKG)",
    valueLabel: "Betreibungsamtliche Schätzung (SchKG in CHF)",
    minBidLabel: "Kalkulatorischer Einstieg 2. Steigerung (ca. 60 %)",
    depositLabel: "Typische Anzahlung / Bankcheck am Steigerungstag (10 %)",
    thresholdLabel: "Richtwert 1. Steigerung / Deckungsprinzip (75 %)",
    taxLabel: "Kantonale Handänderungssteuer + Grundbuchgebühr (%)",
    repairLabel: "Geplantes Renovationsbudget (CHF)",
    totalCostLabel: "Gesamtkapitalbedarf in CHF inkl. Gebühren & Renovation",
    discountLabel: "Rechnerischer Marktabschlag in CHF",
    defaultValue: 780000,
    defaultTaxPct: 1.5,
    defaultRepair: 45000,
    minBidRatio: 0.6,
    thresholdRatio: 0.75,
    depositRatio: 0.1,
    courtFeeRatio: 0.005,
    calcPageTitle: "Grundstücksteigerung Schweiz Rechner (SchKG): Betreibungsamtliche Schätzung, Anzahlung & Handänderungssteuer (CHF)",
    calcPageLead:
      "Berechnen Sie für jede im SHAB publizierte Grundstücksteigerung in allen 26 Schweizer Kantonen die erforderliche Anzahlung (Bankcheck einer Schweizer Bank), den kalkulatorischen Einstieg nach dem Deckungsprinzip (Art. 126 / 142a SchKG) sowie die kantonale Handänderungssteuer und Grundbuchgebühr in CHF.",
    calcMetaTitle: "Grundstücksteigerung Schweiz Rechner (SchKG / SHAB) in CHF | Belowmark",
    calcMetaDesc:
      "Kostenloser SchKG-Rechner für betreibungsamtliche Grundstücksteigerungen in der Schweiz (SHAB): Schätzung in CHF, Anzahlung, Deckungsprinzip & kantonale Handänderungssteuer.",
    faqs: [
      {
        q: "Wie funktioniert das Deckungsprinzip (Art. 126 / 142a SchKG) bei Schweizer Grundstücksteigerungen?",
        a: "Bei einer betreibungsamtlichen Versteigerung (Pfändung oder Grundpfandverwertung) wird das Grundstück dem Meistbietenden zugeschlagen, sofern das Angebot die dem betreibenden Gläubiger im Rang vorgehenden Pfandrechte übersteigt (Deckungsprinzip). Im Konkursverfahren (2. Steigerung) erfolgt der Zuschlag oft ohne Mindestpreis ans höchste Gebot.",
      },
      {
        q: "Welche Zahlungsmittel verlangen Schweizer Betreibungsämter für die Anzahlung?",
        a: "Gemäss den Steigerungsbedingungen (die vorab beim Betreibungsamt aufliegen) muss unmittelbar vor dem Zuschlag eine Baranzahlung oder ein Bankcheck einer dem Bundesgesetz über die Banken unterstehenden Schweizer Bank (meist 10 % des Schätzwerts oder ein fixer Mindestbetrag in CHF) vorgelegt werden.",
      },
      {
        q: "Wie hoch ist die Handänderungssteuer beim Erwerb in der Zwangsverwertung?",
        a: "Die Handänderungssteuer und Grundbuchgebühren sind kantonal geregelt und liegen zwischen ca. 0,2 % (z. B. Zürich, Zug, Schwyz — nur Grundbuchgebühr) und bis zu 3,0–3,3 % (z. B. Genf, Basel-Stadt, Neuenburg).",
      },
    ],
    entryTitle: (e) =>
      e.kind === "court"
        ? `${e.name}: ${e.totalCount} aktuelle Grundstücksteigerungen & Zwangsversteigerungen (SHAB)`
        : `Zwangsversteigerung & Grundstücksteigerung ${e.name} (SHAB): ${e.totalCount} aktuelle Termine`,
    entryLead: (e) =>
      `Alle amtlich im SHAB publizierten betreibungs- und konkursamtlichen Immobilien-, Zwangs- und Grundstücksteigerungen für ${e.name} (${e.nativeRegionName}) — mit Schätzung in CHF, Steigerungsbedingungen nach SchKG und ${e.transferTaxPct} % kantonalen Gebühren.`,
    entryMetaTitle: (e) => {
      const low = fmtMinEntry(e, 0.6, "de-CH", "CHF");
      if (e.kind === "court") {
        const full = `${e.name}: ${e.totalCount} Versteigerungen & SHAB-Termine${low ? ` ab ${low}` : ""}`;
        return full.length <= 66 ? full : `${e.name}: ${e.totalCount} SHAB-Versteigerungen${low ? ` ab ${low}` : ""}`;
      }
      const fullCity = `Zwangsversteigerung ${e.name}: ${e.totalCount} SHAB-Steigerungen${low ? ` ab ${low}` : ""}`;
      return fullCity.length <= 66 ? fullCity : `Versteigerung ${e.name}: ${e.totalCount} SHAB-Termine${low ? ` ab ${low}` : ""}`;
    },
    entryMetaDesc: (e) => {
      const low = fmtMinEntry(e, 0.6, "de-CH", "CHF");
      return `Alle ${e.totalCount} aktuellen Zwangsversteigerungen & Grundstücksteigerungen (SHAB / SchKG) für ${e.name}${low ? ` ab ${low}` : ""} — Schätzung in CHF, Termine & 1 Gratis-Dossier.`;
    },
  },
  IT: {
    hubEyebrow: "ITALIA · ASTE GIUDIZIARIE & PORTALE DELLE VENDITE PUBBLICHE (PVP) · 20 REGIONI",
    hubTitle: (total, rCount, cCount) =>
      `Aste Giudiziarie Immobiliari Italia (PVP): Tutte le ${rCount} Regioni, ${cCount} Tribunali e ${total} Lotti Attivi`,
    hubLead:
      "Catalogo completo delle aste giudiziarie immobiliari pubblicate sul Portale delle Vendite Pubbliche (PVP - Ministero della Giustizia) in tutte le 20 regioni italiane — con Prezzo Base d'Asta, Offerta Minima al 75% (art. 571 c.p.c.), Perizia CTU, Cauzione 10% e calcolo delle imposte.",
    hubMetaTitle: (total, rCount) =>
      `Aste Giudiziarie Italia (PVP): ${total} Lotti in ${rCount} Regioni`,
    hubMetaDesc: (total, rCount) =>
      `Tutti i ${total} immobili all'asta giudiziaria in Italia (${rCount} regioni, PVP Giustizia): Prezzo Base, Offerta Minima 75% (art. 571 c.p.c.) e Cauzione 10%.`,
    calcButtonLabel: "🧮 Calcolatore Gratuito Offerta Minima 75% (art. 571 c.p.c.), Cauzione 10% e Imposte →",
    ctaButtonLabel: "🎁 1 Fascicolo Gratis: Sblocca Perizia CTU, R.G.E. & Avviso PDF →",
    regionsHeading: (c) => `Tutte le ${c} Regioni Italiane (Aste Giudiziarie PVP)`,
    citiesHeading: (c) => `Città e Comuni con Aste Attive (${c} Comuni)`,
    courtsHeading: (c) => `Tribunali Ordinari Italiani (${c} Tribunali)`,
    listingsHeading: "Immobili all'Asta Giudiziaria & Lotti Attivi",
    faqHeading: "Domande Frequenti sulle Aste Giudiziarie Immobiliari in Italia (c.p.c.)",
    valueLabel: "Prezzo Base d'Asta / Valore di Stima CTU (EUR)",
    minBidLabel: "Offerta Minima Ammissibile (75% ex art. 571 c.p.c.)",
    depositLabel: "Deposito Cauzionale Obbligatorio (10% della somma offerta)",
    thresholdLabel: "Prezzo Base d'Asta Pieno (100% senza istanze di assegnazione)",
    taxLabel: "Imposta di Registro (9% Seconda Casa / 2% Prima Casa)",
    repairLabel: "Budget Ristrutturazione e Regolarizzazione Urbanistica (EUR)",
    totalCostLabel: "Investimento Totale Stimato (Offerta Minima + Imposte + Lavori)",
    discountLabel: "Risparmio Immediato con Offerta Minima al 75%",
    defaultValue: 260000,
    defaultTaxPct: 9.0,
    defaultRepair: 20000,
    minBidRatio: 0.75,
    thresholdRatio: 1.0,
    depositRatio: 0.1,
    courtFeeRatio: 0.015,
    calcPageTitle: "Calcolatore Asta Giudiziaria: Offerta Minima 75% (Art. 571 c.p.c.), Cauzione 10% e Imposta di Registro",
    calcPageLead:
      "Inserisci il Prezzo Base d'Asta indicato nell'avviso di vendita del Tribunale: calcola subito l'Offerta Minima valida al 75% (art. 571 c.p.c.), la Cauzione del 10% da versare tramite bonifico o assegno circolare, l'Imposta di Registro (2% Prima Casa o 9% Seconda Casa con Prezzo-Valore) e il budget complessivo.",
    calcMetaTitle: "Calcolatore Offerta Minima 75% Asta Giudiziaria | Belowmark",
    calcMetaDesc:
      "Calcola gratis l'Offerta Minima al 75% (art. 571 c.p.c.), la cauzione del 10%, i costi del delegato e l'imposta di registro per le aste giudiziarie PVP.",
    faqs: [
      {
        q: "Come funziona l'Offerta Minima al 75% del Prezzo Base (art. 571 c.p.c.)?",
        a: "Ai sensi dell'art. 571 del Codice di Procedura Civile, nelle vendite senza incanto l'offerta è efficace anche se inferiore fino a un quarto (25%) rispetto al Prezzo Base stabilito nell'avviso di vendita. È quindi possibile presentare un'offerta valida pari al 75% del Prezzo Base.",
      },
      {
        q: "Come si presenta l'offerta telematica sul Portale delle Vendite Pubbliche (PVP)?",
        a: "Per le aste telematiche (sincrone o asincrone) occorre compilare il modulo ministeriale sul portale PVP (pvp.giustizia.it), allegare la ricevuta del bonifico della cauzione (normalmente il 10% del prezzo offerto) e la marca da bollo digitale da 16 €, firmare digitalmente il file .p7m e inviarlo via PEC.",
      },
      {
        q: "Entro quanti giorni va versato il saldo prezzo dopo l'aggiudicazione?",
        a: "Salvo diverso termine più breve indicato nell'ordinanza di vendita, l'aggiudicatario deve versare il saldo prezzo (dedotta la cauzione) entro 120 giorni dall'aggiudicazione, anche tramite mutuo ipotecario contestuale al Decreto di Trasferimento (art. 585 c.p.c.).",
      },
    ],
    entryTitle: (e) =>
      `Aste Giudiziarie ${e.name} (PVP Italia): ${e.totalCount} Immobili all'Asta e Perizie CTU`,
    entryLead: (e) =>
      `Elenco aggiornato delle esecuzioni immobiliari e aste giudiziarie per ${e.name} (${e.nativeRegionName}) — con Prezzo Base d'Asta, Offerta Minima al 75% (art. 571 c.p.c.), cauzione 10% e confronto con i valori OMI di mercato.`,
    entryMetaTitle: (e) => {
      const low = fmtMinEntry(e, 0.75, "it-IT", "EUR");
      return `Aste Giudiziarie ${e.name}: ${e.totalCount} Lotti PVP${low ? ` da ${low}` : ""}`;
    },
    entryMetaDesc: (e) => {
      const low = fmtMinEntry(e, 0.75, "it-IT", "EUR");
      return `Immobili all'asta giudiziaria a ${e.name}: ${e.totalCount} lotti PVP${low ? ` da ${low}` : ""} con Prezzo Base, Offerta Minima 75% (art. 571 c.p.c.) e Perizia CTU.`;
    },
  },
  ES: {
    hubEyebrow: "ESPAÑA · PORTAL DE SUBASTAS DEL BOE · 17 COMUNIDADES AUTÓNOMAS",
    hubTitle: (total, rCount, cCount) =>
      `Subastas BOE e Inmuebles Judiciales España: ${rCount} Comunidades, ${cCount} Juzgados y ${total} Lotes Activos`,
    hubLead:
      "Directorio actualizado de subastas judiciales, notariales y de la Agencia Tributaria publicadas en el Portal de Subastas del Boletín Oficial del Estado (BOE) en las 17 comunidades autónomas — con Valor de Subasta, reglas del 70% y 50% (Art. 670 LEC), depósito del 5% y cálculo del ITP autonómico.",
    hubMetaTitle: (total) =>
      `Subastas BOE (${total} Activas Hoy): Buscador sin Cl@ve -50%`,
    hubMetaDesc: (total, rCount) =>
      `Buscador abierto de Subastas BOE (${total} pisos, casas y locales activos en ${rCount} CCAA): consulta sin Cl@ve umbrales 70%/50% LEC, depósito 5% y 1 expediente gratis.`,
    calcButtonLabel: "🧮 Calculadora Gratuita Subasta BOE: Regla 70% / 50% (Art. 670 LEC), Depósito 5% e ITP →",
    ctaButtonLabel: "🎁 1 Expediente Gratis: Desbloquear Edicto BOE, Cargas y PDF →",
    regionsHeading: (c) => `Las ${c} Comunidades Autónomas de España (Subastas BOE)`,
    citiesHeading: (c) => `Ciudades y Municipios con Subastas BOE (${c} Municipios)`,
    courtsHeading: (c) => `Juzgados de Primera Instancia y Autoridades (${c} Juzgados)`,
    listingsHeading: "Subastas Judiciales BOE e Inmuebles Activos",
    faqHeading: "Preguntas Frecuentes sobre Subastas Judiciales en el BOE (LEC)",
    valueLabel: "Valor de Subasta / Tasación Judicial BOE (EUR)",
    minBidLabel: "Umbral Mínimo de Adjudicación (50% ex Art. 670.4 LEC)",
    depositLabel: "Depósito Obligatorio Portal BOE (5% del Valor de Subasta)",
    thresholdLabel: "Adjudicación Firme Directa (70% ex Art. 670.1 LEC)",
    taxLabel: "Impuesto de Transmisiones Patrimoniales - ITP Autonómico (%)",
    repairLabel: "Presupuesto de Reforma y Posesión / Lanzamiento (EUR)",
    totalCostLabel: "Inversión Total al 70% (Puja + ITP + Reforma)",
    discountLabel: "Ahorro Directo frente al Valor de Subasta (al 50%)",
    defaultValue: 280000,
    defaultTaxPct: 8.0,
    defaultRepair: 20000,
    minBidRatio: 0.5,
    thresholdRatio: 0.7,
    depositRatio: 0.05,
    courtFeeRatio: 0.01,
    calcPageTitle: "Calculadora de Subastas Judiciales BOE: Regla del 70% y 50% (Art. 670 LEC), Depósito 5% e ITP",
    calcPageLead:
      "Introduce el Valor de Subasta del edicto del BOE: calcula al instante el depósito electrónico del 5% (pasarela NRC de la AEAT), el umbral del 70% de adjudicación firme (Art. 670.1 LEC), el límite del 50% (Art. 670.4 LEC) y el Impuesto de Transmisiones Patrimoniales (ITP) según tu Comunidad Autónoma.",
    calcMetaTitle: "Calculadora Subastas BOE: Regla 70%/50% y Depósito 5%",
    calcMetaDesc:
      "Calcula gratis la puja óptima en Subastas BOE: umbral del 70% y 50% (Art. 670 LEC), depósito electrónico del 5%, ITP autonómico y ahorro real.",
    faqs: [
      {
        q: "¿Qué significa la regla del 70% en las subastas judiciales del BOE (Art. 670.1 LEC)?",
        a: "Según el artículo 670.1 de la Ley de Enjuiciamiento Civil (LEC), si la mejor postura iguala o supera el 70% del Valor de Subasta, el Letrado de la Administración de Justicia aprobará el remate directamente a favor del mejor postor, sin que el deudor pueda presentar a un tercero para mejorar la postura.",
      },
      {
        q: "¿Qué ocurre si la mejor puja está entre el 50% y el 70% del Valor de Subasta?",
        a: "Cuando la mejor puja es inferior al 70%, el ejecutado dispone de 10 días hábiles para presentar a un tercero que mejore la postura superando el 70% o cubriendo la deuda. Si no lo hace y la puja supera el 50% del Valor de Subasta (o cubre toda la deuda reclamada), el inmueble se adjudica al postor.",
      },
      {
        q: "¿Cuánto es el depósito para participar en una subasta del BOE y cuándo se devuelve?",
        a: "Para pujar en subastas.boe.es es obligatorio constituir un depósito electrónico del 5% del Valor de Subasta mediante certificado digital o Cl@ve. Si no resultas ganador y no reservas postura, el depósito se libera automáticamente tras el cierre de la subasta.",
      },
    ],
    entryTitle: (e) =>
      `Subasta BOE y Subastas Judiciales en ${e.name}: ${e.totalCount} Inmuebles y Edictos Activos`,
    entryLead: (e) =>
      `Listado actualizado de subastas judiciales del BOE (viviendas, locales y solares) en ${e.name} (${e.nativeRegionName}) — con Valor de Subasta BOE, umbral del 70% (Art. 670 LEC), depósito del 5% e ITP autonómico del ${e.transferTaxPct}%.`,
    entryMetaTitle: (e) => {
      const low = fmtMinEntry(e, 0.5, "es-ES", "EUR");
      const full = `Subastas BOE ${e.name} (${e.totalCount} Hoy sin Cl@ve)${low ? ` desde ${low}` : " -50%"}`;
      if (full.length <= 65) return full;
      const mid = `Subastas BOE ${e.name} (${e.totalCount} sin Cl@ve)${low ? ` · ${low}` : " -50%"}`;
      if (mid.length <= 65) return mid;
      return `Subastas BOE ${e.name}: ${e.totalCount} Activas sin Cl@ve -50%`;
    },
    entryMetaDesc: (e) => {
      const low = fmtMinEntry(e, 0.5, "es-ES", "EUR");
      return `Buscador sin Cl@ve de las ${e.totalCount} Subastas BOE activas hoy en ${e.name}${low ? ` desde ${low} (-50% LEC)` : ""}: pisos, casas, garajes y locales judiciales + 1 expediente gratis.`;
    },
  },
  FR: {
    hubEyebrow: "FRANCE · TRIBUNAUX JUDICIAIRES, LICITOR & NOTAIRES · 13 RÉGIONS",
    hubTitle: (total, rCount, cCount) =>
      `Ventes aux Enchères Immobilières France (TJ, Licitor & Notaires) : ${rCount} Régions, ${cCount} Juridictions et ${total} Biens`,
    hubLead:
      "Répertoire complet des ventes aux enchères immobilières judiciaires (Tribunal Judiciaire, Licitor, Avoventes) et notariales (Chambres des Notaires, Immo-Interactif®) dans les 13 régions françaises — avec Mise à prix, consignation CARPA, surenchère du dixième et prix DVF/m².",
    hubMetaTitle: (total) =>
      `Enchères Immobilières France (${total} Biens TJ, Licitor & Notaires)`,
    hubMetaDesc: (total, rCount) =>
      `Répertoire ouvert des ${total} ventes aux enchères immobilières judiciaires et notariales (${rCount} régions) : Mise à prix, décote DVF/m², CARPA 10 % et 1 dossier gratuit.`,
    calcButtonLabel: "🧮 Calculateur Gratuit Enchères Judiciaires : Mise à prix, Consignation CARPA 10 % & Frais →",
    ctaButtonLabel: "🎁 1 Dossier Gratuit : Cahier des Ventes, Rôle TJ & Comparatif DVF →",
    regionsHeading: (c) => `Les ${c} Régions de France (Ventes aux Enchères Licitor & TJ)`,
    citiesHeading: (c) => `Villes et Communes avec Enchères Judiciaires (${c} Villes)`,
    courtsHeading: (c) => `Tribunaux Judiciaires (${c} Juridictions)`,
    listingsHeading: "Ventes aux Enchères Immobilières & Audiences d'Adjudication",
    faqHeading: "Questions Fréquentes sur les Enchères Immobilières au Tribunal Judiciaire",
    valueLabel: "Valeur Vénale de Référence (DVF / Estimation Marché en EUR)",
    minBidLabel: "Mise à Prix Indicative (Souvent 30 % à 50 % de la valeur)",
    depositLabel: "Consignation CARPA 10 % de la Mise à Prix (Min. 3 000 €)",
    thresholdLabel: "Enchère Cible Sécurisée (70 % de la valeur DVF)",
    taxLabel: "Droits d'Enregistrement (5,80 %) + Émoluments",
    repairLabel: "Budget Travaux & Libération des Lieux (EUR)",
    totalCostLabel: "Coût Total d'Acquisition à 70 % (Enchère + Droits + Travaux)",
    discountLabel: "Décote Brute par rapport à la Valeur DVF",
    defaultValue: 350000,
    defaultTaxPct: 5.8,
    defaultRepair: 25000,
    minBidRatio: 0.45,
    thresholdRatio: 0.7,
    depositRatio: 0.1,
    courtFeeRatio: 0.025,
    calcPageTitle: "Calculateur d'Enchères Immobilières Judiciaires (Licitor / Tribunal Judiciaire) : Consignation CARPA, Frais Préalables & Droits",
    calcPageLead:
      "Simulez votre acquisition aux enchères judiciaires devant le Tribunal Judiciaire : calculez le montant du chèque de banque de consignation CARPA (10 % de la mise à prix avec un minimum légal de 3 000 €), le seuil de surenchère du dixième (+10 % pendant 10 jours), les droits d'enregistrement (5,80 %) et votre budget maximal.",
    calcMetaTitle: "Calculateur Enchères Judiciaires Licitor & CARPA 10 %",
    calcMetaDesc:
      "Calculez gratuitement les frais d'une vente aux enchères au Tribunal Judiciaire (Licitor) : consignation CARPA 10 %, frais préalables et droits.",
    faqs: [
      {
        q: "Est-il obligatoire de passer par un avocat pour enchérir au Tribunal Judiciaire ?",
        a: "Oui. En France, la représentation par un avocat inscrit au Barreau du Tribunal Judiciaire où se déroule la vente est strictement obligatoire pour porter des enchères à l'audience d'adjudication. Vous devez lui remettre un mandat écrit avec votre plafond d'enchère.",
      },
      {
        q: "Quel est le montant du chèque de banque de consignation (CARPA) ?",
        a: "Pour pouvoir enchérir, vous devez remettre à votre avocat un chèque de banque libellé à l'ordre de la CARPA (ou du Bâtonnier Séquestre) d'un montant égal à 10 % de la mise à prix, sans que ce montant puisse être inférieur à 3 000 €. Si vous n'êtes pas déclaré adjudicataire, le chèque vous est restitué dès la fin de l'audience.",
      },
      {
        q: "Qu'est-ce que la surenchère du dixième (10 jours) ?",
        a: "Pendant un délai de 10 jours suivant l'audience d'adjudication, toute personne peut former une surenchère par ministère d'avocat en proposant un prix supérieur d'au moins 10 % au prix d'adjudication initial. Une seconde et ultime audience est alors fixée.",
      },
    ],
    entryTitle: (e) =>
      `Ventes aux Enchères Immobilières ${e.name} (Licitor & TJ) : ${e.totalCount} Biens à la Barre`,
    entryLead: (e) =>
      `Consultez toutes les ventes aux enchères judiciaires programmées pour ${e.name} (${e.nativeRegionName}) — avec Mise à prix, juridiction compétente, consignation CARPA 10 % et comparaison aux prix réels DVF/m².`,
    entryMetaTitle: (e) => {
      const low = fmtMinEntry(e, 0.45, "fr-FR", "EUR");
      return `Enchères Immobilières ${e.name} : ${e.totalCount} Biens${low ? ` dès ${low}` : ""}`;
    },
    entryMetaDesc: (e) => {
      const low = fmtMinEntry(e, 0.45, "fr-FR", "EUR");
      return `Ventes aux enchères immobilières (Licitor / TJ) à ${e.name} : ${e.totalCount} biens actifs${low ? ` dès ${low}` : ""} avec Mise à prix, conditions de vente et décote DVF.`;
    },
  },
  GB: {
    hubEyebrow: "UNITED KINGDOM · RICS PROPERTY AUCTIONS · ALL 12 UK REGIONS",
    hubTitle: (total, rCount) =>
      `UK Property Auctions Directory: All ${rCount} Regions & ${total} Repossession / Auction Lots`,
    hubLead:
      "Complete directory of live residential and commercial UK property auction lots across all 12 regions of England, Wales, Scotland, and Northern Ireland — featuring Guide Prices in GBP, estimated Reserve Prices, 10% Exchange Deposits, 28-day completion timelines, and Land Registry / EPC street-price comps.",
    hubMetaTitle: (total, rCount) =>
      `UK Property Auctions: ${total} Houses, Flats & Repossessions (${rCount} Regions)`,
    hubMetaDesc: (total, rCount) =>
      `Search ${total} live UK property auction houses, flats & repossession lots across ${rCount} regions (Auction House UK, Clive Emson, Eddisons): Guide Prices in GBP & SDLT calculator.`,
    calcButtonLabel: "🧮 Free UK Property Auction Calculator: Guide vs Reserve, 10% Deposit & Stamp Duty (SDLT) →",
    ctaButtonLabel: "🎁 1 Free Dossier: Unlock Address, Legal Pack PDF & Land Registry Comps →",
    regionsHeading: (c) => `All ${c} UK Regions (England, Wales, Scotland & Northern Ireland)`,
    citiesHeading: (c) => `UK Cities & Towns with Active Auction Lots (${c} Locations)`,
    courtsHeading: () => "Regulated UK Property Auction Channels",
    listingsHeading: "Live UK Property Auction Lots & Guide Prices (GBP)",
    faqHeading: "Frequently Asked Questions: Buying at a UK Property Auction",
    valueLabel: "Verified Local Market Value (HM Land Registry Comps in GBP)",
    minBidLabel: "Published Auction Guide Price (Typical 70% of Market Value)",
    depositLabel: "10% Exchange Deposit Payable on Auction Day (Min. £5,000)",
    thresholdLabel: "Max Reserve Price Ceiling (Guide Price + 10% ASA Rule)",
    taxLabel: "Stamp Duty Land Tax (SDLT / LBTT / LTT in %)",
    repairLabel: "Refurbishment & Bridging Finance Buffer (GBP)",
    totalCostLabel: "Total Capital Required at Reserve Ceiling (incl. SDLT & Refurb)",
    discountLabel: "Built-in Equity Margin Below Market Value (at Guide Price)",
    defaultValue: 290000,
    defaultTaxPct: 5.0,
    defaultRepair: 22000,
    minBidRatio: 0.7,
    thresholdRatio: 0.77,
    depositRatio: 0.1,
    courtFeeRatio: 0.015,
    calcPageTitle: "UK Property Auction Calculator: Guide Price, Reserve Ceiling (+10%), 10% Exchange Deposit & Stamp Duty (SDLT)",
    calcPageLead:
      "Calculate your maximum safe bid for any UK property auction lot: compare HM Land Registry market value against the published Guide Price, model the +10% ASA Reserve Price rule, compute your immediate 10% exchange deposit on the fall of the gavel, and factor in Stamp Duty Land Tax (SDLT) plus refurbishment costs in GBP.",
    calcMetaTitle: "UK Property Auction Calculator: 10% Deposit & Stamp Duty",
    calcMetaDesc:
      "Free UK property auction calculator (GBP): calculate 10% exchange deposit, +10% reserve price ceiling, 28-day completion balance & Stamp Duty (SDLT).",
    faqs: [
      {
        q: "What is the difference between a Guide Price and a Reserve Price in UK property auctions?",
        a: "The Guide Price is the auctioneer's published indication of where bidding is expected to start, while the Reserve Price is the confidential minimum figure the seller will accept. Under UK Advertising Standards Authority (ASA) rules, the Guide Price cannot be set more than 10% below a fixed Reserve Price.",
      },
      {
        q: "What happens when the hammer falls at an unconditional UK property auction?",
        a: "The fall of the auctioneer's gavel creates an immediate, legally binding exchange of contracts. You must pay a 10% exchange deposit (subject to a typical minimum of £3,000–£5,000) plus the auctioneer's administration fee on the day, and complete the remaining 90% balance within 28 working days.",
      },
      {
        q: "Why must I review the Special Conditions of Sale in the Legal Pack before bidding?",
        a: "The Legal Pack (title register, local authority searches, replies to enquiries, and Special Conditions of Sale) often includes clauses requiring the buyer to reimburse the seller's legal fees, search fees, or a buyer's premium (1.5%–3.6% + VAT) on top of the hammer price.",
      },
    ],
    entryTitle: (e) =>
      `UK Property Auctions in ${e.name}: ${e.totalCount} Live Repossession & Auction Lots`,
    entryLead: (e) =>
      `Live residential and commercial UK property auction and repossession lots in ${e.name} (${e.nativeRegionName}) — complete with Guide Prices in GBP, 10% exchange deposit figures, 28-day completion terms, and HM Land Registry £/m² street benchmarks.`,
    entryMetaTitle: (e) => {
      const low = fmtMinEntry(e, 0.7, "en-GB", "GBP");
      const full = `Property Auctions ${e.name}: ${e.totalCount} Houses & Lots${low ? ` from ${low}` : ""}`;
      return full.length <= 66 ? full : `Property Auctions ${e.name}: ${e.totalCount} Lots${low ? ` from ${low}` : ""}`;
    },
    entryMetaDesc: (e) => {
      const low = fmtMinEntry(e, 0.7, "en-GB", "GBP");
      return `${e.totalCount} live houses, flats & commercial property auction lots in ${e.name}${low ? ` from ${low}` : ""}: Guide Prices in GBP, 10% deposit, Legal Pack & Land Registry comps.`;
    },
  },
  NL: {
    hubEyebrow: "NEDERLAND · EXECUTIEVEILINGEN (ART. 3:268 BW) & VASTGOEDVEILING · 12 PROVINCIES",
    hubTitle: (total, rCount, cCount) =>
      `Executieveilingen & Vastgoedveilingen Nederland: Alle ${rCount} Provincies, ${cCount} Veilingnotarissen en ${total} Actieve Kavels`,
    hubLead:
      "Actueel overzicht van openbare executieveilingen (art. 3:268 BW) en notariële online vastgoedveilingen in alle 12 Nederlandse provincies — inclusief inzet- en afslagfase, kadastrale gegevens, bijzondere veilingvoorwaarden, 10% waarborgsom en overdrachtsbelasting (2% eigen woning / 10,4% belegging).",
    hubMetaTitle: (total) =>
      `Executieveilingen Nederland (${total} Kavels Actief): Woningen & Vastgoed`,
    hubMetaDesc: (total, rCount) =>
      `Bekijk alle ${total} actieve executieveilingen en notariële vastgoedveilingen in ${rCount} provincies: woningen, appartementen, bedrijfspanden & 1 gratis dossier.`,
    calcButtonLabel: "🧮 Gratis Executieveiling Calculator: Inzet & Afslag, 10% Waarborgsom & Overdrachtsbelasting →",
    ctaButtonLabel: "🎁 1 Gratis Dossier: Adres, Veilingvoorwaarden PDF & Kadaster Ontgrendelen →",
    regionsHeading: (c) => `Alle ${c} Provincies van Nederland (Executieveilingen)`,
    citiesHeading: (c) => `Steden en Gemeenten met Vastgoedveilingen (${c} Plaatsen)`,
    courtsHeading: (c) => `Veilende Notarissen & Kantoren (${c} Notariskantoren)`,
    listingsHeading: "Actieve Executieveilingen & Online Vastgoedkavels (EUR)",
    faqHeading: "Veelgestelde Vragen over Executieveilingen in Nederland (Art. 3:268 BW)",
    valueLabel: "Geschatte Marktwaarde / Referentiewaarde (EUR)",
    minBidLabel: "Verwachte Openings-/Inzetprijs (ca. 70% van marktwaarde)",
    depositLabel: "Notariële Waarborgsom (10% binnen 3–5 werkdagen na gunning)",
    thresholdLabel: "Doelbod bij Inzet & Afslag (80% van marktwaarde)",
    taxLabel: "Overdrachtsbelasting Belegger (10,4%) / Eigen Woning (2%)",
    repairLabel: "Renovatie- & Ontruimingsbudget (Art. 3:264 BW Huurbeding, EUR)",
    totalCostLabel: "Totale Investering incl. Overdrachtsbelasting & Renovatie",
    discountLabel: "Bruto Korting t.o.v. Marktwaarde",
    defaultValue: 425000,
    defaultTaxPct: 10.4,
    defaultRepair: 25000,
    minBidRatio: 0.7,
    thresholdRatio: 0.8,
    depositRatio: 0.1,
    courtFeeRatio: 0.018,
    calcPageTitle: "Executieveiling Calculator Nederland: Inzet & Afslag, 10% Waarborgsom & Overdrachtsbelasting (2% / 10,4%)",
    calcPageLead:
      "Bereken direct uw maximale bod op een Nederlandse executieveiling (art. 3:268 BW): simuleer de verplichte 10% waarborgsom bij de notaris, inzetpremie (1%), veilingkosten en overdrachtsbelasting (2% voor eigen bewoning of 10,4% voor beleggers).",
    calcMetaTitle: "Executieveiling Calculator: Kosten, 10% Waarborgsom & Overdrachtsbelasting",
    calcMetaDesc:
      "Gratis executieveiling calculator (NL): bereken waarborgsom (10%), overdrachtsbelasting (2% / 10,4%), notariskosten en netto korting bij vastgoedveilingen.",
    faqs: [
      {
        q: "Hoe werkt bieden bij inzet en afslag op een Nederlandse executieveiling?",
        a: "Een Nederlandse vastgoedveiling bestaat uit twee fasen: eerst wordt bij opbod geboden (inzetfase), waarbij de hoogste bieder vaak recht heeft op 1% inzetpremie. Daarna volgt direct de afslagfase waarbij de prijs daalt tot iemand 'Mijn' roept of klikt.",
      },
      {
        q: "Kan ik vóór de executieveiling een onderhands bod uitbrengen?",
        a: "Ja. Tot uiterlijk 14 dagen vóór de geplande executieveiling (art. 3:268 lid 2 BW) kan een onvoorwaardelijk schriftelijk onderhands bod bij de veilende notaris worden ingediend. Als de hypotheekhouder of voorzieningenrechter dit accepteert, vervalt de openbare veiling.",
      },
      {
        q: "Hoeveel overdrachtsbelasting betaal ik bij aankoop op een veiling?",
        a: "Voor een woning die u zelf als hoofdverblijf gaat bewonen geldt 2% overdrachtsbelasting (of 0% startersvrijstelling onder de wettelijke grens). Voor beleggingspanden, verhuurde woningen en commercieel vastgoed bedraagt het tarief 10,4%.",
      },
    ],
    entryTitle: (e) =>
      `Executieveiling & Vastgoedveiling ${e.name}: ${e.totalCount} Actieve Woningen en Kavels`,
    entryLead: (e) =>
      `Actuele notariële executieveilingen (art. 3:268 BW) en online vastgoedveilingen voor ${e.name} (${e.nativeRegionName}) — met inzet/afslag, Kadaster-referentie, bijzondere veilingvoorwaarden en ${e.transferTaxPct}% overdrachtsbelasting.`,
    entryMetaTitle: (e) => {
      const low = fmtMinEntry(e, 0.7, "nl-NL", "EUR");
      const full = `Executieveiling ${e.name} (${e.totalCount} Kavels Actief)${low ? ` vanaf ${low}` : ""}`;
      return full.length <= 65 ? full : `Executieveiling ${e.name}: ${e.totalCount} Woningen & Kavels`;
    },
    entryMetaDesc: (e) => {
      const low = fmtMinEntry(e, 0.7, "nl-NL", "EUR");
      return `Bekijk alle ${e.totalCount} actieve executieveilingen en vastgoedkavels in ${e.name}${low ? ` vanaf ${low}` : ""}: bijzondere veilingvoorwaarden, Kadaster & 1 gratis dossier.`;
    },
  },
  PL: {
    hubEyebrow: "POLSKA · LICYTACJE KOMORNICZE NIERUCHOMOŚCI (KRK) · WSZYSTKIE 16 WOJEWÓDZTW",
    hubTitle: (total, rCount, cCount) =>
      `Licytacje Komornicze Nieruchomości w Polsce: ${rCount} Województw, ${cCount} Kancelarii i ${total} Aktywnych Obwieszczeń`,
    hubLead:
      "Aktualny rejestr oficjalnych licytacji i e-licytacji komorniczych nieruchomości (Krajowa Rada Komornicza) we wszystkich 16 województwach — z sumą oszacowania biegłego, ceną wywołania 3/4 (I termin, art. 965 KPC) i 2/3 (II termin, art. 983 KPC), rękojmią 10% (art. 962 KPC) oraz podatkiem PCC 2%.",
    hubMetaTitle: (total) =>
      `Licytacje Komornicze Nieruchomości (${total} Aktywnych Dziś): Mieszkania, Domy i Działki`,
    hubMetaDesc: (total, rCount) =>
      `Wyszukiwarka ${total} aktywnych licytacji i e-licytacji komorniczych nieruchomości w ${rCount} województwach: mieszkania, domy i działki od 2/3 i 3/4 oszacowania + 1 darmowe dossier.`,
    calcButtonLabel: "🧮 Darmowy Kalkulator Licytacji Komorniczej: Cena Wywołania 3/4 i 2/3, Rękojmia 10% i PCC 2% →",
    ctaButtonLabel: "🎁 1 Darmowe Dossier: Odblokuj Dokładny Adres, Sygnaturę Km i Operat →",
    regionsHeading: (c) => `Wszystkie ${c} Województw (Licytacje Komornicze Nieruchomości)`,
    citiesHeading: (c) => `Miasta i Gminy z Aktywnymi Licytacjami (${c} Miejscowości)`,
    courtsHeading: (c) => `Sądy Rejonowe i Kancelarie Komornicze (${c} Organów)`,
    listingsHeading: "Aktywne Licytacje i e-Licytacje Komornicze Nieruchomości (PLN)",
    faqHeading: "Najczęstsze Pytania o Licytacje Komornicze Nieruchomości (KPC)",
    valueLabel: "Suma Oszacowania Biegłego Sądowego (PLN)",
    minBidLabel: "Cena Wywołania: II Termin 2/3 (66,7%) lub I Termin 3/4 (75%)",
    depositLabel: "Obowiązkowa Rękojmia / Wadium 10% Sumy Oszacowania (Art. 962 KPC)",
    thresholdLabel: "Cena Wywołania w I Licytacji (3/4 = 75% ex Art. 965 KPC)",
    taxLabel: "Podatek od Czynności Cywilnoprawnych - PCC (2%) + Opłata Sądowa KW",
    repairLabel: "Budżet Remontowy i Opróżnienie Lokalu (PLN)",
    totalCostLabel: "Całkowity Kapitał przy Zakupie w I Terminie (75% + PCC + Remont)",
    discountLabel: "Dyskonto Względem Sumy Oszacowania (przy 2/3 w II Terminie)",
    defaultValue: 450000,
    defaultTaxPct: 2.0,
    defaultRepair: 35000,
    minBidRatio: 0.6667,
    thresholdRatio: 0.75,
    depositRatio: 0.1,
    courtFeeRatio: 0.005,
    calcPageTitle: "Kalkulator Licytacji Komorniczej Nieruchomości: Cena Wywołania 3/4 i 2/3 (KPC), Rękojmia 10% i Podatek PCC 2%",
    calcPageLead:
      "Wpisz sumę oszacowania z obwieszczenia komorniczego: oblicz natychmiast wadium / rękojmię 10% (art. 962 KPC), cenę wywołania w pierwszej licytacji (3/4 = 75%, art. 965 KPC) oraz drugiej licytacji (2/3 = 66,7%, art. 983 KPC), podatek PCC 2% i łączny koszt zakupu w PLN.",
    calcMetaTitle: "Kalkulator Licytacji Komorniczej: Wadium 10%, 3/4 i 2/3 KPC oraz PCC 2%",
    calcMetaDesc:
      "Darmowy kalkulator licytacji komorniczej nieruchomości (PLN): oblicz rękojmię 10%, cenę wywołania 75% (I termin) i 66,7% (II termin) oraz podatek PCC 2%.",
    faqs: [
      {
        q: "Ile wynosi cena wywołania na pierwszej i drugiej licytacji komorniczej nieruchomości?",
        a: "Zgodnie z art. 965 Kodeksu postępowania cywilnego (KPC) na pierwszej licytacji cena wywołania wynosi trzy czwarte (3/4, czyli 75%) sumy oszacowania. Jeżeli pierwsza licytacja będzie bezskuteczna, na drugiej licytacji cena wywołania spada do dwóch trzecich (2/3, czyli 66,67%) sumy oszacowania (art. 983 KPC).",
      },
      {
        q: "Kiedy należy wpłacić rękojmię (wadium 10%) na e-licytacji komorniczej?",
        a: "Przystępujący do przetargu obowiązany jest złożyć rękojmię w wysokości jednej dziesiątej (10%) sumy oszacowania najpóźniej na 2 dni robocze przed rozpoczęciem przetargu w systemie e-licytacji (art. 986⁵ § 1 KPC). W przypadku niewygrania licytacji rękojmia jest zwracana niezwłocznie.",
      },
      {
        q: "Czy zakup mieszkania na licytacji komorniczej zwalnia hipotekę z księgi wieczystej?",
        a: "Tak. Z chwilą uprawomocnienia się postanowienia sądu o przysądzeniu własności (art. 1000 § 1 KPC) wygasają wszelkie prawa oraz skutki ujawnienia praw i roszczeń osobistych ciążące na nieruchomości, w tym hipoteki przymusowe i umowne wpisane w dziale IV księgi wieczystej.",
      },
    ],
    entryTitle: (e) =>
      `Licytacje Komornicze Nieruchomości ${e.name}: ${e.totalCount} Mieszkań, Domów i Działek`,
    entryLead: (e) =>
      `Oficjalne obwieszczenia i e-licytacje komornicze nieruchomości dla lokalizacji ${e.name} (${e.nativeRegionName}) — z sumą oszacowania, ceną wywołania 3/4 i 2/3 KPC, rękojmią 10% i podatkiem PCC ${e.transferTaxPct}%.`,
    entryMetaTitle: (e) => {
      const low = fmtMinEntry(e, 0.6667, "pl-PL", "PLN");
      const full = `Licytacje Komornicze ${e.name} (${e.totalCount} Aktywnych)${low ? ` od ${low}` : ""}`;
      if (full.length <= 65) return full;
      return `Licytacje Komornicze ${e.name}: ${e.totalCount} Nieruchomości -33%`;
    },
    entryMetaDesc: (e) => {
      const low = fmtMinEntry(e, 0.6667, "pl-PL", "PLN");
      return `Sprawdź ${e.totalCount} aktywnych licytacji i e-licytacji komorniczych nieruchomości w lokalizacji ${e.name}${low ? ` już od ${low}` : ""}: mieszkania, domy i działki + 1 darmowe dossier.`;
    },
  },
};
