import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_NL: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Bankdossier — Belowmark",
      description: "Financieringsaanvraag voor een executieveilingpand: leenbedrag, eigen vermogen, wettelijk betalingsschema na gunning en waarborgsom — elk cijfer onderbouwd met bron.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Bankdossier", "Financiering", "Executieveiling"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Financiering",
    Title: "Bankdossier",
    Lead: {
      DE: "Op de veilingzitting heeft u de waarborgsom nodig en uiterlijk bij de verdelingszitting het restbedrag. Dit dossier presenteert alles overzichtelijk in één keer aan de bank: financieringsbehoefte, eigen vermogen, wettelijk betalingsschema en wat de bank voor de waarborgsom moet aanleveren. Het vervangt geen financieringstoezegging — die kan alleen de bank afgeven.",
      TR: "De teminat betaalt u vóór het bieden en het restbedrag binnen 7 dagen na publicatie van het veilingprotocol. Dit dossier presenteert alles overzichtelijk aan de bank: financieringsbehoefte, eigen vermogen en het wettelijke betalingsschema. Het vervangt geen financieringstoezegging — die kan alleen de bank afgeven.",
    },
    Button: "Bankdossier openen",
    ButtonHint: "Opent het dossier in een nieuw tabblad. Vul uw geplande bod, eigen vermogen en de wijze van waarborgsom in en sla het op als PDF.",
  },

  File: {
    Kicker: "Financieringsaanvraag · Executieveiling",
    Title: "Bankdossier",
    PrintedAt: "Aangemaakt op {date}",
    DataAsOf: "Publicatiegegevens per {date}",
    Print: "Afdrukken / opslaan als PDF",
    PrintHint: "Kies in het afdrukvenster voor “Opslaan als PDF”.",
    Back: "Terug naar dossier",
    Locked: "Het Bankdossier is onderdeel van het Investor-abonnement",
    NoValue: "niet opgegeven",
    Sections: {
      ask: "Verzoek aan de bank",
      request: "Financieringsbehoefte",
      schedule: "Betalingsschema vanaf veilingdatum",
      deposit: "Waarborgsom — wat de bank moet regelen",
      collateral: "Zekerheid voor de bank — wanneer deze ontstaat",
      object: "Object en taxatiewaarde",
      risks: "Rechten en risico's",
      limit: "Onderbouwing van de biedlimiet",
      documents: "Documenten voor de bank",
      notThis: "Wat dit dossier niet is",
      sources: "Bronnen",
    },
  },

  Form: {
    Title: "Uw gegevens voor het dossier",
    Lead: "Alles begint leeg. Eigen vermogen, rentepercentage en aflossing worden gedeeld met de biedlimietcalculator — een wijziging hier geldt ook daar.",
    StorageHint: "Wordt uitsluitend in deze browser opgeslagen. Deze invoervelden worden niet afgedrukt, alleen het overzicht dat eruit voortkomt.",
    Fields: {
      plannedBid: { label: "Gepland maximumbod", hint: "Laat leeg om uw berekende biedlimiet over te nemen." },
      equity: { label: "Eigen vermogen", hint: "Wat u zelf inbrengt, inclusief de waarborgsom." },
      interestPct: { label: "Aangenomen rente", hint: "Uw eigen aanname. De bank offreert de daadwerkelijke rente." },
      repaymentPct: { label: "Aanvangs­aflossing", hint: "Per jaar, als percentage van de lening." },
      fixedYears: { label: "Gewenste rentevaste periode", hint: "" },
    },
    Applicant: { label: "Aanvrager (optioneel)", hint: "Verschijnt in het verzoek. Blijft in deze browser.", placeholder: "Voor- en achternaam" },
    Method: { label: "Waarborgsom via", empty: "nog niet gekozen" },
    Methods: {
      cheque: "Bundesbank- / gecertificeerde bankcheque",
      guarantee: "Bankgarantie",
      transfer: "Overschrijving naar de gerechtskas",
      portal: "e-Satış-portaal",
    },
    Use: { label: "Beoogd gebruik", empty: "nog niet gekozen" },
    Uses: { own: "Eigen bewoning", rent: "Verhuur", resale: "Doorverkoop" },
    YearsSuffix: "jaar",
    Reset: "Dossierinvoer wissen",
  },

  Ask: {
    Salutation: "Geachte heer/mevrouw,",
    Intro: "Ik ben voornemens te bieden op het object {object} in de executieveilingprocedure {fileNo} bij {court}. Veilingdatum: {date}. Taxatiewaarde volgens officiële bekendmaking: {value}.",
    Applicant: "Aanvrager: {name}",
    NoApplicant: "Aanvrager: ______________________",
    Requests: {
      loan: "Een financiering van {amount} — totale kosten van {total} minus eigen vermogen van {equity} (specificatie in onderdeel 02).",
      guarantee: "Een onbeperkte, onvoorwaardelijke en direct opeisbare bankgarantie van {amount} als waarborgsom voor de zitting (§ 69 lid 3 ZVG).",
      cheque: "Een Bundesbank- of gecertificeerde bankcheque ter hoogte van {amount}, afgegeven op zijn vroegst op de derde werkdag vóór de zitting (§ 69 lid 2 ZVG).",
      transfer: "Een overschrijving van {amount} naar de gerechtskas die vóór de zitting is bijgeschreven, inclusief betalingsbewijs (§ 69 lid 4 ZVG).",
      portal: "Storting van de teminat van {amount} vóór het bieden in het e-Satış-portaal.",
      timing: "Een schriftelijke financieringsbevestiging vóór de zitting, aangezien betalingen na gunning strikt gebonden zijn aan de wettelijke termijnen in onderdeel 03.",
    },
    MissingBid: "Maximumbod ontbreekt — vul dit hierboven in of bereken uw biedlimiet.",
    MissingEquity: "Eigen vermogen ontbreekt — zonder dit bedrag kan de vereiste lening niet worden vastgesteld.",
    MissingMethod: "De wijze van waarborgsom is nog niet gekozen.",
    Closing: "Voor nadere vragen en het toesturen van het volledige taxatierapport ben ik uiteraard graag beschikbaar.",
  },

  Request: {
    UsesTitle: "Bestedingsdoel",
    SourcesTitle: "Financieringsbronnen",
    Bid: "Maximumbod",
    BidFromLimit: "uit uw biedlimiet",
    BidOwn: "uw invoer",
    Total: "Totale kosten",
    Equity: "Eigen vermogen",
    Loan: "Financieringsbehoefte",
    LoanToValue: "Belening t.o.v. taxatiewaarde",
    LoanToValueNote: "Taxatiewaarde volgens de rechtbank — de bank bepaalt zelf haar eigen onderpandwaarde.",
    EquityShare: "Aandeel eigen vermogen",
    TermsTitle: "Gewenste condities",
    Interest: "Aangenomen rente",
    InterestNote: "Uw aanname, geen offerte",
    Repayment: "Aanvangsaflossing",
    MonthlyRate: "Maandlast op basis van uw aangenomen rente",
    FixedYears: "Rentevaste periode",
    Use: "Beoogd gebruik",
    Incomplete: "Een wettelijke kostenpost ontbreekt (bijv. geen belastingtarief in de bekendmaking) — de totale kosten zijn daardoor te laag weergegeven.",
    EquityShortForDeposit: "Uw eigen vermogen dekt de waarborgsom niet. De bank moet deze voorfinancieren of een bankgarantie afgeven.",
    Guarantee: "Aanvullend: bankgarantie voor de waarborgsom",
    GuaranteeBasis: "§ 69 lid 3 ZVG",
  },

  Schedule: {
    Columns: { when: "Wanneer", what: "Wat", amount: "Bedrag" },
    Steps: {
      DE: {
        deposit: { when: "Op de zitting, direct na het bieden", text: "Waarborgsom: een tiende van de taxatiewaarde indien een belanghebbende daarom verzoekt. Ga ervan uit dat deze wordt verlangd.", basis: "§§ 67, 68 lid 1 ZVG", law: "zvg68" },
        balance: { when: "Vóór de verdelingszitting (datum door de rechtbank bepaald na gunning)", text: "Contant bod te voldoen aan de gerechtskas — vóór de zitting bijgeschreven, betalingsbewijs op de zitting overleggen. Een vooraf naar de gerechtskas overgemaakte waarborgsom wordt verrekend.", basis: "§ 49 lid 3, § 107 lid 3 ZVG", law: "zvg49" },
        bidInterest: { when: "Samen met het contante bod", text: "4% rente over het contante bod vanaf de datum van gunning tot aan de verdelingszitting.", basis: "§ 49 lid 2 ZVG jo. § 246 BGB", law: "zvg49" },
        transferTax: { when: "Eén maand na de belastingaanslag", text: "Overdrachtsbelasting over het bod en eventueel in stand blijvende rechten op het object.", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Na ontvangst van de griffiekostenfactuur", text: "Gerechtskosten voor het verlenen van de gunning.", basis: "KV 2214 GKG" },
        registryFee: { when: "Na inschrijving", text: "Inschrijving als eigenaar in het kadaster (Grundbuch).", basis: "KV 14110 GNotKG" },
        own: { when: "Volgens uw planning", text: "Renovatie, ontruiming en overige kosten.", basis: "Uw invoer" },
      },
      TR: {
        deposit: { when: "Vóór het bieden", text: "Teminat in het e-Satış-portaal.", basis: "İİK art. 114/7", law: "esatis" },
        balance: { when: "Binnen 7 dagen na publicatie van het veilingprotocol", text: "Resterende koopsom (bod minus teminat), contant/per bank. Geen verlenging mogelijk.", basis: "İİK art. 130", law: "iik" },
        fees: { when: "Op verzoek van het executiekantoor, vóór inschrijving", text: "Btw (KDV), Tapu-rechten, zegelrecht en leges (döner sermaye).", basis: "Veilingvoorwaarden (şartname)" },
        own: { when: "Volgens uw planning", text: "Renovatie, ontruiming en overige kosten.", basis: "Uw invoer" },
      },
    },
    BalanceGuaranteeNote: "Bij een bankgarantie vindt geen verrekening plaats — het volledige contante bod moet worden betaald.",
    BalanceOpenNote: "Wijze van waarborgsom nog niet gekozen — berekend zonder verrekening.",
    MissingInterestDays: "Vul het aantal dagen tot de verdelingszitting in bij de biedlimietcalculator",
    Unknown: "niet berekenbaar",
    Footnote: {
      DE: "Data na de gunning worden vastgesteld door de rechtbank en de belastingdienst. Dit dossier toont daarom de wettelijke volgorde in plaats van een verzonnen datum.",
      TR: "De termijn van 7 dagen gaat in vanaf de publicatie van het protocol in het portaal, niet vanaf de veilingdag.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Hoogte: een tiende van de taxatiewaarde (§ 68 lid 1 ZVG). Contant geld is uitgesloten (§ 69 lid 1 ZVG). Precies deze drie vormen zijn toegestaan:",
      TR: "De teminat wordt vóór het bieden gestort in het e-Satış-portaal. De toegestane vormen staan vermeld in de veilingvoorwaarden (şartname) van de bekendmaking.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Bundesbank- of gecertificeerde bankcheque", text: "Afgegeven door een in Duitsland vergunde kredietinstelling of de Bundesbank, betaalbaar in het binnenland, op zijn vroegst op de derde werkdag vóór de zitting. Een eerder afgegeven cheque wordt geweigerd.", basis: "§ 69 lid 2 ZVG", law: "zvg69" },
        { id: "guarantee", title: "Bankgarantie", text: "Onbeperkt, onvoorwaardelijk en direct opeisbaar, afgegeven door een dergelijke kredietinstelling en uitvoerbaar in het binnenland. De bank kan hiervoor garantiekosten (Avalprovision) in rekening brengen.", basis: "§ 69 lid 3 ZVG", law: "zvg69" },
        { id: "transfer", title: "Overschrijving naar de gerechtskas", text: "Het bedrag moet vóór de zitting op de rekening van de gerechtskas zijn bijgeschreven en het betalingsbewijs moet op de zitting worden overgelegd. Rekeningnummer en kenmerk worden door de rechtbank verstrekt.", basis: "§ 69 lid 4 ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "Teminat in het e-Satış-portaal", text: "Vóór het bieden te storten in het portaal, inloggen via e-Devlet. Wordt verrekend met de koopsom en vervalt indien de koper na gunning niet betaalt.", basis: "İİK art. 114/7, art. 130", law: "esatis" }],
    },
    Chosen: "geselecteerd",
  },

  Collateral: {
    Lead: {
      DE: "Banken zijn bij executieveilingen vooral terughoudend om één reden: zij keren geld uit voordat hun zekerheidsrecht (Grundschuld) in het kadaster is ingeschreven. Dit is de wettelijke volgorde:",
      TR: "Banken zijn bij İcra-veilingen vooral terughoudend om één reden: het geld moet binnen 7 dagen worden betaald, terwijl de hypotheek (ipotek) pas na eigendomsoverdracht wordt ingeschreven. Dit is de wettelijke volgorde:",
    },
    Items: {
      DE: [
        { text: "Met de gunning wordt u juridisch eigenaar — zonder notariële leveringsakte en nog vóór inschrijving in het kadaster.", basis: "§ 90 lid 1 ZVG" },
        { text: "U kunt na de gunning een Grundschuld ten gunste van de bank vestigen. Deze wordt echter pas ingeschreven nadat de rechtbank het kadaster heeft verzocht u als eigenaar in te schrijven.", basis: "§ 130 lid 3 ZVG", law: "zvg130" },
        { text: "De rechtbank dient dit verzoek pas in nadat het verdelingsplan is uitgevoerd en de gunning onherroepelijk is — dus na de verdelingszitting.", basis: "§ 130 lid 1 ZVG", law: "zvg130" },
        { text: "Voor uw inschrijving vereist het kadaster de fiscale verklaring van geen bezwaar (Unbedenklichkeitsbescheinigung) van de belastingdienst, waarvoor doorgaans betaling van de overdrachtsbelasting nodig is.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "Als u het contante bod niet betaalt, draagt de rechtbank de vordering over aan de schuldeisers, vestigt daarvoor dwanghypotheken op uw pand en dreigt herveiling.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "Hoe de bank de periode tot inschrijving overbrugt — bijvoorbeeld door de Grundschuld direct na gunning notarieel te laten passeren en rechtstreeks aan de gerechtskas uit te keren — beslist de bank zelf.", basis: "Beslissing van de bank" },
      ],
      TR: [
        { text: "De teminat wordt vóór het bieden in het portaal gestort en verrekend met de koopsom.", basis: "İİK art. 114/7", law: "iik" },
        { text: "Het restbedrag betaalt u binnen 7 dagen na publicatie van het protocol in het portaal. Sinds de wetswijziging van 2021 is verlenging afgeschaft.", basis: "İİK art. 130 (Wet nr. 7343)", law: "iik" },
        { text: "De eigendomsinschrijving (tescil) vindt pas plaats nadat de gunning onherroepelijk is. Pas daarna kan een hypotheek (ipotek) voor de bank worden ingeschreven.", basis: "İİK art. 134", law: "iik" },
        { text: "Bij niet-betaling vervalt de teminat. Voor veilingen die op of na 31 juli 2026 worden aangekondigd, legt de wet bovendien een boete van 5% van het bod op.", basis: "İİK art. 114 lid 7 nr. 9 (Wet nr. 7589)", law: "iik" },
        { text: "Gevolg: zonder voorafgaande goedkeuring (ön onay) vóór het bieden is de termijn van 7 dagen met bankfinanciering nauwelijks haalbaar.", basis: "Termijnen İİK art. 130, art. 134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Kerncijfers uit het taxatierapport",
    NoReport: "Geen taxatierapport geüpload. Upload dit op de dossierpagina — de bank zal het volledige rapport toch opvragen.",
    ReportFrom: "uit “{file}”, woordelijk met paginanummer",
    RisksLead: "Risicostoplicht op basis van de officiële bekendmaking en het taxatierapport. Grijs betekent dat geen enkele bron het vermeldt.",
    RiskFrom: { notice: "Officiële bekendmaking", report: "Taxatierapport p. {pages}", none: "geen bron" },
  },

  Documents: {
    Lead: "Wat banken doorgaans opvragen. Elke bank hanteert haar eigen checklist — vraag het na bij uw adviseur.",
    Groups: {
      DE: [
        { title: "Over het object", items: ["Volledig taxatierapport (via de rechtbank of zvg-portal.de)", "Zittingsbeschikking / officiële bekendmaking", "Kadastraal uittreksel / Grundbuch-uittreksel (meestal bijgevoegd bij het rapport)", "Kadastrale kaart en woonoppervlakteberekening", "Huurovereenkomsten, indien verhuurd", "Kostenbegroting voor renovatie, indien gepland"] },
        { title: "Over uzelf", items: ["Geldig identiteitsbewijs of paspoort", "Inkomensbewijzen van de afgelopen maanden", "Belastingaanslagen", "Bewijs van eigen vermogen", "Zelfverklaring van de bank", "Overzicht van lopende leningen"] },
      ],
      TR: [
        { title: "Over het object", items: ["Veilingbekendmaking en veilingvoorwaarden (şartname)", "Taxatierapport (kıymet takdir raporu)", "Tapu-uittreksel en perceelgegevens (ada / parsel)", "Foto's en situatietekening, indien beschikbaar"] },
        { title: "Over uzelf", items: ["Identiteitsbewijs (Kimlik) / paspoort", "Inkomensbewijs", "Belastingnummer", "Bewijs van eigen vermogen"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Geen financieringstoezegging of kredietaanbod. Of en onder welke voorwaarden financiering wordt verstrekt, beslist uitsluitend de bank.", basis: "—" },
      { text: "Geen kredietbemiddeling. Belowmark bemiddelt niet in leningen en neemt namens u geen contact op met banken.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Geen bancaire onderpandwaarde. De taxatiewaarde komt uit het gerechtelijke taxatierapport; de bank voert haar eigen waardering uit.", basis: "BelWertV" },
      { text: "Geen juridisch advies. Wettelijke bepalingen zijn ter referentie gekoppeld.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Officiële bekendmaking",
    document: "Officiële bekendmaking (PDF)",
    zvg: "Wet op de gedwongen verkoop en het gedwongen beheer (ZVG)",
    grestg: "Wet op de overdrachtsbelasting (GrEStG)",
    gewo: "Bedrijfsverordening § 34i (GewO)",
    iik: "Executie- en Faillissementswet (İİK)",
    esatis: "UYAP e-Satış",
  },
};
