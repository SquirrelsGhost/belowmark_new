# Tarife buchen — Einrichtung und offene Punkte

Stand 26.10.2026. Beschreibt, wie Buchung, Kündigung, Widerruf, Datenexport und
Kontolöschung gebaut sind, was in Stripe einzurichten ist und was vor dem
Livegang noch fehlt. **Die Rechtstexte sind Entwürfe, keine Rechtsberatung.**
Sie müssen vor dem Livegang von einer Anwältin oder einem Anwalt geprüft werden.

## So läuft eine Buchung

1. Preisbereich „Investor werden“, das Banner im App-Bereich oder ein gesperrter
   Bereich (Rechner) führen mit einem Klick zu `/buchen`. Wer nicht angemeldet
   ist, landet beim Login und kommt danach direkt zurück.
2. `/buchen` zeigt die Tarife (Investor monatlich 39 € / drei Monate 99 € sowie Pro monatlich 129 € / drei Monate 329 €), die
   Zusammenfassung mit Endpreis, **eine** Pflicht-Checkbox (sofortiger Beginn,
   § 356 Abs. 4 / § 357a Abs. 2 BGB) und den Button **„Zahlungspflichtig
   bestellen“** (§ 312j Abs. 3 BGB). Darunter stehen Links auf AGB,
   Widerrufsbelehrung und Datenschutz.
3. Weiter geht es zu Stripe Checkout (gehostet; Kartendaten erreichen Belowmark
   nie). Nach der Zahlung kommt man zu `/api/billing/bestaetigen`, das
   prüft und zu `/konto?zahlung=bezahlt#tarif` weiterleitet.
4. Freigeschaltet wird nur, wenn Stripe „paid“ meldet, über die Erfolgsseite
   **oder** den Webhook. Wer zuerst kommt, schaltet frei; eine doppelte Meldung
   verlängert nichts doppelt.
5. Bestätigungsmail mit Vertragsdaten, AGB und Widerrufsbelehrung im Volltext
   (§ 312f Abs. 2 BGB, dauerhafter Datenträger). Die Rechnung kommt von Stripe.

Größere Team-Kontingente (ab 299 €) werden auf Anfrage vereinbart.

## Kündigen, Widerrufen, Daten

| Was | Wo | Rechtsgrundlage |
|---|---|---|
| „Verträge hier kündigen“ | Footer jeder Seite, `/kuendigen`, Konto | § 312k BGB |
| „Vertrag widerrufen“ | Footer jeder Seite (hervorgehoben), `/widerruf/erklaeren` | § 356a BGB (seit 19.06.2026) |
| Daten herunterladen (JSON) | `/konto` → „Ihre Daten“ | Art. 15, 20 DSGVO |
| Konto löschen | `/konto` → „Ihre Daten“ (Passwort + Bestätigung) | Art. 17 DSGVO |
| Rechnungen, Zahlungsmittel | `/konto` → Stripe-Kundenportal | — |

Kündigung und Widerruf gehen ohne Anmeldung. Direkt nach dem Absenden erscheint
eine druckbare Eingangsbestätigung mit Inhalt, Datum und Uhrzeit, und dieselbe
Bestätigung geht per E-Mail raus. Eine ordentliche Kündigung des Monatsabos wird
sofort zum Ende des bezahlten Monats ausgeführt. Alles andere geht als Kopie an
`OPERATOR_EMAIL` und wird von Hand bearbeitet: außerordentliche Kündigungen,
Wunschdaten, kein passendes Konto und **jeder Widerruf**. Die Erstattung beim
Widerruf machst du im Stripe-Dashboard.

Der Export enthält kein Passwort-Hash und keinen Geräte-Fingerabdruck. Beim
Löschen bleiben Bestellungen ohne Personenbezug für die steuerlichen
Aufbewahrungsfristen erhalten; ein laufendes Monatsabo endet sofort. Die Seite
sagt das vorher.

## Was du in Stripe einrichten musst

Zuerst alles im **Testmodus** (Schlüssel `sk_test_…`). Damit funktioniert die
Buchung auch ohne Rechtsfreigabe, mit Testkarte `4242 4242 4242 4242`.

