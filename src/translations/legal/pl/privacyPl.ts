import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const PRIVACY_PL: LegalDocument = {
  title: "Polityka prywatności",
  asOf: "Stan na 31 października 2026",
  basis: "Informacje zgodnie z art. 13 i 14 ogólnego rozporządzenia UE o ochronie danych (RODO / GDPR).",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Administrator danych",
      paragraphs: [
        `${operatorAddress()}. E-mail ${LEGAL_OPERATOR.email}, telefon ${LEGAL_OPERATOR.phone}. Nie wyznaczyliśmy inspektora ochrony danych, ponieważ nie istnieje ustawowy obowiązek jego powołania.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Korzystanie ze strony internetowej",
      paragraphs: [
        "Podczas wywoływania każdej strony serwer przetwarza dane technicznie niezbędne: adres IP, znacznik czasu, żądany adres URL, nagłówek User-Agent oraz kod statusu serwera. Podstawą prawną jest art. 6 ust. 1 lit. f RODO; nasz prawnie uzasadniony interes polega na bezpiecznym i bezawaryjnym działaniu serwisu.",
        `Sama aplikacja nie zapisuje logów dostępowych. Logi mogą powstawać u dostawcy hostingu: ${filled(LEGAL_OPERATOR.hosting, "Wstaw dostawcę hostingu, lokalizację serwera i okres przechowywania logów")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Konto i uwierzytelnianie",
      paragraphs: [
        "Dla konta przechowujemy: adres e-mail, kryptograficzny skrót hasła (scrypt, nigdy w postaci jawnej), wybrany rynek i język, datę weryfikacji adresu e-mail, datę zakończenia okresu próbnego, wykupiony plan i okres obowiązywania oraz znacznik czasu ostatniego logowania. Podstawą prawną jest art. 6 ust. 1 lit. b RODO (wykonanie umowy).",
        "Dla każdego logowania utrzymujemy sesję serwerową zawierającą skrót nagłówka User-Agent przeglądarki, skrócony adres IP oraz datę wygaśnięcia. Pozwala to wykryć skradzione pliki cookie sesji i wylogować wszystkie urządzenia. Podstawą prawną jest art. 6 ust. 1 lit. f RODO (bezpieczeństwo konta). Sesje wygasają automatycznie.",
        "Podczas rejestracji i logowania przeglądarka oblicza skrót sprzętowy (hardware fingerprint) na podstawie parametrów technicznych (karta graficzna, ekran, rdzenie CPU, strefa czasowa) i zapisuje go w lokalnej pamięci przeglądarki („ec_hw_id”). Służy on wyłącznie do rozpoznawania zablokowanych urządzeń i ochrony kont przed zautomatyzowanymi atakami (§ 25 ust. 2 pkt 2 TDDDG, art. 6 ust. 1 lit. f RODO).",
        "Nowe hasła sprawdzamy pod kątem znanych wycieków danych (Have I Been Pwned). Przesyłane jest wyłącznie pierwsze pięć znaków skrótu SHA-1, nigdy samo hasło (k-anonimowość). Podstawą prawną jest art. 6 ust. 1 lit. f RODO.",
        "Aby zapobiegać nadużyciom, zliczamy żądania na adres IP oraz adres e-mail w krótkich oknach czasowych (od minut do godzin).",
      ],
    },
    {
      id: "app",
      heading: "4. Treści tworzone na Twoim koncie",
      paragraphs: [
        "Zapisane listy obserwowanych wraz z notatkami oraz zapisane wyszukiwania (alerty) są przechowywane w naszej bazie danych. W przypadku alertów wysyłamy wiadomości e-mail tak długo, jak alert pozostaje aktywny. Wgrane pliki PDF z operatami szacunkowymi są analizowane; przechowujemy wyodrębniony wynik analizy (nazwę pliku, dopasowane cytaty z numerami stron), a nie sam plik PDF. Podstawą prawną jest art. 6 ust. 1 lit. b RODO.",
        "Jeśli włączona jest rozszerzona analiza operatu, tekst wgranego operatu przekazywany jest naszemu podmiotowi przetwarzającemu AI w celu ustrukturyzowanej ekstrakcji (na podstawie standardowych klauzul umownych UE zgodnie z art. 46 ust. 2 lit. c RODO).",
        "Listy kontrolne due diligence, dane kalkulatora limitu licytacji, osobiste notatki do werdyktu, wartości porównawcze oraz teczka bankowa są przechowywane wyłącznie w lokalnej pamięci Twojej przeglądarki („belowmark:…”). Dane te nigdy nie trafiają na nasz serwer.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Zamówienie i płatność",
      paragraphs: [
        "Podczas składania zamówienia zapisujemy dane zamówienia: plan, cenę, rynek, wersję regulaminu, znacznik czasu zgody na natychmiastowe rozpoczęcie świadczenia oraz status płatności. Podstawą prawną jest art. 6 ust. 1 lit. b RODO, a w zakresie ustawowych obowiązków przechowywania art. 6 ust. 1 lit. c RODO.",
        "Płatności są realizowane na stronie płatniczej Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Irlandia. Przekazujemy Stripe Twój adres e-mail i dane zamówienia; dane płatnicze wprowadzasz bezpośrednio w Stripe i nigdy do nas nie trafiają. Od Stripe otrzymujemy identyfikator klienta, status płatności oraz fakturę. Stripe przetwarza dane również jako odrębny administrator (np. w celu zapobiegania oszustwom i realizacji obowiązków ustawowych; zob. stripe.com/privacy). Przekazywanie danych do podmiotów powiązanych w USA odbywa się w oparciu o ramy ochrony danych UE-USA (Data Privacy Framework) oraz standardowe klauzule umowne UE.",
        "Strona płatności Stripe jest hostowana w domenie Stripe. Nie osadzamy skryptów zewnętrznych Stripe bezpośrednio na belowmark.com.",
        "Faktury i dokumenty księgowe są przechowywane przez okresy wymagane przepisami prawa handlowego i podatkowego (§ 147 AO, § 257 HGB).",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Oświadczenia o wypowiedzeniu i odstąpieniu",
      paragraphs: [
        "Oświadczenia złożone za pośrednictwem przycisków „Wypowiedz umowy tutaj” oraz „Odstąp od umowy” są zapisywane wraz z imieniem i nazwiskiem, adresem e-mail, oznaczeniem umowy, treścią oświadczenia oraz datą i godziną wpływu, a potwierdzenie wysyłamy e-mailem. Przechowujemy je przez trzy lata od końca roku kalendarzowego, w którym wpłynęły, w celu udokumentowania zgodności z przepisami (art. 6 ust. 1 lit. c i f RODO).",
      ],
    },
    {
      id: "mail",
      heading: "7. Wiadomości e-mail transakcyjne",
      paragraphs: [
        `Wysyłamy wyłącznie wiadomości e-mail niezbędne do realizacji umowy: linki weryfikacyjne, linki do resetowania hasła, potwierdzenia zamówień i wypowiedzeń oraz alerty wyraźnie utworzone przez Ciebie. Brak reklam, brak newsletterów, brak śledzenia otwarć czy kliknięć. Wysyłka odbywa się za pośrednictwem ${filled(LEGAL_OPERATOR.mailProvider, "Wstaw dostawcę SMTP")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Pliki cookie i pamięć lokalna",
      paragraphs: [
        "Nie używamy plików cookie analitycznych, reklamowych ani śledzących oraz nie osadzamy takich usług podmiotów trzecich. Dlatego baner zgody na pliki cookie nie jest wymagany.",
        "Plik cookie sesji („__Host-bm_session”): utrzymuje stan zalogowania; ściśle niezbędny do świadczenia żądanej usługi (§ 25 ust. 2 pkt 2 TDDDG). Wygasa po zamknięciu przeglądarki lub po 30 dniach, jeśli zaznaczono opcję „Pozostań zalogowany”.",
        "„BELOWMARK_COUNTRY” i „BELOWMARK_MARKET” (każdy na rok): zapamiętują wybrany kraj/język oraz rynek, aby język i ceny były dopasowane (§ 25 ust. 2 pkt 2 TDDDG).",
        "Czcionki internetowe są hostowane lokalnie na naszym serwerze, a nie ładowane z Google.",
      ],
    },
    {
      id: "karten",
      heading: "9. Mapy i zdjęcia lotnicze",
      paragraphs: [
        "Na stronach szczegółów nieruchomości Twoja przeglądarka pobiera kafelki map bezpośrednio z basemap.de (Federalny Urząd Kartografii i Geodezji, Niemcy) lub OpenStreetMap (OpenStreetMap Foundation, Wielka Brytania), a także zdjęcia lotnicze z Esri (server.arcgisonline.com, USA). Dostawcy ci otrzymują Twój adres IP oraz współrzędne żądanych kafelków. Podstawą prawną jest art. 6 ust. 1 lit. f RODO (wizualizacja lokalizacji nieruchomości).",
        "Linki do Google Maps, urzędowych portali sądowych i portali ogłoszeniowych otwierają strony zewnętrzne dopiero po ich kliknięciu; obowiązują tam polityki prywatności odpowiednich operatorów.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Okres przechowywania i usuwanie danych",
      paragraphs: [
        "Dane konta przechowujemy do momentu usunięcia konta przez Ciebie. Na koncie w sekcji „Twoje dane” możesz pobrać wszystkie przechowywane dane w formacie JSON oraz samodzielnie usunąć konto. Po usunięciu natychmiast usuwamy Twoje konto, sesje, listę obserwowanych, alerty i analizy operatów. Dane zamówień oraz ustawowe oświadczenia pozostają bez powiązania z kontem osobowym przez czas wymagany ustawowymi okresami przechowywania.",
        "Tokeny jednorazowe (weryfikacja e-mail, reset hasła) są usuwane po użyciu i wygasają odpowiednio po 24 godzinach lub 1 godzinie.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Twoje prawa",
      paragraphs: [
        "Przysługuje Ci prawo dostępu do danych (art. 15), ich sprostowania (art. 16), usunięcia (art. 17), ograniczenia przetwarzania (art. 18), przenoszenia danych (art. 20) oraz prawo sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie (art. 21 RODO). Skontaktuj się z nami pod powyższym adresem lub wykonaj eksport i usunięcie bezpośrednio na swoim koncie.",
        `Masz prawo wnieść skargę do organu nadzorczego ds. ochrony danych, w szczególności do organu właściwego dla nas: ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "Zautomatyzowane podejmowanie decyzji ani profilowanie w rozumieniu art. 22 RODO nie ma miejsca.",
      ],
    },
  ],
};
