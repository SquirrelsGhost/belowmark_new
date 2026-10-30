import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Task texts in German, for both markets. Every statement has its source in closingTasks.ts. */
export const CLOSING_TASKS_DE: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Zuschlagsbeschluss sichern",
      detail:
        "Mit dem Zuschlag werden Sie Eigentümer, schon vor der Eintragung im Grundbuch (§ 90 ZVG). Lassen Sie sich den Beschluss aushändigen oder zuschicken und heben Sie ihn auf: Er ist später auch der Titel für eine Räumung. Die Zuschlagsgebühr (0,5 Gebühr, KV 2214 GKG) stellt das Gericht gesondert in Rechnung.",
    },
    "de.appeal": {
      title: "Rechtskraft abwarten",
      detail:
        "Gegen den Zuschlag gibt es die sofortige Beschwerde. Für alle, die im Termin oder Verkündungstermin anwesend waren, beginnt die Frist mit der Verkündung (§ 98 ZVG) und beträgt zwei Wochen (§ 569 ZPO). Für Abwesende läuft sie erst ab Zustellung — die Rechtskraft kann also später eintreten. Bis dahin keine Aufträge vergeben, die Sie nicht zurücknehmen können.",
    },
    "de.risk": {
      title: "Objekt ab heute als Ihres behandeln",
      detail:
        "Die Gefahr des zufälligen Untergangs geht mit dem Zuschlag auf Sie über, ebenso Nutzungen und Lasten (§ 56 ZVG). Prüfen Sie, ob das Objekt gesichert ist (Leerstand, Frost, Zugang), und dokumentieren Sie den Zustand mit Fotos und Datum.",
    },
    "de.insurerNotice": {
      title: "Gebäudeversicherer informieren",
      detail:
        "Eine bestehende Gebäudeversicherung geht auf Sie über (§ 99 i. V. m. § 95 VVG). Die Veräußerung ist dem Versicherer unverzüglich anzuzeigen; sonst kann er leistungsfrei werden (§ 97 VVG). Fragen Sie beim Vollstreckungsgericht oder im Gutachten nach Versicherer und Versicherungsnummer. Gibt es keinen Vertrag, sofort selbst versichern.",
    },
    "de.insuranceCancel": {
      title: "Übernommene Versicherung prüfen, ggf. kündigen",
      detail:
        "Sie dürfen den übernommenen Vertrag sofort oder zum Ende der Versicherungsperiode kündigen, aber nur innerhalb eines Monats nach dem Erwerb; kannten Sie den Vertrag nicht, ab Kenntnis (§ 96 Abs. 2 VVG). Kündigen Sie nur, wenn der neue Schutz lückenlos anschließt.",
    },
    "de.charges": {
      title: "Laufende Kosten übernehmen",
      detail:
        "Ab dem Zuschlag tragen Sie die Lasten (§ 56 ZVG): Grundsteuer anteilig, Hausgeld bei Wohnungseigentum, Strom, Wasser, Heizung. Zählerstände festhalten, Versorger und ggf. WEG-Verwaltung informieren. Hausgeldrückstände des Voreigentümers werden aus dem Erlös bedient (Rangklasse 2, § 10 Abs. 1 Nr. 2 ZVG); eine dingliche Haftung des Erwerbers begründet das Vorrecht nach BGH (V ZR 209/12) nicht.",
    },
    "de.interest": {
      title: "Zinslauf auf das Bargebot beachten",
      detail:
        "Das Bargebot ist vom Zuschlag an zu verzinsen (§ 49 Abs. 2 ZVG), mit 4 % im Jahr (§ 246 BGB). Die Zinsen laufen bis zur Zahlung. Ob eine frühere Hinterlegung bei Gericht (§ 49 Abs. 4 ZVG) für Sie sinnvoll ist, klären Sie mit dem Rechtspfleger.",
    },
    "de.summons": {
      title: "Ladung zum Verteilungstermin eintragen",
      detail:
        "Nach dem Zuschlag bestimmt das Gericht den Verteilungstermin und lädt Sie als Ersteher; die Ladung muss mindestens zwei Wochen vorher zugehen (§ 105 ZVG). Tragen Sie das Datum oben ein — daraus rechnet die Liste Zahlung und Termin.",
    },
    "de.financing": {
      title: "Auszahlung mit der Bank abstimmen",
      detail:
        "Belowmark-Regel: zwei Wochen vor dem Verteilungstermin sollte die Bank den Abruf kennen. Geben Sie ihr Aktenzeichen, Gerichtskasse und Verwendungszweck aus der Ladung. Die Bankenmappe fasst das für Ihre Bank zusammen.",
    },
    "de.pay": {
      title: "Bargebot überweisen",
      detail:
        "Das Bargebot ist vor dem Verteilungstermin zu entrichten, per Überweisung an die Gerichtskasse; der Betrag muss vor dem Termin gutgeschrieben sein und der Nachweis im Termin vorliegen (§ 49 Abs. 1, 3 ZVG). Bar zahlen geht nicht. Die Liste setzt die Überweisung fünf Tage vorher an — das ist eine Sicherheitsreserve, keine gesetzliche Frist.",
    },
    "de.attend": {
      title: "Verteilungstermin",
      detail:
        "Nachweis der Zahlung mitbringen (§ 49 Abs. 3 ZVG). Im Termin wird der Teilungsplan aufgestellt und ausgeführt — das ist eine Voraussetzung für Ihre Eintragung (§ 130 ZVG).",
    },
    "de.default": {
      title: "Wissen, was bei Nichtzahlung passiert",
      detail:
        "Zahlen Sie nicht, wird der Teilungsplan durch Übertragung der Forderung gegen Sie auf die Berechtigten ausgeführt (§ 118 ZVG). Die Gläubiger können dann sofort die Wiederversteigerung gegen Sie betreiben, ohne neuen Titel (§ 133 ZVG). Sie bleiben Eigentümer und Schuldner — ein Rücktritt ist nicht vorgesehen.",
    },
    "de.taxNotice": {
      title: "Grunderwerbsteuer zahlen",
      detail:
        "Das Gericht zeigt den Zuschlag dem Finanzamt an (§ 18 Abs. 1 Nr. 3 GrEStG). Die Steuer wird einen Monat nach Bekanntgabe des Bescheids fällig (§ 15 GrEStG). Tragen Sie das Bescheiddatum oben ein.",
    },
    "de.clearance": {
      title: "Unbedenklichkeitsbescheinigung",
      detail:
        "Ohne sie werden Sie nicht ins Grundbuch eingetragen (§ 22 Abs. 1 GrEStG). Das Finanzamt erteilt sie, wenn die Steuer gezahlt, sichergestellt oder gestundet ist (§ 22 Abs. 2 GrEStG), und schickt sie in der Regel dem Gericht oder Grundbuchamt. Nachfragen, wenn nach der Zahlung Wochen vergehen.",
    },
    "de.courtFees": {
      title: "Gerichtskosten bezahlen",
      detail:
        "Zuschlagsgebühr (0,5 Gebühr nach KV 2214 GKG, Wert: Meistgebot plus bestehen bleibende Rechte) und später die Gebühr für Ihre Eintragung (1,0 Gebühr nach KV 14110 GNotKG). Die Bietlimit-Rechnung auf dem Aktenblatt zeigt die Beträge.",
    },
    "de.registry": {
      title: "Grundbuchersuchen abwarten",
      detail:
        "Ist der Teilungsplan ausgeführt und der Zuschlag rechtskräftig, ersucht das Gericht das Grundbuchamt, Sie als Eigentümer einzutragen und die erloschenen Rechte sowie den Versteigerungsvermerk zu löschen (§ 130 Abs. 1 ZVG). Eine Grundschuld für Ihre Bank wird erst danach eingetragen (§ 130 Abs. 3 ZVG).",
    },
    "de.extract": {
      title: "Grundbuchauszug prüfen",
      detail:
        "Nach der Eintragung einen Auszug anfordern: Stehen Sie als Eigentümer drin? Sind Versteigerungsvermerk und erloschene Rechte gelöscht? Stehen nur die Rechte noch drin, die nach den Versteigerungsbedingungen bestehen bleiben?",
    },
    "de.eviction": {
      title: "Räumung aus dem Zuschlagsbeschluss",
      detail:
        "Gegen den Besitzer, etwa den bisherigen Eigentümer, ist der Zuschlagsbeschluss selbst der Räumungstitel (§ 93 Abs. 1 ZVG). Sie brauchen eine vollstreckbare Ausfertigung mit Zustellung (§ 750 ZPO) und beauftragen den Gerichtsvollzieher (§ 885 ZPO); ein beschränkter Auftrag nach § 885a ZPO kann Kosten sparen. Nicht gegen Besitzer mit einem Recht, das den Zuschlag überdauert (§ 93 Abs. 1 S. 2 ZVG). Verwendungen vor dem Zuschlag müssen Sie nicht ersetzen (§ 93 Abs. 2 ZVG).",
    },
    "de.tenantTakeover": {
      title: "Mietverhältnis übernehmen",
      detail:
        "Bestehende Miet- und Pachtverträge gehen auf Sie über (§ 57 ZVG i. V. m. § 566 BGB). Mieter schriftlich über den Eigentümerwechsel und das neue Konto informieren. Für die Rückgabe einer Kaution können Sie einstehen müssen, auch wenn Sie sie nie erhalten haben (§ 566a BGB) — Kautionsnachweis erfragen.",
    },
    "de.tenantNotice": {
      title: "Sonderkündigung: nur zum ersten Termin",
      detail:
        "Sie dürfen mit der gesetzlichen Frist kündigen, aber nur zum ersten zulässigen Termin — sonst ist das Recht weg (§ 57a ZVG). Bei Wohnraum heißt das: Zugang spätestens am dritten Werktag eines Monats (§ 573c BGB). Der Kündigungsschutz bleibt: Sie brauchen ein berechtigtes Interesse, z. B. Eigenbedarf (§ 573 BGB). Das Datum hier ist vorsichtig gerechnet (Samstage zählen, Feiertage nicht berücksichtigt) — lassen Sie die Kündigung anwaltlich prüfen.",
    },
    "de.handover": {
      title: "Übergabe dokumentieren",
      detail:
        "Schlüssel, Zählerstände, Zustand mit Fotos, Mängel, zurückgelassene Gegenstände — mit Datum und Unterschrift. Schlösser tauschen, sobald Sie Besitz haben.",
    },
    "de.inspect": {
      title: "Bestand aufnehmen, Sanierung planen",
      detail:
        "Gewährleistung gibt es nicht (§ 56 ZVG). Vergleichen Sie den Zustand mit dem Gutachten und holen Sie Angebote ein, bevor Sie Aufträge vergeben. Die Bietlimit-Werte für Sanierung können Sie dann durch echte Angebote ersetzen.",
    },
    "de.energy": {
      title: "Nachrüstpflichten nach Eigentümerwechsel",
      detail:
        "Bei Ein- und Zweifamilienhäusern, die der Voreigentümer am 01.02.2002 selbst bewohnte, treffen bestimmte Nachrüstpflichten (z. B. Dämmung der obersten Geschossdecke) den neuen Eigentümer, mit zwei Jahren Frist ab dem Eigentumsübergang (bisher § 47 GEG). Das GEG wurde 2026 durch das Gebäudemodernisierungsgesetz abgelöst — prüfen Sie die aktuelle Fassung mit einem Energieberater.",
    },
    "de.permits": {
      title: "Genehmigungen vor dem Umbau klären",
      detail:
        "Ob ein Umbau, eine Nutzungsänderung oder Arbeiten an einem Denkmal genehmigt werden müssen, regelt das Landesrecht (Bauordnung, Denkmalschutzgesetz). Beim Bauamt nachfragen, bevor Arbeiten beginnen.",
    },
    "de.condo": {
      title: "WEG-Unterlagen anfordern",
      detail:
        "Bei Wohnungseigentum: Verwaltung über den Eigentümerwechsel informieren, Wirtschaftsplan, letzte Jahresabrechnung, Beschlüsse und Teilungserklärung anfordern (WEG). Achten Sie auf beschlossene Sonderumlagen.",
    },
  },
  TR: {
    "tr.pay": {
      title: "Zuschlagspreis (ihale bedeli) zahlen — 7 Tage",
      detail:
        "Kaufpreis und Kosten sind binnen sieben Tagen ab Bekanntgabe des Versteigerungsprotokolls (artırma sonuç tutanağı) zu zahlen, auch wenn jemand die Aufhebung beantragt hat (Elektronik Satış Yönetmeliği m.20/1; İİK m.130). Seit Kanun 7343 gibt es keine Verlängerung um zehn Tage mehr. Tragen Sie oben das Datum der Bekanntgabe ein.",
    },
    "tr.fees": {
      title: "Kosten nach Şartname bereitstellen",
      detail:
        "Tapu harcı beträgt je Seite 20 ‰ des Verkaufspreises (492 s. Harçlar Kanunu, Tarif 4 m.20/a). Steht in der Şartname, dass Tapu-Gebühren ganz beim Käufer liegen, hält das Justizministerium das für zulässig (İİDB, 12.01.2023) — dann sind es 40 ‰. Dazu KDV laut Ilan und Damga vergisi. Lesen Sie die Şartname Ihres Verfahrens.",
    },
    "tr.default": {
      title: "Wissen, was bei Nichtzahlung passiert",
      detail:
        "Wird nicht gezahlt, hebt die Vollstreckungsstelle die Ihale auf, und Sie haften für den Mindererlös (İİK m.133). Für Verkäufe, die ab dem 31.07.2026 bekannt gemacht wurden, kommt eine Strafe von 5 % des Gebots hinzu (İİK m.114 i. d. F. Kanun 7589).",
    },
    "tr.annulment": {
      title: "Frist für die Ihale-Aufhebung abwarten",
      detail:
        "Beteiligte können binnen sieben Tagen die Aufhebung der Ihale verlangen (ihalenin feshi, İİK m.134), in Sonderfällen ab Kenntnis, längstens ein Jahr. Solange ein Verfahren läuft, wird nicht eingetragen. Bis dahin keine Aufträge vergeben, die Sie nicht zurücknehmen können.",
    },
    "tr.registry": {
      title: "Eintragung (tescil) verfolgen",
      detail:
        "Ist die Ihale rechtskräftig (kesinleşme) und bezahlt, schreibt die Vollstreckungsstelle an das Tapu-Amt, Sie einzutragen (İİK m.134). Fragen Sie nach, ob das Schreiben (tescil müzekkeresi) raus ist.",
    },
    "tr.deed": {
      title: "Tapu-Eintrag prüfen",
      detail:
        "Nach der Eintragung über e-Devlet (Tapu Bilgileri) prüfen: Stehen Sie als Eigentümer drin, und sind Pfändungen (haciz) und Hypotheken (ipotek) gelöscht?",
    },
    "tr.dask": {
      title: "Neue DASK-Police abschließen",
      detail:
        "Die Erdbebenversicherung ist Pflicht (6305 s. Kanun). Seit 05.09.2026 geht die Police des Voreigentümers nicht mehr über, sie endet mit der Eintragung (DASK-Bedingungen, RG 21.08.2026/33347). Schließen Sie eine eigene Police ab; Versorger verlangen sie oft für neue Anschlüsse. Ob das Tapu-Amt sie bei der Eintragung aus einer Ihale prüft, fragen Sie dort.",
    },
    "tr.propertyTax": {
      title: "Emlak vergisi klären",
      detail:
        "Der Eigentumsübergang ist ein Grund für eine Erklärung bei der Gemeinde (1319 s. Kanun m.23); steuerpflichtig werden Sie ab dem folgenden Jahr (m.33). Fragen Sie die Gemeinde, ob die Meldung des Tapu-Amts genügt, und lassen Sie sich offene Steuern des Objekts nennen.",
    },
    "tr.eviction": {
      title: "Räumung über die Vollstreckungsstelle",
      detail:
        "Wohnt der Schuldner oder jemand ohne Recht darin, stellt die Vollstreckungsstelle auf Ihren Antrag eine Räumungsaufforderung mit 15 Tagen Frist zu, danach wird geräumt (İİK m.135/2). Mieter mit einem amtlich datierten Vertrag aus der Zeit vor der Pfändung schützt das (siehe Mieter). Antrag nicht lange hinauszögern.",
    },
    "tr.tenant": {
      title: "Mieter: Vertrag geht über",
      detail:
        "Der neue Eigentümer wird Partei des Mietvertrags (TBK m.310). Wollen Sie wegen Eigenbedarf kündigen, müssen Sie das dem Mieter binnen eines Monats ab Erwerb schriftlich mitteilen und können frühestens nach sechs Monaten klagen (TBK m.351). Ab wann der Erwerb bei einer Ihale zählt, mit einem Anwalt klären — die Liste rechnet vorsichtig ab dem Ihale-Datum.",
    },
    "tr.handover": {
      title: "Übergabe dokumentieren",
      detail:
        "Schlüssel, Zählerstände, Zustand mit Fotos, mit Datum. Strom, Wasser und Gas auf sich ummelden (abonelik), Schlösser tauschen.",
    },
    "tr.inspect": {
      title: "Bestand aufnehmen, Sanierung planen",
      detail:
        "Vergleichen Sie den Zustand mit dem Gutachten (kıymet takdir raporu) und holen Sie Angebote ein, bevor Sie Aufträge vergeben.",
    },
    "tr.permits": {
      title: "Genehmigung für Umbauten",
      detail:
        "Für Umbauten kann eine Baugenehmigung (yapı ruhsatı) nötig sein (3194 s. İmar Kanunu m.21). Vorher bei der Gemeinde nachfragen.",
    },
    "tr.condo": {
      title: "Hausverwaltung informieren",
      detail:
        "Bei Eigentumswohnungen: Verwaltung (yönetim) informieren, Aidat und Hausordnung (yönetim planı) erfragen (634 s. Kat Mülkiyeti Kanunu).",
    },
  },
};
