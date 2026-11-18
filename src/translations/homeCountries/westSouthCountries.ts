import { TRIAL_COPY } from "@/lib/billing/trialCopy";
import { HOME_DIRECTORY_COPY } from "@/lib/homeDirectoryCopy";
import { EN } from "@/translations/en/en";
import { ES } from "@/translations/es/es";
import { FR } from "@/translations/fr/fr";
import { IT } from "@/translations/it/it";
import { HomeCountryProfile } from "./homeCountryTypes";

/** 🇬🇧 United Kingdom — 100% RICS Regulated Property Auctions, LPA Receivership & SDLT */
export const HOME_GB_EN: HomeCountryProfile = {
  selectorCode: "GB",
  pricingCountry: "GB",
  formatLocale: "en-GB",
  htmlLang: "en-GB",
  liveSearchLabel: "Live Search",
  freeBadge: TRIAL_COPY.en.homeFreeBadge,
  trialBadge: "7-day free trial · £0.00 due today",
  directoryCopy: HOME_DIRECTORY_COPY.en,
  Navigation: EN.Navigation,
  HomePage: {
    ...EN.HomePage,
    MetaTags: {
      title: "Belowmark UK — Repossession, Receivership & Property Auctions",
      description:
        "All RICS-regulated UK property auction lots in one place: Guide Prices, reserve bands, 10% exchange deposits, Legal Packs and SDLT / LBTT / LTT calculators.",
      imgUrl: "https://www.belowmark.com/og/home.png",
      tags: ["UK property auctions", "repossession auctions UK", "LPA receivership sale", "guide price", "SDLT auction calculator", "RICS auctions"],
      url: "https://www.belowmark.com",
    },
    Hero: {
      Dateline: "Official Catalogues · UK Property, Receivership & Repossession Auctions Across All 12 Regions",
      LiveLabel: "Updated daily from RICS-regulated UK auction houses & HM Land Registry comps",
      HeadlineTop: "Property auctions.",
      HeadlineBelow: "Acquire below market value.",
      LineLabel: "Market value",
      Description:
        "Every week, RICS-regulated auction houses across London, Manchester, Birmingham, Yorkshire, Scotland and Wales list residential and commercial property from mortgagees in possession, LPA receivers, probate estates and local authorities. Belowmark aggregates every live lot in GBP (£) and calculates Guide-to-Reserve spread, 10% exchange deposit and Stamp Duty (SDLT / LBTT / LTT).",
      Principle: "Nothing is estimated. Where a Legal Pack or floor area is missing, we flag the gap rather than inventing a figure.",
      PrimaryCta: "Start free trial access",
      SecondaryCta: "Try the UK auction calculator",
      Note: "Free tier: full UK property lot list visible, guide prices locked. Full access from £35 per month.",
    },
    Stats: {
      AsOf: "Updated",
      Proceedings: "Live UK auction lots from RICS catalogues",
      WithAppraisal: "with published Guide Price in GBP (£)",
      States: "UK regions & nations with active auctions",
      TotalValue: "Combined Guide Price volume",
      Median: "Median Guide Price per lot",
    },
    Notice: {
      Eyebrow: "What you see in the dashboard",
      Title: "One dossier per auction lot. Showing what is in the catalogue — and what needs checking.",
      Description: "The exact same lot card used inside the dashboard. Redacted here so the address cannot be identified without an account.",
      Paragraphs: [
        "At the core sit the published Guide Price in £, the implied ASA +10% maximum Reserve ceiling, and local HM Land Registry price-per-m² comparables.",
        "Red flags come first: short leaseholds, Section 20 major works notices, Buyers' Administration Fees in the Special Conditions, or cash-only non-standard construction.",
        "Inside the dashboard everything is unlocked: exact street address & postcode, auction house lot link, Legal Pack access, bridging pack PDF and 28-day completion tracker.",
      ],
      Redaction: "redacted",
      Card: {
        Example: "Sample UK lot",
        Court: "RICS Regulated Auctioneer",
        FileNo: "Catalogue lot",
        Kind: "Property type",
        KindValue: "Freehold 3-bed semi-detached house",
        State: "UK Region",
        StateValue: "Greater London",
        Appraisal: "Market benchmark",
        Limit: "Guide Price",
        Hearing: "Auction date",
        HearingValue: "in 12 days",
        Stamp: "Members only",
        HintsTitle: "Notes from catalogue & Legal Pack",
        Hints: [
          "28-day unconditional completion upon fall of the gavel",
          "Check Special Conditions for buyer's premium / seller fee clauses",
          "Additional dwelling SDLT rate (England & NI): ~5.0% blended",
        ],
        PortalLink: "Auction Catalogue",
        PdfLink: "Legal Pack",
      },
    },
    Method: {
      Eyebrow: "The underwriting workflow",
      Title: "Three steps before the gavel falls.",
      Description: "Every figure in Belowmark traces back to the official auctioneer catalogue and Land Registry records.",
      StepOne: {
        Kicker: "Catalogue",
        Title: "Live RICS auction house feed across 12 UK regions",
        Body: "Auctioneer, lot number, tenure (Freehold/Leasehold), Guide Price in £ and auction date are indexed directly from regulated UK auctioneers.",
      },
      StepTwo: {
        Kicker: "Numbers",
        Title: "Reserve band, 10% exchange deposit & Stamp Duty",
        Body: "We model the ASA 10% Guide-to-Reserve rule, immediate 10% exchange deposit, and regional SDLT (England/NI), LBTT (Scotland) or LTT (Wales).",
      },
      StepThree: {
        Kicker: "Caveats",
        Title: "Tenure, short leases & Special Conditions upfront",
        Body: "Unmortgageable leases (<80 years), tenanted ASTs, flying freeholds or onerous Special Conditions are highlighted before you bid.",
      },
      Disclaimer: {
        Title: "What Belowmark does not replace.",
        Body: "Contracts exchange immediately on the fall of the gavel in unconditional UK auctions. Always have a conveyancing solicitor review the full Legal Pack, Title Register, Local Searches and Special Conditions before bidding.",
      },
    },
    States: {
      Eyebrow: "UK-wide coverage",
      Title: "All 12 UK regions & nations indexed daily.",
      Description: "Active residential, commercial and land auction lots by UK region plus blended investor Stamp Duty.",
      ColState: "UK Region / Nation",
      ColHearings: "Active lots",
      ColTax: "Stamp Duty",
      NotPublished: "no active lots",
      Footnote: "Covers England & Northern Ireland (SDLT), Scotland (LBTT) and Wales (LTT) across RICS-regulated auction houses.",
    },
    Compare: {
      Eyebrow: "Systematic pre-screening",
      Title: "Browsing 40 auction catalogues vs. Belowmark.",
      Description: "Stop checking dozens of regional auctioneer websites one by one — screen every UK lot in a single terminal.",
      ColCriterion: "Underwriting step",
      ColManual: "Manual search",
      ColBelowmark: "Belowmark",
      Rows: [
        { Criterion: "National lot discovery", Manual: "Check 30+ separate auctioneer sites", Belowmark: "All 12 UK regions searchable in one list" },
        { Criterion: "SDLT / LBTT / LTT & 10% deposit", Manual: "Spreadsheet per property", Belowmark: "Calculated automatically in £ per lot" },
        { Criterion: "Guide vs. Reserve & local comps", Manual: "Cross-check Rightmove & Land Registry", Belowmark: "Instant spread & postcode m² context" },
        { Criterion: "Tenure & lease length risk", Manual: "Buried inside catalogue notes", Belowmark: "Flagged clearly on every lot card" },
        { Criterion: "Path to Legal Pack", Manual: "Register separately on every site", Belowmark: "1-click direct link to the official lot page" },
      ],
    },
    Faq: {
      Eyebrow: "UK Property Auction Law & RICS Rules",
      Title: "Frequently asked questions on UK property auctions.",
      Description: "Grounded in RICS Common Auction Conditions, ASA Guide Price rules, Law of Property Act 1925 and HMRC Stamp Duty rules.",
      SourceLabel: "Authority",
      Items: [
        {
          Question: "What is the difference between the Guide Price and the Reserve Price?",
          Answer: "The Reserve Price is the minimum confidential price the seller authorizes the auctioneer to accept. Under UK Advertising Standards Authority (ASA) and RICS rules, a single Guide Price must not be set more than 10% below an unconditional Reserve Price.",
          Sources: ["RICS Auction Conditions", "ASA CAP Guidance"],
        },
        {
          Question: "When do contracts exchange at a traditional UK property auction?",
          Answer: "In an unconditional (traditional) auction, binding contracts are exchanged immediately upon the fall of the auctioneer's gavel (or close of the online timer). You pay the 10% deposit (subject to a typical £5,000 minimum) plus any auctioneer administration fee on the day, with completion normally due within 28 days.",
          Sources: ["RICS Common Auction Conditions (4th Ed.)"],
        },
        {
          Question: "Who can bid, and what AML / ID checks are required?",
          Answer: "Any UK or international individual or company of full legal capacity may register to bid. Under UK Money Laundering Regulations, bidders must complete electronic AML verification (passport/driving licence + proof of address, plus corporate beneficial ownership docs for SPVs) prior to auction day.",
          Sources: ["MLR 2017"],
        },
        {
          Question: "How is Stamp Duty calculated on UK auction properties?",
          Answer: "Stamp Duty depends on the nation and buyer status: Stamp Duty Land Tax (SDLT) in England & Northern Ireland (including the higher additional-dwelling surcharge for investors/SPVs), Land and Buildings Transaction Tax (LBTT) in Scotland, and Land Transaction Tax (LTT) in Wales. Commercial and mixed-use lots qualify for non-residential rates.",
          Sources: ["Finance Act 2003 (SDLT)", "LBTT(S)A 2013", "LTT(W)A 2017"],
        },
        {
          Question: "What are LPA Receivership and Mortgagee in Possession lots?",
          Answer: "When a borrower defaults on a mortgage or commercial loan, the lender may appoint a Law of Property Act (LPA) Receiver under s. 101 LPA 1925 or sell directly as Mortgagee in Possession to recover the debt via public auction.",
          Sources: ["Law of Property Act 1925, s. 101"],
        },
        {
          Question: "Why is reviewing the Legal Pack essential before bidding?",
          Answer: "The Legal Pack contains the HM Land Registry Title Register & Plan, Local Authority Searches, EPC, tenancy agreements, and the seller's Special Conditions of Sale (which may transfer seller legal/search costs to the buyer). Because exchange is immediate on gavel fall, legal review must happen beforehand.",
          Sources: ["RICS Best Practice"],
        },
      ],
      MoreTitle: "Have a question about UK auction lots?",
      MoreCta: "Contact us",
    },
  },
  Footer: {
    ...EN.Footer,
    SourceZvg: "RICS Regulated Auction Houses · HM Land Registry",
    SourceLaw: "RICS Common Auction Conditions & LPA 1925",
    SourceJustiz: "gov.uk/stamp-duty-land-tax",
  },
};