1. **Unternehmensdaten**: Name, Anschrift und Support-E-Mail so eintragen, wie
   sie im Impressum stehen. Dazu die Steuernummer bzw. USt-IdNr.
2. **Produkte „Belowmark Investor“ & „Belowmark Pro“** mit acht Preisen. Die Beträge müssen exakt
   stimmen, denn die App prüft Betrag, Währung und Intervall und verweigert sonst
   die Bestellung:
   - 39,00 EUR, wiederkehrend, monatlich → `STRIPE_PRICE_DE_INVESTOR_MONAT`
   - 99,00 EUR, **einmalig** → `STRIPE_PRICE_DE_INVESTOR_QUARTAL`
   - 129,00 EUR, wiederkehrend, monatlich → `STRIPE_PRICE_DE_PRO_MONAT`
   - 329,00 EUR, **einmalig** → `STRIPE_PRICE_DE_PRO_QUARTAL`
   - 599,00 TRY, wiederkehrend, monatlich → `STRIPE_PRICE_TR_INVESTOR_MONAT`
   - 1.490,00 TRY, einmalig → `STRIPE_PRICE_TR_INVESTOR_QUARTAL`
   - 1.990,00 TRY, wiederkehrend, monatlich → `STRIPE_PRICE_TR_PRO_MONAT`
   - 4.990,00 TRY, einmalig → `STRIPE_PRICE_TR_PRO_QUARTAL`

   Die TL-Preise sind Platzhalter aus der Konfiguration (`OFFERS` in
   `src/lib/billing/billingConfig.ts`). Bitte selbst festlegen und dort
   anpassen.
   Steuerverhalten der Preise: „inklusive“, wenn du USt ausweist.
3. **Webhook**: Endpunkt `https://<deine-domain>/api/billing/webhook` mit den
   Ereignissen `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`, `checkout.session.expired`,
   `customer.subscription.updated`, `customer.subscription.deleted` und
   `invoice.paid`. Das Signing Secret kommt nach `STRIPE_WEBHOOK_SECRET`.
   Lokal geht das mit `stripe listen --forward-to localhost:3000/api/billing/webhook`.
4. **Kundenportal** (Settings → Billing → Customer portal): Rechnungen,
   Zahlungsmittel und Rechnungsadresse an. Kündigung „am Ende des
   Abrechnungszeitraums“ an. Tarifwechsel und Mengenänderung aus. Links auf AGB
   und Datenschutz eintragen.
5. **Rechnungen/Belege**: Unter Settings → Emails „Successful payments“ und
   „Invoices“ an. Einmalzahlungen bekommen eine Rechnung, weil die App
   `invoice_creation` setzt. Prüfe die Rechnungsangaben nach § 14 UStG mit
   deiner Steuerberatung.
6. **Stripe Tax** (optional): erst einrichten und registrieren, dann
   `STRIPE_AUTOMATIC_TAX=on`.
7. **Stripe-DPA**: Akzeptiere das Data Processing Agreement von Stripe im
   Dashboard und gleiche die Rolle von Stripe mit der Datenschutzerklärung ab.

## Umgebungsvariablen

| Variable | Bedeutung |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_…` oder `sk_live_…`. Leer = in `npm run dev` lokale Testkasse, in Produktion keine Buchung |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` |
| `STRIPE_PRICE_*` | die vier Preis-IDs oben |
| `STRIPE_AUTOMATIC_TAX` | `on` nur mit Stripe Tax |
| `BILLING_LEGAL_APPROVED` | `yes` erst nach anwaltlicher Prüfung. Ohne diesen Wert ist mit `sk_live_` keine Bestellung möglich, und die Rechtsseiten zeigen den Entwurfshinweis |
| `BILLING_VAT_MODE` | `inclusive` (inkl. 19 % USt) oder `kleinunternehmer` (§ 19 UStG). Pflicht im Livebetrieb, steuert den Preishinweis und den AGB-Text |
| `BILLING_TR_ENABLED` | `yes` erst wenn die türkischen Punkte unten erledigt sind |
| `BILLING_TEST_CHECKOUT` | `off` schaltet die lokale Testkasse ab (in Produktion ist sie immer aus) |
| `OPERATOR_EMAIL` | bekommt Widerrufe und manuelle Kündigungen |

