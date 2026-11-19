import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export function vatSentencePl(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") {
    return "Wszystkie ceny są cenami końcowymi. Zgodnie z § 19 niemieckiej ustawy o podatku od wartości dodanej (UStG) podatek VAT nie jest naliczany.";
  }
  return "Wszystkie ceny są cenami końcowymi i zawierają obowiązujący ustawowy podatek od towarów i usług (VAT).";
}

export function termsPl(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Regulamin (OWH / AGB)",
    asOf: "Stan na 31 października 2026",
    basis: "Zasady korzystania z platformy Belowmark (belowmark.com).",
    sections: [
      {
        id: "geltung",
        heading: "1. Zakres stosowania i strony umowy",
        paragraphs: [
          `Niniejszy Regulamin ma zastosowanie do wszystkich umów o korzystanie z usługi online Belowmark zawieranych pomiędzy ${operatorAddress()} (dalej „Usługodawca”) a klientem.`,
          "Konsumentem jest każda osoba fizyczna, która dokonuje czynności prawnej w celach niezwiązanych przeważająco z jej działalnością gospodarczą lub samodzielną działalnością zawodową (§ 13 niemieckiego kodeksu cywilnego, BGB). Odmienne warunki klienta obowiązują wyłącznie za wyraźną zgodą Usługodawcy.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Przedmiot usługi",
        paragraphs: [
          "Belowmark gromadzi publicznie ogłoszone informacje o sądowych i publicznych licytacjach nieruchomości w Europie (Niemcy, Austria, Szwajcaria, Włochy, Hiszpania, Francja, Wielka Brytania) oraz Turcji, porządkuje je i oblicza kluczowe wskaźniki (takie jak ustawowe progi licytacyjne, rękojmie oraz koszty nabycia). Na czas trwania umowy klient otrzymuje osobisty dostęp do aplikacji internetowej dla rynku wybranego podczas rejestracji.",
          "Belowmark jest narzędziem badawczym i pomocniczym do analizy due diligence. Usługa nie stanowi porady prawnej, podatkowej, pośrednictwa w obrocie nieruchomościami ani doradztwa inwestycyjnego i nie zawiera rekomendacji złożenia konkretnej oferty. Każdą informację należy zweryfikować w oryginalnych urzędowych aktach sądowych lub licytacyjnych przed podjęciem decyzji finansowej.",
          "Dane pochodzą ze źródeł zewnętrznych (portali sądowych i urzędowych, dzienników urzędowych oraz portali ogłoszeniowych). Usługodawca nie gwarantuje poprawności, kompletności ani aktualności tych danych; ogłoszenia mogą być niepełne. Obliczone wartości są wynikami matematycznymi opartymi na tych danych i nie stanowią urzędowych wycen.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Plany i cennik",
        paragraphs: [
          "Free Scout: bezpłatny, bezterminowy z ograniczonym zakresem (lista nieruchomości widoczna, wartości oszacowania i terminy licytacji zablokowane). Dane płatnicze nie są pobierane.",
          "Okres próbny: po zweryfikowaniu adresu e-mail klient otrzymuje zakres dostępu Investor bezpłatnie przez 14 dni. Okres próbny kończy się automatycznie i nie przekształca się w płatną subskrypcję.",
          "Investor Miesięczny: pełny dostęp indywidualny za 39,00 € / 35 £ / 39 CHF (rynki europejskie) lub 599,00 TL (rynek turecki) miesięcznie, płatny z góry, z automatycznym comiesięcznym odnowieniem do czasu wypowiedzenia.",
          "Investor 3 Miesiące: pełny dostęp indywidualny na trzy miesiące kalendarzowe za jednorazową opłatą 99,00 € / 89 £ / 99 CHF (rynki europejskie) lub 1 490,00 TL (rynek turecki), płatny z góry. Nie odnawia się automatycznie; wypowiedzenie nie jest wymagane.",
          "Pro Miesięczny: pełny dostęp wraz z linkami dla klientów z własnym papierem firmowym oraz wspólnymi listami zespołowymi (do 3 zespołów po maksymalnie 5 miejsc) za 129,00 € / 115 £ / 129 CHF (rynki europejskie) lub 1 990,00 TL (rynek turecki) miesięcznie, płatny z góry, z automatycznym comiesięcznym odnowieniem.",
          "Pro 3 Miesiące: pełny dostęp Pro na trzy miesiące kalendarzowe za jednorazową opłatą 329,00 € / 295 £ / 329 CHF (rynki europejskie) lub 4 990,00 TL (rynek turecki), płatny z góry. Nie odnawia się automatycznie; wypowiedzenie nie jest wymagane. Rozszerzone limity zespołowe dla firm (od 299,00 € miesięcznie) są ustalane indywidualnie po wcześniejszym zapytaniu.",
          vatSentencePl(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Zawarcie umowy",
        paragraphs: [
          "Poprzez rejestrację i weryfikację adresu e-mail zostaje zawarta bezpłatna umowa o korzystanie (Free Scout z okresem próbnym).",
          "Płatny dostęp Investor lub Pro zamawiany jest na koncie za pośrednictwem strony podsumowania zamówienia, gdzie zestawiono plan, cenę, okres trwania i warunki odnowienia. Klikając przycisk „Zamów z obowiązkiem zapłaty”, klient składa wiążącą ofertę i zostaje przekierowany na stronę płatności dostawcy Stripe. Umowa zostaje zawarta z chwilą potwierdzenia płatności przez Stripe i aktywacji dostępu przez Usługodawcę; klient otrzymuje potwierdzenie e-mailem.",
          "Usługodawca zapisuje treść umowy (zamówienie, plan, cenę oraz aktualną wersję niniejszego Regulaminu) i przesyła ją klientowi e-mailem wraz z potwierdzeniem zamówienia. Aktualna wersja Regulaminu jest zawsze dostępna pod adresem belowmark.com/agb.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Płatności i faktury",
        paragraphs: [
          "Płatności obsługiwane są za pośrednictwem Stripe Payments Europe, Ltd. (Irlandia). Dane płatnicze wprowadzane są wyłącznie na stronie płatności Stripe i nigdy nie są przechowywane przez Usługodawcę.",
          "Subskrypcje miesięczne pobierane są z góry na początku każdego okresu rozliczeniowego. Faktury są dostępne na koncie w sekcji „Faktury i metody płatności” oraz wysyłane e-mailem.",
          "W przypadku nieudanego obciążenia Stripe ponawia próbę pobrania płatności. Jeśli płatność pozostanie nieuregulowana, pełny dostęp wygasa z końcem opłaconego okresu, natomiast bezpłatny dostęp do konta pozostaje zachowany.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Okres obowiązywania i wypowiedzenie",
        paragraphs: [
          "Miesięczne subskrypcje Investor i Pro zawierane są na czas nieokreślony i mogą zostać wypowiedziane w dowolnym momencie ze skutkiem na koniec już opłaconego miesiąca. Pełny dostęp pozostaje aktywny do tego dnia. Przy zwykłym wypowiedzeniu nie przysługuje proporcjonalny zwrot za bieżący miesiąc rozliczeniowy.",
          `Wypowiedzenia można dokonać przyciskiem „Wypowiedz umowy tutaj” w stopce każdej strony (dostępnym bez logowania), w ustawieniach konta, w portalu klienta Stripe lub w formie tekstowej na adres ${LEGAL_OPERATOR.email}. Po złożeniu wypowiedzenia za pomocą przycisku wypowiedzenia klient otrzymuje niezwłocznie potwierdzenie e-mailem zawierające treść, datę i godzinę wpływu oraz datę zakończenia umowy.`,
          "Pakiety trzymiesięczne wygasają automatycznie po upływie wykupionych miesięcy kalendarzowych. Bezpłatną umowę Free Scout można rozwiązać w dowolnym momencie poprzez usunięcie konta.",
          "Prawo obu stron do nadzwyczajnego wypowiedzenia z ważnej przyczyny pozostaje nienaruszone.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Prawo odstąpienia od umowy i jego wygaśnięcie dla treści cyfrowych (§ 356 ust. 5 BGB)",
        paragraphs: [
          "Belowmark jest produktem cyfrowym aktywowanym natychmiast po otrzymaniu płatności. Akceptując niniejszy Regulamin podczas procesu zamawiania, klient wyraża wyraźną zgodę na to, aby Usługodawca rozpoczął wykonanie umowy (udostępnienie i natychmiastową aktywację płatnego dostępu cyfrowego) przed upływem ustawowego terminu do odstąpienia od umowy, oraz potwierdza przyjęcie do wiadomości, że z chwilą aktywacji dostępu traci ustawowe prawo odstąpienia od umowy (zgodnie z § 356 ust. 5 niemieckiego kodeksu cywilnego, BGB).",
          "Pełne pouczenie o wygaśnięciu prawa odstąpienia zgodnie z § 356 ust. 5 BGB jest dostępne pod adresem belowmark.com/widerruf i przesyłane klientowi e-mailem wraz z potwierdzeniem zawarcia umowy.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Dostępność",
        paragraphs: [
          "Usługodawca dąży do ciągłej dostępności usługi, nie gwarantuje jednak określonego procentowego wskaźnika dostępności (uptime). Prace konserwacyjne, zakłócenia po stronie podmiotów trzecich lub awarie urzędowych portali źródłowych mogą czasowo ograniczać dostęp lub aktualność bazy danych.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Prawa do korzystania, zakaz scrapingu i blokada konta bez zwrotu środków",
        paragraphs: [
          "Klient otrzymuje niewyłączne, nieprzenoszalne prawo do korzystania z usługi w okresie trwania umowy wyłącznie na własne potrzeby badawcze za pośrednictwem standardowej przeglądarki internetowej. Bezwzględnie zabronione są: (a) udostępnianie danych logowania lub współdzielenie konta przez wiele osób poza wykupionymi miejscami zespołowymi, (b) wszelkie systematyczne, zautomatyzowane lub skryptowe odczytywanie, pobieranie, kopiowanie lub indeksowanie danych, tekstów, wskaźników lub dokumentów (w szczególności za pomocą botów, crawlerów, scraperów, przeglądarek headless lub skryptów), (c) obchodzenie technicznych zabezpieczeń, limitów zapytań lub mechanizmów ochronnych (w tym uruchamianie pułapek typu honeypot) oraz (d) masowe pobieranie, odsprzedaż, sublicencjonowanie lub publiczne udostępnianie opracowanych danych lub dokumentów.",
          "Każde naruszenie powyższych zakazów stanowi istotne naruszenie umowy i uprawnia Usługodawcę do natychmiastowego nadzwyczajnego wypowiedzenia umowy z ważnej przyczyny (§ 314 BGB) oraz do natychmiastowej, trwałej blokady konta użytkownika i identyfikatora urządzenia bez uprzedniego upomnienia.",
          "W przypadku takiej blokady konta lub nadzwyczajnego wypowiedzenia z winy klienta (w szczególności z powodu scrapingu, zautomatyzowanego pobierania danych lub obchodzenia zabezpieczeń) prawo do korzystania wygasa ze skutkiem natychmiastowym. Wszelkie roszczenia klienta o zwrot lub proporcjonalny zwrot opłat już uiszczonych za bieżący miesiąc rozliczeniowy lub wykupione wielomiesięczne pakiety są w takim przypadku wyłączone. Dalsze roszczenia odszkodowawcze i o zaniechanie po stronie Usługodawcy pozostają nienaruszone.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Odpowiedzialność",
        paragraphs: [
          "Usługodawca ponosi nieograniczoną odpowiedzialność w przypadku winy umyślnej i rażącego niedbalstwa, za szkody na życiu, ciele lub zdrowiu oraz na podstawie bezwzględnie obowiązujących przepisów o odpowiedzialności za produkt. W przypadku lekkiego niedbalstwa Usługodawca odpowiada wyłącznie za naruszenie istotnych obowiązków umownych (obowiązków, których spełnienie w ogóle umożliwia należyte wykonanie umowy i na których przestrzeganiu klient może regularnie polegać), z ograniczeniem do przewidywalnej szkody typowej dla tego rodzaju umowy.",
          "O ile nie zachodzi przypadek opisany w poprzednim akapicie, Usługodawca nie ponosi odpowiedzialności za decyzje finansowe podejmowane przez klienta, w szczególności za oferty składane na licytacjach oraz ich konsekwencje.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Zmiany Regulaminu i cen",
        paragraphs: [
          "Usługodawca informuje klienta w formie tekstowej o wszelkich zmianach niniejszego Regulaminu lub cen subskrypcji miesięcznych co najmniej na sześć tygodni przed ich wejściem w życie. Zmiany wchodzą w życie wyłącznie po wyrażeniu zgody przez klienta; w razie braku zgody każda ze stron może wypowiedzieć umowę ze skutkiem na dzień wejścia w życie zmian.",
        ],
      },
      {
        id: "recht",
        heading: "12. Prawo właściwe i właściwość sądu",
        paragraphs: [
          "Stosuje się prawo niemieckie z wyłączeniem Konwencji Narodów Zjednoczonych o umowach międzynarodowej sprzedaży towarów (CISG). Wobec konsumentów wybór prawa ma zastosowanie wyłącznie w takim zakresie, w jakim nie pozbawia konsumenta ochrony wynikającej z bezwzględnie obowiązujących przepisów prawa państwa, w którym konsument ma miejsce zwykłego pobytu.",
          `Jeśli klient jest przedsiębiorcą (Kaufmann), osobą prawną prawa publicznego lub wyodrębnionym majątkiem prawa publicznego, wyłącznym sądem właściwym jest sąd właściwy dla siedziby Usługodawcy (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
