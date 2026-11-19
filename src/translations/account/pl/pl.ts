import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_PL: IAccountTranslation = {
  Nav: {
    Label: "Sekcje konta",
    Sections: {
      uebersicht: { Title: "Przegląd", Hint: "Dane i status" },
      tarif: { Title: "Pakiet i faktury", Hint: "Okres, PDF, dane do faktury" },
      sicherheit: { Title: "Bezpieczeństwo", Hint: "Hasło, urządzenia" },
      daten: { Title: "Twoje dane", Hint: "Eksport, usunięcie" },
    },
  },

  Overview: {
    Title: "W skrócie",
    Description: "Status Twojego konta. Szczegóły znajdziesz w sekcjach po lewej stronie.",
    Plan: "Pakiet",
    PlanCta: "Pakiet i faktury",
    LatestInvoice: "Ostatnia faktura",
    NoInvoice: "Brak faktur.",
    AllInvoices: "Wszystkie faktury",
    Research: "Wyszukiwarka",
    ResearchBody: "Obwieszczenia, mapa, obserwowane i kalkulator licytacyjny.",
    ResearchCta: "Przejdź do wyszukiwarki",
  },

  Portal: {
    Label: "Metody płatności przez Stripe",
    Hint: "Otwiera portal klienta Stripe, aby zmienić kartę lub zarządzać subskrypcją. Twoje faktury znajdują się bezpośrednio poniżej.",
    Unavailable: "Metodami płatności w Stripe będziesz mógł zarządzać po zrealizowaniu pierwszej płatności.",
  },

  Invoices: {
    Title: "Faktury",
    Description: "Każda płatność otrzymuje własną, kolejno numerowaną fakturę. Dostępna jako PDF w dowolnym momencie, tyle razy, ile potrzebujesz.",
    Empty: "Brak faktur. Twoja faktura pojawi się tutaj natychmiast po potwierdzeniu płatności.",
    Count: "{count} faktur",
    CountOne: "1 faktura",
    Columns: { Number: "Numer · Data", Service: "Usługa", Amount: "Kwota", Document: "Dokument" },
    Paid: "Opłacona",
    Test: "Test",
    Upgrade: "Rozszerzenie",
    Renewal: "Odnowienie",
    Download: "PDF",
    View: "Podgląd",
    DownloadLabel: "Pobierz fakturę {number} jako PDF",
    Note: "Zachowaj faktury w swojej dokumentacji. Po usunięciu konta przechowujemy je wyłącznie w zakresie wymaganym przepisami podatkowymi i rachunkowymi.",
  },

  Address: {
    Title: "Dane do faktury",
    Description: "Widnieją na Twoich fakturach. Dla kwot do 250 € wystarczy adres e-mail; powyżej tej kwoty oraz dla celów księgowych wymagane są imię i nazwisko lub nazwa firmy oraz adres.",
    Missing: "Nie zapisano jeszcze danych do faktury. Wcześniejsze faktury bez adresu jednorazowo uzupełnią się po jego zapisaniu.",
    Empty: "Nie zapisano jeszcze danych do faktury.",
    Add: "Dodaj adres",
    Name: "Imię i nazwisko lub nazwa firmy",
    NameHint: "Dokładnie tak, jak ma widnieć na fakturze.",
    Address: "Adres korespondencyjny",
    AddressHint: "Ulica i numer, kod pocztowy i miasto, kraj — każda pozycja w osobnej linii.",
    VatId: "NIP / VAT UE",
    VatIdHint: "Wyłącznie dla firm, np. PL1234567890.",
    Optional: "opcjonalnie",
    Edit: "Edytuj",
    Cancel: "Anuluj",
    Submit: "Zapisz adres",
    Pending: "Zapisywanie …",
    Saved: "Zapisano. Kolejne faktury będą zawierały te dane.",
    ErrorTitle: "Sprawdź wprowadzone dane",
    Errors: {
      name_required: "Podaj imię i nazwisko lub nazwę firmy.",
      address_required: "Podaj adres.",
      too_long: "Jeden z wpisów jest zbyt długi.",
      rate_limited: "Zbyt wiele prób. Odczekaj chwilę.",
      unknown: "Coś poszło nie tak. Spróbuj ponownie.",
    },
  },
};
