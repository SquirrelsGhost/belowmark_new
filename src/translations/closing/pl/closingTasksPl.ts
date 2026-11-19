import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Teksty zadań w języku polskim dla obu rynków. Każde stwierdzenie ma źródło w closingTasks.ts. */
export const CLOSING_TASKS_PL: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Zabezpiecz postanowienie o przybiciu (Zuschlagsbeschluss)",
      detail:
        "Z chwilą udzielenia przybicia stajesz się właścicielem jeszcze przed wpisem do księgi wieczystej (§ 90 ZVG). Odbierz odpis postanowienia lub poproś o jego doręczenie i starannie go przechowuj: w przyszłości służy również jako tytuł wykonawczy do eksmisji. Opłatę sądową za przybicie sąd zafakturuje osobno (opłata 0,5 według KV 2214 GKG).",
    },
    "de.appeal": {
      title: "Poczekaj na prawomocność (Rechtskraft)",
      detail:
        "Od postanowienia o przybiciu przysługuje zażalenie natychmiastowe (sofortige Beschwerde). Dla osób obecnych na terminie licytacji lub ogłoszenia postanowienia termin zaczyna biec od ogłoszenia (§ 98 ZVG) i wynosi dwa tygodnie (§ 569 ZPO). Dla nieobecnych biegnie dopiero od doręczenia — prawomocność może więc nastąpić później. Do tego czasu nie zlecaj prac, których nie możesz odwołać.",
    },
    "de.risk": {
      title: "Traktuj nieruchomość jak swoją już od dziś",
      detail:
        "Z chwilą przybicia przechodzi na Ciebie ryzyko przypadkowej utraty rzeczy oraz pożytki i ciężary (§ 56 ZVG). Sprawdź, czy obiekt jest zabezpieczony (pustostan, mróz, dostęp) i udokumentuj jego stan zdjęciami z datą.",
    },
    "de.insurerNotice": {
      title: "Powiadom ubezpieczyciela budynku",
      detail:
        "Istniejąca polisa ubezpieczenia budynku przechodzi na Ciebie (§ 99 w zw. z § 95 VVG). Musisz niezwłocznie zawiadomić ubezpieczyciela o nabyciu, w przeciwnym razie może on zostać zwolniony z odpowiedzialności (§ 97 VVG). Zapytaj sąd egzekucyjny lub sprawdź w operacie nazwę ubezpieczyciela i numer polisy. Jeśli nie ma polisy, ubezpiecz budynek natychmiast we własnym zakresie.",
    },
    "de.insuranceCancel": {
      title: "Sprawdź przejętą polisę i ewentualnie ją wypowiedz",
      detail:
        "Przejętą polisę możesz wypowiedzieć ze skutkiem natychmiastowym albo na koniec bieżącego okresu ubezpieczenia, ale wyłącznie w ciągu miesiąca od nabycia — lub od powzięcia wiadomości o polisie, jeśli o niej nie wiedziałeś (§ 96 ust. 2 VVG). Wypowiedz ją dopiero wtedy, gdy masz zapewnioną ciągłość nowej ochrony.",
    },
    "de.charges": {
      title: "Przejmij bieżące opłaty i ciężary",
      detail:
        "Od dnia przybicia ponosisz wszystkie bieżące koszty (§ 56 ZVG): proporcjonalny podatek od nieruchomości, zaliczki na wspólnotę (Hausgeld) w przypadku lokali, prąd, wodę i ogrzewanie. Spisz stany liczników i powiadom dostawców mediów oraz — jeśli dotyczy — zarządcę wspólnoty (WEG-Verwaltung). Zaległości poprzedniego właściciela wobec wspólnoty zaspokajane są z ceny licytacji (kategoria 2, § 10 ust. 1 pkt 2 ZVG); zgodnie z orzeczeniem BGH (V ZR 209/12) przywilej ten nie tworzy odpowiedzialności rzeczowej nabywcy.",
    },
    "de.interest": {
      title: "Pamiętaj o odsetkach 4% od ceny gotówkowej (Bargebot)",
      detail:
        "Cena gotówkowa jest oprocentowana od dnia przybicia (§ 49 ust. 2 ZVG) według stopy 4% w skali roku (§ 246 BGB). Odsetki narastają do dnia zapłaty. Ustal z referendarzem sądowym (Rechtspfleger), czy wcześniejsze złożenie kwoty do depozytu sądowego (§ 49 ust. 4 ZVG) ma sens w Twojej sprawie.",
    },
    "de.summons": {
      title: "Wpisz termin podziału sumy (Verteilungstermin)",
      detail:
        "Po przybiciu sąd wyznacza termin podziału i wzywa Cię jako nabywcę; wezwanie musi zostać doręczone co najmniej dwa tygodnie wcześniej (§ 105 ZVG). Wpisz datę powyżej — lista kontrolna obliczy na jej podstawie terminy płatności i posiedzenia.",
    },
    "de.financing": {
      title: "Ustal wypłatę kredytu z bankiem",
      detail:
        "Zasada Belowmark: Twój bank powinien znać termin uruchomienia środków co najmniej dwa tygodnie przed terminem podziału. Przekaż sygnaturę akt, dane kasy sądu (Gerichtskasse) i tytuł przelewu z wezwania. Teczka bankowa zestawia te informacje dla banku.",
    },
    "de.pay": {
      title: "Przelej cenę gotówkową (Bargebot)",
      detail:
        "Cenę gotówkową należy uiścić przed terminem podziału przelewem do kasy sądu (Gerichtskasse); kwota musi wpłynąć przed terminem, a dowód wpłaty należy okazać na posiedzeniu (§ 49 ust. 1, 3 ZVG). Płatność gotówką jest niedopuszczalna. Ta lista planuje przelew z pięciodniowym wyprzedzeniem — to bufor bezpieczeństwa, a nie termin ustawowy.",
    },
    "de.attend": {
      title: "Termin podziału sumy (Verteilungstermin)",
      detail:
        "Zabierz potwierdzenie przelewu (§ 49 ust. 3 ZVG). Na posiedzeniu sporządzany i wykonywany jest plan podziału (Teilungsplan) — jest to warunek wpisania Cię do księgi wieczystej (§ 130 ZVG).",
    },
    "de.default": {
      title: "Poznaj konsekwencje braku zapłaty",
      detail:
        "Jeśli nie zapłacisz, plan podziału wykonuje się przez przeniesienie wierzytelności przeciwko Tobie na uprawnionych wierzycieli (§ 118 ZVG). Wierzyciele mogą wtedy natychmiast wszcząć ponowną licytację (Wiederversteigerung) przeciwko Tobie bez nowego tytułu wykonawczego (§ 133 ZVG). Pozostajesz właścicielem i dłużnikiem — odstąpienie nie jest możliwe.",
    },
    "de.taxNotice": {
      title: "Zapłać podatek od nabycia nieruchomości (Grunderwerbsteuer)",
      detail:
        "Sąd zawiadamia urząd skarbowy o przybiciu (§ 18 ust. 1 pkt 3 GrEStG). Podatek staje się wymagalny po upływie miesiąca od doręczenia decyzji podatkowej (§ 15 GrEStG). Wpisz powyżej datę doręczenia decyzji.",
    },
    "de.clearance": {
      title: "Zaświadczenie o braku zaległości (Unbedenklichkeitsbescheinigung)",
      detail:
        "Bez tego zaświadczenia nie zostaniesz wpisany do księgi wieczystej (§ 22 ust. 1 GrEStG). Urząd skarbowy wydaje je po zapłacie, zabezpieczeniu lub odroczeniu podatku (§ 22 ust. 2 GrEStG) i zazwyczaj przesyła bezpośrednio do sądu lub wydziału ksiąg wieczystych. Upomnij się, jeśli po zapłacie minie kilka tygodni.",
    },
    "de.courtFees": {
      title: "Opłać koszty sądowe i wieczystoksięgowe",
      detail:
        "Opłata za przybicie (0,5 opłaty według KV 2214 GKG, od najwyższej oferty plus prawa pozostające) oraz później opłata za wpis własności w księdze wieczystej (1,0 opłaty według KV 14110 GNotKG). Kalkulator limitu licytacji na karcie sprawy pokazuje te kwoty.",
    },
    "de.registry": {
      title: "Poczekaj na wniosek sądu do księgi wieczystej (Grundbuchersuchen)",
      detail:
        "Po wykonaniu planu podziału i uprawomocnieniu się przybicia sąd występuje do wydziału ksiąg wieczystych o wpisanie Cię jako właściciela oraz wykreślenie wygasłych praw i wzmianki o licytacji (§ 130 ust. 1 ZVG). Dług gruntowy (Grundschuld) dla Twojego banku może zostać wpisany dopiero później (§ 130 ust. 3 ZVG).",
    },
    "de.extract": {
      title: "Sprawdź odpis z księgi wieczystej",
      detail:
        "Po dokonaniu wpisu zamów odpis: czy widniejesz jako właściciel? Czy wykreślono wzmiankę o egzekucji i wygasłe obciążenia? Czy pozostały wyłącznie te prawa, które zgodnie z warunkami licytacji miały się utrzymać?",
    },
    "de.eviction": {
      title: "Eksmisja na podstawie postanowienia o przybiciu",
      detail:
        "Przeciwko osobie zajmującej nieruchomość bez utrzymującego się prawa — np. byłemu właścicielowi — samo postanowienie o przybiciu stanowi tytuł wykonawczy do eksmisji (§ 93 ust. 1 ZVG). Potrzebujesz odpisu z klauzulą wykonalności i dowodem doręczenia (§ 750 ZPO) oraz zlecenia dla komornika (§ 885 ZPO); ograniczone zlecenie eksmisji z § 885a ZPO pozwala obniżyć koszty. Nie dotyczy osób, których prawo przetrwało przybicie (§ 93 ust. 1 zd. 2 ZVG). Nie musisz zwracać nakładów poczynionych przed przybiciem (§ 93 ust. 2 ZVG).",
    },
    "de.tenantTakeover": {
      title: "Przejmij istniejące umowy najmu",
      detail:
        "Istniejące umowy najmu i dzierżawy przechodzą na Ciebie (§ 57 ZVG w zw. z § 566 BGB). Poinformuj najemców na piśmie o zmianie właściciela i nowym rachunku bankowym. Możesz odpowiadać za zwrot kaucji, nawet jeśli nie otrzymałeś jej od poprzedniego właściciela (§ 566a BGB) — zażądaj potwierdzenia wpłaty kaucji.",
    },
    "de.tenantNotice": {
      title: "Szczególne prawo wypowiedzenia: tylko na pierwszy możliwy termin",
      detail:
        "Możesz wypowiedzieć umowę z zachowaniem ustawowego okresu wypowiedzenia, ale wyłącznie na pierwszy dopuszczalny termin — w przeciwnym razie szczególne prawo wygasa (§ 57a ZVG). Przy najmie lokali mieszkalnych wypowiedzenie musi dotrzeć do najemcy najpóźniej trzeciego dnia roboczego miesiąca (§ 573c BGB). Ustawowa ochrona lokatorów nadal obowiązuje: wymagany jest uzasadniony interes, np. potrzeby własne (§ 573 BGB). Data wskazana tutaj jest liczona ostrożnie (soboty jako dni robocze, bez odliczania świąt) — skonsultuj treść wypowiedzenia z prawnikiem.",
    },
    "de.handover": {
      title: "Udokumentuj wydanie nieruchomości",
      detail:
        "Klucze, stany liczników, stan techniczny na zdjęciach, wady, pozostawione ruchomości — z datą i podpisami. Po objęciu posiadania wymień zamki.",
    },
    "de.inspect": {
      title: "Zbadaj stan techniczny i zaplanuj remont",
      detail:
        "Rękojmia za wady jest wyłączona (§ 56 ZVG). Porównaj rzeczywisty stan z operatem szacunkowym i zbierz oferty wykonawców przed zleceniem prac. W kalkulatorze limitu licytacji możesz potem zastąpić szacunki realnymi wycenami.",
    },
    "de.energy": {
      title: "Obowiązkowa termomodernizacja po zmianie właściciela",
      detail:
        "W przypadku domów jedno- i dwurodzinnych zamieszkiwanych przez poprzedniego właściciela w dniu 01.02.2002 r. określone obowiązki modernizacyjne (np. ocieplenie stropu najwyższej kondygnacji) przechodzą na nowego właściciela z dwuletnim terminem od nabycia (dawniej § 47 GEG). W 2026 r. ustawę GEG zastąpiła ustawa o modernizacji budynków (Gebäudemodernisierungsgesetz) — zweryfikuj aktualne wymogi z audytorem energetycznym.",
    },
    "de.permits": {
      title: "Wyjaśnij pozwolenia przed pracami budowlanymi",
      detail:
        "To, czy przebudowa, zmiana sposobu użytkowania lub prace przy obiekcie zabytkowym wymagają pozwolenia, reguluje prawo landowe (prawo budowlane, ochrona zabytków). Skonsultuj się z lokalnym urzędem budowlanym przed rozpoczęciem robót.",
    },
    "de.condo": {
      title: "Zażądaj dokumentów wspólnoty mieszkaniowej (WEG)",
      detail:
        "W przypadku mieszkania: zgłoś zarządcy zmianę właściciela i poproś o plan gospodarczy (Wirtschaftsplan), ostatnie rozliczenie roczne, zbiór uchwał oraz akt podziału (Teilungserklärung). Zwróć uwagę na uchwalone dopłaty specjalne (Sonderumlagen).",
    },
  },
  TR: {
    "tr.pay": {
      title: "Zapłać cenę nabycia (ihale bedeli) — 7 dni",
      detail:
        "Cenę nabycia i opłaty należy wpłacić w ciągu siedmiu dni od publikacji protokołu wyniku licytacji (artırma sonuç tutanağı), nawet jeśli złożono wniosek o unieważnienie licytacji (Elektronik Satış Yönetmeliği art. 20/1; İİK art. 130). Od wejścia w życie ustawy nr 7343 nie obowiązuje już 10-dniowe przedłużenie. Wpisz powyżej datę publikacji protokołu.",
    },
    "tr.fees": {
      title: "Przygotuj podatki i opłaty zgodnie z Şartname",
      detail:
        "Opłata wieczystoksięgowa (tapu harcı) wynosi 20‰ ceny sprzedaży od każdej ze stron (ustawa o opłatach nr 492 Harçlar Kanunu, taryfa 4 art. 20/a). Jeśli warunki licytacji (Şartname) obciążają kupującego całością opłaty tapu, Ministerstwo Sprawiedliwości uznaje to za dopuszczalne (İİDB, 12.01.2023) — oznacza to 40‰. Do tego dochodzi VAT (KDV) według obwieszczenia oraz opłata skarbowa (damga vergisi). Zapoznaj się z Şartname swojego postępowania.",
    },
    "tr.default": {
      title: "Poznaj konsekwencje braku zapłaty",
      detail:
        "W razie braku terminowej wpłaty urząd egzekucyjny uchyla przybicie (ihale), a Ty odpowiadasz za ewentualną różnicę w cenie (İİK art. 133). Dla licytacji ogłoszonych od 31.07.2026 r. obowiązuje dodatkowo kara w wysokości 5% wylicytowanej kwoty (İİK art. 114 w brzmieniu ustawy nr 7589).",
    },
    "tr.annulment": {
      title: "Odczekaj termin na zaskarżenie licytacji (ihalenin feshi)",
      detail:
        "Zainteresowani mogą żądać unieważnienia licytacji w ciągu siedmiu dni (ihalenin feshi, İİK art. 134), a w szczególnych przypadkach od powzięcia wiadomości, maksymalnie do roku. W trakcie trwania tego postępowania wpis własności nie jest możliwy. Do tego czasu nie zlecaj prac, których nie możesz odwołać.",
    },
    "tr.registry": {
      title: "Śledź wpis w księdze wieczystej (tescil)",
      detail:
        "Po uprawomocnieniu się przybicia (kesinleşme) i uiszczeniu ceny urząd egzekucyjny wysyła do urzędu Tapu urzędowe zlecenie wpisu własności (tescil müzekkeresi, İİK art. 134). Sprawdź, czy pismo zostało już wysłane.",
    },
    "tr.deed": {
      title: "Zweryfikuj wpis w Tapu",
      detail:
        "Po dokonaniu wpisu sprawdź w e-Devlet (Tapu Bilgileri), czy widniejesz jako właściciel oraz czy wykreślono zajęcia (haciz) i hipoteki (ipotek).",
    },
    "tr.dask": {
      title: "Wykup nową polisę od trzęsień ziemi DASK",
      detail:
        "Obowiązkowe ubezpieczenie od trzęsień ziemi jest wymagane ustawowo (ustawa nr 6305). Od 05.09.2026 r. polisa poprzedniego właściciela nie przechodzi już na nabywcę i wygasa z chwilą wpisu (Ogólne Warunki DASK, Dziennik Urzędowy 21.08.2026/33347). Wykup własną polisę; dostawcy mediów często wymagają jej przy przepisywaniu umów. Zapytaj w urzędzie Tapu, czy weryfikują ją przy wpisie po licytacji.",
    },
    "tr.propertyTax": {
      title: "Ureguluj zgłoszenie podatku od nieruchomości (emlak vergisi)",
      detail:
        "Przeniesienie własności wiąże się z obowiązkiem zgłoszenia w gminie (ustawa nr 1319 art. 23); Twój obowiązek podatkowy zaczyna się od następnego roku kalendarzowego (art. 33). Zapytaj w gminie, czy powiadomienie z urzędu Tapu wystarczy, i poproś o zestawienie ewentualnych zaległości podatkowych na nieruchomości.",
    },
    "tr.eviction": {
      title: "Eksmisja przez urząd egzekucyjny",
      detail:
        "Jeśli w lokalu mieszka dłużnik lub osoba bez tytułu prawnego, urząd egzekucyjny na Twój wniosek doręcza 15-dniowe wezwanie do opróżnienia lokalu, a następnie przeprowadza przymusową eksmisję (İİK art. 135/2). Najemcy z umową o dacie pewnej sprzed zajęcia podlegają ochronie (zob. Najemcy). Nie zwlekaj ze złożeniem wniosku.",
    },
    "tr.tenant": {
      title: "Najemcy: umowa najmu przechodzi na Ciebie",
      detail:
        "Nowy właściciel wstępuje w stosunek najmu (TBK art. 310). Jeśli chcesz wypowiedzieć umowę na potrzeby własne, musisz powiadomić najemcę na piśmie w ciągu miesiąca od nabycia, a pozew o eksmisję możesz złożyć najwcześniej po sześciu miesiącach (TBK art. 351). Ustal z prawnikiem, która data liczy się jako data nabycia przy licytacji — ta lista liczy termin ostrożnie od dnia licytacji.",
    },
    "tr.handover": {
      title: "Udokumentuj wydanie nieruchomości",
      detail:
        "Klucze, stany liczników, stan techniczny na zdjęciach z datą. Przepisz umowy na prąd, wodę i gaz (abonelik) na siebie i wymień zamki.",
    },
    "tr.inspect": {
      title: "Zbadaj stan techniczny i zaplanuj remont",
      detail:
        "Porównaj rzeczywisty stan z operatem szacunkowym (kıymet takdir raporu) i zbierz oferty wykonawców przed zleceniem robót.",
    },
    "tr.permits": {
      title: "Pozwolenia na przebudowę",
      detail:
        "Przebudowa może wymagać pozwolenia na budowę (yapı ruhsatı, ustawa nr 3194 İmar Kanunu art. 21). Skonsultuj się z gminą przed rozpoczęciem prac.",
    },
    "tr.condo": {
      title: "Powiadom zarządcę budynku",
      detail:
        "W przypadku mieszkania: powiadom zarząd budynku (yönetim) oraz poproś o wysokość miesięcznego czynszu administracyjnego (aidat) i regulamin zarządzania (yönetim planı, ustawa nr 634 Kat Mülkiyeti Kanunu).",
    },
  },
};
