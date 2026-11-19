import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_NL } from "./closingTasksNl";

export const CLOSING_NL: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "Na de gunning — Belowmark",
      description: "Checklist na gunning: betaling, overdrachtsbelasting, kadaster, ontruiming, verzekering en renovatie — met termijnen en gekoppelde wetsartikelen.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Gunning", "Executieveiling", "Kadaster", "Ontruiming"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "Veilingresultaten — Belowmark",
      description: "Wat executieveilingen opbrengen: winnende biedingen ten opzichte van de taxatiewaarde, samengesteld uit gemelde resultaten, anoniem vanaf vijf zittingen per groep.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Winnend bod", "Taxatiewaarde", "Veilingresultaat", "Executieveiling"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "Na de zitting",
    Title: "Uitkomst & Gunning",
    Lead: {
      DE: "Was u bij de zitting aanwezig? Vul in wat er is geboden. Het officiële portaal publiceert geen uitkomsten — uw meldingen bouwen een anoniem prijsoverzicht op. Heeft u zelf de gunning verkregen, dan begeleidt de checklist u tot aan de inschrijving in het kadaster.",
      TR: "Heeft u de veiling gevolgd? Vul in wat er is geboden. Het portaal publiceert geen openbare uitkomsten — uw meldingen bouwen een anoniem prijsoverzicht op. Heeft u zelf de veiling (ihale) gewonnen, dan begeleidt de checklist u tot aan de Tapu-inschrijving.",
    },
  },

  Result: {
    Title: "Zittingsuitkomst melden",
    Lead: "Alleen cijfers, geen namen. U kunt uw melding op elk moment aanpassen.",
    NotYet: "U kunt een uitkomst vastleggen vanaf de dag van de zitting.",
    HearingDate: "Zittingsdatum",
    Outcome: "Uitkomst",
    Outcomes: {
      awarded: "Gegund",
      refused: "Gunning geweigerd",
      pending: "Beslissing aangehouden",
      noBids: "Geen biedingen",
      cancelled: "Zitting niet doorgegaan",
    },
    HighestBid: {
      DE: { label: "Hoogste bod (contant bod / Bargebot)", hint: "Zoals vermeld in het proces-verbaal of de gunningsbeschikking" },
      TR: { label: "Winnend bod (ihale bedeli)", hint: "Zoals vermeld in het veilingresultaatprotocol" },
    },
    RetainedRights: { label: "In stand blijvende rechten", hint: "Indien vermeld — zij maken deel uit van de economische koopprijs" },
    BidderCount: { label: "Aantal bieders", hint: "Indien bekend" },
    Source: "Waar komen uw cijfers vandaan?",
    Sources: { attended: "Zelf aanwezig geweest", protocol: "Proces-verbaal / beschikking", court: "Informatie van de rechtbank" },
    IsBuyer: { DE: "Ik heb de gunning verkregen", TR: "Ik heb de veiling (ihale) gewonnen" },
    AwardDate: {
      DE: { label: "Gunning uitgesproken op", hint: "Leeg laten = zittingsdatum" },
      TR: { label: "Protocol gepubliceerd op", hint: "Vanaf deze dag loopt de betalingstermijn van 7 dagen" },
    },
    Shared: { label: "Anoniem opnemen in het prijsoverzicht", hint: "Alleen een mediaan per regio en objecttype wordt getoond, vanaf vijf zittingen — nooit uw afzonderlijke melding." },
    Privacy: "Wij slaan zittingsdatum, uitkomst, bedragen en aantal bieders op bij dit zaaknummer — nooit namen van bieders, kopers of eigenaren.",
    Save: "Uitkomst opslaan",
    Saved: "Opgeslagen.",
    SavedBuyer: "Opgeslagen. Uw checklist na gunning staat klaar.",
    Errors: {
      auth: "Log opnieuw in.",
      locked: "De checklist na gunning is onderdeel van het Investor-abonnement.",
      date: "Vul een geldige datum in (niet vóór de zitting).",
      future: "Uitkomsten kunnen pas vanaf de dag van de zitting worden gemeld.",
      outcome: "Selecteer de uitkomst.",
      bid: "Vul bij een gunning het winnende bod in (geheel getal).",
      ratio: "Het bod staat niet in verhouding tot de taxatiewaarde — controleer uw invoer.",
      bidders: "Vul een aannemelijk aantal bieders in.",
      buyer: "“Ik heb de gunning verkregen” is alleen mogelijk bij de uitkomst “Gegund”.",
      unknown: "Opslaan mislukt. Probeer het opnieuw.",
    },
    Ratio: "{pct} van de taxatiewaarde",
    StatsLink: "Prijsoverzicht bekijken",
  },

  Teaser: {
    Title: "Uw checklist na de gunning",
    Lead: "Betaling, belasting, kadaster, inbezitneming, verzekering, renovatie — berekend met uw eigen termijnen.",
    Button: "Checklist openen",
    Progress: "{done} van {total} afgerond",
    Next: "Volgende: {title} · {date}",
    NoDate: "Vul de gunningsdatum in zodat de checklist uw termijnen kan berekenen.",
  },

  Tasks: {
    Kicker: "Na de gunning",
    Title: "Checklist na gunning",
    Lead: {
      DE: "Van de gunning tot kadastrale inschrijving en oplevering. Wij berekenen termijnen strikt op basis van de door u ingevoerde data. Elke stap verwijst naar de toepasselijke wetsbepaling.",
      TR: "Van de ihale tot Tapu-inschrijving en oplevering. Wij berekenen termijnen strikt op basis van de door u ingevoerde data. Elke stap verwijst naar de toepasselijke wetsbepaling.",
    },
    Back: "Terug naar dossier",
    Disclaimer:
      "Deze checklist dient uitsluitend ter oriëntatie en vormt geen juridisch advies. Zij vat wettelijke bepalingen vereenvoudigd samen (stand 26-10-2026) en houdt geen rekening met uw individuele situatie. Raadpleeg voor termijnen, opzeggingen en ontruiming de rechtbank, een notaris of een advocaat.",
    Locked: {
      Title: "Checklist in het Investor-abonnement",
      Body: "Uw uitkomst is opgeslagen. De checklist na gunning met berekende termijnen en herinneringen is inbegrepen in het Investor-abonnement.",
      Cta: "Upgraden naar Investor",
    },
    Dates: {
      Title: "Uw data",
      Lead: "De checklist berekent termijnen op basis van deze data. Laat leeg wat u nog niet weet.",
      Fields: {
        DE: {
          awardDate: { label: "Gunning uitgesproken op", hint: "Verplicht" },
          distributionDate: { label: "Verdelingszitting (Verteilungstermin)", hint: "Vermeld in de oproep van de rechtbank" },
          taxNoticeDate: { label: "Aanslag overdrachtsbelasting d.d.", hint: "Datum van bekendmaking" },
          handoverDate: { label: "Oplevering / ontruiming op", hint: "Gepland of uitgevoerd" },
        },
        TR: {
          awardDate: { label: "Veilingprotocol gepubliceerd op", hint: "Verplicht — start de termijn van 7 dagen" },
          handoverDate: { label: "Oplevering / ontruiming op", hint: "Gepland of uitgevoerd" },
        },
      },
      FromPortfolio: "Vooringevuld vanuit uw portefeuille — sla de gegevens op.",
      Save: "Data opslaan",
      Saved: "Opgeslagen.",
      Required: "Vul ten minste de gunningsdatum in.",
      Errors: {
        auth: "Log opnieuw in.",
        locked: "De checklist na gunning is onderdeel van het Investor-abonnement.",
        date: "Vul ten minste de gunningsdatum in.",
        unknown: "Opslaan mislukt. Probeer het opnieuw.",
      },
    },
    Conditions: {
      Title: "Uw situatie",
      Lead: "Toont alleen de taken die voor uw object van toepassing zijn. Wordt in deze browser opgeslagen.",
      Items: { tenant: "Er zijn huurders", ownerOccupied: "Vorige eigenaar woont er nog", condo: "Appartementsrecht", house: "Een- of tweegezinswoning" },
    },
    Phases: { first: "Eerste dagen", payment: "Betaling", register: "Belasting & Kadaster", possession: "Bezit & Huurders", works: "Renovatie & Beheer" },
    Due: { deadline: "uiterlijk {date}", earliest: "op zijn vroegst {date}", on: "vanaf {date}" },
    Missing: "Ontbrekende datum: {field}",
    States: { done: "Afgerond", overdue: "Verstreken", soon: "Binnenkort", open: "Open", undated: "Geen datum" },
    Basis: { law: "Wet", practice: "Praktijk", rule: "Belowmark-regel" },
    Check: "Wettelijke regeling gewijzigd of nog niet uitgekristalliseerd — controleren",
    MarkDone: "Afgerond",
    MarkOpen: "Heropenen",
    Sources: "Bronnen",
    Progress: "{done} van {total} afgerond",
    Items: CLOSING_TASKS_NL,
  },

  Results: {
    Kicker: "Zittingsuitkomsten",
    Title: "Wat er daadwerkelijk wordt betaald",
    Lead: "Gemelde winnende biedingen ten opzichte van de taxatiewaarde. Cijfers zijn aangeleverd door gebruikers, niet door rechtbanken — zij geven een algemeen prijsniveau weer, geen taxatie voor uw object.",
    Method: {
      Title: "Hoe wij rekenen",
      Items: [
        "Verhouding = (hoogste bod + in stand blijvende rechten) ÷ taxatiewaarde volgens de officiële bekendmaking.",
        "Als meerdere gebruikers dezelfde zitting melden, telt deze één keer mee op basis van de mediaan van de meldingen.",
        "Cijfers worden pas getoond vanaf vijf zittingen per groep. Daaronder tonen wij alleen het aantal.",
        "In het overzicht verschijnen geen namen en geen zaaknummers. Alleen u ziet uw eigen meldingen.",
      ],
    },
    Table: { Region: "Regio", Segment: "Objecttype", Awarded: "Gunningen", Median: "Mediaan", Range: "Middelste helft (IQR)", Bidders: "Bieders (mediaan)", Reported: "Gemelde zittingen" },
    AllSegments: "Alle objecttypes",
    Total: "Totaal",
    OtherRegion: "Geen regio",
    TooFew: "{n} — te weinig (vanaf {min})",
    Empty: "Nog geen meldingen in uw markt. Het overzicht vult zich zodra gebruikers zittingsuitkomsten invullen op de dossierpagina onder “Uitkomst & Gunning”.",
    Locked: "Het prijsoverzicht is onderdeel van het Investor-abonnement. U kunt wel uitkomsten melden.",
    Own: { Title: "Uw meldingen", Lead: "Alleen zichtbaar voor u.", Empty: "U heeft nog geen uitkomsten gemeld.", Shared: "in overzicht", Private: "privé", Buyer: "Uw gunning" },
  },
};
