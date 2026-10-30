import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

/** How prices are stated depends on the operator's VAT status (BILLING_VAT_MODE). */
export function vatSentenceDe(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") return "Alle Preise sind Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.";
  return "Alle Preise sind Endpreise und enthalten die gesetzliche Umsatzsteuer.";
}

export function termsDe(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Allgemeine Geschäftsbedingungen",
    asOf: "Stand 30. Oktober 2026",
    basis: "Für die Nutzung von Belowmark (belowmark.com).",
    sections: [
      {
        id: "geltung",
        heading: "1. Geltungsbereich und Vertragspartner",
        paragraphs: [
          `Diese Bedingungen gelten für alle Verträge über die Nutzung des Online-Dienstes Belowmark zwischen ${operatorAddress()} (nachfolgend „Anbieter“) und dem Kunden.`,
          "Verbraucher ist jede natürliche Person, die den Vertrag zu Zwecken schließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB). Abweichende Bedingungen des Kunden gelten nur, wenn der Anbieter ihnen ausdrücklich zustimmt.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Gegenstand der Leistung",
        paragraphs: [
          "Belowmark stellt öffentlich bekannt gemachte Angaben zu Zwangsversteigerungen in Deutschland und zu Versteigerungen in der Türkei zusammen, ordnet sie und berechnet daraus Kennzahlen (zum Beispiel Wertgrenzen, Sicherheitsleistung, Erwerbsnebenkosten). Der Kunde erhält für die Dauer des Vertrags einen persönlichen Zugang zu der Webanwendung für den Markt, den er bei der Registrierung gewählt hat.",
          "Belowmark ist eine Rechercheunterlage. Der Dienst ist keine Rechts-, Steuer-, Immobilien- oder Anlageberatung und enthält keine Empfehlung, ein bestimmtes Gebot abzugeben. Jede Angabe ist vor einer wirtschaftlichen Entscheidung am amtlichen Original zu prüfen.",
          "Die Angaben stammen aus Quellen Dritter (Justiz- und Behördenportale, Inseratsportale). Der Anbieter übernimmt keine Gewähr für deren Richtigkeit, Vollständigkeit und Aktualität; der Bestand kann unvollständig sein. Berechnete Werte sind Rechenergebnisse auf Grundlage dieser Angaben und keine Wertgutachten.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Tarife",
        paragraphs: [
          "Free Scout: kostenfreie, unbefristete Nutzung mit eingeschränktem Umfang (Objektliste sichtbar, Werte und Termine gesperrt). Es werden keine Zahlungsdaten erhoben.",
          "Testzeitraum: Nach Bestätigung der E-Mail-Adresse erhält der Kunde 14 Tage lang kostenfrei den Umfang des Investor-Zugangs. Der Testzeitraum endet automatisch und geht nicht in einen kostenpflichtigen Vertrag über.",
          "Investor monatlich: Vollzugang für 39,00 € (Markt Deutschland) bzw. 599,00 TL (Markt Türkei) je Monat, im Voraus zu zahlen, mit automatischer Verlängerung um jeweils einen Monat.",
          "Investor drei Monate: Vollzugang für drei Kalendermonate für einmalig 99,00 € (Markt Deutschland) bzw. 1.490,00 TL (Markt Türkei), im Voraus zu zahlen. Dieser Zugang verlängert sich nicht automatisch; eine Kündigung ist nicht erforderlich.",
          "Pro monatlich: Vollzugang einschließlich Kundenlinks mit eigenem Briefkopf und gemeinsamer Team-Listen (bis zu 3 Teams mit jeweils bis zu 5 Plätzen) für 129,00 € (Markt Deutschland) bzw. 1.990,00 TL (Markt Türkei) je Monat, im Voraus zu zahlen, mit automatischer Verlängerung um jeweils einen Monat.",
          "Pro drei Monate: Vollzugang im Pro-Umfang für drei Kalendermonate für einmalig 329,00 € (Markt Deutschland) bzw. 4.990,00 TL (Markt Türkei), im Voraus zu zahlen. Dieser Zugang verlängert sich nicht automatisch; eine Kündigung ist nicht erforderlich. Erweiterte Team-Kontingente (ab 299,00 € je Monat) werden nach vorheriger Anfrage individuell vereinbart.",
          vatSentenceDe(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Vertragsschluss",
        paragraphs: [
          "Mit der Registrierung und Bestätigung der E-Mail-Adresse kommt ein unentgeltlicher Nutzungsvertrag (Free Scout mit Testzeitraum) zustande.",
          "Ein kostenpflichtiger Investor-Zugang wird im Konto über die Bestellübersicht gebucht. Dort werden Tarif, Preis, Laufzeit und Verlängerung zusammengefasst; Eingaben lassen sich bis zum Absenden über „Zurück“ korrigieren. Mit Klick auf die Schaltfläche „Zahlungspflichtig bestellen“ gibt der Kunde ein verbindliches Angebot ab. Anschließend wird er zur Bezahlseite des Zahlungsdienstleisters Stripe weitergeleitet. Der Vertrag kommt zustande, sobald Stripe die Zahlung bestätigt und der Anbieter den Zugang freischaltet; der Kunde erhält darüber eine Bestätigung per E-Mail.",
          "Vertragssprache ist Deutsch. Der Anbieter speichert den Vertragstext (Bestellung, Tarif, Preis, Version dieser Bedingungen) und sendet ihn mit der Bestätigung per E-Mail. Die jeweils aktuelle Fassung dieser Bedingungen ist unter belowmark.com/agb abrufbar.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Zahlung und Rechnungen",
        paragraphs: [
          "Die Zahlung wird über Stripe Payments Europe, Ltd. (Irland) abgewickelt. Zahlungsdaten gibt der Kunde ausschließlich auf der Bezahlseite von Stripe ein; sie werden nicht beim Anbieter gespeichert. Welche Zahlungsarten zur Verfügung stehen, zeigt die Bezahlseite.",
          "Der monatliche Investor-Zugang wird jeweils zu Beginn eines Monats im Voraus abgebucht. Rechnungen stehen im Konto unter „Rechnungen und Zahlungsmittel“ zum Abruf bereit und werden per E-Mail versandt.",
          "Schlägt eine Abbuchung fehl, versucht Stripe sie erneut. Bleibt die Zahlung aus, endet der Vollzugang mit Ablauf des bezahlten Zeitraums; der kostenfreie Umfang bleibt erhalten.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Laufzeit und Kündigung",
        paragraphs: [
          "Der monatliche Investor-Zugang läuft auf unbestimmte Zeit und kann jederzeit zum Ende des bereits bezahlten Monats gekündigt werden; die Frist beträgt damit höchstens einen Monat. Bis dahin bleibt der Vollzugang bestehen. Eine anteilige Erstattung für den laufenden Monat erfolgt bei ordentlicher Kündigung nicht.",
          "Die Kündigung ist über die Schaltfläche „Verträge hier kündigen“ möglich, die im Fuß jeder Seite steht und ohne Anmeldung erreichbar ist, im Konto, über das Kundenportal von Stripe oder in Textform an " +
            `${LEGAL_OPERATOR.email}. Nach einer Kündigung über die Kündigungsschaltfläche erhält der Kunde unverzüglich eine Bestätigung per E-Mail mit Inhalt, Datum und Uhrzeit des Eingangs sowie dem Zeitpunkt, zu dem der Vertrag endet.`,
          "Der Investor-Zugang für drei Monate endet automatisch nach Ablauf der gebuchten Kalendermonate. Der kostenfreie Free-Scout-Vertrag kann jederzeit durch Löschen des Kontos beendet werden.",
          "Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt für beide Seiten unberührt.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Widerrufsrecht und Erlöschen bei digitalen Inhalten (§ 356 Abs. 5 BGB)",
        paragraphs: [
          "Bei Verträgen über die Bereitstellung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten erlischt das gesetzliche Widerrufsrecht gemäß § 356 Abs. 5 BGB sofort mit Beginn der Vertragsausführung (Freischaltung des kostenpflichtigen Zugangs), nachdem der Kunde im Bestellprozess ausdrücklich zugestimmt hat, dass der Anbieter vor Ablauf der Widerrufsfrist mit der Ausführung des Vertrags beginnt, und seine Kenntnis vom dadurch eintretenden Verlust des Widerrufsrechts bestätigt hat.",
          "Die vollständige Belehrung zum Erlöschen des Widerrufsrechts nach § 356 Abs. 5 BGB ist unter belowmark.com/widerruf abrufbar und wird dem Kunden mit der Vertragsbestätigung per E-Mail übermittelt.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Verfügbarkeit",
        paragraphs: [
          "Der Anbieter bemüht sich um einen durchgehend erreichbaren Dienst, schuldet aber keine bestimmte Verfügbarkeit. Wartung, Störungen bei Dritten und Ausfälle der Quellportale können den Zugang oder die Aktualität des Datenbestands vorübergehend einschränken.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Nutzungsrechte, Verbot von Scraping und Kontosperrung ohne Rückerstattung",
        paragraphs: [
          "Der Kunde erhält ein einfaches, nicht übertragbares Recht, den Dienst während der Vertragslaufzeit ausschließlich für eigene Recherchezwecke über einen regulären Webbrowser zu nutzen. Untersagt sind insbesondere: (a) die Weitergabe der Zugangsdaten oder die gemeinsame Nutzung eines Kontos durch mehrere Personen außerhalb gebuchter Team-Plätze, (b) jedes systematische, automatisierte oder skriptgestützte Auslesen, Abrufen, Kopieren oder Indexieren von Daten, Texten, Kennzahlen oder Dokumenten (insbesondere mittels Bots, Crawlern, Scrapern, Headless-Browsern oder Skripten), (c) die Umgehung technischer Schutzmaßnahmen, Abruflimits (Rate-Limits) oder Sicherheitsmechanismen (einschließlich des Auslösens von Honeypot-Schutzfallen) sowie (d) der Massen-Download, die Weiterveräußerung, Unterlizenzierung oder öffentliche Zugänglichmachung der aufbereiteten Daten oder Dokumente.",
          "Ein Verstoß gegen die vorstehenden Verbote stellt eine schwerwiegende Verletzung wesentlicher Vertragspflichten dar und berechtigt den Anbieter zur sofortigen außerordentlichen Kündigung aus wichtigem Grund (§ 314 BGB) sowie zur unmittelbaren, dauerhaften Sperrung des Nutzerkontos und der verwendeten Endgeräte-Kennung ohne vorherige Abmahnung.",
          "Im Falle einer solchen durch den Vertragsverstoß des Kunden (insbesondere durch Scraping, automatisierten Datenabzug oder Umgehung von Schutzmechanismen) verursachten Kontosperrung oder außerordentlichen Kündigung erlischt das Nutzungsrecht mit sofortiger Wirkung. Ein Anspruch des Kunden auf Rückerstattung oder anteilige Erstattung bereits gezahlter Entgelte für den laufenden Abrechnungsmonat oder gebuchte mehrteilige Festlaufzeiten ist in diesem Fall ausgeschlossen. Weitergehende Schadensersatz- und Unterlassungsansprüche des Anbieters bleiben unberührt.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Haftung",
        paragraphs: [
          "Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit sowie nach dem Produkthaftungsgesetz. Bei einfacher Fahrlässigkeit haftet er nur für die Verletzung wesentlicher Vertragspflichten (Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags erst ermöglicht und auf deren Einhaltung der Kunde regelmäßig vertrauen darf), und zwar begrenzt auf den vertragstypischen, vorhersehbaren Schaden.",
          "Für wirtschaftliche Entscheidungen des Kunden, insbesondere für abgegebene Gebote und deren Folgen, haftet der Anbieter nicht, soweit nicht ein Fall des vorstehenden Absatzes vorliegt.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Änderungen dieser Bedingungen und der Preise",
        paragraphs: [
          "Änderungen dieser Bedingungen oder des Preises für den monatlichen Investor-Zugang teilt der Anbieter mindestens sechs Wochen vor ihrem Wirksamwerden in Textform mit. Sie werden nur wirksam, wenn der Kunde ihnen zustimmt; stimmt er nicht zu, kann jede Seite den Vertrag zum Wirksamwerden der Änderung kündigen.",
        ],
      },
      {
        id: "recht",
        heading: "12. Anwendbares Recht und Gerichtsstand",
        paragraphs: [
          "Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gegenüber Verbrauchern gilt diese Rechtswahl nur, soweit dadurch nicht der Schutz durch zwingende Bestimmungen des Rechts des Staates entzogen wird, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat.",
          `Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand der Sitz des Anbieters (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
