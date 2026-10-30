import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_DE: IAccountTranslation = {
  Nav: {
    Label: "Bereiche Ihres Kontos",
    Sections: {
      uebersicht: { Title: "Übersicht", Hint: "Angaben und Stand" },
      tarif: { Title: "Tarif & Rechnungen", Hint: "Laufzeit, PDF, Adresse" },
      sicherheit: { Title: "Sicherheit", Hint: "Passwort, Geräte" },
      daten: { Title: "Ihre Daten", Hint: "Export, Löschen" },
    },
  },

  Overview: {
    Title: "Auf einen Blick",
    Description: "Der Stand Ihres Kontos. Details stehen in den Bereichen links.",
    Plan: "Tarif",
    PlanCta: "Tarif & Rechnungen",
    LatestInvoice: "Letzte Rechnung",
    NoInvoice: "Noch keine Rechnung.",
    AllInvoices: "Alle Rechnungen",
    Research: "Recherche",
    ResearchBody: "Aushänge, Karte, Merkliste und Bietrechner.",
    ResearchCta: "Zur Recherche",
  },

  Portal: {
    Label: "Zahlungsmittel bei Stripe",
    Hint: "Öffnet das Kundenportal von Stripe: Karte ändern oder das Abo verwalten. Ihre Rechnungen finden Sie hier darunter.",
    Unavailable: "Zahlungsmittel verwalten Sie bei Stripe, sobald Sie einmal über Stripe bezahlt haben.",
  },

  Invoices: {
    Title: "Rechnungen",
    Description: "Jede Zahlung bekommt eine eigene Rechnung mit fortlaufender Nummer. Als PDF, jederzeit, so oft Sie wollen.",
    Empty: "Noch keine Rechnung. Sie erscheint hier, sobald eine Zahlung bestätigt ist.",
    Count: "{count} Rechnungen",
    CountOne: "1 Rechnung",
    Columns: { Number: "Nummer · Datum", Service: "Leistung", Amount: "Betrag", Document: "Dokument" },
    Paid: "Bezahlt",
    Test: "Test",
    Upgrade: "Upgrade",
    Renewal: "Verlängerung",
    Download: "PDF",
    View: "Ansehen",
    DownloadLabel: "Rechnung {number} als PDF herunterladen",
    Note: "Bewahren Sie Rechnungen für Ihre Unterlagen auf. Nach einer Kontolöschung bewahren wir sie nur noch für Steuer und Buchhaltung auf.",
  },

  Address: {
    Title: "Rechnungsadresse",
    Description: "Erscheint auf Ihren Rechnungen. Für Beträge bis 250 € genügt die E-Mail-Adresse; darüber und für Ihre Buchhaltung brauchen Sie Name und Anschrift.",
    Missing: "Noch keine Rechnungsadresse hinterlegt. Bisherige Rechnungen ohne Adresse übernehmen sie einmalig, sobald Sie sie speichern.",
    Name: "Name oder Firma",
    NameHint: "So, wie er auf der Rechnung stehen soll.",
    Address: "Anschrift",
    AddressHint: "Straße und Hausnummer, PLZ und Ort, Land — eine Angabe pro Zeile.",
    VatId: "USt-IdNr.",
    VatIdHint: "Nur für Unternehmen, z. B. DE123456789.",
    Optional: "optional",
    Edit: "Bearbeiten",
    Cancel: "Abbrechen",
    Submit: "Adresse speichern",
    Pending: "Wird gespeichert …",
    Saved: "Gespeichert. Neue Rechnungen tragen diese Adresse.",
    ErrorTitle: "Bitte prüfen Sie Ihre Angaben",
    Errors: {
      name_required: "Bitte geben Sie einen Namen an.",
      address_required: "Bitte geben Sie eine Anschrift an.",
      too_long: "Eine Angabe ist zu lang.",
      rate_limited: "Zu viele Versuche. Bitte warten Sie einen Moment.",
      unknown: "Das hat nicht geklappt. Bitte versuchen Sie es erneut.",
    },
  },
};
