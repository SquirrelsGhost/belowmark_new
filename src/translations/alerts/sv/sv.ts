import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_SV: IAlertsTranslation = {
  MetaTags: {
    title: "Bevakningar — Belowmark",
    description: "Sparade sökningar med e-postlarm: få besked direkt när ett matchande exekutivt ärende kungörs eller ett auktionsdatum ändras.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Bevakningar", "Exekutiv auktion", "Sparad sökning"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Bevakningar",

  Page: {
    Eyebrow: "Sparade sökningar",
    Title: "Bevakningar",
    Lead: "Varje bevakning är en sparad sökning. När ett nytt matchande ärende dyker upp eller myndigheten ändrar ett auktionsdatum får du ett mejl — med ärendenummer och direktlänk till ärendeakten.",
    Usage: "{count} av {max} bevakningar",
    Empty: {
      Title: "Inga bevakningar ännu.",
      Body: "Ställ in dina filter bland kungörelserna — län/region, objekttyp, värdeintervall, sökord — och spara sökningen som en bevakning direkt under antalet träffar.",
      Cta: "Gå till kungörelser",
    },
    HowItWorks:
      "Jämförelser körs efter varje uppdatering av de officiella registren. Vi rapporterar enbart det som den officiella kungörelsen själv anger: ett nytt ärende, ett ändrat datum eller en inställd auktion. Tidsintervall och sortering ingår inte i bevakningen — den blickar alltid framåt.",
  },

  Card: {
    Active: "Aktiv",
    Paused: "Pausad",
    Pause: "Pausa",
    Resume: "Återuppta",
    Delete: "Ta bort",
    OpenSearch: "Öppna sökning",
    Matches: "{count} öppna träffar",
    MatchesOne: "1 öppen träff",
    NotifyNew: "Nya ärenden",
    NotifyChanges: "Datumändringar",
    LastSent: "Senaste mejl: {date}",
    NeverSent: "Inget mejl skickat ännu",
    LastChecked: "Kontrollerad: {date}",
    Error: "Något gick fel. Försök igen.",
  },

  Summary: {
    AllRegions: { DE: "Alla län / regioner", TR: "Alla provinser" },
    AllSegments: "Alla objekttyper",
    Query: "”{query}”",
    Min: "från {value}",
    Max: "upp till {value}",
  },

  Save: {
    Toggle: "Spara sökning som bevakning",
    Title: "Skapa bevakning",
    NameLabel: "Namn",
    NotifyNew: "Mejl vid nya ärenden",
    NotifyChanges: "Mejl vid datumändringar och inställda auktioner",
    Hint: "Sparar sökord, region, objekttyp och värdeintervall. Nuvarande träffar markeras som kända — aviseringar gäller förändringar framöver.",
    Submit: "Spara bevakning",
    Pending: "Sparar …",
    Saved: "Sparad. Du får ett mejl så snart något ändras.",
    Manage: "Hantera bevakningar",
    Errors: {
      limit: "Du har redan 10 bevakningar. Ta bort en innan du skapar en ny.",
      invalid: "Namnge bevakningen och välj minst ett aviseringsalternativ.",
      failed: "Bevakningen kunde inte sparas. Försök igen.",
    },
  },

  Mail: {
    Subject: "{count} uppdateringar för dina bevakningar",
    SubjectOne: "1 uppdatering för dina bevakningar",
    Preheader: "Nya ärenden och ändrade auktionsdatum från dina sparade sökningar.",
    Greeting: "Hej,",
    Intro: "sedan vår senaste kontroll har följande förändringar skett i dina sparade sökningar:",
    Kinds: { new: "Ny", cancelled: "Inställd", reinstated: "Återupptagen", rescheduled: "Ombokad" },
    NextDate: "Auktion {date}",
    Moved: "tidigare {before}, nu {after}",
    Value: { DE: "Marknadsvärde", TR: "Muhammen bedel" },
    More: "+ {count} till",
    OpenSearch: "Öppna sökning",
    LockedValues: "Fullständiga ärendenummer, gatuadresser och värderings-PDF:er låses upp med full åtkomst (eller via din 1 kostnadsfria ärendeakt).",
    TrialTitle: "Lås upp alla ärendenummer, gatuadresser & värderings-PDF:er",
    TrialBody: "Ditt bevakningskonto och din kostnadsfria ärendeakt förblir alltid gratis (inga betaluppgifter sparas, ingen automatisk förlängning). Testa Investor full åtkomst i 7 dagar för 0 kr idag.",
    TrialCta: "Starta 7 dagars gratis provperiod (0 kr)",
    Manage: "Hantera eller pausa bevakningar",
    Source: { DE: "Källa för samtliga uppgifter: kronofogden.se / zvg-portal.de", TR: "Källa för samtliga uppgifter: ilan.gov.tr" },
    Signature: "Ditt Belowmark-team",
    Footer: "Belowmark · Källbelagda exekutiva auktioner · belowmark.com",
  },
};
