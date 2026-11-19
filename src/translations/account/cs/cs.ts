import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_CS: IAccountTranslation = {
  Nav: {
    Label: "Sekce účtu",
    Sections: {
      uebersicht: { Title: "Přehled", Hint: "Údaje a stav" },
      tarif: { Title: "Tarif a faktury", Hint: "Platnost, PDF, adresa" },
      sicherheit: { Title: "Zabezpečení", Hint: "Heslo, zařízení" },
      daten: { Title: "Vaše údaje", Hint: "Export, smazání" },
    },
  },

  Overview: {
    Title: "Přehled účtu",
    Description: "Aktuální stav vašeho účtu. Podrobnosti najdete v sekcích vlevo.",
    Plan: "Tarif",
    PlanCta: "Tarif a faktury",
    LatestInvoice: "Poslední faktura",
    NoInvoice: "Zatím žádné faktury.",
    AllInvoices: "Všechny faktury",
    Research: "Rešerše",
    ResearchBody: "Dražební vyhlášky, mapa, sledované a dražební kalkulačka.",
    ResearchCta: "Přejít k rešerším",
  },

  Portal: {
    Label: "Platební metody přes Stripe",
    Hint: "Otevře zákaznický portál Stripe pro změnu karty nebo správu předplatného. Vaše faktury jsou uvedeny hned níže.",
    Unavailable: "Platební metody přes Stripe můžete spravovat ihned po dokončení své první platby přes Stripe.",
  },

  Invoices: {
    Title: "Faktury",
    Description: "Každá platba má vlastní průběžně číslovanou fakturu. Kdykoli ke stažení v PDF, kolikrát potřebujete.",
    Empty: "Zatím žádné faktury. Vaše faktura se zde objeví ihned po potvrzení platby.",
    Count: "{count} faktur",
    CountOne: "1 faktura",
    Columns: { Number: "Číslo · Datum", Service: "Služba", Amount: "Částka", Document: "Doklad" },
    Paid: "Uhrazeno",
    Test: "Test",
    Upgrade: "Upgrade",
    Renewal: "Prodloužení",
    Download: "PDF",
    View: "Zobrazit",
    DownloadLabel: "Stáhnout fakturu {number} jako PDF",
    Note: "Uschovejte si prosím faktury pro své účetnictví. Po smazání účtu je uchováváme výhradně pro splnění daňových a účetních povinností.",
  },

  Address: {
    Title: "Fakturační adresa",
    Description: "Zobrazuje se na vašich fakturách. Pro částky do 250 € stačí vaše e-mailová adresa; nad tuto částku a pro vaše účetnictví je vyžadováno jméno a poštovní adresa.",
    Missing: "Zatím není uložena žádná fakturační adresa. Předchozí faktury bez adresy ji jednorázově převezmou ihned po uložení.",
    Empty: "Zatím není uložena žádná fakturační adresa.",
    Add: "Přidat adresu",
    Name: "Jméno nebo firma",
    NameHint: "Přesně tak, jak se má zobrazit na faktuře.",
    Address: "Poštovní adresa",
    AddressHint: "Ulice a číslo popisné, PSČ a město, země — každý údaj na nový řádek.",
    VatId: "DIČ",
    VatIdHint: "Pouze pro firmy a podnikatele, např. CZ12345678.",
    Optional: "nepovinné",
    Edit: "Upravit",
    Cancel: "Zrušit",
    Submit: "Uložit adresu",
    Pending: "Ukládání …",
    Saved: "Uloženo. Budoucí faktury ponesou tuto adresu.",
    ErrorTitle: "Zkontrolujte prosím své údaje",
    Errors: {
      name_required: "Zadejte prosím jméno nebo název firmy.",
      address_required: "Zadejte prosím poštovní adresu.",
      too_long: "Jeden ze zadaných údajů je příliš dlouhý.",
      rate_limited: "Příliš mnoho pokusů. Počkejte prosím okamžik.",
      unknown: "Něco se nepovedlo. Zkuste to prosím znovu.",
    },
  },
};