/** 🌐 International English (`INTL`) — Global default for US, UAE, Asia, Nordics/EU outside the 12 direct markets */
export const HOME_INTL_EN: HomeCountryProfile = {
  ...HOME_GB_EN,
  selectorCode: "INTL",
  pricingCountry: "DE",
  formatLocale: "en",
  htmlLang: "en",
  trialBadge: TRIAL_COPY.en.homeTrialBadge,
  HomePage: {
    ...EN.HomePage,
    Hero: {
      ...EN.HomePage.Hero,
      Dateline: "Official Court & Auction Portals · 12 European & Turkish Markets in One Terminal",
      LiveLabel: "Daily sync across DE · AT · CH · IT · ES · FR · UK · NL · PL · CZ · SE · TR",
      Description:
        "Every day, enforcement courts, bailiffs and regulated auction houses across 12 countries — Germany (ZVG), Austria (Edikte), Switzerland (SHAB), Italy (PVP), Spain (BOE), France (Licitor), UK (RICS), Netherlands, Poland, Czechia, Sweden and Türkiye (UYAP) — put real estate up for forced sale. Belowmark unifies all official notices and computes statutory minimum bids, deposits and transfer taxes.",
      Note: "Free tier: full property register visible across your selected country, financial values locked. Switch between all 12 countries anytime in the top bar.",
    },
    States: {
      Eyebrow: "Cross-border coverage",
      Title: "12 official judicial & auction markets — switch country anytime.",
      Description: "Currently previewing Germany's 16 federal states (ZVG). Use the country selector in the top navigation bar or pricing section to switch to UK, Switzerland, Italy, Spain, France, Austria, Netherlands, Poland, Czechia, Sweden or Türkiye.",
      ColState: "State / Region",
      ColHearings: "Open proceedings",
      ColTax: "Transfer tax",
      NotPublished: "no active filings",
      Footnote: "All counts and appraised values derive directly from official national judicial and enforcement portals.",
    },
  },
  Footer: {
    ...EN.Footer,
    SourceZvg: "12 Official National Judicial & Auction Portals",
    SourceLaw: "ZVG · EO · SchKG · c.p.c. · LEC · CPCE · RICS · İİK",
    SourceJustiz: "belowmark.com/atlas",
  },
};

