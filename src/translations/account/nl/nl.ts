import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_NL: IAccountTranslation = {
  Nav: {
    Label: "Accountonderdelen",
    Sections: {
      uebersicht: { Title: "Overzicht", Hint: "Gegevens en status" },
      tarif: { Title: "Pakket & facturen", Hint: "Looptijd, PDF, adres" },
      sicherheit: { Title: "Beveiliging", Hint: "Wachtwoord, apparaten" },
      daten: { Title: "Uw gegevens", Hint: "Exporteren, verwijderen" },
    },
  },

  Overview: {
    Title: "In één oogopslag",
    Description: "De status van uw account. Details vindt u in de onderdelen aan de linkerzijde.",
    Plan: "Pakket",
    PlanCta: "Pakket & facturen",
    LatestInvoice: "Laatste factuur",
    NoInvoice: "Nog geen facturen.",
    AllInvoices: "Alle facturen",
    Research: "Onderzoek",
    ResearchBody: "Publicaties, kaart, watchlist en biedcalculator.",
    ResearchCta: "Naar onderzoek",
  },

  Portal: {
    Label: "Betaalmethoden via Stripe",
    Hint: "Opent het Stripe-klantenportaal om uw betaalkaart te wijzigen of uw abonnement te beheren. Uw facturen staan hieronder.",
    Unavailable: "U kunt betaalmethoden via Stripe beheren zodra u uw eerste betaling via Stripe heeft afgerond.",
  },

  Invoices: {
    Title: "Facturen",
    Description: "Elke betaling krijgt een eigen doorlopend genummerde factuur. Altijd beschikbaar als PDF, zo vaak u wilt.",
    Empty: "Nog geen facturen. Uw factuur verschijnt hier zodra een betaling is bevestigd.",
    Count: "{count} facturen",
    CountOne: "1 factuur",
    Columns: { Number: "Nummer · Datum", Service: "Dienst", Amount: "Bedrag", Document: "Document" },
    Paid: "Betaald",
    Test: "Test",
    Upgrade: "Upgrade",
    Renewal: "Verlenging",
    Download: "PDF",
    View: "Bekijken",
    DownloadLabel: "Factuur {number} downloaden als PDF",
    Note: "Bewaar facturen voor uw eigen administratie. Na verwijdering van uw account bewaren wij ze uitsluitend voor fiscale en boekhoudkundige verplichtingen.",
  },

  Address: {
    Title: "Factuuradres",
    Description:
      "Verschijnt op uw facturen. Voor bedragen tot € 250 volstaat uw e-mailadres; daarboven en voor uw boekhouding zijn naam en postadres vereist.",
    Missing: "Nog geen factuuradres opgeslagen. Eerdere facturen zonder adres nemen dit eenmalig over zodra u het opslaat.",
    Empty: "Nog geen factuuradres opgeslagen.",
    Add: "Adres toevoegen",
    Name: "Naam of bedrijfsnaam",
    NameHint: "Exact zoals het op de factuur moet staan.",
    Address: "Postadres",
    AddressHint: "Straat en huisnummer, postcode en plaats, land — één regel per onderdeel.",
    VatId: "Btw-identificatienummer",
    VatIdHint: "Alleen voor bedrijven, bijv. NL123456789B01.",
    Optional: "optioneel",
    Edit: "Bewerken",
    Cancel: "Annuleren",
    Submit: "Adres opslaan",
    Pending: "Opslaan …",
    Saved: "Opgeslagen. Toekomstige facturen vermelden dit adres.",
    ErrorTitle: "Controleer uw gegevens",
    Errors: {
      name_required: "Vul een naam in.",
      address_required: "Vul een postadres in.",
      too_long: "Een van de invoervelden is te lang.",
      rate_limited: "Te veel pogingen. Wacht een moment.",
      unknown: "Er is iets misgegaan. Probeer het opnieuw.",
    },
  },
};
