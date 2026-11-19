import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_NL: IAlertsTranslation = {
  MetaTags: {
    title: "Zoekalerts — Belowmark",
    description:
      "Opgeslagen zoekopdrachten met e-mailmeldingen: hoor direct wanneer een passende executieveiling wordt gepubliceerd of een veilingdatum wijzigt.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Zoekalerts", "Executieveiling", "Opgeslagen zoekopdracht"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Alerts",

  Page: {
    Eyebrow: "Opgeslagen zoekopdrachten",
    Title: "Zoekalerts",
    Lead: "Elke alert is een opgeslagen zoekopdracht. Zodra er een nieuw passend dossier verschijnt of de notaris of rechtbank een veilingdatum wijzigt, ontvangt u een e-mail — met het dossiernummer en een directe link naar het veilingdossier.",
    Usage: "{count} van {max} alerts",
    Empty: {
      Title: "Nog geen alerts.",
      Body: "Stel uw filters in bij de publicaties — provincie of regio, type object, waardebereik, trefwoord — en sla de zoekopdracht direct onder het aantal resultaten op als alert.",
      Cta: "Naar publicaties",
    },
    HowItWorks:
      "Vergelijkingen worden uitgevoerd na elke update van de officiële registers. Wij melden uitsluitend wat de officiële publicatie zelf vermeldt: een nieuw dossier, een verplaatste veilingdatum of een intrekking. Periode en sortering maken geen deel uit van de alert — deze kijkt altijd vooruit.",
  },

  Card: {
    Active: "Actief",
    Paused: "Gepauzeerd",
    Pause: "Pauzeren",
    Resume: "Hervatten",
    Delete: "Verwijderen",
    OpenSearch: "Zoekopdracht openen",
    Matches: "{count} openstaande treffers",
    MatchesOne: "1 openstaande treffer",
    NotifyNew: "Nieuwe dossiers",
    NotifyChanges: "Datumwijzigingen",
    LastSent: "Laatste e-mail: {date}",
    NeverSent: "Nog geen e-mail verzonden",
    LastChecked: "Gecontroleerd: {date}",
    Error: "Er is iets misgegaan. Probeer het opnieuw.",
  },

  Summary: {
    AllRegions: { DE: "Alle provincies / regio's", TR: "Alle provincies" },
    AllSegments: "Alle objecttypen",
    Query: "“{query}”",
    Min: "vanaf {value}",
    Max: "tot {value}",
  },

  Save: {
    Toggle: "Zoekopdracht opslaan als alert",
    Title: "Alert aanmaken",
    NameLabel: "Naam",
    NotifyNew: "E-mail bij nieuwe dossiers",
    NotifyChanges: "E-mail bij datumwijzigingen en intrekkingen",
    Hint: "Slaat trefwoord, regio, type object en waardebereik op. Huidige treffers worden als bekend gemarkeerd — meldingen gelden voor wijzigingen vanaf nu.",
    Submit: "Alert opslaan",
    Pending: "Opslaan …",
    Saved: "Opgeslagen. U ontvangt een e-mail zodra er iets verandert.",
    Manage: "Alerts beheren",
    Errors: {
      limit: "U heeft al 10 alerts. Verwijder er eerst een voordat u een nieuwe aanmaakt.",
      invalid: "Geef de alert een naam en kies minstens één meldingsoptie.",
      failed: "De alert kon niet worden opgeslagen. Probeer het opnieuw.",
    },
  },

  Mail: {
    Subject: "{count} updates voor uw zoekalerts",
    SubjectOne: "1 update voor uw zoekalerts",
    Preheader: "Nieuwe executieveilingen en gewijzigde veilingdata uit uw opgeslagen zoekopdrachten.",
    Greeting: "Hallo,",
    Intro: "sinds onze laatste controle hebben de volgende wijzigingen plaatsgevonden in uw opgeslagen zoekopdrachten:",
    Kinds: { new: "Nieuw", cancelled: "Ingetrokken", reinstated: "Heropend", rescheduled: "Verplaatst" },
    NextDate: "Veiling {date}",
    Moved: "voorheen {before}, nu {after}",
    Value: { DE: "Taxatiewaarde", TR: "Muhammen bedel" },
    More: "+ {count} meer",
    OpenSearch: "Zoekopdracht openen",
    LockedValues:
      "Volledige dossiernummers, straatadressen en taxatie-PDF's zijn zichtbaar met Volledige toegang (of via uw 1 Gratis Dossier).",
    TrialTitle: "Ontgrendel alle dossiernummers, adressen & officiële PDF's",
    TrialBody:
      "Uw alert-account en 1 Gratis Dossier blijven blijvend gratis (geen betaalgegevens opgeslagen, geen automatische verlenging). Test optioneel 7 dagen Investor Volledige toegang voor € 0,00 vandaag.",
    TrialCta: "Start 7 dagen gratis proefperiode (€ 0,00)",
    Manage: "Alerts beheren of pauzeren",
    Source: { DE: "Bron van alle gegevens: officiële veilingportalen", TR: "Bron van alle gegevens: ilan.gov.tr" },
    Signature: "Uw Belowmark-team",
    Footer: "Belowmark · Brongeverifieerde executieveilingen · belowmark.com",
  },
};
