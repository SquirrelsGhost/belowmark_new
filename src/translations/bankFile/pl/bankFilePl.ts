import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_PL: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Teczka bankowa — Belowmark",
      description: "Wniosek o finansowanie nieruchomości z licytacji komorniczej: kwota, wkład własny, ustawowy harmonogram płatności po przybiciu i rękojmia — każda liczba poparta źródłem.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Teczka bankowa", "Finansowanie", "Licytacja komornicza"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Finansowanie",
    Title: "Teczka bankowa",
    Lead: {
      DE: "Na terminie licytacji potrzebujesz rękojmi, a do terminu podziału sumy uzyskanej z egzekucji — reszty ceny. Ta teczka przedstawia bankowi wszystko w jednym miejscu: kwotę, wkład własny, ustawowy harmonogram płatności oraz to, co bank musi przygotować na poczet rękojmi. Nie zastępuje promesy kredytowej — ją może wydać wyłącznie bank.",
      TR: "Wadium (teminat) wpłacasz przed licytacją, a pozostałą kwotę w ciągu 7 dni od publikacji protokołu licytacji. Ta teczka przedstawia bankowi wszystko w jednym miejscu: kwotę, wkład własny i ustawowy harmonogram płatności. Nie zastępuje promesy kredytowej — ją może wydać wyłącznie bank.",
    },
    Button: "Otwórz teczkę bankową",
    ButtonHint: "Otwiera teczkę w nowej karcie. Wpisz planowaną cenę maksymalną, wkład własny i formę rękojmi, a następnie zapisz dokument jako PDF.",
  },

  File: {
    Kicker: "Wniosek o finansowanie · Licytacja komornicza",
    Title: "Teczka bankowa",
    PrintedAt: "Utworzono {date}",
    DataAsOf: "Dane obwieszczenia z dnia {date}",
    Print: "Drukuj / zapisz jako PDF",
    PrintHint: "W oknie drukowania wybierz „Zapisz jako PDF”.",
    Back: "Powrót do akt sprawy",
    Locked: "Teczka bankowa jest dostępna w planie Investor",
    NoValue: "nie podano",
    Sections: {
      ask: "Zapytanie do banku",
      request: "Zapotrzebowanie na finansowanie",
      schedule: "Harmonogram płatności od terminu licytacji",
      deposit: "Rękojmia — co musi przygotować bank",
      collateral: "Zabezpieczenie dla banku — kiedy powstaje",
      object: "Nieruchomość i wartość oszacowania",
      risks: "Prawa i ryzyka",
      limit: "Wyliczenie maksymalnej ceny licytacji",
      documents: "Dokumenty dla banku",
      notThis: "Czym ta teczka nie jest",
      sources: "Źródła",
    },
  },

  Form: {
    Title: "Twoje dane do teczki",
    Lead: "Wszystkie pola są początkowo puste. Wkład własny, oprocentowanie i spłata kapitału są współdzielone z kalkulatorem limitu licytacji — zmiana tutaj aktualizuje również kalkulator.",
    StorageHint: "Zapisywane wyłącznie w tej przeglądarce. Same pola formularza nie są drukowane — drukowane jest tylko wynikowe podsumowanie.",
    Fields: {
      plannedBid: { label: "Planowana maksymalna oferta", hint: "Pozostaw puste, aby przejąć obliczony limit licytacji." },
      equity: { label: "Wkład własny", hint: "Środki, które wnosisz samodzielnie, łącznie z rękojmią." },
      interestPct: { label: "Założone oprocentowanie", hint: "Twoje założenie. Rzeczywistą stawkę określi bank." },
      repaymentPct: { label: "Początkowa spłata kapitału", hint: "Rocznie, jako procent kwoty kredytu." },
      fixedYears: { label: "Oczekiwany okres stałej stopy", hint: "" },
    },
    Applicant: { label: "Wnioskodawca (opcjonalnie)", hint: "Pojawia się we wniosku. Pozostaje w tej przeglądarce.", placeholder: "Imię i nazwisko" },
    Method: { label: "Forma rękojmi", empty: "nie wybrano" },
    Methods: {
      cheque: "Czek Bundesbanku / potwierdzony czek bankowy",
      guarantee: "Gwarancja bankowa",
      transfer: "Przelew na rachunek kasy sądu",
      portal: "Portal e-Satış",
    },
    Use: { label: "Planowane przeznaczenie", empty: "nie wybrano" },
    Uses: { own: "Na własne potrzeby", rent: "Wynajem", resale: "Odsprzedaż" },
    YearsSuffix: "lat",
    Reset: "Wyczyść dane teczki",
  },

  Ask: {
    Salutation: "Szanowni Państwo,",
    Intro: "Zamierzam przystąpić do licytacji nieruchomości {object} w postępowaniu egzekucyjnym o sygnaturze {fileNo} przed sądem {court}. Termin licytacji: {date}. Wartość oszacowania według urzędowego obwieszczenia: {value}.",
    Applicant: "Wnioskodawca: {name}",
    NoApplicant: "Wnioskodawca: ______________________",
    Requests: {
      loan: "Finansowanie w kwocie {amount} — całkowite koszty inwestycji {total} pomniejszone o wkład własny {equity} (zestawienie w sekcji 02).",
      guarantee: "Bezterminową, bezwarunkową i płatną na pierwsze żądanie gwarancję bankową na kwotę {amount} tytułem rękojmi na termin licytacji (§ 69 ust. 3 ZVG).",
      cheque: "Czek Bundesbanku lub potwierdzony czek bankowy na kwotę {amount}, wystawiony najwcześniej na trzeci dzień roboczy przed terminem licytacji (§ 69 ust. 2 ZVG).",
      transfer: "Przelew kwoty {amount} na rachunek kasy sądu zaksięgowany przed terminem licytacji wraz z potwierdzeniem wpływu środków (§ 69 ust. 4 ZVG).",
      portal: "Złożenie wadium (teminat) w kwocie {amount} przed licytacją w portalu e-Satış.",
      timing: "Pisemne potwierdzenie finansowania przed terminem licytacji, ponieważ płatności po udzieleniu przybicia są ściśle związane ustawowymi terminami wskazanymi w sekcji 03.",
    },
    MissingBid: "Brak maksymalnej oferty — wpisz ją powyżej lub oblicz swój limit licytacji.",
    MissingEquity: "Brak kwoty wkładu własnego — bez tej wartości nie można określić wymaganego kredytu.",
    MissingMethod: "Forma złożenia rękojmi nie została jeszcze wybrana.",
    Closing: "Chętnie odpowiem na wszelkie pytania i przekażę pełny operat szacunkowy.",
  },

  Request: {
    UsesTitle: "Przeznaczenie środków",
    SourcesTitle: "Źródła finansowania",
    Bid: "Maksymalna oferta",
    BidFromLimit: "z Twojego limitu licytacji",
    BidOwn: "Twój wpis",
    Total: "Całkowite koszty",
    Equity: "Wkład własny",
    Loan: "Zapotrzebowanie na kredyt",
    LoanToValue: "Relacja kredytu do wartości oszacowania (LTV)",
    LoanToValueNote: "Wartość oszacowania według sądu — bank ustala własną wartość bankowo-hipoteczną.",
    EquityShare: "Udział wkładu własnego",
    TermsTitle: "Oczekiwane parametry",
    Interest: "Założone oprocentowanie",
    InterestNote: "Twoje założenie, nie jest ofertą",
    Repayment: "Początkowa spłata kapitału",
    MonthlyRate: "Miesięczna rata przy założonym oprocentowaniu",
    FixedYears: "Okres stałego oprocentowania",
    Use: "Planowane przeznaczenie",
    Incomplete: "Brakuje ustawowej pozycji kosztowej (np. stawki podatku w obwieszczeniu) — całkowite koszty są zaniżone.",
    EquityShortForDeposit: "Twój wkład własny nie pokrywa kwoty rękojmi. Bank musi ją prefinansować lub wystawić gwarancję bankową.",
    Guarantee: "Dodatkowo: gwarancja bankowa na poczet rękojmi",
    GuaranteeBasis: "§ 69 ust. 3 ZVG",
  },

  Schedule: {
    Columns: { when: "Kiedy", what: "Co", amount: "Kwota" },
    Steps: {
      DE: {
        deposit: { when: "Na terminie licytacji, bezpośrednio po złożeniu oferty", text: "Rękojmia: jedna dziesiąta wartości oszacowania na żądanie uczestnika postępowania. Należy założyć, że będzie wymagana.", basis: "§§ 67, 68 ust. 1 ZVG", law: "zvg68" },
        balance: { when: "Przed terminem podziału (wyznaczanym przez sąd po przybiciu)", text: "Cena gotówkowa (Bargebot) płatna na rachunek kasy sądu — środki muszą wpłynąć przed terminem, a potwierdzenie należy okazać na posiedzeniu. Rękojmia wpłacona przelewem do kasy sądu podlega zaliczeniu.", basis: "§ 49 ust. 3, § 107 ust. 3 ZVG", law: "zvg49" },
        bidInterest: { when: "Wraz z ceną gotówkową", text: "Odsetki 4% w skali roku od ceny gotówkowej od dnia przybicia do terminu podziału.", basis: "§ 49 ust. 2 ZVG w zw. z § 246 BGB", law: "zvg49" },
        transferTax: { when: "Miesiąc po doręczeniu decyzji podatkowej", text: "Podatek od nabycia nieruchomości (Grunderwerbsteuer) od wylicytowanej ceny oraz ewentualnych praw pozostających na nieruchomości.", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Po wystawieniu rachunku kosztów sądowych", text: "Opłata sądowa za udzielenie przybicia.", basis: "KV 2214 GKG" },
        registryFee: { when: "Po dokonaniu wpisu", text: "Wpis prawa własności w księdze wieczystej.", basis: "KV 14110 GNotKG" },
        own: { when: "Zgodnie z Twoim planem", text: "Remont, opróżnienie lokalu i pozostałe koszty.", basis: "Twój wpis" },
      },
      TR: {
        deposit: { when: "Przed licytacją", text: "Wadium (teminat) w portalu e-Satış.", basis: "İİK art. 114/7", law: "esatis" },
        balance: { when: "W ciągu 7 dni od publikacji protokołu licytacji", text: "Pozostała cena nabycia (oferta minus teminat), gotówką/przelewem. Brak możliwości przedłużenia terminu.", basis: "İİK art. 130", law: "iik" },
        fees: { when: "Na wezwanie urzędu egzekucyjnego, przed wpisem", text: "Podatek VAT (KDV), opłata wieczystoksięgowa (Tapu), opłata skarbowa, opłata funduszu obrotowego (döner sermaye).", basis: "Warunki sprzedaży (şartname)" },
        own: { when: "Zgodnie z Twoim planem", text: "Remont, opróżnienie lokalu i pozostałe koszty.", basis: "Twój wpis" },
      },
    },
    BalanceGuaranteeNote: "Przy gwarancji bankowej nic nie podlega zaliczeniu — należy wpłacić pełną cenę gotówkową.",
    BalanceOpenNote: "Forma rękojmi nie została wybrana — wyliczono bez zaliczenia.",
    MissingInterestDays: "Wpisz liczbę dni do terminu podziału w kalkulatorze limitu licytacji",
    Unknown: "nie można obliczyć",
    Footnote: {
      DE: "Terminy po przybiciu wyznacza sąd oraz urząd skarbowy. Dlatego niniejsza teczka przedstawia kolejność ustawową zamiast szacowanej daty.",
      TR: "Termin 7 dni biegnie od dnia publikacji protokołu w portalu, a nie od dnia samej licytacji.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Wysokość: jedna dziesiąta wartości oszacowania (§ 68 ust. 1 ZVG). Gotówka jest wykluczona (§ 69 ust. 1 ZVG). Dopuszczalne są wyłącznie następujące trzy formy:",
      TR: "Wadium (teminat) składa się w portalu e-Satış przed rozpoczęciem licytacji. Akceptowane formy określa regulamin sprzedaży (şartname) w obwieszczeniu.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Czek Bundesbanku lub potwierdzony czek bankowy", text: "Wystawiony przez instytucję kredytową uprawnioną do działalności w Niemczech lub przez Bundesbank, płatny w kraju, najwcześniej na trzeci dzień roboczy przed terminem licytacji. Czek wystawiony wcześniej zostanie odrzucony.", basis: "§ 69 ust. 2 ZVG", law: "zvg69" },
        { id: "guarantee", title: "Gwarancja bankowa", text: "Bezterminowa, bezwarunkowa i płatna na pierwsze żądanie, wystawiona przez taką instytucję kredytową, wykonalna w kraju. Bank może pobrać prowizję za gwarancję (Avalprovision).", basis: "§ 69 ust. 3 ZVG", law: "zvg69" },
        { id: "transfer", title: "Przelew na rachunek kasy sądu", text: "Kwota musi zostać zaksięgowana na rachunku kasy sądu przed terminem licytacji, a potwierdzenie należy przedłożyć na posiedzeniu. Numer rachunku i tytuł przelewu wskazuje sąd.", basis: "§ 69 ust. 4 ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "Wadium (teminat) w portalu e-Satış", text: "Składane w portalu przed licytacją po zalogowaniu przez e-Devlet. Zaliczane na poczet ceny; przepada, jeśli nabywca nie zapłaci po przybiciu.", basis: "İİK art. 114/7, art. 130", law: "esatis" }],
    },
    Chosen: "wybrano",
  },

  Collateral: {
    Lead: {
      DE: "Banki podchodzą ostrożnie do licytacji komorniczych głównie z jednego powodu: wypłacają środki, zanim ich dług gruntowy (Grundschuld) zostanie wpisany do księgi wieczystej. Oto ustawowa kolejność zdarzeń:",
      TR: "Banki podchodzą ostrożnie do licytacji İcra głównie z jednego powodu: środki muszą zostać wpłacone w ciągu 7 dni, podczas gdy hipotekę (ipotek) wpisuje się dopiero po przeniesieniu własności. Oto ustawowa kolejność zdarzeń:",
    },
    Items: {
      DE: [
        { text: "Z chwilą udzielenia przybicia stajesz się prawnym właścicielem — bez aktu notarialnego i jeszcze przed wpisem do księgi wieczystej.", basis: "§ 90 ust. 1 ZVG" },
        { text: "Po przybiciu możesz ustanowić dług gruntowy (Grundschuld) na rzecz banku. Zostanie on jednak wpisany dopiero wtedy, gdy sąd zwróci się do wydziału ksiąg wieczystych o wpisanie Cię jako właściciela.", basis: "§ 130 ust. 3 ZVG", law: "zvg130" },
        { text: "Sąd kieruje taki wniosek dopiero po wykonaniu planu podziału i uprawomocnieniu się postanowienia o przybiciu — czyli po terminie podziału.", basis: "§ 130 ust. 1 ZVG", law: "zvg130" },
        { text: "Do wpisu własności sąd wieczystoksięgowy wymaga zaświadczenia urzędu skarbowego o braku zaległości (Unbedenklichkeitsbescheinigung), które co do zasady wymaga uprzedniej zapłaty podatku od nabycia nieruchomości.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "Jeśli nie zapłacisz ceny gotówkowej, sąd przenosi wierzytelność na wierzycieli, zabezpiecza ją hipotekami przymusowymi na Twojej nieruchomości, a nieruchomości grozi ponowna licytacja.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "Sposób zabezpieczenia okresu przejściowego do czasu wpisu — np. notarialne ustanowienie długu gruntowego niezwłocznie po przybiciu i bezpośrednia wypłata do kasy sądu — zależy wyłącznie od decyzji banku.", basis: "Decyzja banku" },
      ],
      TR: [
        { text: "Wadium (teminat) wpłaca się w portalu przed licytacją i zalicza na poczet ceny nabycia.", basis: "İİK art. 114/7", law: "iik" },
        { text: "Pozostałą kwotę wpłacasz w ciągu 7 dni od publikacji protokołu w portalu. Możliwość przedłużenia terminu została zniesiona reformą z 2021 r.", basis: "İİK art. 130 (ustawa nr 7343)", law: "iik" },
        { text: "Wpis własności (tescil) następuje dopiero po uprawomocnieniu się przybicia. Dopiero wtedy można wpisać hipotekę (ipotek) na rzecz banku.", basis: "İİK art. 134", law: "iik" },
        { text: "W razie braku zapłaty wadium przepada. Dla licytacji ogłoszonych od 31 lipca 2026 r. ustawa nakłada dodatkowo karę w wysokości 5% wylicytowanej ceny.", basis: "İİK art. 114 ust. 7 pkt 9 (ustawa nr 7589)", law: "iik" },
        { text: "Konsekwencja: bez wstępnej decyzji kredytowej (ön onay) przed licytacją dotrzymanie 7-dniowego terminu z finansowaniem bankowym jest niemal niemożliwe.", basis: "Terminy İİK art. 130, art. 134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Kluczowe dane z operatu szacunkowego",
    NoReport: "Nie wgrano operatu szacunkowego. Wgraj go na karcie sprawy — bank i tak będzie wymagał pełnego operatu.",
    ReportFrom: "z pliku „{file}”, dosłownie z numerem strony",
    RisksLead: "Sygnalizacja ryzyk na podstawie urzędowego obwieszczenia i operatu szacunkowego. Kolor szary oznacza brak wzmianki w źródłach.",
    RiskFrom: { notice: "Obwieszczenie urzędowe", report: "Operat str. {pages}", none: "brak źródła" },
  },

  Documents: {
    Lead: "Dokumenty, o które banki zazwyczaj proszą. Każdy bank ma własną listę wymogów — zapytaj swojego doradcę.",
    Groups: {
      DE: [
        { title: "Dotyczące nieruchomości", items: ["Pełny operat szacunkowy wartości rynkowej (z sądu lub zvg-portal.de)", "Postanowienie o wyznaczeniu terminu / obwieszczenie urzędowe", "Odpis z księgi wieczystej (zwykle załączony do operatu)", "Mapa ewidencyjna i zestawienie powierzchni użytkowej", "Umowy najmu, jeśli nieruchomość jest wynajmowana", "Kosztorys remontu, jeśli jest planowany"] },
        { title: "Dotyczące wnioskodawcy", items: ["Ważny dowód osobisty lub paszport", "Zaświadczenia o dochodach za ostatnie miesiące", "Decyzje podatkowe (PIT / Steuerbescheid)", "Potwierdzenie wkładu własnego", "Oświadczenie majątkowe dla banku", "Zestawienie posiadanych zobowiązań kredytowych"] },
      ],
      TR: [
        { title: "Dotyczące nieruchomości", items: ["Obwieszczenie o licytacji i warunki sprzedaży (şartname)", "Operat szacunkowy (kıymet takdir raporu)", "Wypis z Tapu i dane działki (ada / parsel)", "Zdjęcia i plan sytuacyjny, jeśli dostępne"] },
        { title: "Dotyczące wnioskodawcy", items: ["Dowód tożsamości (Kimlik) / paszport", "Zaświadczenie o dochodach", "Numer podatkowy", "Potwierdzenie wkładu własnego"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Nie jest promesą kredytową ani ofertą finansowania. O udzieleniu kredytu i jego warunkach decyduje wyłącznie bank.", basis: "—" },
      { text: "Nie stanowi pośrednictwa kredytowego. Belowmark nie pośredniczy w udzielaniu kredytów ani nie kontaktuje się z bankami w Twoim imieniu.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Nie określa bankowo-hipotecznej wartości nieruchomości. Wartość oszacowania pochodzi z operatu sądowego; bank dokonuje własnej wyceny.", basis: "BelWertV" },
      { text: "Nie stanowi porady prawnej. Przepisy ustawowe podano wyłącznie w celach informacyjnych.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Obwieszczenie urzędowe",
    document: "Obwieszczenie urzędowe (PDF)",
    zvg: "Ustawa o licytacji przymusowej i zarządzie przymusowym (ZVG)",
    grestg: "Ustawa o podatku od nabycia nieruchomości (GrEStG)",
    gewo: "Ordynacja przemysłowa § 34i (GewO)",
    iik: "Prawo egzekucyjne i upadłościowe (İİK)",
    esatis: "UYAP e-Satış",
  },
};
