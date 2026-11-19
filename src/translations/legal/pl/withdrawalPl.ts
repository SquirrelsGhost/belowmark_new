import { operatorAddress, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, e-mail ${LEGAL_OPERATOR.email}, telefon ${LEGAL_OPERATOR.phone}`;

export const WITHDRAWAL_PL: LegalDocument = {
  title: "Pouczenie o odstąpieniu od umowy i wygaśnięciu dla treści cyfrowych",
  asOf: "Stan na 31 października 2026",
  basis: "Dla konsumentów w umowach o dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym (§§ 312g, 355, 356 ust. 5 niemieckiego kodeksu cywilnego, BGB).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Przedterminowe wygaśnięcie prawa odstąpienia (§ 356 ust. 5 BGB)",
      paragraphs: [
        "W przypadku umowy o dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym (aktywacja pełnego dostępu cyfrowego do wartości oszacowania, analiz operatów szacunkowych, ustawowych limitów licytacji, kalkulatorów terminów i dokumentów w Belowmark) prawo odstąpienia wygasa natychmiast z chwilą rozpoczęcia wykonania umowy, jeżeli:",
        "1. wyraziłeś wyraźną zgodę na rozpoczęcie przez nas wykonywania umowy przed upływem terminu do odstąpienia od umowy,",
        "2. potwierdziłeś przyjęcie do wiadomości, że wyrażając tę zgodę, tracisz prawo odstąpienia z chwilą rozpoczęcia wykonania umowy, oraz",
        "3. przekazaliśmy Ci potwierdzenie zgodnie z § 312f ust. 2 BGB na trwałym nośniku (pocztą elektroniczną).",
        "Ponieważ wyrażasz tę zgodę i potwierdzenie podczas procesu zamawiania poprzez akceptację Regulaminu przed kliknięciem „Zamów z obowiązkiem zapłaty”, a Twój pełny dostęp cyfrowy jest aktywowany natychmiast po potwierdzeniu płatności, prawo odstąpienia jest wyłączone na mocy § 356 ust. 5 BGB z chwilą aktywacji dostępu cyfrowego.",
      ],
    },
    {
      id: "recht",
      heading: "2. Ustawowe prawo odstąpienia od umowy (przed rozpoczęciem wykonania)",
      paragraphs: [
        "Jeżeli wyjątkowo wykonywanie umowy (aktywacja dostępu cyfrowego) jeszcze się nie rozpoczęło, przysługuje Ci następujące ustawowe prawo odstąpienia:",
        "Masz prawo odstąpić od niniejszej umowy w terminie czternastu dni bez podania jakiejkolwiek przyczyny. Termin do odstąpienia od umowy wynosi czternaście dni od dnia zawarcia umowy.",
        `Aby skorzystać z prawa odstąpienia od umowy, musisz poinformować nas (${contact}) o swojej decyzji o odstąpieniu od niniejszej umowy w drodze jednoznacznego oświadczenia (na przykład pismo wysłane pocztą lub wiadomość e-mail). Możesz skorzystać z załączonego wzoru formularza odstąpienia od umowy, jednak nie jest to obowiązkowe.`,
        "Aby zachować termin do odstąpienia od umowy, wystarczy wysłać informację dotyczącą wykonania przysługującego Ci prawa odstąpienia przed upływem terminu do odstąpienia oraz przed aktywacją dostępu cyfrowego.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Skutki skutecznego odstąpienia od umowy (przed aktywacją)",
      paragraphs: [
        "W przypadku skutecznego odstąpienia od niniejszej umowy przed wygaśnięciem prawa odstąpienia na skutek aktywacji dostępu cyfrowego zgodnie z § 356 ust. 5 BGB zwrócimy Ci wszystkie otrzymane od Ciebie płatności niezwłocznie, a w każdym przypadku nie później niż czternaście dni od dnia, w którym zostaliśmy poinformowani o Twojej decyzji o wykonaniu prawa odstąpienia od niniejszej umowy. Zwrotu płatności dokonamy przy użyciu takich samych sposobów płatności, jakie zostały użyte w pierwotnej transakcji.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Wypowiedzenie aktywnych subskrypcji",
      paragraphs: [
        "Niezależnie od wygaśnięcia prawa odstąpienia z chwilą natychmiastowej aktywacji (§ 356 ust. 5 BGB), aktywną subskrypcję miesięczną (Investor Miesięczny lub Pro Miesięczny) możesz wypowiedzieć w dowolnym momencie ze skutkiem na koniec już opłaconego miesiąca rozliczeniowego — jednym kliknięciem na swoim koncie lub poprzez „Wypowiedz umowy tutaj” w stopce każdej strony.",
      ],
    },
    {
      id: "formular",
      heading: "5. Wzór formularza odstąpienia od umowy",
      paragraphs: [
        "(Ma zastosowanie wyłącznie wtedy, gdy prawo odstąpienia nie wygasło już zgodnie z § 356 ust. 5 BGB wskutek aktywacji dostępu cyfrowego.)",
        `Adresat: ${operatorAddress()}, e-mail ${LEGAL_OPERATOR.email}:`,
        "Ja/My (*) niniejszym informuję/informujemy (*) o moim/naszym (*) odstąpieniu od umowy o dostarczanie następujących treści cyfrowych (*):",
        "Zamówiono dnia (*):",
        "Imię i nazwisko konsumenta(-ów):",
        "Adres konsumenta(-ów):",
        "Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w wersji papierowej):",
        "Data:",
        "(*) Niepotrzebne skreślić.",
      ],
    },
  ],
};
