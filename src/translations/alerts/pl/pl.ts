import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_PL: IAlertsTranslation = {
  MetaTags: {
    title: "Alerty — Belowmark",
    description: "Zapisane wyszukiwania z powiadomieniami e-mail: dowiedz się natychmiast, gdy pojawi się nowa pasująca licytacja komornicza lub zmieni się termin przetargu.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Alerty", "Licytacje komornicze", "Zapisane wyszukiwanie"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Alerty",

  Page: {
    Eyebrow: "Zapisane wyszukiwania",
    Title: "Alerty",
    Lead: "Każdy alert to zapisane wyszukiwanie. Gdy pojawi się nowe pasujące postępowanie lub sąd zmieni termin licytacji, otrzymasz e-mail — z sygnaturą akt i bezpośrednim linkiem do akt sprawy.",
    Usage: "{count} z {max} alertów",
    Empty: {
      Title: "Nie masz jeszcze żadnych alertów.",
      Body: "Ustaw filtry w obwieszczeniach — województwo, rodzaj nieruchomości, przedział wartości, słowo kluczowe — i zapisz wyszukiwanie jako alert tuż pod liczbą wyników.",
      Cta: "Przejdź do obwieszczeń",
    },
    HowItWorks:
      "Porównanie odbywa się po każdej aktualizacji oficjalnych rejestrów. Informujemy wyłącznie o tym, co wynika z samego obwieszczenia: nowym postępowaniu, zmianie terminu lub odwołaniu licytacji. Zakres dat i sortowanie nie są częścią alertu — alert zawsze patrzy w przyszłość.",
  },

  Card: {
    Active: "Aktywny",
    Paused: "Wstrzymany",
    Pause: "Wstrzymaj",
    Resume: "Wznów",
    Delete: "Usuń",
    OpenSearch: "Otwórz wyszukiwanie",
    Matches: "{count} aktywnych wyników",
    MatchesOne: "1 aktywny wynik",
    NotifyNew: "Nowe postępowania",
    NotifyChanges: "Zmiany terminów",
    LastSent: "Ostatni e-mail: {date}",
    NeverSent: "Nie wysłano jeszcze żadnego e-maila",
    LastChecked: "Sprawdzono: {date}",
    Error: "Coś poszło nie tak. Spróbuj ponownie.",
  },

  Summary: {
    AllRegions: { DE: "Wszystkie regiony / województwa", TR: "Wszystkie prowincje" },
    AllSegments: "Wszystkie rodzaje nieruchomości",
    Query: "„{query}”",
    Min: "od {value}",
    Max: "do {value}",
  },

  Save: {
    Toggle: "Zapisz wyszukiwanie jako alert",
    Title: "Utwórz alert",
    NameLabel: "Nazwa",
    NotifyNew: "E-mail o nowych postępowaniach",
    NotifyChanges: "E-mail o zmianach terminów i odwołaniach",
    Hint: "Zapisuje słowo kluczowe, region, rodzaj nieruchomości i przedział wartości. Bieżące wyniki są oznaczane jako znane — powiadomienia dotyczą zmian od teraz.",
    Submit: "Zapisz alert",
    Pending: "Zapisywanie …",
    Saved: "Zapisano. Otrzymasz wiadomość e-mail, gdy tylko coś się zmieni.",
    Manage: "Zarządzaj alertami",
    Errors: {
      limit: "Masz już 10 alertów. Usuń jeden z nich przed utworzeniem kolejnego.",
      invalid: "Nadaj alertowi nazwę i wybierz co najmniej jedną opcję powiadomień.",
      failed: "Nie udało się zapisać alertu. Spróbuj ponownie.",
    },
  },

  Mail: {
    Subject: "{count} aktualizacji dla Twoich alertów",
    SubjectOne: "1 aktualizacja dla Twoich alertów",
    Preheader: "Nowe postępowania i zmienione terminy licytacji z Twoich zapisanych wyszukiwań.",
    Greeting: "Dzień dobry,",
    Intro: "od ostatniego sprawdzenia w Twoich zapisanych wyszukiwaniach zaszły następujące zmiany:",
    Kinds: { new: "Nowe", cancelled: "Odwołane", reinstated: "Przywrócone", rescheduled: "Zmieniony termin" },
    NextDate: "Termin {date}",
    Moved: "wcześniej {before}, teraz {after}",
    Value: { DE: "Suma oszacowania", TR: "Muhammen bedel" },
    More: "+ {count} więcej",
    OpenSearch: "Otwórz wyszukiwanie",
    LockedValues: "Pełne sygnatury akt, dokładne adresy i pliki PDF operatów odblokujesz w Pełnym Dostępie (lub przez 1 darmowe pełne akta).",
    TrialTitle: "Odblokuj wszystkie sygnatury, dokładne adresy i dokumenty PDF",
    TrialBody: "Twoje konto alertowe oraz 1 darmowe akta pozostają na zawsze darmowe (bez danych karty i bez automatycznego przedłużenia). Opcjonalnie przetestuj pełny pakiet Investor przez 7 dni za 0,00 zł dzisiaj.",
    TrialCta: "Rozpocznij 7-dniowy test (0,00 zł)",
    Manage: "Zarządzaj lub wstrzymaj alerty",
    Source: { DE: "Źródło wszystkich danych: oficjalne portale sądowe i KRK", TR: "Źródło wszystkich danych: ilan.gov.tr" },
    Signature: "Zespół Belowmark",
    Footer: "Belowmark · Licytacje komornicze potwierdzone źródłowo · belowmark.com",
  },
};
