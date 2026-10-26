import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_DE: IAlertsTranslation = {
  MetaTags: {
    title: "Alerts — Belowmark",
    description: "Gespeicherte Suchen mit Mail-Benachrichtigung: Sie erfahren es, sobald ein passendes Verfahren neu erscheint oder sich ein Termin ändert.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Alerts", "Zwangsversteigerung", "Suchauftrag"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Alerts",

  Page: {
    Eyebrow: "Gespeicherte Suchen",
    Title: "Alerts",
    Lead: "Jeder Alert ist eine gespeicherte Suche. Erscheint ein neues passendes Verfahren oder ändert das Gericht einen Termin, bekommen Sie eine Mail — mit Aktenzeichen und Link auf das Aktenblatt.",
    Usage: "{count} von {max} Alerts",
    Empty: {
      Title: "Noch kein Alert.",
      Body: "Stellen Sie in den Aushängen Ihre Filter ein — Bundesland, Objektart, Wertspanne, Suchwort — und speichern Sie die Suche unter der Trefferzahl als Alert.",
      Cta: "Zu den Aushängen",
    },
    HowItWorks:
      "Verglichen wird nach jeder Aktualisierung der amtlichen Daten. Gemeldet wird nur, was der Aushang selbst sagt: ein neues Verfahren, ein verlegter Termin, eine Aufhebung. Zeitraum und Sortierung der Suche gehören nicht zum Alert — er schaut immer nach vorn.",
  },

  Card: {
    Active: "Aktiv",
    Paused: "Pausiert",
    Pause: "Pausieren",
    Resume: "Fortsetzen",
    Delete: "Löschen",
    OpenSearch: "Suche öffnen",
    Matches: "{count} offene Treffer",
    MatchesOne: "1 offener Treffer",
    NotifyNew: "Neue Verfahren",
    NotifyChanges: "Terminänderungen",
    LastSent: "Letzte Mail: {date}",
    NeverSent: "Noch keine Mail",
    LastChecked: "Geprüft: {date}",
    Error: "Das hat nicht geklappt. Bitte noch einmal versuchen.",
  },

  Summary: {
    AllRegions: { DE: "Alle Bundesländer", TR: "Alle Provinzen" },
    AllSegments: "Alle Objektarten",
    Query: "„{query}“",
    Min: "ab {value}",
    Max: "bis {value}",
  },

  Save: {
    Toggle: "Suche als Alert speichern",
    Title: "Alert anlegen",
    NameLabel: "Name",
    NotifyNew: "Mail bei neuen Verfahren",
    NotifyChanges: "Mail bei Terminänderungen und Aufhebungen",
    Hint: "Gespeichert werden Suchwort, Region, Objektart und Wertspanne. Was heute schon passt, gilt als bekannt — gemeldet wird ab jetzt.",
    Submit: "Alert speichern",
    Pending: "Speichert …",
    Saved: "Gespeichert. Sie bekommen eine Mail, sobald sich etwas tut.",
    Manage: "Alerts verwalten",
    Errors: {
      limit: "Sie haben schon 10 Alerts. Löschen Sie einen, bevor Sie einen neuen anlegen.",
      invalid: "Bitte geben Sie dem Alert einen Namen und wählen Sie mindestens eine Benachrichtigung.",
      failed: "Der Alert konnte nicht gespeichert werden. Bitte noch einmal versuchen.",
    },
  },

  Mail: {
    Subject: "{count} Neuigkeiten zu Ihren Alerts",
    SubjectOne: "1 Neuigkeit zu Ihren Alerts",
    Preheader: "Neue Verfahren und geänderte Termine aus Ihren gespeicherten Suchen.",
    Greeting: "Guten Tag,",
    Intro: "seit der letzten Prüfung hat sich in Ihren gespeicherten Suchen Folgendes getan:",
    Kinds: { new: "Neu", cancelled: "Aufgehoben", reinstated: "Wieder angesetzt", rescheduled: "Termin geändert" },
    NextDate: "Termin {date}",
    Moved: "vorher {before}, jetzt {after}",
    Value: { DE: "Verkehrswert", TR: "Muhammen bedel" },
    More: "+ {count} weitere",
    OpenSearch: "Suche öffnen",
    LockedValues: "Beträge sehen Sie mit vollem Zugang in der App.",
    Manage: "Alerts verwalten oder pausieren",
    Source: { DE: "Quelle aller Angaben: zvg-portal.de", TR: "Quelle aller Angaben: ilan.gov.tr" },
    Signature: "Ihr Belowmark-Team",
    Footer: "Belowmark · Zwangsversteigerungen mit Quelle · belowmark.com",
  },
};
