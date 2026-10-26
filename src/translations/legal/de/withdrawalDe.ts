import { operatorAddress, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email}, Telefon ${LEGAL_OPERATOR.phone}`;

/**
 * Widerrufsbelehrung für digitale Inhalte (§ 356 Abs. 5 BGB).
 * Mit ausdrücklicher Zustimmung zum sofortigen Beginn und Bestätigung der
 * Kenntnis vom Verlust des Widerrufsrechts erlischt das Widerrufsrecht
 * unmittelbar mit der Freischaltung des digitalen Vollzugangs.
 */
export const WITHDRAWAL_DE: LegalDocument = {
  title: "Widerrufsbelehrung & Erlöschen bei digitalen Inhalten",
  asOf: "Stand 26. Oktober 2026",
  basis: "Für Verbraucher bei Verträgen über digitale Inhalte, die nicht auf einem körperlichen Datenträger bereitgestellt werden (§§ 312g, 355, 356 Abs. 5 BGB).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Vorzeitiges Erlöschen des Widerrufsrechts (§ 356 Abs. 5 BGB)",
      paragraphs: [
        "Das Widerrufsrecht erlischt bei einem Vertrag über die Bereitstellung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten (Freischaltung des digitalen Vollzugangs zu Verkehrswerten, Gutachten-Auswertungen, Wertgrenzen, Fristen-Rechnern und Dokumenten auf Belowmark) sofort mit Beginn der Vertragsausführung, wenn:",
        "1. Sie ausdrücklich zugestimmt haben, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen,",
        "2. Sie Ihre Kenntnis davon bestätigt haben, dass durch Ihre Zustimmung mit Beginn der Ausführung des Vertrags Ihr Widerrufsrecht erlischt, und",
        "3. wir Ihnen eine Bestätigung gemäß § 312f Abs. 2 BGB auf einem dauerhaften Datenträger (per E-Mail) zur Verfügung gestellt haben.",
        "Da Sie diese Zustimmung und Bestätigung im Bestellprozess vor Klick auf „Zahlungspflichtig bestellen“ abgeben und Ihr Vollzugang unmittelbar nach Zahlungsbestätigung freigeschaltet wird, ist ein Widerruf nach erfolgter Freischaltung des digitalen Zugangs gemäß § 356 Abs. 5 BGB ausgeschlossen.",
      ],
    },
    {
      id: "recht",
      heading: "2. Gesetzliche Widerrufsbelehrung (vor Beginn der Vertragsausführung)",
      paragraphs: [
        "Sofern mit der Ausführung des Vertrags (Freischaltung des digitalen Zugangs) ausnahmsweise noch nicht begonnen wurde, gilt folgendes gesetzliches Widerrufsrecht:",
        "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.",
        `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (${contact}) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.`,
        "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist und vor Freischaltung des digitalen Zugangs absenden.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Folgen eines wirksamen Widerrufs (vor Freischaltung)",
      paragraphs: [
        "Wenn Sie diesen Vertrag wirksam widerrufen, bevor das Widerrufsrecht durch Freischaltung des digitalen Zugangs gemäß § 356 Abs. 5 BGB erloschen ist, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Kündigung laufender Abonnements",
      paragraphs: [
        "Unabhängig vom Erlöschen des Widerrufsrechts bei sofortiger Freischaltung (§ 356 Abs. 5 BGB) können Sie ein laufendes Monatsabo (Investor monatlich oder Pro monatlich) jederzeit ordentlich zum Ende des bereits bezahlten Abrechnungsmonats kündigen — mit einem Klick im Konto oder über „Verträge hier kündigen“ im Fuß jeder Seite.",
      ],
    },
    {
      id: "formular",
      heading: "5. Muster-Widerrufsformular",
      paragraphs: [
        "(Nur anwendbar, sofern das Widerrufsrecht nicht bereits gemäß § 356 Abs. 5 BGB durch Freischaltung des digitalen Zugangs erloschen ist.)",
        `An ${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email}:`,
        "Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Bereitstellung der folgenden digitalen Inhalte (*):",
        "Bestellt am (*):",
        "Name des/der Verbraucher(s):",
        "Anschrift des/der Verbraucher(s):",
        "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):",
        "Datum:",
        "(*) Unzutreffendes streichen.",
      ],
    },
  ],
};
