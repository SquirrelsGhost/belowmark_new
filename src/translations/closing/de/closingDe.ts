import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_DE } from "./closingTasksDe";

export const CLOSING_DE: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "Nach dem Zuschlag — Belowmark",
      description: "Aufgabenliste nach dem Zuschlag: Zahlung, Grunderwerbsteuer, Grundbuch, Räumung, Versicherung und Sanierung — mit Fristen und verlinkten Gesetzen.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Zuschlag", "Zwangsversteigerung", "Grundbuch", "Räumung"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "Terminergebnisse — Belowmark",
      description: "Was Zwangsversteigerungen erzielen: Zuschlag im Verhältnis zum Verkehrswert, aus gemeldeten Terminergebnissen, anonym ab fünf Terminen je Gruppe.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Zuschlag", "Verkehrswert", "Terminergebnis", "Zwangsversteigerung"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "Nach dem Termin",
    Title: "Ergebnis & Zuschlag",
    Lead: {
      DE: "Waren Sie im Termin? Tragen Sie ein, was geboten wurde. Das Portal veröffentlicht keine Ergebnisse — aus Ihren Meldungen entsteht eine anonyme Preisübersicht. Haben Sie selbst den Zuschlag, führt Sie die Aufgabenliste bis ins Grundbuch.",
      TR: "Waren Sie bei der Versteigerung dabei? Tragen Sie ein, was geboten wurde. Das Portal veröffentlicht keine Ergebnisse — aus Ihren Meldungen entsteht eine anonyme Preisübersicht. Haben Sie selbst den Zuschlag (ihale), führt Sie die Aufgabenliste bis zur Tapu.",
    },
  },

  Result: {
    Title: "Terminergebnis melden",
    Lead: "Nur Zahlen, keine Namen. Sie können Ihre Meldung jederzeit korrigieren.",
    NotYet: "Ein Ergebnis können Sie ab dem Termin eintragen.",
    HearingDate: "Datum des Termins",
    Outcome: "Ausgang",
    Outcomes: {
      awarded: "Zuschlag erteilt",
      refused: "Zuschlag versagt",
      pending: "Entscheidung vertagt",
      noBids: "Kein Gebot",
      cancelled: "Termin fand nicht statt",
    },
    HighestBid: {
      DE: { label: "Meistgebot (Bargebot)", hint: "Wie im Protokoll oder Zuschlagsbeschluss" },
      TR: { label: "Zuschlagspreis (ihale bedeli)", hint: "Wie im Versteigerungsprotokoll" },
    },
    RetainedRights: { label: "Bestehen bleibende Rechte", hint: "Falls angegeben — sie gehören zum Preis dazu" },
    BidderCount: { label: "Anzahl Bieter", hint: "Wenn Sie es wissen" },
    Source: "Woher haben Sie die Zahlen?",
    Sources: { attended: "Selbst im Termin", protocol: "Protokoll / Beschluss", court: "Auskunft des Gerichts" },
    IsBuyer: { DE: "Ich habe den Zuschlag erhalten", TR: "Ich habe den Zuschlag (ihale) erhalten" },
    AwardDate: {
      DE: { label: "Zuschlag verkündet am", hint: "Leer = Tag des Termins" },
      TR: { label: "Protokoll bekannt gemacht am", hint: "Ab diesem Tag laufen die 7 Tage Zahlungsfrist" },
    },
    Shared: { label: "Anonym in die Preisübersicht aufnehmen", hint: "Gezeigt wird nur ein Median je Region und Objektart, erst ab fünf Terminen — nie Ihr Eintrag einzeln." },
    Privacy: "Wir speichern Termin, Ausgang, Beträge und Bieterzahl zu diesem Aktenzeichen, keine Namen von Bietern, Erstehern oder Eigentümern.",
    Save: "Ergebnis speichern",
    Saved: "Gespeichert.",
    SavedBuyer: "Gespeichert. Ihre Aufgabenliste ist angelegt.",
    Errors: {
      auth: "Bitte erneut anmelden.",
      locked: "Die Aufgabenliste gehört zum Investor-Tarif.",
      date: "Bitte ein gültiges Datum eintragen (nicht vor dem Termin).",
      future: "Ergebnisse lassen sich erst ab dem Termin melden.",
      outcome: "Bitte den Ausgang wählen.",
      bid: "Bei einem Zuschlag bitte das Gebot eintragen (ganze Zahl).",
      ratio: "Das Gebot passt nicht zum Verkehrswert — bitte prüfen.",
      bidders: "Bitte eine plausible Bieterzahl eintragen.",
      buyer: "„Zuschlag erhalten“ geht nur mit dem Ausgang „Zuschlag erteilt“.",
      unknown: "Speichern hat nicht geklappt. Bitte noch einmal.",
    },
    Ratio: "{pct} des Verkehrswerts",
    StatsLink: "Preisübersicht ansehen",
  },

  Teaser: {
    Title: "Ihre Aufgabenliste nach dem Zuschlag",
    Lead: "Zahlung, Steuer, Grundbuch, Besitz, Versicherung, Sanierung — mit Ihren Fristen.",
    Button: "Aufgabenliste öffnen",
    Progress: "{done} von {total} erledigt",
    Next: "Nächstes: {title} · {date}",
    NoDate: "Tragen Sie das Zuschlagsdatum ein, dann rechnet die Liste die Fristen.",
  },

  Tasks: {
    Kicker: "Nach dem Zuschlag",
    Title: "Aufgabenliste",
    Lead: {
      DE: "Vom Zuschlag bis zur Eintragung im Grundbuch und zur Übergabe. Fristen rechnen wir nur aus Daten, die Sie eintragen. Jede Aussage nennt ihre Vorschrift.",
      TR: "Von der Ihale bis zur Eintragung in die Tapu und zur Übergabe. Fristen rechnen wir nur aus Daten, die Sie eintragen. Jede Aussage nennt ihre Vorschrift.",
    },
    Back: "Zurück zum Aktenblatt",
    Disclaimer:
      "Diese Liste ist eine Orientierung, keine Rechtsberatung. Sie gibt den Gesetzeswortlaut vereinfacht wieder (Stand 26.10.2026) und kennt Ihren Einzelfall nicht. Bei Fristen, Kündigungen und Räumung: Gericht, Notar oder Anwalt fragen.",
    Locked: {
      Title: "Aufgabenliste im Investor-Tarif",
      Body: "Ihr Ergebnis ist gespeichert. Die Aufgabenliste mit Fristen und Erinnerungen gehört zum Investor-Tarif.",
      Cta: "Investor buchen",
    },
    Dates: {
      Title: "Ihre Daten",
      Lead: "Aus diesen Daten rechnet die Liste. Was Sie nicht wissen, lassen Sie leer.",
      Fields: {
        DE: {
          awardDate: { label: "Zuschlag verkündet am", hint: "Pflicht" },
          distributionDate: { label: "Verteilungstermin", hint: "Steht in der Ladung" },
          taxNoticeDate: { label: "Grunderwerbsteuerbescheid vom", hint: "Datum der Bekanntgabe" },
          handoverDate: { label: "Übergabe / Räumung am", hint: "Geplant oder erfolgt" },
        },
        TR: {
          awardDate: { label: "Versteigerungsprotokoll bekannt gemacht am", hint: "Pflicht — Start der 7 Tage" },
          handoverDate: { label: "Übergabe / Räumung am", hint: "Geplant oder erfolgt" },
        },
      },
      FromPortfolio: "Aus Ihrem Portfolio übernommen — bitte speichern.",
      Save: "Daten speichern",
      Saved: "Gespeichert.",
      Required: "Bitte mindestens das Zuschlagsdatum eintragen.",
      Errors: {
        auth: "Bitte erneut anmelden.",
        locked: "Die Aufgabenliste gehört zum Investor-Tarif.",
        date: "Bitte mindestens das Zuschlagsdatum eintragen.",
        unknown: "Speichern hat nicht geklappt. Bitte noch einmal.",
      },
    },
    Conditions: {
      Title: "Ihre Lage",
      Lead: "Blendet nur die Aufgaben ein, die passen. Wird in diesem Browser gemerkt.",
      Items: { tenant: "Es gibt Mieter", ownerOccupied: "Bisheriger Eigentümer wohnt noch darin", condo: "Eigentumswohnung", house: "Ein- oder Zweifamilienhaus" },
    },
    Phases: { first: "Die ersten Tage", payment: "Zahlung", register: "Steuer & Grundbuch", possession: "Besitz & Mieter", works: "Sanierung & Betrieb" },
    Due: { deadline: "spätestens {date}", earliest: "frühestens {date}", on: "ab {date}" },
    Missing: "Datum fehlt: {field}",
    States: { done: "Erledigt", overdue: "Überfällig", soon: "Bald fällig", open: "Offen", undated: "Ohne Datum" },
    Basis: { law: "Gesetz", practice: "Verfahren", rule: "Belowmark-Regel" },
    Check: "Rechtslage geändert oder nicht abschließend geklärt — prüfen",
    MarkDone: "Erledigt",
    MarkOpen: "Wieder offen",
    Sources: "Quellen",
    Progress: "{done} von {total} erledigt",
    Items: CLOSING_TASKS_DE,
  },

  Results: {
    Kicker: "Terminergebnisse",
    Title: "Was tatsächlich gezahlt wird",
    Lead: "Gemeldete Zuschläge im Verhältnis zum Verkehrswert. Die Zahlen stammen von Nutzern, nicht vom Gericht — sie zeigen ein Preisniveau, keinen Wert für Ihr Objekt.",
    Method: {
      Title: "So rechnen wir",
      Items: [
        "Quote = (Meistgebot + bestehen bleibende Rechte) ÷ Verkehrswert laut Bekanntmachung.",
        "Melden mehrere Nutzer denselben Termin, zählt er einmal mit dem Median der Meldungen.",
        "Zahlen erscheinen erst ab fünf Terminen je Gruppe. Darunter zeigen wir nur die Anzahl.",
        "Keine Namen, kein Aktenzeichen in der Übersicht. Ihre eigenen Meldungen sehen nur Sie.",
      ],
    },
    Table: { Region: "Region", Segment: "Objektart", Awarded: "Zuschläge", Median: "Median", Range: "Mittlere Hälfte", Bidders: "Bieter (Median)", Reported: "Gemeldete Termine" },
    AllSegments: "Alle Objektarten",
    Total: "Gesamt",
    OtherRegion: "Ohne Region",
    TooFew: "{n} — zu wenige (ab {min})",
    Empty: "Noch keine Meldungen in Ihrem Markt. Die Übersicht füllt sich, sobald Nutzer Terminergebnisse eintragen — auf dem Aktenblatt unter „Ergebnis & Zuschlag“.",
    Locked: "Die Preisübersicht gehört zum Investor-Tarif. Melden können Sie trotzdem.",
    Own: { Title: "Ihre Meldungen", Lead: "Nur für Sie sichtbar.", Empty: "Sie haben noch nichts gemeldet.", Shared: "in Übersicht", Private: "privat", Buyer: "Ihr Zuschlag" },
  },
};