/** 🇮🇹 Italia — 100% Art. 568–591 c.p.c. & Portale delle Vendite Pubbliche (PVP) */
export const HOME_IT: HomeCountryProfile = {
  selectorCode: "IT",
  pricingCountry: "IT",
  formatLocale: "it",
  htmlLang: "it",
  liveSearchLabel: "Ricerca Live",
  freeBadge: TRIAL_COPY.it.homeFreeBadge,
  trialBadge: TRIAL_COPY.it.homeTrialBadge,
  directoryCopy: HOME_DIRECTORY_COPY.it,
  Navigation: { ...IT.Navigation, StatesLabel: "Regioni" },
  HomePage: {
    ...IT.HomePage,
    Faq: {
      Eyebrow: "Normativa italiana (Codice di Procedura Civile)",
      Title: "Domande frequenti sulle aste giudiziarie in Italia.",
      Description: "Ogni risposta cita gli articoli del Codice di Procedura Civile (c.p.c.) e la normativa fiscale italiana vigente.",
      SourceLabel: "Norma",
      Items: [
        {
          Question: "Chi può partecipare a un'asta giudiziaria immobiliare in Italia?",
          Answer: "Chiunque, persona fisica o società, eccetto il debitore esecutato (Art. 571 e 579 c.p.c.). Nelle vendite telematiche sul Portale delle Vendite Pubbliche (PVP) l'offerta si presenta digitalmente tramite PEC per la vendita telematica o firma digitale.",
          Sources: ["Art. 571 c.p.c.", "Art. 579 c.p.c.", "D.M. 32/2015"],
        },
        {
          Question: "Che differenza c'è tra Prezzo Base e Offerta Minima (-25%)?",
          Answer: "Ai sensi dell'Art. 571 comma 2 c.p.c., l'offerta è valida ed efficace anche se inferiore fino a un quarto (25%) rispetto al prezzo base d'asta fissato nell'ordinanza di vendita (ossia pari almeno al 75% del prezzo base).",
          Sources: ["Art. 571 c.p.c.", "Art. 572 c.p.c."],
        },
        {
          Question: "A quanto ammonta la cauzione e quando viene restituita se non aggiudico?",
          Answer: "La cauzione minima di legge è pari al 10% del prezzo offerto (salvo percentuale maggiore fissata dal giudice nell'avviso di vendita) e va versata tramite bonifico bancario sul conto della procedura (o assegno circolare nelle aste analogiche). In caso di mancata aggiudicazione viene integralmente restituita.",
          Sources: ["Art. 571 c.p.c.", "Art. 580 c.p.c."],
        },
        {
          Question: "Quali imposte si pagano sull'acquisto all'asta in Italia?",
          Answer: "Per i privati: imposta di registro al 2% con agevolazione 'Prima Casa' (con calcolo spesso sul valore catastale tramite 'prezzo-valore') oppure 9% per seconda casa, più imposte ipotecaria e catastale fisse (50 € ciascuna). Non si pagano né provvigioni d'agenzia né atto notarile di compravendita: la proprietà passa con il Decreto di Trasferimento del Giudice, che ordina anche la cancellazione di ipoteche e pignoramenti.",
          Sources: ["Art. 586 c.p.c.", "D.P.R. 131/1986"],
        },
        {
          Question: "Come funziona la liberazione dell'immobile occupato?",
          Answer: "Con la riforma Cartabia del nuovo Art. 560 c.p.c., il custode giudiziario attua l'ordine di liberazione a spese della procedura, senza che l'aggiudicatario debba avviare una separata causa di sfratto (salvo contratti di locazione con data certa anteriore al pignoramento opponibili alla procedura).",
          Sources: ["Art. 560 c.p.c.", "Art. 2923 c.c."],
        },
        {
          Question: "Dove si consultano la perizia CTU e l'avviso di vendita?",
          Answer: "Il Giudice dell'Esecuzione nomina un Consulente Tecnico d'Ufficio (CTU) che redige la perizia estimativa completa di stato urbanistico, catastale ed eventuali abusi sanabili (Art. 568 c.p.c.). Tutti i PDF sono pubblicati sul PVP e sui siti autorizzati.",
          Sources: ["Art. 568 c.p.c.", "Art. 490 c.p.c."],
        },
      ],
      MoreTitle: "Altre domande sulle aste PVP?",
      MoreCta: "Contattaci",
    },
  },
  Footer: {
    ...IT.Footer,
    SourceZvg: "pvp.giustizia.it · Portali Autorizzati",
    SourceLaw: "Codice di Procedura Civile (Art. 568–591 c.p.c.)",
    SourceJustiz: "pst.giustizia.it",
  },
};

