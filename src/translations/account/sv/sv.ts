import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_SV: IAccountTranslation = {
  Nav: {
    Label: "Kontoavsnitt",
    Sections: {
      uebersicht: { Title: "Översikt", Hint: "Uppgifter och status" },
      tarif: { Title: "Paket & fakturor", Hint: "Period, PDF, adress" },
      sicherheit: { Title: "Säkerhet", Hint: "Lösenord, enheter" },
      daten: { Title: "Dina uppgifter", Hint: "Export, radering" },
    },
  },

  Overview: {
    Title: "I korthet",
    Description: "Status för ditt konto. Detaljer finns i avsnitten till vänster.",
    Plan: "Paket",
    PlanCta: "Paket & fakturor",
    LatestInvoice: "Senaste fakturan",
    NoInvoice: "Inga fakturor ännu.",
    AllInvoices: "Alla fakturor",
    Research: "Analys",
    ResearchBody: "Kungörelser, karta, bevakningslista och budkalkylator.",
    ResearchCta: "Gå till analysen",
  },

  Portal: {
    Label: "Betalningsmetoder via Stripe",
    Hint: "Öppnar Stripes kundportal för att byta kort eller hantera ditt abonnemang. Dina fakturor visas direkt nedan.",
    Unavailable: "Du kan hantera betalningsmetoder via Stripe så snart du har genomfört din första Stripe-betalning.",
  },

  Invoices: {
    Title: "Fakturor",
    Description: "Varje betalning får en egen löpnumrerad faktura. Tillgänglig som PDF när som helst, så ofta du behöver.",
    Empty: "Inga fakturor ännu. Din faktura visas här så snart en betalning är bekräftad.",
    Count: "{count} fakturor",
    CountOne: "1 faktura",
    Columns: { Number: "Nummer · Datum", Service: "Tjänst", Amount: "Belopp", Document: "Dokument" },
    Paid: "Betald",
    Test: "Test",
    Upgrade: "Uppgradering",
    Renewal: "Förnyelse",
    Download: "PDF",
    View: "Visa",
    DownloadLabel: "Ladda ned faktura {number} som PDF",
    Note: "Spara fakturorna för din bokföring. Efter radering av kontot bevarar vi dem enbart för att uppfylla skatte- och bokföringskrav.",
  },

  Address: {
    Title: "Fakturaadress",
    Description: "Visas på dina fakturor. För belopp upp till 250 € räcker din e-postadress; därutöver och för din bokföring krävs namn och postadress.",
    Missing: "Ingen fakturaadress sparad ännu. Tidigare fakturor utan adress uppdateras en gång så snart du sparar den.",
    Empty: "Ingen fakturaadress sparad ännu.",
    Add: "Lägg till adress",
    Name: "Namn eller företag",
    NameHint: "Exakt så som det ska stå på fakturan.",
    Address: "Postadress",
    AddressHint: "Gatuadress, postnummer och ort, land — en uppgift per rad.",
    VatId: "Momsregistreringsnummer (VAT)",
    VatIdHint: "Endast för företag, t.ex. SE556123456701.",
    Optional: "valfritt",
    Edit: "Redigera",
    Cancel: "Avbryt",
    Submit: "Spara adress",
    Pending: "Sparar …",
    Saved: "Sparat. Framtida fakturor kommer att använda denna adress.",
    ErrorTitle: "Kontrollera dina uppgifter",
    Errors: {
      name_required: "Ange ett namn.",
      address_required: "Ange en postadress.",
      too_long: "En av uppgifterna är för lång.",
      rate_limited: "För många försök. Vänta en stund.",
      unknown: "Något gick fel. Försök igen.",
    },
  },
};
