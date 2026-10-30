# Instagram-Schablone belowmark

Freigegeben von Emre am 26.10.2026. Diese Schablone gilt ab jetzt für alle Instagram-Bilder.
Änderungen an Layout, Texten oder Regeln nur nach Rücksprache.

Erzeugt wird alles mit `npm run insta:daily` (Code: `scripts/instagram-daily.mjs` und `scripts/instagram/`).
Referenzbilder: `marketing/instagram/2026-10-26/` (de-objekt-feed.png, tr-objekt-feed.png, de-objekt-story.png).

## Ablauf jeden Tag

1. `npm run sync` (frische Aushänge)
2. `npm run insta:daily`
3. `marketing/instagram/<datum>/kontrolle.txt` öffnen: Ist der Termin noch angesetzt? Stimmen die Beträge mit dem amtlichen Aushang?
4. PNG hochladen, Text aus der passenden `.txt` als Bildunterschrift einfügen. Den Link aus `kontrolle.txt` nicht posten.

Optionen: `-- --alle` (alle drei Themen), `-- --thema=objekt|zahl|wissen`, `-- --datum=JJJJ-MM-TT`, `-- --trotzdem` (Objekt trotz altem Datenstand, nicht empfohlen).

## Formate

| Format | Größe | Ränder |
|---|---|---|
| Feed-Post (4:5) | 1080 × 1350 px | links/rechts 72 px, oben 60 px, unten 50 px |
| Story (9:16) | 1080 × 1920 px | links/rechts 80 px, oben 220 px, unten 260 px (frei für die Instagram-Bedienelemente), Inhalt vertikal zentriert, roter Button „Link in der Bio“ / „Link biyografide“ |

Je Markt eine Sprache: Deutschland = Deutsch, Türkei = Türkisch.

## Themenplan

| Tag | Thema |
|---|---|
| Montag, Mittwoch, Freitag | Objekt des Tages / Günün ilanı |
| Dienstag, Samstag | Wissen / Bilgi |
| Donnerstag, Sonntag | Zahl des Tages / Günün rakamı |

Ein Objekt wird innerhalb von 60 Tagen nicht zweimal gezeigt (`marketing/instagram/verlauf.json`).

## Design („Amtlicher Aushang“)

**Farben**

| Name | Wert | Einsatz |
|---|---|---|
| Papier | `#eeeae1` | Hintergrund |
| Papier hell | `#f7f4ee` | Fläche im Eckdaten-Kasten |
| Tinte | `#12110f` | Text, Linien, Kastenkopf, harter Schatten |
| Tinte weich | `#3b3933` | Ort, Beschriftungen |
| Grau | `#6e695e` | Kleingedrucktes |
| Signalrot | `#c8362b` | Marktlinie, Preis, Abschlag-Stempel, Rubrik-Quadrat, Button |

**Schriften** (liegen in `scripts/instagram/fonts`, Lizenz OFL)

- Archivo Condensed ExtraBold: Schlagzeilen, Preis, Stempel, Wortmarke. Immer in Großbuchstaben, für Türkisch mit `tr-TR` (sonst wird i/İ falsch).
- Archivo Regular/SemiBold: Fließtext, Zeilen im Kasten.
- IBM Plex Mono: Rubrik, Datum, Beträge im Kasten, Quelle.
- Newsreader Italic: das Versprechen unter der Linie und die Hinweise.

**Logo:** nur die Wortmarke BELOWMARK mit der roten Linie darüber. Kein kleines Zeichen (Linie + Punkt) daneben.

## Aufbau „Objekt des Tages“ (von oben nach unten)

1. **Kopf:** links Wortmarke, rechts rotes Quadrat + Rubrik („OBJEKT DES TAGES“ / „GÜNÜN İLANI“) und Datum, darunter eine dicke Tintenlinie.
2. **Dachzeile** (Mono, grau): „ZWANGSVERSTEIGERUNG · AG …“ bzw. „İCRA SATIŞI · …“.
3. **Schlagzeile** (Condensed, sehr groß): Objektart, z. B. EINFAMILIENHAUS / DAİRE.
4. **Ort** (Condensed, kleiner, Tinte weich): DE „PLZ 130XX · BERLIN“, TR „YENİMAHALLE / ANKARA“.
5. **Rote Marktlinie** über die ganze Bildbreite.
6. **Preis, der fängt:**
   - Zeile kursiv: DE „Zuschlag im ersten Termin möglich ab“, TR „Açık artırma başlangıç bedeli“.
   - Preis in Signalrot, sehr groß. DE = 5/10 des Verkehrswerts, TR = Startgebot aus dem Aushang. Lange Beträge werden automatisch kleiner gesetzt.
   - Roter Stempel mit hartem Tintenschatten rechts daneben: DE „−50 %“, TR „−%X“ (Abstand Startgebot zum muhammen bedel).
   - Darunter in Mono: DE „Verkehrswert 375.000 € · 5/10-Grenze, § 85a ZVG“, TR „Muhammen bedel … · ilana göre“.
7. **Kasten „ECKDATEN“ / „ÖZET“:** Tintenkopf, helle Fläche, 12 px harter Schatten.
   - DE: Termin (Datum + Uhrzeit), Verkehrswert, 7/10-Grenze § 74a ZVG, Sicherheitsleistung § 68 ZVG (10 %), Grunderwerbsteuer des Bundeslands.
   - TR: offene Artırma-Runde(n) mit Zeitraum, Teminat %10, KDV (ilana göre), Alan (wenn im Aushang).
