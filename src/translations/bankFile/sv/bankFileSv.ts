import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_SV: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Bankunderlag — Belowmark",
      description: "Finansieringsförfrågan för en fastighet på exekutiv auktion: lånebelopp, egen insats, lagstadgad betalningsplan efter klubbslag och handpenning — varje siffra med källhänvisning.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Bankunderlag", "Finansiering", "Exekutiv auktion"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Finansiering",
    Title: "Bankunderlag",
    Lead: {
      DE: "Du behöver säkerhet (handpenning) vid auktionstillfället och resterande köpeskilling senast till fördelningssammanträdet. Detta underlag presenterar allt för banken på en gång: lånebelopp, egen insats, lagstadgad betalningsplan och vad banken behöver ställa ut för säkerheten. Det ersätter inte ett lånelöfte — endast banken kan ge ett sådant.",
      TR: "Du betalar teminat (handpenning) före budgivning och resterande belopp inom 7 dagar efter auktionsprotokollet. Detta underlag presenterar allt för banken på en gång: lånebelopp, egen insats och lagstadgad betalningsplan. Det ersätter inte ett lånelöfte — endast banken kan ge ett sådant.",
    },
    Button: "Öppna bankunderlag",
    ButtonHint: "Öppnar underlaget i en ny flik. Fyll i planerat maxbud, egen insats och metod för säkerhet och spara sedan som PDF.",
  },

  File: {
    Kicker: "Finansieringsförfrågan · Exekutiv auktion",
    Title: "Bankunderlag",
    PrintedAt: "Skapad {date}",
    DataAsOf: "Kungörelsedata per {date}",
    Print: "Skriv ut / spara som PDF",
    PrintHint: "Välj ”Spara som PDF” i utskriftsdialogen.",
    Back: "Tillbaka till ärendeakten",
    Locked: "Bankunderlaget ingår i Investor-planen",
    NoValue: "ej angivet",
    Sections: {
      ask: "Förfrågan till banken",
      request: "Finansieringsbehov",
      schedule: "Betalningsplan från auktionstillfället",
      deposit: "Säkerhet (handpenning) — vad banken behöver göra",
      collateral: "Panträtt för banken — när den uppstår",
      object: "Fastighet och marknadsvärde",
      risks: "Rättigheter och risker",
      limit: "Härledning av maxbud",
      documents: "Handlingar till banken",
      notThis: "Vad detta underlag inte är",
      sources: "Källor",
    },
  },

  Form: {
    Title: "Dina uppgifter till underlaget",
    Lead: "Allt börjar tomt. Egen insats, ränta och amortering delas med budgränskalkylatorn — ändringar här slår igenom även där.",
    StorageHint: "Sparas endast i denna webbläsare. Själva formulärfälten skrivs inte ut, endast den färdiga sammanställningen.",
    Fields: {
      plannedBid: { label: "Planerat maxbud", hint: "Lämna tomt för att använda din beräknade budgräns." },
      equity: { label: "Egen insats", hint: "Det du själv skjuter till, inklusive handpenning/säkerhet." },
      interestPct: { label: "Antagen ränta", hint: "Ditt antagande. Banken lämnar den faktiska räntan." },
      repaymentPct: { label: "Initial amortering", hint: "Per år, i procent av lånebeloppet." },
      fixedYears: { label: "Önskad räntebindningstid", hint: "" },
    },
    Applicant: { label: "Sökande (valfritt)", hint: "Visas i förfrågan. Stannar i denna webbläsare.", placeholder: "För- och efternamn" },
    Method: { label: "Säkerhet via", empty: "ej bestämt" },
    Methods: {
      cheque: "Bundesbank- eller bekräftad bankcheck",
      guarantee: "Bankgaranti",
      transfer: "Banköverföring till domstolskassan",
      portal: "e-Satış-portalen",
    },
    Use: { label: "Avsedd användning", empty: "ej bestämt" },
    Uses: { own: "Eget boende", rent: "Uthyrning", resale: "Vidareförsäljning" },
    YearsSuffix: "år",
    Reset: "Rensa underlagets fält",
  },

  Ask: {
    Salutation: "Hej,",
    Intro: "Jag avser att lägga bud på fastigheten {object} i den exekutiva auktionen {fileNo} vid {court}. Auktionsdatum: {date}. Bedömt marknadsvärde enligt officiell kungörelse: {value}.",
    Applicant: "Sökande: {name}",
    NoApplicant: "Sökande: ______________________",
    Requests: {
      loan: "Finansiering om {amount} — totala kostnader på {total} minus egen insats om {equity} (specifikation i avsnitt 02).",
      guarantee: "En obegränsad, ovillkorlig och direkt verkställbar bankgaranti om {amount} som säkerhet vid auktionstillfället (§ 69 (3) ZVG).",
      cheque: "En Bundesbank- eller bekräftad bankcheck på {amount}, utställd tidigast tre bankdagar före auktionstillfället (§ 69 (2) ZVG).",
      transfer: "En banköverföring om {amount} till domstolskassan med valuteringsdag före auktionstillfället, inklusive betalningsintyg (§ 69 (4) ZVG).",
      portal: "Ställande av teminat om {amount} före budgivning i e-Satış-portalen.",
      timing: "Ett skriftligt finansieringsbesked före auktionstillfället, eftersom betalningarna efter klubbslag är strikt bundna till lagstadgade tidsfrister i avsnitt 03.",
    },
    MissingBid: "Maxbud saknas — fyll i ovan eller beräkna din budgräns.",
    MissingEquity: "Egen insats saknas — utan den kan önskat lånebelopp inte anges.",
    MissingMethod: "Metod för säkerhet är ännu inte vald.",
    Closing: "Jag står gärna till förfogande för eventuella frågor och tillhandahåller gärna det fullständiga värderingsutlåtandet.",
  },

  Request: {
    UsesTitle: "Kapitalanvändning",
    SourcesTitle: "Finansieringskällor",
    Bid: "Maxbud",
    BidFromLimit: "från din budgräns",
    BidOwn: "din inmatning",
    Total: "Totala kostnader",
    Equity: "Egen insats",
    Loan: "Lånebehov",
    LoanToValue: "Belåningsgrad mot marknadsvärde",
    LoanToValueNote: "Marknadsvärde enligt domstolen — banken fastställer sitt eget belåningsvärde.",
    EquityShare: "Andel egen insats",
    TermsTitle: "Önskade villkor",
    Interest: "Antagen ränta",
    InterestNote: "Ditt antagande, inte ett erbjudande",
    Repayment: "Initial amortering",
    MonthlyRate: "Månadskostnad vid antagen ränta",
    FixedYears: "Räntebindningstid",
    Use: "Avsedd användning",
    Incomplete: "En lagstadgad kostnadspost saknas (t.ex. skattesats i kungörelsen) — de totala kostnaderna är för lågt räknade.",
    EquityShortForDeposit: "Din egna insats täcker inte säkerheten. Banken måste förfinansiera den eller ställa ut en bankgaranti.",
    Guarantee: "Utöver detta: bankgaranti för säkerheten",
    GuaranteeBasis: "§ 69 (3) ZVG",
  },

  Schedule: {
    Columns: { when: "När", what: "Vad", amount: "Belopp" },
    Steps: {
      DE: {
        deposit: { when: "Vid auktionstillfället, direkt efter budgivning", text: "Säkerhet (handpenning): en tiondel av marknadsvärdet om en sakägare begär det. Räkna med att den krävs.", basis: "§§ 67, 68 (1) ZVG", law: "zvg68" },
        balance: { when: "Före fördelningssammanträdet (datum fastställs av domstolen efter klubbslag)", text: "Kontantbud (Bargebot) som ska betalas till domstolskassan — krediterat före sammanträdet, kvitto krävs på plats. Överförd säkerhet räknas av mot beloppet.", basis: "§ 49 (3), § 107 (3) ZVG", law: "zvg49" },
        bidInterest: { when: "Tillsammans med kontantbudet", text: "4 % ränta på kontantbudet från klubbslagsdagen till fördelningssammanträdet.", basis: "§ 49 (2) ZVG jämte § 246 BGB", law: "zvg49" },
        transferTax: { when: "En månad efter skattebeslut", text: "Fastighetsförvärvsskatt (Grunderwerbsteuer) på budet samt eventuella kvarstående rättigheter i fastigheten.", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Vid domstolens avgiftsfaktura", text: "Domstolsavgift för meddelat klubbslag.", basis: "KV 2214 GKG" },
        registryFee: { when: "Efter inskrivning", text: "Lagfart / inskrivning som ägare i fastighetsregistret (Grundbuch).", basis: "KV 14110 GNotKG" },
        own: { when: "Enligt din plan", text: "Renovering, avhysning och övriga kostnader.", basis: "Din inmatning" },
      },
      TR: {
        deposit: { when: "Före budgivning", text: "Teminat (handpenning) i e-Satış-portalen.", basis: "İİK m.114/7", law: "esatis" },
        balance: { when: "Inom 7 dagar efter publicering av auktionsprotokollet", text: "Resterande köpeskilling (bud minus teminat), kontant. Ingen förlängning.", basis: "İİK m.130", law: "iik" },
        fees: { when: "Enligt exekutionsmyndighetens anvisning, före inskrivning", text: "Moms (KDV), lagfartsavgift (Tapu), stämpelskatt, expeditionsavgift (döner sermaye).", basis: "Auktionsvillkor (şartname)" },
        own: { when: "Enligt din plan", text: "Renovering, avhysning och övriga kostnader.", basis: "Din inmatning" },
      },
    },
    BalanceGuaranteeNote: "Vid bankgaranti sker ingen avräkning — hela kontantbudet måste betalas.",
    BalanceOpenNote: "Metod för säkerhet är ej vald — beräknat utan avräkning.",
    MissingInterestDays: "Ange antal dagar till fördelningssammanträdet i budgränskalkylatorn",
    Unknown: "ej beräkningsbart",
    Footnote: {
      DE: "Datumen efter klubbslag fastställs av domstol och skattemyndighet. Underlaget anger därför den lagstadgade ordningen i stället för ett uppskattat datum.",
      TR: "Sjudagarsfristen löper från publiceringen av protokollet i portalen, inte från själva auktionsdagen.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Belopp: en tiondel av marknadsvärdet (§ 68 (1) ZVG). Kontanter är uteslutna (§ 69 (1) ZVG). Exakt dessa tre former är tillåtna:",
      TR: "Teminat (handpenning) deponeras i e-Satış-portalen före budgivning. Godkända former framgår av auktionsvillkoren (şartname) i kungörelsen.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Bundesbank- eller bekräftad bankcheck", text: "Utställd av ett kreditinstitut med tillstånd i Tyskland eller Bundesbank, betalbar inrikes, tidigast den tredje bankdagen före auktionstillfället. En tidigare utställd check avvisas.", basis: "§ 69 (2) ZVG", law: "zvg69" },
        { id: "guarantee", title: "Bankgaranti", text: "Obegränsad, ovillkorlig och direkt verkställbar, utställd av ett sådant kreditinstitut, infribar inrikes. Banken kan ta ut garantiprovision (Avalprovision).", basis: "§ 69 (3) ZVG", law: "zvg69" },
        { id: "transfer", title: "Banköverföring till domstolskassan", text: "Beloppet måste vara krediterat domstolskassans konto före auktionstillfället och betalningsintyg måste visas upp på plats. Kontouppgifter och referens anges av domstolen.", basis: "§ 69 (4) ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "Teminat i e-Satış-portalen", text: "Deponeras i portalen före budgivning med inloggning via e-Devlet. Avräknas mot köpeskillingen; förverkas om köparen inte betalar efter klubbslag.", basis: "İİK m.114/7, m.130", law: "esatis" }],
    },
    Chosen: "vald",
  },

  Collateral: {
    Lead: {
      DE: "Banker tvekar ofta vid exekutiva auktioner av ett huvudsakligt skäl: lånet måste betalas ut innan deras panträtt (Grundschuld) skrivs in i fastighetsregistret. Så här ser den lagstadgade ordningen ut:",
      TR: "Banker tvekar ofta vid İcra-auktioner av ett huvudsakligt skäl: köpeskillingen måste betalas inom 7 dagar, medan panträtten (ipotek) först kan skrivas in efter lagfart. Så här ser den lagstadgade ordningen ut:",
    },
    Items: {
      DE: [
        { text: "Genom klubbslaget blir du juridisk ägare — utan notariehandling och före inskrivning i fastighetsregistret.", basis: "§ 90 (1) ZVG" },
        { text: "Du kan upplåta en panträtt (Grundschuld) till banken efter klubbslaget. Den skrivs dock in först när domstolen begär att fastighetsregistret skriver in dig som ägare.", basis: "§ 130 (3) ZVG", law: "zvg130" },
        { text: "Domstolen skickar denna begäran först när fördelningsplanen är verkställd och klubbslaget vunnit laga kraft — alltså efter fördelningssammanträdet.", basis: "§ 130 (1) ZVG", law: "zvg130" },
        { text: "För lagfart kräver inskrivningsmyndigheten skatteverkets godkännandeintyg (Unbedenklichkeitsbescheinigung), vilket normalt förutsätter att fastighetsförvärvsskatten är betald.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "Betalar du inte kontantbudet överför domstolen fordran till borgenärerna, säkrar den med tvångspant i din fastighet och ny exekutiv auktion hotar.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "Hur banken överbryggar tiden fram till inskrivning — t.ex. genom att notarisera panträtten direkt efter klubbslag och betala ut direkt till domstolskassan — avgör banken själv.", basis: "Bankens beslut" },
      ],
      TR: [
        { text: "Teminat deponeras i portalen före budgivning och avräknas mot köpeskillingen.", basis: "İİK m.114/7", law: "iik" },
        { text: "Resterande belopp betalas kontant inom 7 dagar efter att protokollet publicerats i portalen. Förlängning är avskaffad sedan 2021 års reform.", basis: "İİK m.130 (Lag nr 7343)", law: "iik" },
        { text: "Lagfart (tescil) sker först när klubbslaget vunnit laga kraft. Först därefter kan en panträtt (ipotek) skrivas in för banken.", basis: "İİK m.134", law: "iik" },
        { text: "Utblir betalningen förverkas teminat. För auktioner som kungjorts från och med 31 juli 2026 tillkommer dessutom en lagstadgad straffavgift på 5 % av budet.", basis: "İİK m.114 (7) nr 9 (Lag nr 7589)", law: "iik" },
        { text: "Konsekvens: utan förhandsbesked (ön onay) före budgivningen är 7-dagarsfristen svår att klara med bankfinansiering.", basis: "Tidsfrister İİK m.130, m.134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Nyckeltal ur värderingsutlåtandet",
    NoReport: "Inget värderingsutlåtande uppladdat. Ladda upp det på ärendeakten — banken kommer ändå att kräva det fullständiga utlåtandet.",
    ReportFrom: "ur ”{file}”, ordagrant med sidhänvisning",
    RisksLead: "Risktrafikljus utifrån officiell kungörelse och värderingsutlåtande. Grått innebär att ingen källa nämner förhållandet.",
    RiskFrom: { notice: "Officiell kungörelse", report: "Utlåtande s. {pages}", none: "ingen källa" },
  },

  Documents: {
    Lead: "Vad banker normalt begär in. Varje bank har sin egen checklista — fråga din rådgivare.",
    Groups: {
      DE: [
        { title: "Om fastigheten", items: ["Fullständigt marknadsvärderingsutlåtande (från domstolen eller zvg-portal.de)", "Kallelse till auktion / officiell kungörelse", "Fastighetsregisterutdrag (Grundbuchauszug, ofta bilagt i utlåtandet)", "Fastighetskarta och boareaberäkning", "Hyresavtal, om fastigheten är uthyrd", "Kostnadskalkyl för renovering, om sådan planeras"] },
        { title: "Om dig", items: ["Giltigt ID-kort eller pass", "Inkomstunderlag för de senaste månaderna", "Slutskattebesked", "Bevis på egen insats", "Bankens självdeklaration / kreditunderlag", "Sammanställning av befintliga lån"] },
      ],
      TR: [
        { title: "Om fastigheten", items: ["Auktionskungörelse och auktionsvillkor (şartname)", "Värderingsutlåtande (kıymet takdir raporu)", "Tapu-utdrag och fastighetsbeteckning (ada / parsel)", "Foton och situationsplan, om tillgängligt"] },
        { title: "Om dig", items: ["ID-kort (Kimlik) / pass", "Inkomstunderlag", "Skattenummer", "Bevis på egen insats"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Inget lånelöfte eller finansieringserbjudande. Om och på vilka villkor finansiering beviljas avgörs uteslutande av banken.", basis: "—" },
      { text: "Ingen kreditförmedling. Belowmark förmedlar inte lån och kontaktar ingen bank för din räkning.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Inget belåningsvärde. Marknadsvärdet kommer från domstolens värdering; banken gör sin egen värdering.", basis: "BelWertV" },
      { text: "Ingen juridisk rådgivning. Lagrum länkas som referens.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Officiell kungörelse",
    document: "Officiell kungörelse (PDF)",
    zvg: "Lag om exekutiv försäljning och tvångsförvaltning (ZVG)",
    grestg: "Lag om fastighetsförvärvsskatt (GrEStG)",
    gewo: "Näringslagstiftning § 34i (GewO)",
    iik: "Utsöknings- och konkurslag (İİK)",
    esatis: "UYAP e-Satış",
  },
};
