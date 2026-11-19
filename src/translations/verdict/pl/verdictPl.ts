import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_PL: IVerdictTranslation = {
  Section: {
    Eyebrow: "Werdykt",
    Title: "Licytować czy odpuścić?",
    Lead: "Werdykt wyprowadzony z urzędowego obwieszczenia, Twojego operatu szacunkowego, przepisów ustawowych oraz Twoich własnych liczb. Wskazuje „Licytuj” dopiero wtedy, gdy żadna istotna kwestia nie pozostaje otwarta — i podaje źródło każdego argumentu.",
    Disclaimer: "Wskazówka inwestycyjna oparta na Twoich danych, a nie porada prawna ani inwestycyjna. Wiążące są wyłącznie księga wieczysta, operat szacunkowy oraz ogłoszenia sądu na terminie licytacji.",
  },
  Locked: {
    Title: "Werdykt w planie Investor",
    Body: "Werdykt łączy kontrolę ryzyk, analizę operatu szacunkowego oraz limit licytacji w jednoznaczną rekomendację dla każdej nieruchomości. Dostępny w planie Investor.",
  },

  States: {
    go: { Stamp: "Licytuj", Headline: "Licytuj do {amount}", Sub: "Na podstawie Twoich liczb i dostępnych źródeł. Nie przekraczaj tego pułapu." },
    open: { Stamp: "Niegotowe do licytacji", Headline: "Wstępny limit {amount}", Sub: "Ten limit podlega otwartym zastrzeżeniom. Stanie się wiążącym werdyktem dopiero po wyjaśnieniu poniższych punktów." },
    stop: { Stamp: "Nie licytuj", Headline: "Nie licytuj", Sub: "Co najmniej jeden udokumentowany powód wyraźnie przemawia przeciwko licytowaniu — zobacz poniżej." },
    none: { Stamp: "Brak werdyktu", Headline: "Werdykt niemożliwy", Sub: "Tego postępowania nie można obecnie ocenić." },
  },
  GoUnverified: "Uwaga: Twój budżet remontowy nie został zweryfikowany na miejscu ani poparty kosztorysem wykonawcy. Twój limit jest tylko tak wiarygodny, jak ta kwota.",
  OpenNoLimit: { Headline: "Brak jeszcze limitu", Sub: "Bez określenia celów w kalkulatorze limitu licytacji nie istnieje górny pułap. Poniższa lista pokazuje, czego jeszcze brakuje." },
  Groups: {
    none: "Dlaczego werdykt nie jest możliwy",
    stop: "Dlaczego nie licytować",
    gap: "Zanim zalicytujesz",
    caution: "Miej na uwadze",
    ok: "Co przemawia za zakupem",
  },

  Reasons: {
    noValue: "Obwieszczenie urzędowe nie podaje wartości rynkowej. Bez niej nie można obliczyć ani progów ustawowych, ani kosztów.",
    cancelled: "Według portalu termin licytacji został odwołany.",
    past: "Data terminu licytacji już minęła.",
    unreachable: "Twoich celów nie da się osiągnąć przy żadnej cenie — nawet przy 0. Koszty bieżące i czynsz ich nie pokrywają.",
    belowStart: "Twój limit {amount} jest niższy niż cena wywołania {other}. Tak niska oferta jest niedopuszczalna.",
    belowHalf: "Twój limit łącznie z prawami pozostającymi ({amount}) leży poniżej 5/10 wartości rynkowej ({other}). Na pierwszym terminie przybicie poniżej tego progu musi zostać odmówione z urzędu — oceń sprawę ponownie przy kolejnym terminie.",
    rightStays: "{risk} według źródła. Może przetrwać przybicie i pozbawić Cię korzystania z nieruchomości lub obniżyć jej wartość. Licytuj dopiero po potwierdzeniu w sądzie, czy prawo wygasa, i wpisaniu jego wartości w polu „Prawa pozostające na nieruchomości” w limicie licytacji (wpisz 0, jeśli wygasa).",
    noTargets: "W kalkulatorze limitu licytacji nie podano jeszcze kryterium celu (rentowności, cashflow ani wartości odsprzedaży). Bez celu nie można wyznaczyć pułapu.",
    noReport: "Nie wgrano operatu szacunkowego. Prawa, wady i zanieczyszczenia znane są więc tylko z obwieszczenia urzędowego — które zazwyczaj o nich nie wspomina.",
    noRenovation: "Nie wpisano budżetu remontowego. Podaj swoje oszacowanie — albo 0, jeśli remont nie jest potrzebny.",
    noClearance: "Możliwa obecność najemców lub lokatorów, ale nie wpisano kosztów eksmisji ani opróżnienia (wpisz 0, jeśli nie występują).",
    askInspection: "Określ, czy oglądałeś nieruchomość.",
    askOccupancy: "Określ, kto zajmuje nieruchomość — na ile jest Ci to wiadome.",
    askRights: "Określ, czy zapytałeś sąd o prawa pozostające na nieruchomości.",
    rightsOpen: "Nie zweryfikowałeś jeszcze praw pozostających. Wszystko, co przetrwa przybicie, trzeba zapłacić lub przejąć ponad cenę gotówkową.",
    askCostBasis: "Określ, na czym opierają się Twoje szacunki kosztów remontu i opróżnienia.",
    costsIncomplete: "Jednej z ustawowych pozycji kosztowych nie da się wyliczyć z obwieszczenia — suma kosztów jest niepełna.",
    contamination: "W operacie szacunkowym wskazano zanieczyszczenia. Tylko ekspertyza specjalistyczna pozwala wycenić rekultywację. Nie licytuj, dopóki Twój budżet nie będzie oparty na ofercie.",
    rightPriced: "{risk} według źródła — wyjaśnione w sądzie i wycenione w limicie licytacji na kwotę {amount}.",
    notInside: "Nie byłeś wewnątrz nieruchomości. Twój budżet remontowy nie jest więc zweryfikowany — poniższy test warunków skrajnych pokazuje, jak przekroczenie kosztów wpływa na limit.",
    reportOutsideOnly: "Biegły sądowy również nie mógł (w pełni) obejrzeć wnętrza.",
    estimateOnly: "Koszty remontu to Twoje własne oszacowanie, a nie kosztorys wykonawcy.",
    defects: "Operat szacunkowy wspomina o wadach lub uszkodzeniach. Sprawdź, czy Twój budżet remontowy je pokrywa.",
    tenant: "Nieruchomość jest (prawdopodobnie) wynajęta. Umowy najmu przechodzą na nabywcę — licz według aktualnego czynszu, a nie docelowego.",
    heritage: "Ochrona zabytków według źródła. Przebudowy i remonty wymagają zgody konserwatora zabytków i często są droższe.",
    easement: "Operat szacunkowy wspomina o służebnościach lub obciążeniach budowlanych (np. służebności drogi). Często pozostają one w mocy po przybiciu.",
    contaminationUnclear: "Operat szacunkowy pozostawia otwartą kwestię występowania zanieczyszczeń.",
    oldValuation: "Data wyceny przypada {years} lat przed terminem licytacji. Sytuacja rynkowa i stan nieruchomości mogły się od tego czasu zmienić.",
    valueMismatch: "Operat szacunkowy podaje {amount}, a obwieszczenie urzędowe {other}. Wyjaśnij w sądzie, która kwota jest wiążąca.",
    sevenTenths: "Twój limit łącznie z prawami pozostającymi ({amount}) jest poniżej 7/10 ({other}). Uprawniony wierzyciel może wnieść o odmowę przybicia na pierwszym terminie.",
    atCeiling: "Limit osiąga górną granicę obliczeń (trzykrotność wartości rynkowej). Twoje założenia docelowe są prawdopodobnie zbyt optymistyczne.",
    conflicting: "Źródła są ze sobą sprzeczne w kwestii „{risk}”.",
    limitBy: "Twój cel „{criterion}” uzasadnia licytowanie do {amount}.",
    legalClear: "Limit przekracza ustawowe progi minimalne dla tego terminu.",
    limitsWaived: "W tym postępowaniu ustawowe progi wartościowe już nie obowiązują.",
    rightsClear: "Prawo zamieszkania, użytkowanie i prawo zabudowy są wykluczone według źródeł.",
  },
  MarketReasons: {
    belowStart: {
      DE: "Twój limit {amount} jest niższy niż cena wywołania {other}.",
      TR: "Twój limit {amount} jest niższy niż cena wywołania {other} (50% wartości oszacowania). Tak niska oferta nie jest dopuszczalna w żadnej rundzie.",
    },
    rightStays: {
      DE: "{risk} według źródła. Może przetrwać przybicie i pozbawić Cię korzystania z nieruchomości lub obniżyć jej wartość. Licytuj dopiero po potwierdzeniu w sądzie, czy prawo wygasa, i wpisaniu jego wartości w polu „Prawa pozostające na nieruchomości” w limicie licytacji (wpisz 0, jeśli wygasa).",
      TR: "{risk} według źródła. To, czy prawo przetrwa licytację, zależy od zapisów w Tapu i Satış şartnamesi. Licytuj dopiero po weryfikacji i uwzględnieniu tego w swoich obliczeniach.",
    },
    askRights: {
      DE: "Określ, czy zapytałeś sąd o prawa pozostające na nieruchomości.",
      TR: "Określ, czy sprawdziłeś wpisy w Tapu i Satış şartnamesi pod kątem obciążeń.",
    },
    rightsOpen: {
      DE: "Nie zapytałeś jeszcze sądu o prawa pozostające. Wszystko, co przetrwa przybicie, przejmujesz ponad swoją ofertę.",
      TR: "Nie sprawdziłeś jeszcze wpisów w Tapu i Satış şartnamesi. Obciążenia, które przetrwają licytację, pozostają po Twojej stronie.",
    },
    tenant: {
      DE: "Nieruchomość jest (prawdopodobnie) wynajęta. Umowy najmu przechodzą na nabywcę — licz według aktualnego czynszu, a nie docelowego.",
      TR: "Nieruchomość jest (prawdopodobnie) zamieszkała lub wynajęta. Eksmisja może zająć czas i wymagać odrębnego postępowania — uwzględnij to.",
    },
  },
  Actions: {
    limit: "Wpisz w limicie licytacji",
    report: "Wgraj operat",
    questions: "Odpowiedz poniżej",
  },

  Sources: {
    Label: "Źródło",
    notice: "Obwieszczenie urzędowe",
    report: "Operat str. {page}",
    input: "Twoje dane",
    answer: "Twoja odpowiedź",
    rule: "zasada belowmark",
  },

  Questions: {
    Title: "To, co możesz wiedzieć tylko Ty",
    Lead: "Żaden dokument nie pokaże, jak wnętrze wygląda dziś ani kto w nim mieszka. Twoje odpowiedzi bezpośrednio wpływają na werdykt — bez odpowiedzi punkt pozostaje otwarty.",
    Items: {
      inspection: {
        Label: "Czy oglądałeś nieruchomość?",
        Hint: "Oględziny wnętrza często nie są możliwe w przypadku licytacji komorniczych.",
        Options: { inside: "Tak, wewnątrz", outside: "Tylko z zewnątrz", none: "Wcale" },
      },
      rights: {
        Label: "Czy pytałeś sąd o prawa pozostające?",
        Hint: "Referendarz sądowy (Rechtspfleger) może przed terminem podać minimalną ofertę i ewentualne prawa pozostające po zapytaniu.",
        Options: { confirmed: "Tak, wyjaśnione", open: "Jeszcze nie" },
      },
      occupancy: {
        Label: "Kto zajmuje nieruchomość?",
        Hint: "Na podstawie operatu, informacji od sąsiadów lub wierzyciela — na ile jest to znane.",
        Options: { vacant: "Wolna", owner: "Właściciel", tenant: "Najemca", unknown: "Nie wiem" },
      },
      costBasis: {
        Label: "Na czym opierają się Twoje koszty remontu i opróżnienia?",
        Hint: "Istotne tylko wtedy, gdy wpisano koszty.",
        Options: { quote: "Kosztorys / fachowiec", estimate: "Własne oszacowanie" },
      },
    },
    Rights: {
      DE: { Label: "Czy pytałeś sąd o prawa pozostające?", Hint: "Referendarz sądowy (Rechtspfleger) może przed terminem podać minimalną ofertę i ewentualne prawa pozostające po zapytaniu." },
      TR: { Label: "Czy sprawdziłeś Tapu i Satış şartnamesi pod kątem obciążeń?", Hint: "Wzmianki (şerhler), użytkowanie (intifa) i prawo zamieszkania (sükna hakkı) są wymienione w wypisie z Tapu i Satış şartnamesi w e-Satış." },
    },
    Unanswered: "otwarte",
    Reset: "Wyczyść odpowiedzi",
    StorageHint: "Twoje odpowiedzi są zapisywane wyłącznie w tej przeglądarce.",
  },

  Stress: {
    Title: "Test warunków skrajnych",
    Lead: "Przykładowe wyliczenie, a nie prognoza: jaki byłby Twój limit licytacji, gdyby remont i opróżnienie okazały się droższe niż założono?",
    Row: "+{pct}% kosztów: {limit}",
    Unreachable: "żadna oferta się nie opłaca",
    BelowThreshold: "poniżej progu ustawowego",
    NoLimit: "nie można obliczyć",
  },

  Unknowables: {
    Title: "Czego belowmark nie może wiedzieć",
    Items: [
      "Aktualnego stanu wnętrza — zdjęcia i operaty pokazują tylko to, co biegły mógł zobaczyć.",
      "Rzeczywistych kosztów remontu — wymaga to oględzin wykwalifikowanego fachowca na miejscu.",
      "Czy lokatorzy wyprowadzą się dobrowolnie oraz ile potrwa ewentualna eksmisja.",
      "Ile innych osób stanie do licytacji na terminie i jak wysoko będą licytować.",
      "Czy termin nie zostanie odwołany w ostatniej chwili — sprawdź ponownie dzień wcześniej.",
    ],
  },

  File: {
    Title: "Werdykt",
  },
};
