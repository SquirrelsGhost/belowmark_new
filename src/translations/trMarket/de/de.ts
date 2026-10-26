import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_DE: ITrMarketTranslation = {
  Age: {
    Title: "Alter des Schätzwerts",
    Lead: "Der Muhammen bedel ist ein Nennbetrag aus dem Jahr, in dem das Verfahren begann. Bei türkischer Inflation ist das bei älteren Akten keine Feinheit.",
    FileYear: "Aktenjahr",
    Basis: "Wertfestsetzung spätestens Dezember {year} — das späteste mögliche Datum, im Zweifel also die kleinere Zahl.",
    Factor: "Verbraucherpreise seitdem",
    Lost: "Kaufkraftverlust des Nennbetrags",
    Today: "Schätzwert in Lira von {month}",
    TodayNote: "Nur die Kaufkraft umgerechnet — kein neuer Verkehrswert und kein Marktpreis.",
    Young: "Akte aus {year}: Der Schätzwert ist jung, eine Inflationskorrektur ergibt hier nichts.",
    NoYear: "Das Aktenzeichen nennt kein Jahr. Ohne Jahr keine Einordnung.",
    Unavailable: "Die amtliche Preisreihe ist nicht aktuell genug. Lieber keine Zahl als eine eingefrorene.",
    Source: "{label}, {source} · Stand {month}",
  },

  Euro: {
    Title: "Gegenwert in Euro",
    Value: "Schätzwert",
    StartingBid: "Startgebot",
    AllIn: "Startgebot inkl. Nebenkosten",
    Rate: "1 € = {rate} · TCMB-Devisenankaufskurs vom {date}",
    Note: "Umgerechnet zum Tageskurs der Zentralbank, nicht zum Kurs am Zahltag. Bezahlt wird in Lira.",
    Unavailable: "Kein aktueller Kurs der Zentralbank hinterlegt{last}. Euro-Werte erscheinen, sobald der Tageskurs geladen ist — ein alter Kurs wird nicht weitergerechnet.",
    LastRate: " (letzter Kurs vom {date})",
  },

  CheckKit: {
    Title: "Prüf-Kit für e-Satış",
    Lead: "Fotos, Gutachten und Bietbedingungen liegen auf e-Satış, nur mit Anmeldung über e-Devlet. Ein Link bringt dort nichts mit — kopieren Sie diese Angaben und fügen Sie sie dort ein.",
    Copy: "Prüf-Kit kopieren",
    Copied: "Kopiert",
    Open: "e-Satış öffnen",
    NotStated: "nicht angegeben",
  },

  Converter: {
    Title: "Währungsrechner ₺ ↔ €",
    Subtitle: "Zum Tageskurs der TCMB",
    Lira: "Betrag in Lira",
    Euro: "Betrag in Euro",
    Unavailable: "Kein aktueller Kurs der Zentralbank hinterlegt{last}. Der Rechner erscheint, sobald der Tageskurs geladen ist.",
  },
};
