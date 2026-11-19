import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_PL } from "./closingTasksPl";

export const CLOSING_PL: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "Po przybiciu — Belowmark",
      description: "Lista kontrolna po przybiciu: płatność, podatek od nabycia, księga wieczysta, eksmisja, ubezpieczenie i remont — z terminami i powołaniem przepisów ustawowych.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Przybicie", "Licytacja komornicza", "Księga wieczysta", "Eksmisja"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "Wyniki licytacji — Belowmark",
      description: "Jakie ceny osiągają licytacje komornicze: wylicytowane ceny w relacji do wartości rynkowej na podstawie zgłoszonych wyników, anonimowo od pięciu terminów w grupie.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Cena przybicia", "Wartość rynkowa", "Wynik licytacji", "Licytacja komornicza"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "Po licytacji",
    Title: "Wynik i przybicie",
    Lead: {
      DE: "Byłeś na terminie licytacji? Wpisz, jaka padła oferta. Urzędowy portal nie publikuje wyników — Twoje zgłoszenia budują anonimowy przegląd cen. Jeśli sam uzyskałeś przybicie, lista kontrolna poprowadzi Cię aż do wpisu w księdze wieczystej.",
      TR: "Śledziłeś licytację? Wpisz, jaka padła oferta. Portal nie publikuje publicznych wyników — Twoje zgłoszenia budują anonimowy przegląd cen. Jeśli sam wygrałeś licytację (ihale), lista kontrolna poprowadzi Cię aż do wpisu w Tapu.",
    },
  },

  Result: {
    Title: "Zgłoś wynik terminu",
    Lead: "Tylko liczby, bez nazwisk. Swoje zgłoszenie możesz zaktualizować w dowolnym momencie.",
    NotYet: "Wynik można zapisać dopiero od dnia terminu licytacji.",
    HearingDate: "Data terminu",
    Outcome: "Wynik",
    Outcomes: {
      awarded: "Udzielono przybicia",
      refused: "Odmówiono przybicia",
      pending: "Odroczono ogłoszenie",
      noBids: "Brak ofert",
      cancelled: "Termin nie odbył się",
    },
    HighestBid: {
      DE: { label: "Najwyższa oferta (cena gotówkowa / Bargebot)", hint: "Zgodnie z protokołem lub postanowieniem o przybiciu" },
      TR: { label: "Cena wylicytowana (ihale bedeli)", hint: "Zgodnie z protokołem wyniku licytacji" },
    },
    RetainedRights: { label: "Prawa pozostające", hint: "Jeśli podano — stanowią część ceny ekonomicznej" },
    BidderCount: { label: "Liczba licytantów", hint: "Jeśli znana" },
    Source: "Skąd pochodzą Twoje dane?",
    Sources: { attended: "Obecność osobista", protocol: "Protokół / postanowienie", court: "Informacja z sądu" },
    IsBuyer: { DE: "Uzyskałem przybicie", TR: "Wygrałem licytację (ihale)" },
    AwardDate: {
      DE: { label: "Data ogłoszenia przybicia", hint: "Puste = data terminu licytacji" },
      TR: { label: "Data publikacji protokołu", hint: "Od tego dnia biegnie 7-dniowy termin zapłaty" },
    },
    Shared: { label: "Uwzględnij anonimowo w przeglądzie cen", hint: "Wyświetlana jest wyłącznie mediana dla regionu i typu nieruchomości, od pięciu terminów wzwyż — nigdy Twój pojedynczy wpis." },
    Privacy: "Dla tej sygnatury przechowujemy datę terminu, wynik, kwoty i liczbę licytantów — nigdy nazwisk licytantów, nabywców ani właścicieli.",
    Save: "Zapisz wynik",
    Saved: "Zapisano.",
    SavedBuyer: "Zapisano. Twoja lista kontrolna po przybiciu jest gotowa.",
    Errors: {
      auth: "Zaloguj się ponownie.",
      locked: "Lista kontrolna po przybiciu jest częścią planu Investor.",
      date: "Podaj prawidłową datę (nie wcześniejszą niż termin licytacji).",
      future: "Wyniki można zgłaszać dopiero od dnia terminu licytacji.",
      outcome: "Wybierz wynik postępowania.",
      bid: "W przypadku przybicia wpisz wylicytowaną kwotę (liczba całkowita).",
      ratio: "Kwota oferty nie pasuje do wartości rynkowej — sprawdź wpis.",
      bidders: "Podaj realistyczną liczbę licytantów.",
      buyer: "Opcja „Uzyskałem przybicie” jest dostępna tylko przy wyniku „Udzielono przybicia”.",
      unknown: "Nie udało się zapisać. Spróbuj ponownie.",
    },
    Ratio: "{pct} wartości rynkowej",
    StatsLink: "Zobacz przegląd cen",
  },

  Teaser: {
    Title: "Twoja lista kontrolna po przybiciu",
    Lead: "Płatność, podatek, księga wieczysta, objęcie posiadania, ubezpieczenie, remont — obliczone na podstawie Twoich terminów.",
    Button: "Otwórz listę kontrolną",
    Progress: "Ukończono {done} z {total}",
    Next: "Następne: {title} · {date}",
    NoDate: "Wpisz datę przybicia, aby lista kontrolna mogła wyliczyć Twoje terminy.",
  },

  Tasks: {
    Kicker: "Po przybiciu",
    Title: "Lista kontrolna po przybiciu",
    Lead: {
      DE: "Od przybicia do wpisu w księdze wieczystej i wydania nieruchomości. Terminy obliczamy ściśle z podanych przez Ciebie dat. Każde stwierdzenie wskazuje podstawę ustawową.",
      TR: "Od ihale do wpisu w Tapu i wydania nieruchomości. Terminy obliczamy ściśle z podanych przez Ciebie dat. Każde stwierdzenie wskazuje podstawę ustawową.",
    },
    Back: "Powrót do karty sprawy",
    Disclaimer:
      "Ta lista kontrolna ma charakter wyłącznie orientacyjny i nie stanowi porady prawnej. Przedstawia przepisy ustawowe w formie uproszczonej (stan na 26.10.2026) i nie uwzględnia specyfiki indywidualnej sprawy. W sprawach terminów, wypowiedzeń i eksmisji skonsultuj się z sądem, notariuszem lub prawnikiem.",
    Locked: {
      Title: "Lista kontrolna w planie Investor",
      Body: "Twój wynik został zapisany. Lista kontrolna po przybiciu z wyliczonymi terminami i przypomnieniami jest dostępna w planie Investor.",
      Cta: "Przejdź na plan Investor",
    },
    Dates: {
      Title: "Twoje daty",
      Lead: "Lista kontrolna wylicza terminy na podstawie tych dat. Pola, których jeszcze nie znasz, pozostaw puste.",
      Fields: {
        DE: {
          awardDate: { label: "Data ogłoszenia przybicia", hint: "Wymagane" },
          distributionDate: { label: "Termin podziału (Verteilungstermin)", hint: "Podany w wezwaniu sądowym" },
          taxNoticeDate: { label: "Data decyzji o podatku od nabycia", hint: "Data doręczenia" },
          handoverDate: { label: "Wydanie / eksmisja dnia", hint: "Planowane lub dokonane" },
        },
        TR: {
          awardDate: { label: "Data publikacji protokołu licytacji", hint: "Wymagane — rozpoczyna bieg 7 dni" },
          handoverDate: { label: "Wydanie / eksmisja dnia", hint: "Planowane lub dokonane" },
        },
      },
      FromPortfolio: "Wstępnie wypełniono z Twojego portfela — zapisz zmiany.",
      Save: "Zapisz daty",
      Saved: "Zapisano.",
      Required: "Podaj co najmniej datę przybicia.",
      Errors: {
        auth: "Zaloguj się ponownie.",
        locked: "Lista kontrolna po przybiciu jest częścią planu Investor.",
        date: "Podaj co najmniej datę przybicia.",
        unknown: "Nie udało się zapisać. Spróbuj ponownie.",
      },
    },
    Conditions: {
      Title: "Twoja sytuacja",
      Lead: "Pokazuje wyłącznie zadania dotyczące Twojej nieruchomości. Zapisywane w tej przeglądarce.",
      Items: { tenant: "Są najemcy", ownerOccupied: "Były właściciel nadal tam mieszka", condo: "Mieszkanie własnościowe", house: "Dom jedno- lub dwurodzinny" },
    },
    Phases: { first: "Pierwsze dni", payment: "Płatność", register: "Podatek i księga wieczysta", possession: "Posiadanie i najemcy", works: "Remont i utrzymanie" },
    Due: { deadline: "do {date}", earliest: "najwcześniej {date}", on: "od {date}" },
    Missing: "Brakująca data: {field}",
    States: { done: "Ukończono", overdue: "Po terminie", soon: "Wkrótce termin", open: "Otwarte", undated: "Bez daty" },
    Basis: { law: "Ustawa", practice: "Praktyka", rule: "Zasada Belowmark" },
    Check: "Stan prawny zmieniony lub nieostatecznie rozstrzygnięty — zweryfikuj",
    MarkDone: "Gotowe",
    MarkOpen: "Otwórz ponownie",
    Sources: "Źródła",
    Progress: "Ukończono {done} z {total}",
    Items: CLOSING_TASKS_PL,
  },

  Results: {
    Kicker: "Wyniki terminów",
    Title: "Ile faktycznie się płaci",
    Lead: "Zgłoszone ceny przybicia w relacji do wartości rynkowej. Dane pochodzą od użytkowników, nie z sądów — pokazują ogólny poziom cen, a nie wycenę Twojej nieruchomości.",
    Method: {
      Title: "Jak to obliczamy",
      Items: [
        "Wskaźnik = (najwyższa oferta + prawa pozostające) ÷ wartość rynkowa z obwieszczenia urzędowego.",
        "Jeśli ten sam termin zgłosi kilku użytkowników, liczy się raz jako mediana zgłoszeń.",
        "Wartości wyświetlamy dopiero od pięciu terminów w grupie wzwyż. Poniżej pokazujemy wyłącznie liczbę.",
        "W zestawieniu nie pojawiają się żadne nazwiska ani sygnatury akt. Twoje zgłoszenia widzisz tylko Ty.",
      ],
    },
    Table: { Region: "Region", Segment: "Typ nieruchomości", Awarded: "Przybicia", Median: "Mediana", Range: "Środkowa połowa (IQR)", Bidders: "Licytanci (mediana)", Reported: "Zgłoszone terminy" },
    AllSegments: "Wszystkie typy nieruchomości",
    Total: "Łącznie",
    OtherRegion: "Bez regionu",
    TooFew: "{n} — za mało (od {min})",
    Empty: "Brak jeszcze zgłoszeń na Twoim rynku. Zestawienie wypełni się, gdy użytkownicy zaczną wpisywać wyniki terminów na karcie sprawy w sekcji „Wynik i przybicie”.",
    Locked: "Przegląd cen jest częścią planu Investor. Nadal możesz jednak zgłaszać wyniki.",
    Own: { Title: "Twoje zgłoszenia", Lead: "Widoczne wyłącznie dla Ciebie.", Empty: "Nie zgłosiłeś jeszcze żadnych wyników.", Shared: "w przeglądzie", Private: "prywatne", Buyer: "Twoje przybicie" },
  },
};
