/**
 * Printed wording of the invoice PDF. German only: the provider is a German
 * business and the invoice is a German tax document. Legal wording is a
 * draft — the operator has it checked before going live.
 */
export const INVOICE_TEXT = {
  Title: "Rechnung",
  TestTitle: "Testrechnung",
  TestWatermark: "TEST · KEINE GÜLTIGE RECHNUNG",
  TestBanner: "Bezahlt in der Testkasse ohne echte Zahlung. Dieses Dokument ist keine Rechnung im Sinne des § 14 UStG.",
  MarketLine: "Marktniveau",
  RecipientLabel: "Rechnung an",
  RecipientVatId: "USt-IdNr.",
  ItemPrefix: "Belowmark",
  ItemDetail: "Zugang zur Recherche-Plattform belowmark.com (digitale Dienstleistung)",
  UpgradeTitle: "Upgrade {from} → {to}",
  UpgradeDetail: "Anteiliger Aufpreis für die Restlaufzeit des laufenden Zugangs",
  Columns: { Position: "Pos.", Service: "Leistung", Quantity: "Menge", Amount: "Betrag" },
  Facts: {
    Number: "Rechnungsnummer",
    Date: "Rechnungsdatum",
    Period: "Leistungszeitraum",
    Paid: "Bezahlt am",
    Account: "Kundenkonto",
  },
  Totals: {
    Net: "Nettobetrag",
    Vat: "Umsatzsteuer {rate} %",
    Kdv: "Türkische KDV {rate} %",
    Gross: "Gesamtbetrag",
  },
  Vat: {
    Inclusive: "Im Gesamtbetrag ist die Umsatzsteuer enthalten.",
    SmallBusiness: "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).",
    OutsideDe: "Leistungsort Türkei (§ 3a UStG): in Deutschland nicht steuerbar, keine deutsche Umsatzsteuer.",
    OutsideDeKdv: "Leistungsort Türkei (§ 3a UStG): in Deutschland nicht steuerbar, keine deutsche Umsatzsteuer. Türkische KDV ist im Gesamtbetrag enthalten.",
  },
  PaidStamp: "Bezahlt",
  PaidNote: "Der Betrag wurde am {date} online über Stripe bezahlt. Bitte nicht erneut überweisen.",
  PaidNoteTest: "Testzahlung vom {date} — es wurde kein Geld bewegt.",
  Thanks: "Danke, dass Sie mit Belowmark recherchieren.",
  Footer: {
    Provider: "Anbieter",
    Contact: "Kontakt",
    Tax: "Rechtliches",
    Web: "belowmark.com",
    Court: "Gerichtsstand {court}",
  },
  Gaps: {
    Recipient: "Name und Anschrift fehlen — im Konto unter Rechnungsadresse eintragen",
    VatMode: "Umsatzsteuer-Angabe offen: BILLING_VAT_MODE setzen",
    VatTr: "Umsatzsteuerliche Behandlung für Kunden in der Türkei prüfen",
    KdvTr: "Türkische KDV prüfen",
  },
  Page: "Seite {page} von {pages}",
  FileName: "belowmark-rechnung-{number}.pdf",
} as const;
