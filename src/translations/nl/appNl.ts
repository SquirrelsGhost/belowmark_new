import { IAppTranslation } from "../app/IAppTranslation";

const NO_INDEX_IMG = "https://belowmark.com/og/home.png";

export const APP_NL: IAppTranslation = {
  MetaTags: {
    Search: {
      title: "Publicaties — Belowmark",
      description:
        "Alle gerechtelijke en notariële executieveilingen met taxatiewaarde, 5/10- en 7/10-drempels, 10% waarborgsom en overdrachtsbelasting — filterbaar op land, objecttype en veilingdatum.",
      imgUrl: NO_INDEX_IMG,
      tags: ["executieveiling", "vastgoedveiling", "veilingdata"],
      url: "https://belowmark.com/app",
    },
    Listing: {
      title: "Dossier — Belowmark",
      description:
        "Volledig veilingdossier: taxatiewaarde, wettelijke drempels, waarborgsom, overdrachtsbelasting, officiële bron, checklist vóór het bieden en persoonlijke notities.",
      imgUrl: NO_INDEX_IMG,
      tags: ["executieveiling", "veilingdossier"],
      url: "https://belowmark.com/app",
    },
    Watchlist: {
      title: "Watchlist — Belowmark",
      description:
        "Opgeslagen executieveilingen gerangschikt als veilingkalender, met persoonlijke notities en agenda-export voor alle zittingen. Privé in uw account op al uw apparaten.",
      imgUrl: NO_INDEX_IMG,
      tags: ["watchlist", "executieveiling"],
      url: "https://belowmark.com/app/merkliste",
    },
    Calculator: {
      title: "Biedcalculator — Belowmark",
      description:
        "Biedcalculator voor gerechtelijke en notariële executieveilingen: 5/10- en 7/10-grenzen, 10% waarborgsom en regionale overdrachtsbelasting direct berekend voor elke taxatiewaarde.",
      imgUrl: NO_INDEX_IMG,
      tags: ["biedcalculator", "executieveiling"],
      url: "https://belowmark.com/app/rechner",
    },
  },

  Shell: {
    NavLabel: "App-navigatie",
    SkipToContent: "Direct naar inhoud",
    Search: "Publicaties",
    Watchlist: "Watchlist",
    Calculator: "Calculator",
    Account: "Account",
    SignOut: "Uitloggen",
    Market: { DE: "Europa · 11 landen", TR: "İcra · Turkije" },
    TrialRunning:
      "Proeftoegang (nog {days} dagen): volledige toegang — eindigt automatisch, geen betaalgegevens opgeslagen, geen automatische verlenging.",
    TrialLastDay:
      "Proeftoegang (laatste dag): eindigt automatisch zonder kosten — geen betaalgegevens opgeslagen, geen automatische afschrijving.",
    FreePlan:
      "Gratis account (14 dagen vrijblijvende toegang — eindigt automatisch): geen betaalgegevens opgeslagen, geen automatische facturering of verlenging.",
    Upgrade: "Volledige toegang ontgrendelen",
    DataAsOf: "Stand per {date}",
    SourceLabel: "Bron",
    Principle:
      "Niets wordt geschat. Ontbreekt een bewijsstuk, dan vermelden wij de reden in plaats van een verzonnen getal.",
  },

  Segments: {
    house: "Woning",
    apartment: "Appartement",
    multiFamily: "Beleggingspand / Gemengd",
    land: "Bouwkavel / Perceel",
    farmland: "Agrarisch & bosgrond",
    commercial: "Bedrijfsruimte",
    other: "Overig",
  },

  Search: {
    Eyebrow: {
      DE: "Publicatiebord · DE · AT · CH · IT · ES · FR · UK · NL · PL · CZ · SE",
      TR: "Publicatiebord · Turkse executieveilingen",
    },
    Title: "Publicaties",
    Countries: {
      DE: { Name: "Duitsland", Source: "ZVG Portal", Region: "Deelstaat" },
      AT: { Name: "Oostenrijk", Source: "Ediktsdatei", Region: "Deelstaat" },
      CH: { Name: "Zwitserland", Source: "SHAB", Region: "Kanton" },
      IT: { Name: "Italië", Source: "Aste Giudiziarie / PVP", Region: "Regio" },
      ES: { Name: "Spanje", Source: "BOE Portal", Region: "Autonome regio" },
      FR: { Name: "Frankrijk", Source: "Licitor TJ", Region: "Regio" },
      GB: { Name: "Verenigd Koninkrijk", Source: "Property Auctions", Region: "Regio" },
      NL: { Name: "Nederland", Source: "Executieveiling", Region: "Provincie" },
      PL: { Name: "Polen", Source: "Licytacje Komornicze", Region: "Woiwodschap" },
      CZ: { Name: "Tsjechië", Source: "Portál dražeb EKČR", Region: "Regio" },
      SE: { Name: "Zweden", Source: "Kronofogden", Region: "Provincie (Län)" },
      TR: { Name: "Turkije", Source: "İcra / ilan.gov.tr", Region: "Provincie" },
    },
    CountryEyebrow: "Publicatiebord · {country} · {source}",
    CountryLead:
      "Officiële executieveilingen in {country} via {source} — met taxatiewaarde, minimumbod en termijnen tot aan de veiling. Andere landen zijn afzonderlijke pakketten en verschijnen hier niet.",
    CountrySwitch: "Land",
    Lead: {
      DE: "Officiële gerechtelijke en notariële executieveilingen in Duitsland (ZVG), Oostenrijk (Ediktsdatei), Zwitserland (SHAB), Italië (Aste Giudiziarie / PVP), Spanje (BOE Portal), Frankrijk (Licitor TJ), het Verenigd Koninkrijk (Property Auctions), Nederland (Executieveiling), Polen (Licytacje Komornicze), Tsjechië (Portál dražeb EKČR) en Zweden (Kronofogden) — met taxatiewaarde, minimumbod, 10% waarborgsom en overdrachtsbelasting.",
      TR: "Turkse executieprocedures met startbod, waarborgsom en bijkomende aankoopkosten. Rood markeert de taxatiewaarde; daaronder ligt het wettelijke startbod.",
    },
    Filters: {
      Title: "Register",
      Query: "Zoeken",
      QueryPlaceholder: {
        DE: "Plaats, postcode, veilingnotaris, rechtbank, dossiernr.",
        TR: "Provincie, district, mahalle, perceel (Ada/Parsel), dossiernr.",
      },
      Region: { DE: "Provincie / Deelstaat / Regio", TR: "Provincie" },
      AllRegions: "Alle",
      Segment: "Type object",
      AllSegments: "Alle typen",
      Value: { DE: "Taxatiewaarde", TR: "Geschatte waarde" },
      Min: "vanaf",
      Max: "tot",
      Any: "alle",
      Scope: "Veilingen",
      Scopes: { upcoming: "aankomend", all: "alle", past: "verlopen" },
      WithCancelled: "ingetrokken tonen",
      From: "vanaf datum",
      To: "tot datum",
      Apply: "Toepassen",
      Reset: "Alles wissen",
    },
    SortLabel: "Sorteren op",
    Sorts: {
      hearing: "Eerstvolgende veiling",
      discount: "Beste kansen & korting",
      valueAsc: "Waarde oplopend",
      valueDesc: "Waarde aflopend",
      newest: "Nieuw toegevoegd",
    },
    Summary: "{count} dossiers",
    SummaryOne: "1 dossier",
    NextSevenDays: "{count} in de komende 7 dagen",
    Calendar: {
      Title: "Veilingkalender",
      Hint: "Veilingen per kalenderweek. Klik op een week om alleen op die data te filteren.",
      Week: "WK",
      Clear: "Datumfilter wissen",
      Selected: "geselecteerd",
    },
    Empty: {
      Title: "Geen enkele publicatie voldoet aan deze filters.",
      Body: "Verruim een filter of toon ook verlopen veilingen. Wij verzinnen nooit objecten om de resultaten aan te vullen.",
      Reset: "Filters wissen",
    },
    Pagination: {
      Label: "Pagina's",
      Previous: "Vorige",
      Next: "Volgende",
      Page: "Pagina {page} van {count}",
    },
  },

  Row: {
    Running: "loopt, {days}d",
    RunningToday: "eindigt vandaag",
    Upcoming: "over {days} dagen",
    Today: "vandaag",
    Tomorrow: "morgen",
    Past: "verlopen",
    Cancelled: "Ingetrokken",
    Unknown: "Datum volgt",
    Round: "Ronde {round}",
    New: "Nieuw",
    Value: { DE: "Taxatiewaarde", TR: "Taxatiewaarde" },
    NoValue: "Geen waarde vermeld in publicatie",
    EntryDe: "vanaf 5/10",
    EntryTr: "Startbod",
    Waived: "Drempels vervallen",
    Watch: "Bewaren",
    Unwatch: "Bewaard",
    WatchError: "Opslaan mislukt",
    Open: "Dossier",
    Locked: "Zichtbaar met volledige toegang",
  },

  Listing: {
    Back: "Terug naar publicaties",
    FactsTitle: "Veilingdossier",
    FileNo: "Dossiernummer",
    Authority: { DE: "Rechtbank / Veilingnotaris", TR: "Executie-instantie (İcra)" },
    Hearing: "Veilingdatum",
    Rounds: "Biedronden",
    Address: "Locatie",
    Region: { DE: "Provincie / Deelstaat / Regio", TR: "Provincie" },
    Segment: "Type object",
    Value: { DE: "Taxatiewaarde", TR: "Taxatiewaarde" },
    ValueBasis: {
      DE: "ambtshalve vastgesteld (§ 74a ZVG · § 140 EO · SchKG · Art. 3:268 BW)",
      TR: "Kıymet takdiri conform officiële bekendmaking",
    },
    NotStated: "niet vermeld in publicatie",
    FileYear: "Procedure sinds",
    FirstSeen: "eerst geregistreerd",
    LimitsTitle: "Wettelijke drempels bij eerste veiling",
    Half: "5/10 · § 85a — gunning wordt hieronder ambtshalve geweigerd",
    SevenTenths: "7/10 · § 74a — schuldeiser kan gunning hieronder weigeren",
    Deposit: "Waarborgsom (10%) · § 68",
    TransferTax: "Overdrachtsbelasting bij 5/10 · {pct}",
    EntryAtHalf: "Totale instap bij 5/10-grens",
    WaivedNote:
      "De wettelijke waardedrempels zijn in deze procedure al vervallen (§ 85a lid 2, § 74a lid 4 ZVG). Er geldt geen wettelijke minimumgrens meer.",
    CalculatorTitle: "Uw bod voor dit dossier",
    CalculatorNote:
      "Taxatiewaarde en regionaal belastingtarief zijn vooraf ingevuld uit de officiële publicatie. Verschuif de regelaar om uw bod door te rekenen.",
    Sources: {
      Title: "Bronnen & hulpmiddelen",
      Official: "Officiële publicatie openen",
      OfficialNote: {
        DE: "Origineel op het officiële veiling- of justitieportaal. Het volledige taxatierapport en de veilingvoorwaarden liggen uitsluitend daar of bij de notaris/rechtbank ter inzage.",
        TR: "Origineel op ilan.gov.tr. Taxatierapport en foto's zijn toegankelijk via e-Satış (UYAP) met e-Devlet-inlog.",
      },
      Map: "Bekijk op kaart",
      Geoportal: "Kadastrale kaart in geoportaal",
      Calendar: "Toevoegen aan agenda",
      CopyFileNo: "Dossiernummer kopiëren",
      Copied: "Gekopieerd",
    },
    Caveats: {
      Title: "Wat de publicatie onthult",
      Empty: "De publicatie vermeldt geen bijzondere lasten of beperkingen.",
      Points: "−{points}",
    },
    Checklist: {
      Title: "Checklist vóór het bieden",
      Hint: "Uw vinkjes worden lokaal in deze browser opgeslagen.",
      Progress: "{done} van {total} voltooid",
      Items: {
        DE: [
          "Taxatierapport en Bijzondere Veilingvoorwaarden ingezien bij de veilingnotaris of rechtbank",
          "Kadaster / grondboek gecontroleerd op blijvende lasten, erfdienstbaarheden en beslagen",
          "Buitenbezichtiging uitgevoerd en omgeving geïnspecteerd",
          "Schriftelijke financieringsbevestiging of bewijs van eigen middelen geregeld",
          "Waarborgsom (10%) klaargezet via overboeking op kwaliteitsrekening of bankgarantie (geen contant geld)",
          "Veilingstatus een dag vooraf opnieuw gecontroleerd — intrekkingen op het laatste moment komen vaak voor",
          "Maximumbod vastgesteld inclusief overdrachtsbelasting, notariskosten en kadastrale rechten",
        ],
        TR: [
          "Bilirkişi raporu (taxatierapport) geraadpleegd in UYAP / e-Satış",
          "Tapu kaydı (kadaster) en Şerhler (aantekeningen/lasten) gecontroleerd",
          "Buitenbezichtiging uitgevoerd en bewoningssituatie nagegaan",
          "Teminat (10% waarborgsom) klaargezet",
          "e-Devlet-toegang ingesteld voor bieden via e-Satış",
          "Btw (KDV), overdrachtsrecht (Tapu harcı) en zegelrecht meegerekend in het maximumbod",
          "Eventuele ontruimingstermijn ingecalculeerd bij bewoonde staat",
        ],
      },
    },
    Note: {
      Title: "Persoonlijke notitie",
      Placeholder: "bijv. Bezichtiging zaterdag, veilingvoorwaarden opgevraagd, max. bod € 140.000",
      Save: "Notitie opslaan",
      Saved: "Opgeslagen en automatisch aan uw watchlist toegevoegd.",
      Error: "Opslaan mislukt. Probeer het opnieuw.",
      Hint: "Alleen zichtbaar voor u. Door een notitie op te slaan wordt het dossier automatisch op uw watchlist geplaatst.",
    },
    Locked: {
      Title: "Financiële gegevens vereisen volledige toegang",
      Body: "Taxatiewaarde, wettelijke drempels, waarborgsom en de interactieve biedcalculator worden ontgrendeld met volledige toegang. Veilingdatum, instantie en dossiernummer zijn al zichtbaar.",
      Cta: "Bekijk pakketten voor volledige toegang",
    },
    NotFound: {
      Title: "Dit dossier staat niet in de actuele dataset.",
      Body: "Het is verwijderd van het officiële publicatiebord of de link is onvolledig. Het officiële register van de notaris of rechtbank is altijd leidend.",
    },
    Tr: {
      Parcel: "Blok / Perceel (Ada / Parsel)",
      Mahalle: "Wijk (Mahalle)",
      LandArea: "Perceeloppervlakte (Yüzölçümü)",
      BuildingArea: "Bruto vloeroppervlakte",
      NetArea: "Netto oppervlakte",
      UsableArea: "Gebruiks- / bedrijfsoppervlakte",
      PricePerM2: "Referentiewaarde / m²",
      Rooms: "Kamers",
      Floor: "Verdieping",
      YearBuilt: "Bouwjaar",
      Grundbuch: "Kadaster (Tapu)",
      ArsaPayi: "Grondaandeel (Arsa Payı)",
      UnitNoPrefix: "Eenheid",
      Condo: "Appartementsrecht — Yüzölçümü verwijst naar het volledige perceel",
      StartingBid: "Startbod · İİK Art. 129",
      StartingBidNote:
        "50% van de taxatiewaarde. Voor gunning moeten daarnaast bevoorrechte vorderingen en executiekosten worden gedekt.",
      Deposit: "Waarborgsom (Teminat) · İİK Art. 114/7",
      CostsTitle: "Wettelijke bijkomende kosten boven op de koopsom",
      Costs: {
        kdv: "Btw (KDV) · {pct}",
        tapuHarci: "Overdrachtsrecht (Tapu harcı) · {pct}",
        damgaVergisi: "Zegelrecht · {pct}",
        donerSermaye: "Kadastrale bijdrage (vast)",
      },
      AllIn: "Bod incl. wettelijke kosten",
      VatUnknown:
        "De publicatie vermeldt geen btw-tarief. Het totaalbedrag wordt daarom als onvolledig gemarkeerd en niet geschat.",
      Tellaliye:
        "Exclusief: gemeentelijke veilingheffing (Tellaliye, Wet gemeentelijke inkomsten Art. 67) — verschilt per gemeente.",
      CostsAsOf: "Tarieven per {date}",
      MarketTitle: "Marktvergelijking",
      MarketMedian: "Mediane vraagprijs per m²",
      Discount: "Startbod onder marktwaarde",
      Sample: "Vergelijkbare objecten",
      Confidence: "Betrouwbaarheid",
      NoMarket: "Geen betrouwbare vergelijking — onvoldoende vergelijkbare oppervlakte of referentiepanden.",
      BidLabel: "Uw bod",
      Hits: "Weergaven officiële publicatie",
    },
  },

  Watchlist: {
    Eyebrow: "Veilingkalender",
    Title: "Watchlist",
    Lead: "Uw bewaarde dossiers geordend op veilingdatum. Notities en watchlist worden gesynchroniseerd op al uw apparaten.",
    Count: "{count} bewaard",
    ExportAll: "Alle veilingdata exporteren naar agenda (.ics)",
    Upcoming: "Aankomende veilingen",
    Past: "Verlopen of ingetrokken",
    NoNote: "Nog geen notitie.",
    EditNote: "Notitie bewerken",
    Remove: "Verwijderen",
    Missing: "Niet meer in de actuele dataset — waarschijnlijk ingetrokken of onderhands verkocht.",
    Empty: {
      Title: "Nog niets op uw watchlist.",
      Body: "Klik op 'Bewaren' bij een publicatie om hier uw persoonlijke veilingkalender op te bouwen.",
      Cta: "Publicaties bekijken",
    },
  },

  Calculator: {
    Eyebrow: "Hulpmiddel",
    Title: "Biedcalculator",
    Lead: {
      DE: "Voor elke taxatiewaarde: zie direct de exacte 5/10- en 7/10-drempels, 10% waarborgsom en regionale overdrachtsbelasting.",
      TR: "Voor elke taxatiewaarde: startbod, 10% waarborgsom (Teminat) en wettelijke bijkomende kosten boven op de koopsom.",
    },
    Tr: {
      Title: "İcra-calculator",
      Subtitle: "Conform İİK Art. 114/7, Art. 129",
      ValueLabel: "Taxatiewaarde (Kıymet takdiri)",
      VatLabel: "Btw conform publicatie",
      VatNone: "niet vermeld",
      Footnote:
        "Exclusief Tellaliye, achterstallige onroerendezaakbelasting en ontruimingskosten. Wettelijke tarieven per 13 aug 2026.",
    },
  },

  Ics: {
    Summary: "Executieveiling {fileNo} · {place}",
    Description:
      "{authority}, dossiernr. {fileNo}. Officiële bron: {url}. Controleer de status een dag vooraf: intrekkingen op het laatste moment komen vaak voor.",
  },

  Views: {
    Label: "Weergave",
    List: "Lijst",
    Map: "Kaart",
  },

  Quick: {
    Label: "Snelfilters",
    Opportunity: {
      DE: "★ Drempels vervallen (§§ 74a/85a)",
      TR: "★ Topkansen (≥ 25% onder markt / İhale)",
    },
    WithDocs: {
      DE: "Met PDF / rapport",
      TR: "Met marktvergelijking / perceeldata",
    },
    ThisWeek: "Deze week",
    NextMonth: "Komende 30 dagen",
    Houses: "Woningen",
    Apartments: "Appartementen",
    UpTo: "tot {value}",
  },

  SearchMap: {
    Hint: {
      DE: "Elke markering toont een postcodegebied, niet het exacte perceel. Klik op een provincie of regio om te filteren.",
      TR: "Elke cirkel staat voor een provincie (İl). Publicaties bevatten geen straatcoördinaten; klik op een provincie om te filteren.",
    },
    HintEurope:
      "Elke markering toont de locatie uit de officiële publicatie (adres of postcodegebied), niet noodzakelijk het exacte perceel. Klik op een regio om te filteren.",
    Inset: "Canarische Eilanden, verschoven weergegeven",
    Imminent: "Veiling binnen 7 dagen",
    Later: "Latere veiling",
    Size: "Grootte = aantal dossiers",
    OffMap: "{count} zonder koppelbare postcode, niet op kaart getoond",
    Several: "{count} dossiers",
    ShowHere: "Toon in lijst",
    Open: "Dossier openen",
    Basis: "Kaartgegevens",
    AllRegions: "Alle regio's",
    RegionCount: "{region}: {count} dossiers",
  },

  Location: {
    Title: "Locatie",
    Precision: {
      postcode:
        "Cirkel = globaal postcodegebied {label}. Exacte kadastrale gegevens staan in de officiële publicatie en het kadaster.",
      province:
        "Centrum van provincie {label}. De publicatie vermeldt geen straatcoördinaten; blok- en perceelnummers (Ada/Parsel) identificeren het perceel.",
    },
    Scale: "Schaal",
    Levels: ["Regio", "Plaats", "Straat"],
    OpenLarge: "Grote kaart openen",
    Locator: "Ligging in {region}",
    NoGeo:
      "De officiële publicatie bevat geen koppelbare postcode. Wij tonen liever geen kaart dan een onnauwkeurige speld.",
    Loading: "Kaart laden …",
  },

  Media: {
    Title: "Foto's & documenten",
    Slot: {
      DE: "Foto's uitsluitend in de officiële brochure",
      TR: "Foto's in officiële publicatie",
    },
    Body: {
      DE: "Veilingnotarissen en rechtbanken publiceren foto's, plattegronden en taxatierapporten uitsluitend op het officiële portaal. Wij gebruiken nooit stockfoto's en linken direct naar de bron.",
      TR: "Foto's staan in de officiële bekendmaking op ilan.gov.tr. Wij gebruiken nooit stockfoto's en linken rechtstreeks naar het origineel.",
    },
    Announcement: "Officiële publicatie (PDF)",
    Portal: {
      DE: "Brochure, taxatierapport & foto's op het portaal",
      TR: "Officiële publicatie met foto's op ilan.gov.tr",
    },
    StreetView: "Omgeving op Google Maps",
    Aerial: "Luchtfoto & kadastrale kaart in geoportaal",
    Parcel: "Perceel opzoeken bij TKGM Parsel Sorgu",
  },

  Evidence: {
    Title: "Wettelijke grondslag & bronnen",
    Lead: "Waar elk getal op dit dossierblad vandaan komt. Wetsverwijzingen linken rechtstreeks naar de officiële wettekst.",
    Figure: "Kengetal",
    Basis: "Wettelijke grondslag",
    Source: "Bron",
    Items: {
      DE: [
        {
          figure: "Taxatiewaarde (Verkehrswert)",
          basis: "vastgesteld door de executierechter, § 74a lid 5 ZVG",
          source: "gesetze-im-internet.de",
          url: "https://www.gesetze-im-internet.de/zvg/__74a.html",
        },
        {
          figure: "5/10-drempel",
          basis: "gunning ambtshalve geweigerd bij eerste zitting, § 85a ZVG",
          source: "gesetze-im-internet.de",
          url: "https://www.gesetze-im-internet.de/zvg/__85a.html",
        },
        {
          figure: "7/10-drempel",
          basis: "weigering op verzoek van een gerechtigde schuldeiser, § 74a lid 1 ZVG",
          source: "gesetze-im-internet.de",
          url: "https://www.gesetze-im-internet.de/zvg/__74a.html",
        },
        {
          figure: "Waarborgsom (10%)",
          basis: "één tiende van de taxatiewaarde, § 68 lid 1 ZVG; contant geld uitgesloten, § 69 ZVG",
          source: "gesetze-im-internet.de",
          url: "https://www.gesetze-im-internet.de/zvg/__68.html",
        },
        {
          figure: "Overdrachtsbelasting",
          basis: "tarief van de betreffende deelstaat, § 11 GrEStG",
          source: "gesetze-im-internet.de",
          url: "https://www.gesetze-im-internet.de/grestg_1983/__11.html",
        },
        {
          figure: "Grondrichtwaarde",
          basis: "onafhankelijke toetsing via regionale taxatiecommissies",
          source: "BORIS-D",
          url: "https://www.bodenrichtwerte-boris.de/",
        },
      ],
      TR: [
        {
          figure: "Taxatiewaarde (Muhammen bedel)",
          basis: "Kıymet takdiri door het executiekantoor, İİK Art. 128",
          source: "mevzuat.gov.tr",
          url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.3.2004.pdf",
        },
        {
          figure: "Startbod 50%",
          basis: "minimumbod in beide biedronden, İİK Art. 129",
          source: "mevzuat.gov.tr",
          url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.3.2004.pdf",
        },
        {
          figure: "Waarborgsom (Teminat) 10%",
          basis: "verplichte zekerheidsstelling vóór het bieden, İİK Art. 114/7",
          source: "mevzuat.gov.tr",
          url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.3.2004.pdf",
        },
        {
          figure: "Overdrachtsrecht (Tapu harcı)",
          basis: "Legeswet nr. 492, Tarief 4",
          source: "mevzuat.gov.tr",
          url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.4.492.pdf",
        },
        {
          figure: "Zegelrecht (Damga vergisi)",
          basis: "Zegelrechtwet nr. 488",
          source: "mevzuat.gov.tr",
          url: "https://www.mevzuat.gov.tr/mevzuatmetin/1.4.488.pdf",
        },
        {
          figure: "Kadastraal perceel",
          basis: "Ada en Parsel uit de publicatie, te verifiëren in het kadaster",
          source: "TKGM",
          url: "https://parselsorgu.tkgm.gov.tr/",
        },
      ],
    },
    Notice: "Veilingdatum, dossiernummer, object en waarde: officiële publicatie",
  },

  History: {
    Title: "Portaalhistorie",
    Hint: "Wijzigingen die door het officiële portaal zijn gepubliceerd sinds wij dit dossier voor het eerst hebben vastgelegd. Letterlijk wijzigingslogboek.",
  },

  Compare: {
    Plan: "Planning",
    Compare: "Vergelijking",
    Title: "Uw aankomende veilingen naast elkaar",
    NeedTwo: "Bewaar minstens twee aankomende veilingen om ze naast elkaar te vergelijken.",
    Best: "laagste instap",
    Rows: {
      Place: "Locatie",
      Segment: "Type object",
      Hearing: "Veilingdatum",
      Value: { DE: "Taxatiewaarde", TR: "Taxatiewaarde" },
      Entry: { DE: "Instap (5/10)", TR: "Startbod (50%)" },
      Limit: { DE: "7/10-drempel", TR: "Teminat (10%)" },
      Deposit: "Waarborgsom",
      AllIn: { DE: "Instap incl. belasting", TR: "Startbod incl. kosten" },
      Authority: { DE: "Instantie", TR: "Instantie" },
      Note: "Uw notitie",
    },
  },
};
