import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

/**
 * Datenschutzerklärung. Every processing listed here exists in the code as
 * of 26.10.2026 — when a feature adds a recipient, cookie or storage key,
 * this text has to follow.
 */
export const PRIVACY_DE: LegalDocument = {
  title: "Datenschutzerklärung",
  asOf: "Stand 26. Oktober 2026",
  basis: "Informationen nach Art. 13 und 14 der Datenschutz-Grundverordnung (DSGVO).",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Verantwortlicher",
      paragraphs: [
        `${operatorAddress()}. E-Mail ${LEGAL_OPERATOR.email}, Telefon ${LEGAL_OPERATOR.phone}. Einen Datenschutzbeauftragten haben wir nicht benannt, weil keine gesetzliche Pflicht dazu besteht.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Aufruf der Website",
      paragraphs: [
        "Beim Abruf jeder Seite verarbeitet der Server technisch notwendige Angaben: IP-Adresse, Zeitpunkt, angeforderte Adresse, Browserkennung und die Antwort des Servers. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt in einem sicheren und störungsfreien Betrieb.",
        `Die Anwendung selbst schreibt keine Zugriffsprotokolle. Beim Hosting-Anbieter können Protokolle anfallen: ${filled(LEGAL_OPERATOR.hosting, "Hosting-Anbieter, Serverstandort und Speicherdauer der Protokolle eintragen; Auftragsverarbeitungsvertrag nach Art. 28 DSGVO abschließen")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Konto und Anmeldung",
      paragraphs: [
        "Für ein Konto speichern wir: E-Mail-Adresse, einen kryptografischen Prüfwert des Passworts (scrypt, kein Klartext), den gewählten Markt und die Sprache, Zeitpunkt der E-Mail-Bestätigung, Ende des Testzeitraums, gebuchten Tarif und dessen Laufzeit sowie den Zeitpunkt der letzten Anmeldung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertrag).",
        "Für jede Anmeldung führen wir eine Sitzung mit einem Prüfwert der Browserkennung, einer gekürzten IP-Adresse und dem Ablaufzeitpunkt. So erkennen wir gestohlene Sitzungscookies und können alle Geräte abmelden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Schutz des Kontos). Sitzungen werden mit ihrem Ablauf ungültig.",
        "Bei Registrierung und Anmeldung berechnet der Browser einen Geräte-Prüfwert aus technischen Merkmalen (Grafikkarte, Bildschirm, Prozessorkerne, Zeitzone) und legt ihn im lokalen Speicher ab („ec_hw_id“). Er dient ausschließlich dazu, gesperrte Geräte wiederzuerkennen und Konten vor automatisierten Angriffen zu schützen (§ 25 Abs. 2 Nr. 2 TDDDG, Art. 6 Abs. 1 lit. f DSGVO).",
        "Ein neues Passwort prüfen wir gegen bekannte Datenlecks (Have I Been Pwned). Dabei werden nur die ersten fünf Zeichen eines SHA-1-Prüfwerts übertragen, nie das Passwort selbst (k-Anonymität). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.",
        "Zur Abwehr von Missbrauch zählen wir Anfragen je IP-Adresse und E-Mail-Adresse für kurze Zeitfenster (Minuten bis Stunden).",
      ],
    },
    {
      id: "app",
      heading: "4. Inhalte, die Sie im Konto anlegen",
      paragraphs: [
        "Merkliste mit Notizen und gespeicherte Suchen (Alerts) liegen in unserer Datenbank. Für Alerts senden wir E-Mails, solange der Alert aktiv ist. Hochgeladene Gutachten werden ausgewertet; gespeichert wird das Ergebnis der Auswertung (Dateiname, gefundene Textstellen mit Seitenangabe), nicht die PDF-Datei. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.",
        "Ist die erweiterte Gutachten-Auswertung eingeschaltet, wird der Text des hochgeladenen Gutachtens zur Auswertung an unseren KI-Auftragsverarbeiter übermittelt (Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO).",
        "Prüfliste, Bietlimit-Eingaben, eigene Antworten zum Urteil, Vergleichswerte und die Bankenmappe speichert nur Ihr Browser (lokaler Speicher, Schlüssel „belowmark:…“). Diese Angaben erreichen unseren Server nicht.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Buchung und Zahlung",
      paragraphs: [
        "Bei einer Buchung speichern wir die Bestellung: Tarif, Preis, Markt, Version der AGB, den Zeitpunkt Ihres Verlangens nach sofortigem Leistungsbeginn und den Zahlungsstatus. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, für die Aufbewahrung Art. 6 Abs. 1 lit. c DSGVO.",
        "Bezahlt wird auf der Bezahlseite von Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Irland. Dorthin übermitteln wir Ihre E-Mail-Adresse und die Bestellung; Zahlungsdaten geben Sie direkt bei Stripe ein, sie erreichen uns nicht. Von Stripe erhalten wir eine Kundennummer, den Zahlungsstatus und die Rechnung. Stripe verarbeitet Daten auch selbst als Verantwortlicher, etwa zur Betrugsprävention und für eigene gesetzliche Pflichten; dazu gilt die Datenschutzerklärung von Stripe (stripe.com/de/privacy). Soweit Daten an verbundene Unternehmen in den USA übermittelt werden, erfolgt dies auf Grundlage des EU-US Data Privacy Framework sowie der EU-Standardvertragsklauseln.",
        "Die Bezahlseite von Stripe liegt auf einer Stripe-Domain. Auf belowmark.com selbst binden wir keine Skripte von Stripe ein.",
        "Rechnungen und Buchungsbelege bewahren wir so lange auf, wie Handels- und Steuerrecht es verlangen (§ 147 AO, § 257 HGB).",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Kündigung und Widerruf",
      paragraphs: [
        "Erklärungen über „Verträge hier kündigen“ und „Vertrag widerrufen“ speichern wir mit Name, E-Mail-Adresse, Vertragsangabe, Inhalt sowie Datum und Uhrzeit des Eingangs und senden eine Bestätigung per E-Mail. Wir bewahren sie drei Jahre ab Ende des Jahres des Eingangs auf, um den Eingang belegen zu können (Art. 6 Abs. 1 lit. c und f DSGVO).",
      ],
    },
    {
      id: "mail",
      heading: "7. E-Mails",
      paragraphs: [
        `Wir senden nur E-Mails, die zum Vertrag gehören: Bestätigungslinks, Passwort-Links, Buchungs- und Kündigungsbestätigungen sowie Alerts, die Sie selbst angelegt haben. Keine Werbung, kein Newsletter, keine Öffnungs- oder Klickmessung. Versand über ${filled(LEGAL_OPERATOR.mailProvider, "E-Mail-Dienstleister (SMTP) eintragen; Auftragsverarbeitungsvertrag abschließen")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Cookies und lokale Speicherung",
      paragraphs: [
        "Wir setzen keine Analyse-, Werbe- oder Tracking-Cookies und binden keine solchen Dienste ein. Deshalb gibt es kein Einwilligungsfenster.",
        "Anmelde-Cookie („__Host-bm_session“): hält die Anmeldung aufrecht; für den angeforderten Dienst unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Es endet mit dem Schließen des Browsers oder, bei „Angemeldet bleiben“, nach 30 Tagen.",
        "„BELOWMARK_COUNTRY“ und „BELOWMARK_MARKET“ (je ein Jahr): merken das gewählte Land und den in der Preisübersicht gewählten Markt, damit Sprache und Preise passen. Sie enthalten nur „DE“ oder „TR“ (§ 25 Abs. 2 Nr. 2 TDDDG).",
        "Schriften werden von unserem eigenen Server geladen, nicht von Google.",
      ],
    },
    {
      id: "karten",
      heading: "9. Karten und Luftbilder",
      paragraphs: [
        "Auf der Detailseite eines Objekts lädt Ihr Browser Kartenkacheln direkt von basemap.de (Bundesamt für Kartographie und Geodäsie, Deutschland), ersatzweise von OpenStreetMap (OpenStreetMap Foundation, Vereinigtes Königreich), sowie Luftbilder von Esri (server.arcgisonline.com, USA). Diese Anbieter erhalten dabei Ihre IP-Adresse und die Kachel-Adresse. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Darstellung der Lage).",
        "Links zu Google Maps, amtlichen Portalen und Inseratsportalen öffnen fremde Seiten erst, wenn Sie darauf klicken; dort gelten die Hinweise der jeweiligen Betreiber.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Speicherdauer und Löschung",
      paragraphs: [
        "Kontodaten speichern wir, bis Sie das Konto löschen. Im Konto können Sie unter „Ihre Daten“ alle gespecherten Angaben herunterladen und das Konto selbst löschen. Beim Löschen entfernen wir Konto, Sitzungen, Merkliste, Alerts und Gutachten-Auswertungen sofort. Bestellungen und Erklärungen bleiben ohne Kontozuordnung so lange erhalten, wie gesetzliche Aufbewahrungsfristen es verlangen; bei Stripe liegen Rechnungen und Zahlungsdaten nach dessen eigenen Pflichten.",
        "Einmal-Links (E-Mail-Bestätigung, Passwort) werden bei Benutzung gelöscht und verlieren nach 24 Stunden bzw. einer Stunde ihre Gültigkeit.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Ihre Rechte",
      paragraphs: [
        "Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO). Wenden Sie sich dafür an die oben genannte Adresse; Export und Löschung können Sie im Konto auch selbst auslösen.",
        `Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren, insbesondere bei der für uns zuständigen: ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "Eine automatisierte Entscheidungsfindung oder Profilbildung im Sinne von Art. 22 DSGVO findet nicht statt.",
      ],
    },
  ],
};