## Offene Lücken in den Rechtstexten

Auf den Seiten sind diese Stellen rot als ⟨…⟩ markiert. Im Testmodus listet
`/buchen` sie auf.

- USt-IdNr. bzw. Steuernummer im Impressum (`LEGAL_OPERATOR.vatId` in
  `src/lib/legal/legalOperator.ts`)
- Hosting-Anbieter, Serverstandort, Protokoll-Speicherdauer, AV-Vertrag
  (Art. 28 DSGVO)
- E-Mail-Dienstleister (SMTP) mit AV-Vertrag
- Stripe: Rolle, DPA, Übermittlungsgrundlage
- Anthropic (Gutachten-Auswertung): AV-Vertrag, Übermittlungsgrundlage, Hinweis
  an der Upload-Stelle
- Widerrufsbelehrung: Wortlaut des neuen Gestaltungshinweises 3 der amtlichen
  Musterbelehrung (Fassung ab 19.06.2026)
- AGB-Änderungsklausel: Zustimmungslösung statt Zustimmungsfiktion (BGH XI ZR
  26/20)
- Aufbewahrungsfristen mit der Steuerberatung bestätigen
- Automatische Länderkennung ohne Einwilligung: prüfen lassen

## Datenschutz: was mir beim Bau aufgefallen ist (nicht geändert)

- **Geräte-Fingerabdruck beim Login** (`ec_hw_id`): Das Auslesen von
  Endgeräteinformationen braucht nach § 25 TDDDG eine Einwilligung oder muss
  „unbedingt erforderlich“ sein. Bitte prüfen lassen oder entfernen.
- **Cookie `BELOWMARK_COUNTRY`** wird automatisch gesetzt. Möglicherweise ist es
  unbedingt erforderlich; das ist zu prüfen (siehe Lücke oben).
- **Esri-Luftbilder**: Beim Laden der Kacheln gehen IP-Adressen an Esri in den
  USA. Das steht in der Datenschutzerklärung; alternativ kommen sie erst nach
  einem Klick.
- **Kein Cookie-Banner nötig**, solange nur das Sitzungscookie, das Sprach- und
  das Marktcookie gesetzt werden und keine Analyse- oder Werbedienste dazukommen.
  Stripe-Cookies entstehen erst auf der Stripe-Seite.

## Türkei: ehrlicher Stand

Die Online-Buchung für den TR-Markt ist **gesperrt**, bis `BILLING_TR_ENABLED=yes`
gesetzt ist. TR-Nutzer sehen einen Hinweis und den Kontaktweg.

- **Stripe** eröffnet keine Konten für Unternehmen mit Sitz in der Türkei. Ein
  deutsches Stripe-Konto kann aber in TRY abrechnen. Ob das für dein Konto
  freigeschaltet ist, siehst du im Dashboard beim Anlegen des TRY-Preises.
- **iyzico** setzt ein türkisches Unternehmen voraus und ist für PYCIE Studio
  derzeit keine Option.
- **Steuer**: Ausländische Anbieter elektronischer Dienstleistungen an
  Privatpersonen in der Türkei müssen sich für die Sonder-KDV registrieren
  („Elektronik Hizmet Sağlayıcıları İçin Özel KDV Mükellefiyeti“, Erklärung Nr. 3,
  ohne Schwellenwert).
- **Verträge**: Nötig sind ein Vorabinformationsformular und ein Fernabsatzvertrag
  nach der Mesafeli Sözleşmeler Yönetmeliği sowie ein KVKK-Aydınlatma-Metni.
  Die deutschen Texte reichen dafür nicht.

## Nach dem Einspielen lokal

1. `npm install` (neu: `stripe@22.6.2`)
2. Dev-Server neu starten. Migration `0004_billing` läuft beim Start.
3. Ohne Stripe-Schlüssel: Schnell-Login „DE“, dann `/buchen`, dann
   „Zahlungspflichtig bestellen“, dann „Testzahlung abschließen“. Danach ist der
   Zugang im Konto aktiv.
