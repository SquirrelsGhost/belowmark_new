import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_NL: IDeadlineTranslation = {
  MetaTags: {
    title: "Veilingbegeleider — Belowmark",
    description:
      "Elke termijn van publicatie tot gunning met wettelijke grondslag: 10% waarborgsom, bankgarantie, veilingdatum en teminat. Herinneringen per e-mail en kalenderfeed.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Termijnen", "Executieveiling", "Waarborgsom", "Kalender"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Termijnen",

  Section: {
    Eyebrow: "Veilingbegeleider",
    Title: "Termijnen & Stappenplan",
    Lead: {
      DE: "Elke termijn tot aan de gunning, berekend vanaf de veilingdatum in de officiële publicatie en onderbouwd met wettelijke verwijzingen. Volg het dossier voor e-mail- en agenderherinneringen.",
      TR: "Elke termijn van de e-Satış-biedronden, berekend uit de İlan-data en onderbouwd met wettelijke regels. Volg het dossier voor e-mail- en agendaherinneringen.",
    },
    Locked: {
      Title: "Termijnen met herinneringen",
      Body: "De Veilingbegeleider berekent de uiterste datum voor de 10% waarborgsom, bankcheque en gunning uit de officiële publicatie en herinnert u per e-mail en agenda. Inbegrepen in het Investor-pakket.",
    },
    NoDates: "De officiële publicatie vermeldt geen veilingdatum, waardoor geen termijnen kunnen worden berekend.",
    Cancelled: "Het dossier is ingetrokken. Er lopen geen termijnen meer.",
    Phases: { before: "Vóór de veiling", hearing: "Veiling", after: "Na gunning" },
    Basis: { law: "Wet", notice: "Officiële publicatie", user: "Uw invoer", rule: "belowmark-aanbeveling" },
    Kinds: { deadline: "Deadline", appointment: "Veiling", task: "Vanaf dan", info: "Ter oriëntatie" },
    AfterAwardEmpty:
      "Termijnen na gunning (betaling koopsom, overdrachtsbelasting, kadasterinschrijving, ontruiming) verschijnen hier zodra u de uitkomst van de veiling vastlegt.",
    Reminders: "Herinnering",
    ReminderDay: "1 dag ervoor",
    ReminderDays: "{days} dagen ervoor",
    ReminderToday: "op de dag zelf",
    Disclaimer:
      "Berekend zonder rekening te houden met feestdagen en bewust behoudend zodat geen enkele datum te laat valt. De wet en de officiële oproeping blijven leidend; geen juridisch advies.",
  },

  Status: {
    Past: "verlopen",
    Today: "vandaag",
    Tomorrow: "morgen",
    InDays: "over {days} dagen",
  },

  Follow: {
    Start: "Dossier volgen",
    Stop: "Niet meer volgen",
    Following: "U volgt dit dossier.",
    NotFollowing: "Nog geen herinneringen ingesteld.",
    MailOn: "E-mailherinnering aan",
    MailOff: "E-mailherinnering uit",
    Download: "Termijnen als agenda (.ics)",
    Overview: "Alle termijnen",
    Error: "Dat is niet gelukt. Probeer het opnieuw.",
  },

  Checklist: {
    Title: "Stappenplan naar de veiling",
    Hint: "Aangevinkte punten blijven opgeslagen in deze browser. Stappen met een belowmark-controle worden automatisch herkend.",
    Progress: "{done} van {total} voltooid",
    Auto: "herkend",
    Steps: {
      DE: [
        {
          id: "gutachten",
          Label: "Taxatierapport en veilingvoorwaarden laten lezen",
          Hint: "Upload het taxatierapport of de veilingvoorwaarden; de risicocheck controleert rechten, huurders en bouwjaar.",
        },
        {
          id: "inspection",
          Label: "Het object bezichtigen",
          Hint: "Minstens van buitenaf; bijbehorende aandachtspunten staan in het onderdeel Oordeel.",
        },
        {
          id: "limit",
          Label: "Uw biedlimiet vaststellen",
          Hint: "Tot welk bod blijft het rendement gezond? Uw cijfers, uw bovengrens.",
        },
        {
          id: "bank",
          Label: "Financiering regelen",
          Hint: "Het bankdossier toont uw financier het betalingsschema en de wettelijke termijnen.",
        },
        {
          id: "deposit",
          Label: "Waarborgsom (10%) regelen",
          Hint: "Overboeking op kwaliteitsrekening, gecertificeerde bankcheque of bankgarantie: exacte data staan in de tijdlijn.",
        },
        {
          id: "papers",
          Label: "Biedersmap afdrukken",
          Hint: "Legitimatiebewijs, notariële volmacht, bewijs van waarborgsom en uw biedlimiet op papier.",
        },
      ],
      TR: [
        {
          id: "gutachten",
          Label: "Het kıymet takdir raporu doornemen",
          Hint: "Upload het taxatierapport; de risicocheck controleert rechten, huurders en bouwkundige staat.",
        },
        {
          id: "inspection",
          Label: "Het object bezichtigen",
          Hint: "Minstens van buitenaf; bijbehorende aandachtspunten staan in het onderdeel Oordeel.",
        },
        {
          id: "limit",
          Label: "Uw teklif-limiet vaststellen",
          Hint: "Tot welk bod is het financieel zinvol, inclusief tapu harcı en KDV?",
        },
        {
          id: "bank",
          Label: "Financiering vooraf regelen",
          Hint: "Na afloop van de biedronde heeft u slechts 7 dagen om te betalen; zonder voorafgaand bankakkoord is dat krap.",
        },
        {
          id: "deposit",
          Label: "De teminat storten",
          Hint: "Contant via het portaal of via teminat mektubu: de deadlines staan in de tijdlijn.",
        },
        {
          id: "papers",
          Label: "e-Devlet en portaaltoegang testen",
          Hint: "Bieden is alleen mogelijk wanneer u via e-Devlet bent ingelogd op het e-Satış-portaal.",
        },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "Officiële publicatie verschenen",
        Detail: "De veiling moet minstens zes weken vooraf worden aangekondigd. Hier begint uw voorbereiding.",
      },
      Transfer: {
        Title: "Waarborgsom per overboeking: bijgeschreven",
        Detail:
          "Contant geld is uitgesloten. Een overboeking telt alleen als het bedrag vóór de veiling is bijgeschreven op de rekening van de rechtbank of kwaliteitsrekening en u het bewijs overlegt. De instantie verstrekt rekeningnummer en betalingskenmerk. Behoudend berekend: de dag ervoor.{amount}",
      },
      Cheque: {
        Title: "Vroegste uitgiftedatum voor gecertificeerde bankcheque",
        Detail:
          "Een gecertificeerde bankcheque (Verrechnungsscheck) is alleen geldig als deze niet eerder dan de derde werkdag vóór de veiling is afgegeven door een in Duitsland vergunde bank of de Bundesbank en in het binnenland betaalbaar is. Eerder afgegeven cheques worden geweigerd. Berekend met zaterdag als werkdag en zonder feestdagen, zodat u nooit te vroeg bent.",
      },
      Hearing: {
        Title: "Zitting executieveiling",
        Detail:
          "{authority}. Tussen de oproep tot bieden en het sluiten van de bieding moeten minstens 30 minuten verstrijken. Meenemen: legitimatiebewijs, bewijs van waarborgsom en een notarieel gewaarmerkte volmacht als u namens iemand anders biedt.",
      },
      Award: {
        Title: "Uiterste datum voor uitspraak gunning (streeftermijn)",
        Detail:
          "De gunning wordt uitgesproken op de veiling zelf of tijdens een afzonderlijke zitting die in beginsel uiterlijk een week later plaatsvindt. Met de gunning wordt u eigenaar. De instantie bepaalt de exacte datum.",
      },
      Amount: " Bedrag indien zekerheid wordt verlangd: {amount} (10% van de taxatiewaarde).",
    },
    TR: {
      Notice: {
        Title: "İlan gepubliceerd",
        Detail: "De biedronde moet minstens 15 dagen vóór aanvang op het e-Satış-portaal worden aangekondigd.",
      },
      RoundStart: {
        Title: "Ronde {round} (Artırma) start",
        Detail: "Er kan nu worden geboden op het e-Satış-portaal; de ronde duurt zeven dagen.{startingBid}",
      },
      Cash: {
        Title: "Ronde {round} (Artırma): contante teminat uiterlijk 23:30",
        Detail:
          "Stort de waarborgsom via het portaal uiterlijk om 23:30 uur op de dag vóór het einde van de ronde op de rekening van de İcra dairesi.{amount}",
      },
      Letter: {
        Title: "Ronde {round} (Artırma): teminat mektubu vóór sluitingstijd",
        Detail:
          "Een bankgarantiebrief moet uiterlijk vóór sluitingstijd van de werkdag vóór het einde van de ronde bij de İcra dairesi zijn ontvangen. Feestdagen worden niet afgetrokken: valt die dag op een feestdag, dan geldt de voorafgaande werkdag.",
      },
      RoundEnd: {
        Title: "Ronde {round} (Artırma) eindigt",
        Detail:
          "Wordt er in de laatste tien minuten geboden, dan wordt de ronde per bod met drie minuten verlengd tot maximaal één uur. Daarna verschijnt het uitkomstprotocol; vanaf dat moment heeft u zeven dagen om te betalen.",
      },
      Amount: " Bedrag: {amount} (10% van de taxatiewaarde).",
      StartingBid: " Startbod conform de İlan: {amount}.",
    },
  },

  Page: {
    Eyebrow: "Veilingbegeleider",
    Title: "Termijnen",
    Lead: "Alle termijnen voor de dossiers die u volgt in één overzicht. Herinneringen per e-mail en gesynchroniseerd in uw eigen agenda.",
    Count: "{count} gevolgd",
    Empty: {
      Title: "U volgt nog geen dossiers",
      Body: "Open een veilingdossier en klik onder “Termijnen & Stappenplan” op “Dossier volgen”.",
      Cta: "Naar zoeken",
    },
    Next: "Eerstvolgend",
    NothingAhead: "Geen aankomende termijnen.",
    OpenListing: "Dossier openen",
    Missing: "Niet meer in de actuele dataset",
    Feed: {
      Title: "Agenda-abonnement",
      Body: "Voeg dit adres als abonnement toe in Google Agenda, Outlook of Apple Agenda (“Via URL”). Nieuwe dossiers en verplaatste veilingdata worden automatisch gesynchroniseerd, inclusief voorafgaande herinneringen.",
      Create: "Feed-URL aanmaken",
      Renew: "Nieuwe URL aanmaken",
      Copy: "Kopiëren",
      Copied: "Gekopieerd",
      Shown:
        "Alleen nu zichtbaar. Wij slaan dit adres niet leesbaar op; iedereen die de URL kent kan uw termijnen inzien.",
      Hidden:
        "Er is een agendafeed actief. URL kwijt? Maak een nieuwe aan — het oude adres stopt direct met werken.",
      Error: "Feed-URL kon niet worden aangemaakt.",
    },
    HowItWorks:
      "Herinneringen worden 's ochtends per e-mail verzonden en verschijnen in uw agendafeed op de dagen die naast elke termijn staan. Veilingdata komen uit de officiële publicaties; wijzigt een datum, dan wordt de termijn bij de eerstvolgende synchronisatie bijgewerkt.",
  },

  Mail: {
    Subject: "{count} aankomende termijnen",
    SubjectOne: "Één aankomende termijn",
    Preheader: "Uw Veilingbegeleider van belowmark.",
    Greeting: "Hallo,",
    Intro: "dit staat er binnenkort op de planning voor de dossiers die u volgt:",
    Today: "vandaag",
    Tomorrow: "morgen",
    InDays: "over {days} dagen",
    OpenListing: "Dossier openen",
    Manage: "Herinneringen beheren",
    Signature: "Uw belowmark-team",
    Footer: "U ontvangt deze e-mail omdat u een dossier volgt. Afmelden kan onder “Termijnen”.",
    Source: "Wettelijke grondslag",
  },

  Ics: {
    CalendarName: "belowmark Termijnen",
    Source: "Bron",
  },
};
