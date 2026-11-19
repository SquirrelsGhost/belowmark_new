import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_PL: IDeadlineTranslation = {
  MetaTags: {
    title: "Asystent terminów — Belowmark",
    description: "Wszystkie terminy od obwieszczenia do przybicia wraz z podstawą prawną: rękojmia (wadium), termin przelewu lub czeku, dzień licytacji. Przypomnienia e-mail i subskrypcja kalendarza.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Terminy", "Licytacje komornicze", "Rękojmia", "Kalendarz"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Terminy",

  Section: {
    Eyebrow: "Asystent terminów",
    Title: "Terminy i harmonogram",
    Lead: {
      DE: "Wszystkie terminy aż do przybicia, wyliczone z daty licytacji w oficjalnym obwieszczeniu i poparte podstawą prawną. Obserwuj postępowanie, aby otrzymywać przypomnienia e-mail i w kalendarzu.",
      TR: "Wszystkie terminy tur e-Satış, wyliczone z dat obwieszczenia İlan i poparte przepisami. Obserwuj postępowanie, aby otrzymywać przypomnienia e-mail i w kalendarzu.",
    },
    Locked: {
      Title: "Terminy z przypomnieniami",
      Body: "Asystent terminów wylicza z obwieszczenia datę wpłaty rękojmi, termin wystawienia czeku bankowego oraz termin przybicia i przypomina o nich e-mailem oraz w kalendarzu. Funkcja dostępna w planie Investor.",
    },
    NoDates: "Oficjalne obwieszczenie nie podaje daty licytacji, dlatego nie można wyliczyć terminów.",
    Cancelled: "Postępowanie zostało odwołane. Terminy nie biegną.",
    Phases: { before: "Przed licytacją", hearing: "Licytacja", after: "Po przybiciu" },
    Basis: { law: "Ustawa", notice: "Obwieszczenie", user: "Twój wpis", rule: "zalecenie belowmark" },
    Kinds: { deadline: "Termin", appointment: "Licytacja", task: "Od tego dnia", info: "Orientacyjnie" },
    AfterAwardEmpty: "Terminy po przybiciu (zapłata ceny, podatek, wpis w księdze wieczystej, wydanie lokalu) pojawią się tutaj po zapisaniu wyniku licytacji.",
    Reminders: "Przypomnienie",
    ReminderDay: "1 dzień wcześniej",
    ReminderDays: "{days} dni wcześniej",
    ReminderToday: "w dniu terminu",
    Disclaimer: "Obliczono bez uwzględnienia dni ustawowo wolnych i ostrożnościowo, aby żaden termin nie okazał się za późny. Wiążące są przepisy ustawy i wezwanie sądu; nie stanowi porady prawnej.",
  },

  Status: {
    Past: "miniony",
    Today: "dziś",
    Tomorrow: "jutro",
    InDays: "za {days} dni",
  },

  Follow: {
    Start: "Śledź postępowanie",
    Stop: "Przestań śledzić",
    Following: "Śledzisz to postępowanie.",
    NotFollowing: "Nie ustawiono jeszcze przypomnień.",
    MailOn: "Przypomnienie e-mail włączone",
    MailOff: "Przypomnienie e-mail wyłączone",
    Download: "Terminy jako kalendarz (.ics)",
    Overview: "Wszystkie terminy",
    Error: "To się nie udało. Spróbuj ponownie.",
  },

  Checklist: {
    Title: "Plan działań przed licytacją",
    Hint: "Zaznaczone punkty pozostają zapisane w tej przeglądarce. Kroki z weryfikacją belowmark wykrywane są automatycznie.",
    Progress: "Ukończono {done} z {total}",
    Auto: "wykryto",
    Steps: {
      DE: [
        { id: "gutachten", Label: "Zapoznaj się z operatem szacunkowym", Hint: "Wgraj operat szacunkowy; analiza ryzyk sprawdzi służebności, najemców i rok budowy." },
        { id: "inspection", Label: "Obejrzyj nieruchomość", Hint: "Przynajmniej z zewnątrz; powiązane pytania znajdziesz w sekcji Werdykt." },
        { id: "limit", Label: "Ustal swój limit oferty", Hint: "Do jakiej kwoty zakup ma sens finansowy? Twoje założenia, Twój pułap." },
        { id: "bank", Label: "Zabezpiecz finansowanie", Hint: "Teczka bankowa pokazuje bankowi harmonogram płatności i ustawowe terminy." },
        { id: "deposit", Label: "Przygotuj rękojmię (wadium)", Hint: "Przelew, czek potwierdzony lub gwarancja bankowa: dokładne daty znajdziesz na osi czasu." },
        { id: "papers", Label: "Wydrukuj teczkę licytanta", Hint: "Dowód tożsamości, pełnomocnictwo, potwierdzenie wpłaty rękojmi i limit oferty na papierze." },
      ],
      TR: [
        { id: "gutachten", Label: "Przeczytaj kıymet takdir raporu", Hint: "Wgraj raport z wyceny; analiza ryzyk sprawdzi obciążenia, najemców i stan techniczny." },
        { id: "inspection", Label: "Obejrzyj nieruchomość", Hint: "Przynajmniej z zewnątrz; powiązane pytania znajdziesz w sekcji Werdykt." },
        { id: "limit", Label: "Ustal swój limit oferty (teklif)", Hint: "Do jakiej kwoty zakup się opłaca z uwzględnieniem tapu harcı i VAT (KDV)?" },
        { id: "bank", Label: "Ustal finansowanie z wyprzedzeniem", Hint: "Po zakończeniu tury na zapłatę pozostaje zaledwie 7 dni; bez wcześniejszej decyzji banku to bardzo krótki czas." },
        { id: "deposit", Label: "Wpłać wadium (teminat)", Hint: "Gotówkowo przez portal lub jako teminat mektubu: terminy widnieją na osi czasu." },
        { id: "papers", Label: "Sprawdź dostęp e-Devlet i e-Satış", Hint: "Licytowanie jest możliwe wyłącznie po zalogowaniu do portalu e-Satış przez e-Devlet." },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "Opublikowano oficjalne obwieszczenie",
        Detail: "Termin licytacji musi zostać ogłoszony z co najmniej sześciotygodniowym wyprzedzeniem. Tutaj rozpoczyna się Twoje przygotowanie.",
      },
      Transfer: {
        Title: "Rękojmia przelewem: zaksięgowana na rachunku",
        Detail: "Gotówka jest wykluczona. Przelew bankowy liczy się wyłącznie wtedy, gdy wpłynie na rachunek kasy sądu przed terminem licytacji, a potwierdzenie zostanie okazane na sali. Dane rachunku i tytuł przelewu podaje sąd. Obliczono ostrożnościowo: dzień wcześniej.{amount}",
      },
      Cheque: {
        Title: "Najwcześniejsza data wystawienia potwierdzonego czeku bankowego",
        Detail: "Potwierdzony czek rozrachunkowy (Verrechnungsscheck) jest ważny wyłącznie wtedy, gdy został wystawiony najwcześniej trzeciego dnia roboczego przed licytacją przez bank licencjonowany w Niemczech lub Bundesbank. Wcześniej wystawiony czek zostanie odrzucony. Liczono z sobotą jako dniem roboczym i bez świąt, aby nigdy nie było za wcześnie.",
      },
      Hearing: {
        Title: "Termin licytacji komorniczej / sądowej",
        Detail: "{authority}. Między wezwaniem do składania ofert a zamknięciem licytacji musi upłynąć co najmniej 30 minut. Zabierz: dowód tożsamości, potwierdzenie rękojmi oraz notarialnie poświadczone pełnomocnictwo, jeśli licytujesz w imieniu innej osoby.",
      },
      Award: {
        Title: "Najpóźniejszy termin ogłoszenia przybicia (termin instrukcyjny)",
        Detail: "Przybicie ogłaszane jest na terminie licytacji lub na osobnym posiedzeniu ogłoszeniowym, nie później niż po upływie tygodnia. Z chwilą ogłoszenia nabywasz własność. Dokładną datę wyznacza sąd.",
      },
      Amount: " Kwota w razie żądania zabezpieczenia: {amount} (10% wartości rynkowej).",
    },
    TR: {
      Notice: {
        Title: "Opublikowano obwieszczenie (İlan)",
        Detail: "Tura licytacji musi zostać ogłoszona w portalu e-Satış co najmniej 15 dni przed jej rozpoczęciem.",
      },
      RoundStart: {
        Title: "Rozpoczyna się tura {round} (Artırma)",
        Detail: "Można już składać oferty w portalu e-Satış; tura trwa siedem dni.{startingBid}",
      },
      Cash: {
        Title: "Tura {round} (Artırma): gotówkowe teminat do 23:30",
        Detail: "Wpłać wadium przez portal na rachunek urzędu İcra najpóźniej do godziny 23:30 w dniu poprzedzającym zakończenie tury.{amount}",
      },
      Letter: {
        Title: "Tura {round} (Artırma): teminat mektubu do końca godzin pracy",
        Detail: "Gwarancja bankowa musi dotrzeć do urzędu İcra przed końcem godzin pracy w dniu roboczym poprzedzającym koniec tury. Dni świąteczne nie są odejmowane: jeśli dzień ten wypada w święto, obowiązuje poprzedni dzień roboczy.",
      },
      RoundEnd: {
        Title: "Zakończenie tury {round} (Artırma)",
        Detail: "Złożenie oferty w ostatnich dziesięciu minutach wydłuża turę o trzy minuty za każde postąpienie, maksymalnie o godzinę. Następnie publikowany jest protokół wyniku; od tego momentu masz siedem dni na zapłatę.",
      },
      Amount: " Kwota: {amount} (10% wartości oszacowania).",
      StartingBid: " Cena wywołania według İlan: {amount}.",
    },
  },

  Page: {
    Eyebrow: "Asystent terminów",
    Title: "Terminy",
    Lead: "Wszystkie terminy śledzonych postępowań na jednej liście. Z przypomnieniami e-mail i subskrypcją we własnym kalendarzu.",
    Count: "{count} śledzonych",
    Empty: {
      Title: "Nie śledzisz jeszcze żadnego postępowania",
      Body: "Otwórz kartę sprawy i kliknij „Śledź postępowanie” w sekcji „Terminy i harmonogram”.",
      Cta: "Przejdź do wyszukiwarki",
    },
    Next: "Najbliższy termin",
    NothingAhead: "Brak nadchodzących terminów.",
    OpenListing: "Otwórz akta sprawy",
    Missing: "Brak w bieżącym zbiorze danych",
    Feed: {
      Title: "Subskrypcja kalendarza",
      Body: "Dodaj ten adres jako subskrypcję w Kalendarzu Google, Outlooku lub Apple Calendar („Z adresu URL”). Nowe postępowania i przełożone terminy synchronizują się automatycznie wraz z przypomnieniami.",
      Create: "Wygeneruj adres URL kanału",
      Renew: "Wygeneruj nowy adres URL",
      Copy: "Kopiuj",
      Copied: "Skopiowano",
      Shown: "Widoczny wyłącznie teraz. Nie przechowujemy tego adresu jawnym tekstem; każdy, kto go zna, może podglądać Twoje terminy.",
      Hidden: "Kanał kalendarza jest aktywny. Zgubiłeś adres URL? Wygeneruj nowy — poprzedni przestanie natychmiast działać.",
      Error: "Nie udało się wygenerować adresu URL kanału.",
    },
    HowItWorks: "Przypomnienia wysyłane są rano e-mailem i pojawiają się w kalendarzu w dniach wskazanych przy każdym terminie. Daty licytacji pochodzą z oficjalnych obwieszczeń; jeśli sąd zmieni termin, zaktualizuje się on przy kolejnej synchronizacji danych.",
  },

  Mail: {
    Subject: "Zbliża się {count} terminów",
    SubjectOne: "Zbliża się jeden termin",
    Preheader: "Twój Asystent terminów z belowmark.",
    Greeting: "Dzień dobry,",
    Intro: "poniżej znajdziesz najbliższe terminy w śledzonych przez Ciebie postępowaniach:",
    Today: "dziś",
    Tomorrow: "jutro",
    InDays: "za {days} dni",
    OpenListing: "Otwórz akta sprawy",
    Manage: "Zarządzaj przypomnieniami",
    Signature: "Zespół belowmark",
    Footer: "Otrzymujesz tę wiadomość, ponieważ śledzisz postępowanie. Możesz zrezygnować w zakładce „Terminy”.",
    Source: "Podstawa prawna",
  },

  Ics: {
    CalendarName: "belowmark Terminy",
    Source: "Źródło",
  },
};