/** 🇪🇸 España — 100% Ley de Enjuiciamiento Civil (LEC) & Portal de Subastas BOE */
export const HOME_ES: HomeCountryProfile = {
  selectorCode: "ES",
  pricingCountry: "ES",
  formatLocale: "es",
  htmlLang: "es",
  liveSearchLabel: "Buscador",
  freeBadge: TRIAL_COPY.es.homeFreeBadge,
  trialBadge: TRIAL_COPY.es.homeTrialBadge,
  directoryCopy: HOME_DIRECTORY_COPY.es,
  Navigation: { ...ES.Navigation, StatesLabel: "Comunidades" },
  HomePage: {
    ...ES.HomePage,
    Faq: {
      Eyebrow: "Marco legal en España (Ley de Enjuiciamiento Civil)",
      Title: "Preguntas frecuentes sobre las subastas del Portal BOE.",
      Description: "Cada respuesta cita los preceptos vigentes de la Ley de Enjuiciamiento Civil (LEC), la LAU y la normativa del ITP.",
      SourceLabel: "Norma",
      Items: [
        {
          Question: "¿Quién puede participar en una subasta electrónica del Portal BOE?",
          Answer: "Cualquier persona física o jurídica con capacidad de obrar (excepto el ejecutado), acreditándose en subastas.boe.es mediante certificado electrónico o sistema Cl@ve y constituyendo previamente el depósito obligatorio del 5%.",
          Sources: ["Art. 647 LEC", "Art. 648 LEC"],
        },
        {
          Question: "¿Cómo funcionan las reglas del 70% y del 50% en el Art. 670 LEC?",
          Answer: "Si la mejor postura es igual o superior al 70% del valor de subasta, el Letrado de la Administración de Justicia aprueba el remate directamente a favor del mejor postor (con 40 días hábiles para pagar el resto). Entre el 50% y el 70%, el ejecutado dispone de 10 días para presentar a un tercero que mejore la postura y, en su defecto, el ejecutante puede pedir la adjudicación; si nadie lo ejerce, se aprueba el remate siempre que supere el 50% del valor de tasación o cubra toda la deuda reclamada.",
          Sources: ["Art. 670.1–4 LEC"],
        },
        {
          Question: "¿Cuánto es el depósito para pujar y cuándo se devuelve?",
          Answer: "El depósito electrónico en las subastas judiciales y de la AEAT en el Portal BOE es exactamente el 5% del valor de subasta (Art. 647.1.3.º LEC). Si no resultas adjudicatario (y no hiciste reserva de postura), el sistema libera y devuelve la consignación automáticamente tras el cierre.",
          Sources: ["Art. 647 LEC", "Art. 652 LEC"],
        },
        {
          Question: "¿Qué ocurre con las cargas anteriores y posteriores a la ejecución?",
          Answer: "El decreto de adjudicación y el mandamiento de cancelación extinguen la carga que motiva la subasta y todas las inscripciones y anotaciones posteriores, pero las cargas, hipotecas o embargos anteriores subsisten y el adjudicatario se subroga en ellos (Art. 670.5 LEC). Por eso es esencial revisar la certificación registral de cargas.",
          Sources: ["Art. 656 LEC", "Art. 670.5 LEC", "Art. 674 LEC"],
        },
        {
          Question: "¿Qué impuestos paga el comprador en una subasta en España?",
          Answer: "En segunda transmisión de viviendas y locales usados se tributa por el Impuesto sobre Transmisiones Patrimoniales (ITP), cuyo tipo general varía entre el 4% (País Vasco), 6% (Madrid, Navarra), 6,5% (Canarias), 7% (Andalucía) y el 10% (Cataluña, Comunidad Valenciana), más inscripción en el Registro de la Propiedad. Cero comisión de agencia.",
          Sources: ["RDL 1/1993 ITP-AJD"],
        },
        {
          Question: "¿Qué sucede si el inmueble tiene inquilinos u ocupantes?",
          Answer: "La situación arrendaticia se rige por el Art. 13 de la Ley de Arrendamientos Urbanos (LAU) y el Art. 661 LEC; si existen ocupantes sin título suficiente, el adjudicatario puede solicitar el lanzamiento judicial dentro del propio procedimiento de ejecución en el plazo de un año desde la adquisición (Art. 675 LEC).",
          Sources: ["Art. 661 LEC", "Art. 675 LEC", "Art. 13 LAU"],
        },
      ],
      MoreTitle: "¿Tienes otra duda sobre subastas BOE?",
      MoreCta: "Contactar",
    },
  },
  Footer: {
    ...ES.Footer,
    SourceZvg: "subastas.boe.es · AEAT",
    SourceLaw: "Ley de Enjuiciamiento Civil (Arts. 643–675 LEC)",
    SourceJustiz: "boe.es",
  },
};

