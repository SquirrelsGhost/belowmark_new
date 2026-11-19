import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_PL: ITrMarketTranslation = {
  Age: {
    Title: "Wiek wartości oszacowania",
    Lead: "Muhammen bedel to kwota nominalna z roku wszczęcia postępowania egzekucyjnego. Przy tureckiej inflacji w przypadku starszych akt ma to zasadnicze znaczenie.",
    FileYear: "Rok założenia akt",
    Basis: "Wycena ustalona najpóźniej w grudniu {year} — najpóźniejszy możliwy termin w tym roku, czyli najbardziej ostrożne założenie.",
    Factor: "Wzrost cen konsumpcyjnych od tego czasu",
    Lost: "Utrata siły nabywczej kwoty nominalnej",
    Today: "Wartość oszacowania w lirach z {month}",
    TodayNote: "Wyłącznie korekta o siłę nabywczą — nie jest to nowy operat ani cena rynkowa.",
    Young: "Akta z {year}: wycena jest świeża, dlatego korekta inflacyjna nie wnosi tu dodatkowej wartości.",
    NoYear: "Sygnatura akt nie zawiera roku. Bez roku nie można przeprowadzić porównania inflacyjnego.",
    Unavailable: "Oficjalny szereg wskaźnika cen nie jest wystarczająco aktualny. Lepiej nie podawać liczby niż podawać nieaktualną.",
    Source: "{label}, {source} · stan na {month}",
  },

  Euro: {
    Title: "Równowartość w euro",
    Value: "Wartość oszacowania",
    StartingBid: "Cena wywołania",
    AllIn: "Cena wywołania z kosztami dodatkowymi",
    Rate: "1 € = {rate} · kurs kupna dewiz TCMB z dnia {date}",
    Note: "Przeliczone po dziennym kursie banku centralnego, nie po kursie z dnia płatności. Rozliczenie następuje w lirach tureckich.",
    Unavailable: "Brak zapisanego aktualnego kursu banku centralnego{last}. Kwoty w euro pojawią się natychmiast po załadowaniu dzisiejszego kursu — nigdy nie ekstrapolujemy nieaktualnym kursem.",
    LastRate: " (ostatni kurs z dnia {date})",
  },

  CheckKit: {
    Title: "Pakiet weryfikacyjny e-Satış",
    Lead: "Zdjęcia, operat szacunkowy i warunki licytacji znajdują się w portalu e-Satış i wymagają logowania przez e-Devlet. Bezpośrednie linki nie przenoszą parametrów wyszukiwania — skopiuj te dane i wklej je bezpośrednio w portalu.",
    Copy: "Kopiuj pakiet weryfikacyjny",
    Copied: "Skopiowano",
    Open: "Otwórz e-Satış",
    NotStated: "nie podano",
  },

  Converter: {
    Title: "Przelicznik walut ₺ ↔ €",
    Subtitle: "Według dziennego kursu TCMB",
    Lira: "Kwota w lirach",
    Euro: "Kwota w euro",
    Unavailable: "Brak zapisanego aktualnego kursu banku centralnego{last}. Przelicznik pojawi się natychmiast po załadowaniu dzisiejszego kursu.",
  },
};
