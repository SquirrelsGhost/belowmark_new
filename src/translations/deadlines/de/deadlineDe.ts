import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_DE: IDeadlineTranslation = {
  MetaTags: {
    title: "Termin-Begleiter — Belowmark",
    description: "Alle Fristen vom Aushang bis zum Zuschlag mit Gesetzesquelle: Sicherheitsleistung, Scheck-Tag, Termin, Teminat. Erinnerung per Mail und als Kalender-Abo.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Fristen", "Zwangsversteigerung", "Sicherheitsleistung", "Kalender"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Termine",

  Section: {
    Eyebrow: "Termin-Begleiter",
    Title: "Fristen & Fahrplan",
    Lead: {
      DE: "Jede Frist bis zum Zuschlag, aus dem Termin der Bekanntmachung gerechnet und mit Paragraf belegt. Begleiten Sie das Verfahren, dann erinnern wir per Mail und im Kalender.",
      TR: "Jede Frist der e-Satış-Runden, aus den Daten des İlan gerechnet und mit Vorschrift belegt. Begleiten Sie das Verfahren, dann erinnern wir per Mail und im Kalender.",
    },
    Locked: {
      Title: "Fristen mit Erinnerung",
      Body: "Der Termin-Begleiter rechnet Sicherheitsleistung, Scheck-Tag und Zuschlag aus der Bekanntmachung und erinnert Sie per Mail und Kalender. Im Investor-Tarif enthalten.",
    },
    NoDates: "Die Bekanntmachung nennt keinen Termin, also lässt sich keine Frist rechnen.",
    Cancelled: "Das Verfahren ist aufgehoben. Fristen laufen nicht mehr.",
    Phases: { before: "Vor dem Termin", hearing: "Termin", after: "Nach dem Zuschlag" },
    Basis: { law: "Gesetz", notice: "Bekanntmachung", user: "Ihre Angabe", rule: "belowmark-Empfehlung" },
    Kinds: { deadline: "Frist", appointment: "Termin", task: "Ab dann", info: "Zur Orientierung" },
    AfterAwardEmpty: "Fristen nach dem Zuschlag (Zahlung, Steuer, Grundbuch, Räumung) erscheinen hier, sobald Sie das Ergebnis des Termins eintragen.",
    Reminders: "Erinnerung",
    ReminderDay: "1 Tag vorher",
    ReminderDays: "{days} Tage vorher",
    ReminderToday: "am Tag",
    Disclaimer: "Gerechnet ohne Feiertage und so, dass ein Tag nie zu spät liegt. Maßgeblich sind Gesetz und die Ladung des Gerichts; keine Rechtsberatung.",
  },

  Status: {
    Past: "vorbei",
    Today: "heute",
    Tomorrow: "morgen",
    InDays: "in {days} Tagen",
  },

  Follow: {
    Start: "Verfahren begleiten",
    Stop: "Nicht mehr begleiten",
    Following: "Sie begleiten dieses Verfahren.",
    NotFollowing: "Noch keine Erinnerungen eingerichtet.",
    MailOn: "Mail-Erinnerung an",
    MailOff: "Mail-Erinnerung aus",
    Download: "Fristen als Kalender (.ics)",
    Overview: "Alle Termine",
    Error: "Das hat nicht geklappt. Bitte noch einmal versuchen.",
  },

  Checklist: {
    Title: "Fahrplan bis zum Termin",
    Hint: "Abhaken bleibt in diesem Browser. Schritte mit Haken von belowmark erkennen wir selbst.",
    Progress: "{done} von {total} erledigt",
    Auto: "erkannt",
    Steps: {
      DE: [
        { id: "gutachten", Label: "Gutachten lesen lassen", Hint: "Laden Sie das Gutachten hoch, die Risiko-Ampel prüft Rechte, Mieter und Baujahr." },
        { id: "inspection", Label: "Objekt ansehen", Hint: "Mindestens von außen; Fragen dazu stehen im Urteil." },
        { id: "limit", Label: "Bietlimit festlegen", Hint: "Bis zu welchem Gebot rechnet es sich? Ihre Zahlen, Ihre Grenze." },
        { id: "bank", Label: "Finanzierung anfragen", Hint: "Die Bankenmappe zeigt der Bank Zahlungsplan und Fristen." },
        { id: "deposit", Label: "Sicherheitsleistung klären", Hint: "Überweisung, Verrechnungsscheck oder Bürgschaft: die Tage stehen in der Zeitleiste." },
        { id: "papers", Label: "Bieter-Mappe drucken", Hint: "Ausweis, Vollmacht, Nachweis der Sicherheit und Ihr Limit auf Papier." },
      ],
      TR: [
        { id: "gutachten", Label: "Kıymet takdir raporu lesen", Hint: "Laden Sie den Bericht hoch, die Risiko-Ampel prüft Rechte, Mieter und Zustand." },
        { id: "inspection", Label: "Objekt ansehen", Hint: "Mindestens von außen; Fragen dazu stehen im Urteil." },
        { id: "limit", Label: "Teklif-Limit festlegen", Hint: "Bis zu welchem Gebot rechnet es sich, inklusive Tapu harcı und KDV?" },
        { id: "bank", Label: "Finanzierung vorab klären", Hint: "Nach der Runde bleiben nur 7 Tage zum Zahlen; ohne Vorabzusage der Bank ist das knapp." },
        { id: "deposit", Label: "Teminat hinterlegen", Hint: "Bar über das Portal oder Teminat mektubu: die Fristen stehen in der Zeitleiste." },
        { id: "papers", Label: "e-Devlet und Portal-Zugang prüfen", Hint: "Bieten geht nur angemeldet im e-Satış-Portal über e-Devlet." },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "Bekanntmachung erschienen",
        Detail: "Der Termin muss mindestens sechs Wochen vorher bekanntgemacht sein. Ab hier läuft Ihre Vorbereitung.",
      },
      Transfer: {
        Title: "Sicherheit per Überweisung: gutgeschrieben",
        Detail: "Bargeld ist ausgeschlossen. Eine Überweisung zählt nur, wenn sie vor dem Termin auf dem Konto der Gerichtskasse gutgeschrieben ist und Sie den Nachweis im Termin vorlegen. Konto und Verwendungszweck nennt das Gericht. Sicher gerechnet: am Vortag.{amount}",
      },
      Cheque: {
        Title: "Frühester Tag für den Verrechnungsscheck",
        Detail: "Ein Verrechnungsscheck gilt nur, wenn er frühestens am dritten Werktag vor dem Termin ausgestellt ist, von einer in Deutschland zugelassenen Bank oder der Bundesbank, im Inland zahlbar. Früher ausgestellt wird er zurückgewiesen. Gerechnet mit Samstag als Werktag und ohne Feiertage, also nie zu früh.",
      },
      Hearing: {
        Title: "Versteigerungstermin",
        Detail: "{authority}. Zwischen Aufforderung zur Abgabe von Geboten und Schluss liegen mindestens 30 Minuten. Mitbringen: Ausweis, Nachweis der Sicherheit, bei Vertretung eine öffentlich beglaubigte Vollmacht.",
      },
      Award: {
        Title: "Zuschlag spätestens (Soll-Frist)",
        Detail: "Der Zuschlag wird im Termin oder in einem eigenen Verkündungstermin verkündet, der nicht über eine Woche hinaus bestimmt werden soll. Mit der Verkündung werden Sie Eigentümer. Das echte Datum nennt das Gericht.",
      },
      Amount: " Höhe, wenn ein Beteiligter Sicherheit verlangt: {amount} (10 % des Verkehrswerts).",
    },
    TR: {
      Notice: {
        Title: "İlan erschienen",
        Detail: "Die Runde muss mindestens 15 Tage vor Beginn im e-Satış-Portal angekündigt sein.",
      },
      RoundStart: {
        Title: "{round}. Artırma beginnt",
        Detail: "Ab jetzt sind Gebote im e-Satış-Portal möglich, die Runde läuft sieben Tage.{startingBid}",
      },
      Cash: {
        Title: "{round}. Artırma: Bar-Teminat bis 23.30 Uhr",
        Detail: "Die Sicherheit über das Portal auf das Konto der İcra dairesi spätestens am Tag vor Rundenende um 23.30 Uhr einzahlen.{amount}",
      },
      Letter: {
        Title: "{round}. Artırma: Teminat mektubu bis Dienstschluss",
        Detail: "Eine Bankgarantie muss spätestens am Arbeitstag vor Rundenende bis Dienstschluss bei der İcra dairesi sein. Feiertage sind nicht abgezogen: fällt dieser Tag auf einen, gilt der Arbeitstag davor.",
      },
      RoundEnd: {
        Title: "{round}. Artırma endet",
        Detail: "Kommt in den letzten zehn Minuten ein Gebot, verlängert sich die Runde um je drei Minuten, zusammen höchstens eine Stunde. Danach wird das Ergebnis-Protokoll veröffentlicht; ab dann laufen sieben Tage zum Zahlen.",
      },
      Amount: " Höhe: {amount} (10 % des Schätzwerts).",
      StartingBid: " Startgebot laut İlan: {amount}.",
    },
  },

  Page: {
    Eyebrow: "Termin-Begleiter",
    Title: "Termine",
    Lead: "Alle Fristen der Verfahren, die Sie begleiten, in einer Liste. Per Mail erinnert, im eigenen Kalender abonniert.",
    Count: "{count} begleitet",
    Empty: {
      Title: "Noch kein Verfahren begleitet",
      Body: "Öffnen Sie ein Aktenblatt und tippen Sie bei „Fristen & Fahrplan“ auf „Verfahren begleiten“.",
      Cta: "Zur Suche",
    },
    Next: "Als Nächstes",
    NothingAhead: "Keine offene Frist mehr.",
    OpenListing: "Zum Aktenblatt",
    Missing: "Nicht mehr im aktuellen Datenstand",
    Feed: {
      Title: "Kalender-Abo",
      Body: "Diese Adresse in Google Kalender, Outlook oder Apple Kalender als Abo hinzufügen (\"Per URL\"). Neue Verfahren und geänderte Termine kommen von selbst nach, mit Erinnerung vorher.",
      Create: "Abo-Adresse erzeugen",
      Renew: "Neue Adresse erzeugen",
      Copy: "Kopieren",
      Copied: "Kopiert",
      Shown: "Nur jetzt sichtbar. Wir speichern die Adresse nicht im Klartext; wer sie kennt, sieht Ihre Termine.",
      Hidden: "Ein Abo ist eingerichtet. Adresse verloren? Neue erzeugen, die alte hört dann auf zu funktionieren.",
      Error: "Konnte keine Adresse erzeugen.",
    },
    HowItWorks: "Erinnert wird an den Tagen, die bei jeder Frist stehen, morgens per Mail und im Kalender-Abo. Termine kommen aus dem Datenstand der Bekanntmachungen; ändert das Gericht etwas, folgt die Frist beim nächsten Datenstand.",
  },

  Mail: {
    Subject: "{count} Fristen stehen an",
    SubjectOne: "Eine Frist steht an",
    Preheader: "Ihr Termin-Begleiter von belowmark.",
    Greeting: "Guten Tag,",
    Intro: "für die Verfahren, die Sie begleiten, steht Folgendes an:",
    Today: "heute",
    Tomorrow: "morgen",
    InDays: "in {days} Tagen",
    OpenListing: "Aktenblatt öffnen",
    Manage: "Erinnerungen verwalten",
    Signature: "Ihr belowmark",
    Footer: "Sie erhalten diese Mail, weil Sie ein Verfahren begleiten. Abbestellen unter „Termine“.",
    Source: "Rechtsgrundlage",
  },

  Ics: {
    CalendarName: "belowmark Termine",
    Source: "Quelle",
  },
};