/** 🇫🇷 France — 100% Tribunaux Judiciaires, Licitor & Code des procédures civiles d'exécution (CPCE) */
export const HOME_FR: HomeCountryProfile = {
  selectorCode: "FR",
  pricingCountry: "FR",
  formatLocale: "fr",
  htmlLang: "fr",
  liveSearchLabel: "Recherche",
  freeBadge: TRIAL_COPY.fr.homeFreeBadge,
  trialBadge: TRIAL_COPY.fr.homeTrialBadge,
  directoryCopy: HOME_DIRECTORY_COPY.fr,
  Navigation: { ...FR.Navigation, StatesLabel: "Régions" },
  HomePage: {
    ...FR.HomePage,
    Faq: {
      Eyebrow: "Cadre juridique en France (CPCE)",
      Title: "Questions fréquentes sur les enchères des Tribunaux Judiciaires.",
      Description: "Chaque réponse cite le Code des procédures civiles d'exécution (CPCE) applicable aux saisies immobilières et licitations.",
      SourceLabel: "Texte",
      Items: [
        {
          Question: "Peut-on enchérir soi-même au Tribunal Judiciaire en France ?",
          Answer: "Non : lors d'une audience d'adjudication devant le Juge de l'Exécution du Tribunal Judiciaire, vous devez obligatoirement être représenté par un avocat inscrit au barreau du ressort du tribunal où a lieu la vente (Art. R. 322-40 CPCE), muni d'un mandat écrit de plafonnement d'enchère.",
          Sources: ["Art. R. 322-40 CPCE"],
        },
        {
          Question: "À combien s'élève la consignation (chèque de banque / CARPA) ?",
          Answer: "Pour pouvoir porter les enchères, votre avocat doit détenir un chèque de banque certifié à l'ordre du bâtonnier / compte séquestre CARPA (ou caution bancaire irrévocable) égal à 10 % de la mise à prix, sans que ce montant puisse être inférieur à 3 000 € (Art. R. 322-41 CPCE). Il vous est restitué immédiatement à l'issue de l'audience si vous n'êtes pas adjudicataire.",
          Sources: ["Art. R. 322-41 CPCE", "Art. R. 322-49 CPCE"],
        },
        {
          Question: "Qu'est-ce que le délai de surenchère de 10 jours (+10 %) ?",
          Answer: "Dans les 10 jours suivant l'audience d'adjudication, toute personne (par ministère d'avocat) peut former une surenchère du dixième (+10 % minimum au-dessus du prix principal d'adjudication), ce qui remet le bien aux enchères lors d'une nouvelle et dernière audience. Passé ce délai de 10 jours sans surenchère, la vente devient définitive.",
          Sources: ["Art. R. 322-50 à R. 322-55 CPCE"],
        },
        {
          Question: "Quels frais s'ajoutent au prix d'adjudication en France ?",
          Answer: "Outre le prix d'adjudication (payable sous 2 mois sans intérêts), l'adjudicataire règle : les frais préalables de poursuite taxés par le juge, les émoluments proportionnels de vente, les droits d'enregistrement (~5,80 % pour un particulier, ou 0,715 % sous régime marchand de biens avec engagement de revente) et les frais de publication foncière.",
          Sources: ["Art. R. 322-56 CPCE", "Art. R. 322-58 CPCE"],
        },
        {
          Question: "Que contient le Cahier des conditions de vente (CCV) ?",
          Answer: "Déposé au greffe du juge de l'exécution, il réunit le procès-verbal de description dressé par commissaire de justice, les diagnostics techniques (DPE, amiante, plomb, métrage Loi Carrez), l'état hypothécaire, les charges de copropriété et la situation d'occupation (libre, loué ou occupé par le saisi).",
          Sources: ["Art. R. 322-10 CPCE", "Art. R. 322-11 CPCE"],
        },
        {
          Question: "Comment se passe l'expulsion si le débiteur saisi occupe encore le bien ?",
          Answer: "Le jugement d'adjudication vaut titre d'expulsion à l'encontre du saisi et de tout occupant de son chef n'ayant aucun droit opposable antérieur au commandement de payer valant saisie (Art. L. 322-13 CPCE), dès le versement du prix et des frais.",
          Sources: ["Art. L. 322-13 CPCE"],
        },
      ],
      MoreTitle: "Une question sur les ventes judiciaires en France ?",
      MoreCta: "Nous contacter",
    },
  },
  Footer: {
    ...FR.Footer,
    SourceZvg: "licitor.com · Greffes des Tribunaux Judiciaires",
    SourceLaw: "Code des procédures civiles d'exécution (CPCE)",
    SourceJustiz: "justice.fr",
  },
};