8. **Hinweis** (kursiv): DE „Unter 5/10 kein Zuschlag im ersten Termin. Der echte Preis entsteht erst im Termin.“, TR „Başlangıç bedeli ilandan alınmıştır. Masraflar ve şartlar için ilanın tamamını okuyun.“
9. **Fuß:** Quelle mit Datenstand, „Keine Rechts- oder Anlageberatung. Termine können aufgehoben werden.“ (TR: „Hukuki veya yatırım danışmanlığı değildir. İhaleler iptal edilebilir.“), rechts BELOWMARK.COM.

Sind die 5/10- und 7/10-Grenze im Verfahren entfallen (Folgetermin), zeigt das Bild statt des Preises nur den Verkehrswert.

## Aufbau „Zahl des Tages“ und „Wissen“

- **Zahl des Tages:** gleiche Kopf- und Fußzeile. Wechselt täglich zwischen sehr großer Zahl (Termine in 7 bzw. 30 Tagen) mit roten Balken für die Top-5-Regionen und Median-Verkehrswert je Objektart (nur mit mindestens 20 Aushängen), dann Marktlinie und Versprechen „Jeden Tag neu aus den amtlichen Justizportalen.“
- **Wissen:** Norm im roten Rahmen (z. B. „§ 85a ZVG“, „İİK m. 114/7“), Zähler „Folge X von Y“, große Schlagzeile, Marktlinie, Erklärung, kursiver Merksatz mit roter Randlinie. Karten stehen in `scripts/instagram/tips.mjs`; neue Karten nur mit Normangabe.

## Inhaltliche Regeln (nicht verhandelbar)

- **Nichts wird erfunden.** Jede Zahl kommt aus dem amtlichen Aushang oder ist eine gesetzliche Quote davon (5/10, 7/10, 10 %). Keine Fantasie-Abschläge wie „40 % unter Wert“, keine Renditeversprechen, keine Anlageberatung.
- **Datenschutz:** nur Objektart, PLZ-Bereich (3 Ziffern + xx) und Ort bzw. İlçe/İl, Gericht/Dienststelle, Termin und amtliche Beträge. Keine Straße, kein Aktenzeichen, keine Ada/Parsel, keine Namen.
- **Keine fremden Fotos:** Gutachten- und Portalfotos (zvg.com) sind urheberrechtlich geschützt.
- **Aktuell:** Ist der Datenstand älter als 2 Tage, wird kein Objekt des Tages erzeugt.
- **Türkei:** nur İCRA-Aushänge, keine Anteilsverkäufe (hisseli), Startgebot immer aus dem Aushang.
- Auf jedem Bild stehen Quelle, Datenstand und der Hinweis „Keine Rechts- oder Anlageberatung“.

## Bildunterschrift, Instagram-SEO & Hashtags (`scripts/instagram/captions.mjs`)

Gleiche Fakten wie auf dem Bild, dann „Link in der Bio“ (`Link biyografide`), Quelle mit Datenstand, Hinweis zur Beratung, eine sachliche Instagram-SEO-Suchzeile (`Suchbegriffe: …` / `Arama terimleri: …`) und deduplizierte High-Intent-Hashtags:

- **Basis-Hashtags DE:** `#zwangsversteigerung #versteigerung #immobilien #immobilienkauf #amtsgericht #belowmark` + Bundesland + Ort + regionale Kombinationen (`#immobilien<ort>`, `#zwangsversteigerung<ort>`) + Objektart-/Themen-Tags (`#einfamilienhaus`, `#eigentumswohnung`, `#mehrfamilienhaus`, `#zvg`, `#verkehrswert`, `#kapitalanlageimmobilien`).
- **Basis-Hashtags TR:** `#icra #icradansatılık #ihale #gayrimenkul #emlak #belowmark` + İl + İlçe + regionale Kombinationen (`#<il>emlak`, `#<il>icra`) + Objektart-/Themen-Tags (`#satılıkdaire`, `#müstakilev`, `#uyapesatış`, `#açıkartırma`, `#emlakyatırımı`).

## Meta Ads & täglicher Autopilot (`scripts/instagram/ads.mjs` & `scripts/instagram-autopilot.mjs`)

Jeder Lauf erzeugt zusätzlich zu den Bildern (`*-feed.png` 4:5 und `*-story.png` 9:16) und Bildunterschriften (`*.txt`):

- `<lang>-<thema>-ad.txt` und `marketing/instagram/<datum>/ads.json`: fertige Meta-Ads-Vorlagen (Instagram/Facebook Feed 4:5 & Story 9:16) mit Headline, Primary Text, Link-Description, `LEARN_MORE`-CTA, UTM-Ziel-URLs (`belowmark.com/de?...` / `belowmark.com/tr?...`) und Zielgruppen-Targeting.
- `marketing/instagram/latest.json` und `marketing/instagram/week-plan.json`: Manifest für den 7-Tage-Wochenplan (`belowmark_de` und `belowmark_tr`).
- **Täglicher Autopilot (`npm run insta:autopilot`):**
  1. Prüft das Alter der Snapshots (`data/snapshots/de.json`, `tr.json`) und führt bei Bedarf automatisch `npm run sync` aus.
  2. Rendert alle 3 Themen für heute sowie die 7-Tage-Wochenvorschau.
  3. Synchronisiert die offiziellen 4:5- und 9:16-Karten, Captions, 7-Tage-Wochenpläne und Meta-Ads-Varianten analog zu ImanTree (`imantree_de` / `imantree_tr`) in das PYCIE Social- & Ads-System (`belowmark_de` / `belowmark_tr`).
  4. Läuft täglich automatisch über die Windows-Aufgabenplanung (`\PYCIE_Belowmark_Daily_Instagram` um 07:15 Uhr).
