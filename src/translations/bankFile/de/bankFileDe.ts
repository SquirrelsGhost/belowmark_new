import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_DE: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Bankenmappe — Belowmark",
      description: "Finanzierungsanfrage für ein Versteigerungsobjekt: Betrag, Eigenkapital, Zahlungsplan nach Zuschlag und Sicherheitsleistung — jede Zahl mit Quelle.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Bankenmappe", "Finanzierung", "Zwangsversteigerung"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Finanzierung",
    Title: "Bankenmappe",
    Lead: {
      DE: "Die Sicherheitsleistung brauchen Sie im Termin, den Rest bis zum Verteilungstermin. Die Mappe legt der Bank alles auf einmal vor: Betrag, Eigenkapital, Zahlungsplan nach Gesetz und was die Bank für die Sicherheitsleistung tun muss. Eine Zusage ersetzt sie nicht — die gibt nur die Bank.",
      TR: "Den Teminat zahlen Sie vor dem Bieten, den Rest binnen 7 Tagen nach dem Protokoll. Die Mappe legt der Bank alles auf einmal vor: Betrag, Eigenkapital und Zahlungsplan nach Gesetz. Eine Kreditzusage ersetzt sie nicht — die gibt nur die Bank.",
    },
    Button: "Bankenmappe öffnen",
    ButtonHint: "Öffnet die Mappe in einem neuen Tab. Dort tragen Sie Gebot, Eigenkapital und den Weg der Sicherheitsleistung ein und speichern sie als PDF.",
  },

  File: {
    Kicker: "Finanzierungsanfrage · Zwangsversteigerung",
    Title: "Bankenmappe",
    PrintedAt: "Erstellt am {date}",
    DataAsOf: "Datenstand der Bekanntmachung {date}",
    Print: "Drucken / als PDF",
    PrintHint: "Im Druckdialog „Als PDF speichern“ wählen.",
    Back: "Zurück zum Aktenblatt",
    Locked: "Die Bankenmappe gehört zum Investor-Plan",
    NoValue: "nicht angegeben",
    Sections: {
      ask: "Anfrage an die Bank",
      request: "Finanzierungsbedarf",
      schedule: "Zahlungsplan ab dem Termin",
      deposit: "Sicherheitsleistung — was die Bank tun muss",
      collateral: "Sicherheit für die Bank — wann sie entsteht",
      object: "Objekt und Verkehrswert",
      risks: "Rechte und Risiken",
      limit: "Herleitung des Höchstgebots",
      documents: "Unterlagen für die Bank",
      notThis: "Was diese Mappe nicht ist",
      sources: "Quellen",
    },
  },

  Form: {
    Title: "Ihre Angaben für die Mappe",
    Lead: "Alles startet leer. Eigenkapital, Zins und Tilgung teilt sich die Mappe mit dem Bietlimit-Rechner — eine Änderung hier gilt auch dort.",
    StorageHint: "Gespeichert nur in diesem Browser. Diese Eingaben werden nicht gedruckt, nur das Ergebnis.",
    Fields: {
      plannedBid: { label: "Geplantes Höchstgebot", hint: "Leer lassen, um Ihr Bietlimit zu übernehmen." },
      equity: { label: "Eigenkapital", hint: "Was Sie selbst einbringen, inklusive Sicherheitsleistung." },
      interestPct: { label: "Rechenzins", hint: "Ihre Annahme. Den echten Zins nennt die Bank." },
      repaymentPct: { label: "Anfängliche Tilgung", hint: "Pro Jahr, in Prozent des Darlehens." },
      fixedYears: { label: "Gewünschte Zinsbindung", hint: "" },
    },
    Applicant: { label: "Antragsteller (optional)", hint: "Erscheint in der Anfrage. Bleibt in diesem Browser.", placeholder: "Vor- und Nachname" },
    Method: { label: "Sicherheitsleistung über", empty: "noch offen" },
    Methods: {
      cheque: "Bundesbank- / Verrechnungsscheck",
      guarantee: "Bankbürgschaft",
      transfer: "Überweisung an die Gerichtskasse",
      portal: "e-Satış-Portal",
    },
    Use: { label: "Nutzung", empty: "noch offen" },
    Uses: { own: "Selbst bewohnen", rent: "Vermieten", resale: "Weiterverkaufen" },
    YearsSuffix: "Jahre",
    Reset: "Angaben der Mappe löschen",
  },

  Ask: {
    Salutation: "Sehr geehrte Damen und Herren,",
    Intro: "ich beabsichtige, im Zwangsversteigerungsverfahren {fileNo} beim {court} auf das Objekt {object} zu bieten. Termin: {date}. Verkehrswert laut Bekanntmachung: {value}.",
    Applicant: "Antragsteller: {name}",
    NoApplicant: "Antragsteller: ______________________",
    Requests: {
      loan: "Finanzierung über {amount} — Gesamtkosten {total} abzüglich Eigenkapital {equity} (Aufstellung in Abschnitt 02).",
      guarantee: "Eine unbefristete, unbedingte und selbstschuldnerische Bürgschaft über {amount} als Sicherheitsleistung für den Termin (§ 69 Abs. 3 ZVG).",
      cheque: "Einen Bundesbank- oder Verrechnungsscheck über {amount}, ausgestellt frühestens am dritten Werktag vor dem Termin (§ 69 Abs. 2 ZVG).",
      transfer: "Eine Überweisung über {amount} an die Gerichtskasse, so dass sie vor dem Termin gutgeschrieben ist, samt Nachweis (§ 69 Abs. 4 ZVG).",
      portal: "Bereitstellung des Teminat über {amount} vor dem Bieten im e-Satış-Portal.",
      timing: "Eine schriftliche Finanzierungsbestätigung vor dem Termin, weil die Zahlungen danach fest an die Fristen in Abschnitt 03 gebunden sind.",
    },
    MissingBid: "Höchstgebot fehlt — tragen Sie es oben ein oder berechnen Sie Ihr Bietlimit.",
    MissingEquity: "Eigenkapital fehlt — ohne es lässt sich der Darlehensbetrag nicht nennen.",
    MissingMethod: "Weg der Sicherheitsleistung ist noch offen.",
    Closing: "Für Rückfragen und eine Besichtigung des Gutachtens stehe ich gern zur Verfügung.",
  },

  Request: {
    UsesTitle: "Mittelverwendung",
    SourcesTitle: "Mittelherkunft",
    Bid: "Höchstgebot",
    BidFromLimit: "aus Ihrem Bietlimit",
    BidOwn: "Ihre Angabe",
    Total: "Gesamtkosten",
    Equity: "Eigenkapital",
    Loan: "Darlehensbedarf",
    LoanToValue: "Darlehen zum Verkehrswert",
    LoanToValueNote: "Verkehrswert laut Gericht — die Bank ermittelt ihren eigenen Beleihungswert.",
    EquityShare: "Eigenkapitalquote",
    TermsTitle: "Wünsche zu den Konditionen",
    Interest: "Rechenzins",
    InterestNote: "Ihre Annahme, kein Angebot",
    Repayment: "Anfängliche Tilgung",
    MonthlyRate: "Rate bei Ihrem Rechenzins",
    FixedYears: "Zinsbindung",
    Use: "Nutzung",
    Incomplete: "Eine gesetzliche Kostenposition fehlt (z. B. kein Steuersatz in der Bekanntmachung) — die Gesamtkosten sind zu niedrig.",
    EquityShortForDeposit: "Ihr Eigenkapital deckt die Sicherheitsleistung nicht. Dann muss die Bank sie vorfinanzieren oder eine Bürgschaft stellen.",
    Guarantee: "Zusätzlich: Bürgschaft für die Sicherheitsleistung",
    GuaranteeBasis: "§ 69 Abs. 3 ZVG",
  },

  Schedule: {
    Columns: { when: "Wann", what: "Was", amount: "Betrag" },
    Steps: {
      DE: {
        deposit: { when: "Im Termin, direkt nach dem Gebot", text: "Sicherheitsleistung: ein Zehntel des Verkehrswerts, wenn ein Beteiligter sie verlangt. Rechnen Sie damit.", basis: "§§ 67, 68 Abs. 1 ZVG", law: "zvg68" },
        balance: { when: "Vor dem Verteilungstermin (Datum setzt das Gericht nach dem Zuschlag)", text: "Bargebot an die Gerichtskasse — gutgeschrieben vor dem Termin, Nachweis im Termin. Eine an die Gerichtskasse überwiesene Sicherheit wird angerechnet.", basis: "§ 49 Abs. 3, § 107 Abs. 3 ZVG", law: "zvg49" },
        bidInterest: { when: "Mit dem Bargebot", text: "4 % Zinsen auf das Bargebot vom Zuschlag bis zum Verteilungstermin.", basis: "§ 49 Abs. 2 ZVG i. V. m. § 246 BGB", law: "zvg49" },
        transferTax: { when: "Einen Monat nach dem Steuerbescheid", text: "Grunderwerbsteuer auf Gebot und bestehen bleibende Rechte.", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Nach Kostenrechnung des Gerichts", text: "Gebühr für die Erteilung des Zuschlags.", basis: "KV 2214 GKG" },
        registryFee: { when: "Nach der Eintragung", text: "Eintragung als Eigentümer im Grundbuch.", basis: "KV 14110 GNotKG" },
        own: { when: "Nach Ihrem Plan", text: "Sanierung, Räumung und Sonstiges.", basis: "Ihre Angabe" },
      },
      TR: {
        deposit: { when: "Vor dem Bieten", text: "Teminat im e-Satış-Portal.", basis: "İİK m.114/7", law: "esatis" },
        balance: { when: "Binnen 7 Tagen nach Bekanntgabe des Versteigerungsprotokolls", text: "Restlicher Preis (Gebot minus Teminat), bar. Keine Verlängerung.", basis: "İİK m.130", law: "iik" },
        fees: { when: "Laut Aufforderung des Vollstreckungsamts, vor der Eintragung", text: "KDV, Tapu-Gebühr, Stempelsteuer, Döner sermaye.", basis: "Verkaufsbedingungen (şartname)" },
        own: { when: "Nach Ihrem Plan", text: "Sanierung, Räumung und Sonstiges.", basis: "Ihre Angabe" },
      },
    },
    BalanceGuaranteeNote: "Bei einer Bürgschaft wird nichts angerechnet — das volle Bargebot ist zu zahlen.",
    BalanceOpenNote: "Weg der Sicherheitsleistung offen — ohne Anrechnung gerechnet.",
    MissingInterestDays: "Tage bis zum Verteilungstermin im Bietlimit eintragen",
    Unknown: "nicht berechenbar",
    Footnote: {
      DE: "Die Daten nach dem Zuschlag setzen Gericht und Finanzamt. Die Mappe nennt deshalb die gesetzliche Reihenfolge, kein erfundenes Datum.",
      TR: "Die Frist von 7 Tagen läuft ab der Bekanntgabe des Protokolls im Portal, nicht ab dem Versteigerungstag.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Höhe: ein Zehntel des Verkehrswerts (§ 68 Abs. 1 ZVG). Bargeld ist ausgeschlossen (§ 69 Abs. 1 ZVG). Zulässig sind genau diese drei Wege:",
      TR: "Der Teminat wird vor dem Bieten im e-Satış-Portal hinterlegt. Welche Formen das Vollstreckungsamt annimmt, steht in den Verkaufsbedingungen (şartname) der Anzeige.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Bundesbank- oder Verrechnungsscheck", text: "Ausgestellt von einem in Deutschland zugelassenen Kreditinstitut oder der Bundesbank, im Inland zahlbar, frühestens am dritten Werktag vor dem Termin. Ein früher ausgestellter Scheck wird zurückgewiesen.", basis: "§ 69 Abs. 2 ZVG", law: "zvg69" },
        { id: "guarantee", title: "Bankbürgschaft", text: "Unbefristet, unbedingt und selbstschuldnerisch, von einem solchen Kreditinstitut, im Inland zu erfüllen. Die Bank kann dafür eine Gebühr (Avalprovision) verlangen.", basis: "§ 69 Abs. 3 ZVG", law: "zvg69" },
        { id: "transfer", title: "Überweisung an die Gerichtskasse", text: "Der Betrag muss vor dem Termin auf dem Konto der Gerichtskasse gutgeschrieben sein, der Nachweis im Termin vorliegen. Kontoverbindung und Verwendungszweck nennt das Gericht.", basis: "§ 69 Abs. 4 ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "Teminat im e-Satış-Portal", text: "Vor dem Bieten im Portal zu hinterlegen, Anmeldung über e-Devlet. Er wird auf den Preis angerechnet; wer nach dem Zuschlag nicht zahlt, verliert ihn.", basis: "İİK m.114/7, m.130", law: "esatis" }],
    },
    Chosen: "gewählt",
  },

  Collateral: {
    Lead: {
      DE: "Banken zögern bei Zwangsversteigerungen vor allem aus einem Grund: Sie zahlen, bevor ihre Grundschuld im Grundbuch steht. So sieht der Ablauf nach Gesetz aus:",
      TR: "Banken zögern bei İcra-Versteigerungen vor allem aus einem Grund: Sie müssten binnen 7 Tagen zahlen, ihre Hypothek kommt erst nach der Eintragung. So sieht der Ablauf nach Gesetz aus:",
    },
    Items: {
      DE: [
        { text: "Mit dem Zuschlag werden Sie Eigentümer — ohne Notarvertrag und vor jeder Eintragung.", basis: "§ 90 Abs. 1 ZVG" },
        { text: "Eine Grundschuld für die Bank können Sie nach dem Zuschlag bewilligen. Eingetragen wird sie aber erst, nachdem das Gericht das Grundbuchamt ersucht hat, Sie als Eigentümer einzutragen.", basis: "§ 130 Abs. 3 ZVG", law: "zvg130" },
        { text: "Dieses Ersuchen stellt das Gericht erst, wenn der Teilungsplan ausgeführt und der Zuschlag rechtskräftig ist — also nach dem Verteilungstermin.", basis: "§ 130 Abs. 1 ZVG", law: "zvg130" },
        { text: "Für Ihre Eintragung braucht das Grundbuchamt die Unbedenklichkeitsbescheinigung des Finanzamts; sie setzt in der Regel die bezahlte Grunderwerbsteuer voraus.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "Zahlen Sie das Bargebot nicht, überträgt das Gericht die Forderung auf die Berechtigten, sichert sie mit Sicherungshypotheken an Ihrem Grundstück, und es droht die Wiederversteigerung.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "Wie die Bank die Zeit bis zur Eintragung absichert — etwa Grundschuld direkt nach dem Zuschlag notariell bestellen und an die Gerichtskasse auszahlen — entscheidet die Bank.", basis: "Entscheidung der Bank" },
      ],
      TR: [
        { text: "Der Teminat wird vor dem Bieten im Portal hinterlegt und auf den Preis angerechnet.", basis: "İİK m.114/7", law: "iik" },
        { text: "Den restlichen Preis zahlen Sie binnen 7 Tagen nach Bekanntgabe des Protokolls im Portal bar. Eine Verlängerung gibt es seit der Reform 2021 nicht mehr.", basis: "İİK m.130 (Kanun Nr. 7343)", law: "iik" },
        { text: "Eingetragen (tescil) werden Sie erst, wenn der Zuschlag endgültig ist. Erst danach kann eine Hypothek (ipotek) für die Bank eingetragen werden.", basis: "İİK m.134", law: "iik" },
        { text: "Zahlen Sie nicht, verfällt der Teminat. Für Versteigerungen, die ab dem 31.07.2026 angezeigt wurden, sieht das Gesetz zusätzlich ein Bußgeld von 5 % des Gebots vor.", basis: "İİK m.114 Abs. 7 Nr. 9 (Kanun Nr. 7589)", law: "iik" },
        { text: "Folge: Ohne Kreditzusage (ön onay) vor dem Bieten ist die Frist von 7 Tagen mit einer Bank kaum einzuhalten.", basis: "Fristen İİK m.130, m.134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Eckdaten aus dem Gutachten",
    NoReport: "Kein Gutachten hochgeladen. Laden Sie es auf dem Aktenblatt hoch — die Bank verlangt es ohnehin vollständig.",
    ReportFrom: "aus „{file}“, wörtlich mit Seite",
    RisksLead: "Risiko-Ampel aus Bekanntmachung und Gutachten. Grau heißt: keine Quelle sagt etwas dazu.",
    RiskFrom: { notice: "Bekanntmachung", report: "Gutachten S. {pages}", none: "keine Quelle" },
  },

  Documents: {
    Lead: "Was Banken üblicherweise sehen wollen. Jede Bank hat ihre eigene Liste — fragen Sie danach.",
    Groups: {
      DE: [
        { title: "Zum Objekt", items: ["Vollständiges Verkehrswertgutachten (bei Gericht oder auf zvg-portal.de)", "Terminsbestimmung / Bekanntmachung", "Grundbuchauszug (meist Anlage des Gutachtens)", "Flurkarte und Wohnflächenberechnung", "Mietverträge, falls vermietet", "Kostenplan für Sanierung, falls geplant"] },
        { title: "Zu Ihnen", items: ["Personalausweis", "Einkommensnachweise der letzten Monate", "Steuerbescheide", "Nachweis des Eigenkapitals", "Selbstauskunft der Bank", "Aufstellung bestehender Kredite"] },
      ],
      TR: [
        { title: "Zum Objekt", items: ["Versteigerungsanzeige und Verkaufsbedingungen (şartname)", "Bewertungsgutachten (kıymet takdir raporu)", "Tapu-Auszug und Parzellendaten (ada / parsel)", "Fotos und Lageplan, falls vorhanden"] },
        { title: "Zu Ihnen", items: ["Kimlik / Reisepass", "Einkommensnachweise", "Steuernummer", "Nachweis des Eigenkapitals"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Keine Kreditzusage und kein Angebot. Ob und zu welchen Konditionen finanziert wird, entscheidet allein die Bank.", basis: "—" },
      { text: "Keine Kreditvermittlung. Belowmark vermittelt keine Darlehen und spricht für Sie mit keiner Bank.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Kein Beleihungswert. Der Verkehrswert stammt aus dem Gerichtsgutachten; die Bank bewertet selbst.", basis: "BelWertV" },
      { text: "Keine Rechtsberatung. Gesetzesstellen sind zum Nachlesen verlinkt.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Amtliche Bekanntmachung",
    document: "Bekanntmachung (PDF)",
    zvg: "Zwangsversteigerungsgesetz (ZVG)",
    grestg: "Grunderwerbsteuergesetz (GrEStG)",
    gewo: "Gewerbeordnung § 34i",
    iik: "İcra ve İflas Kanunu (İİK)",
    esatis: "UYAP e-Satış",
  },
};
