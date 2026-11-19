import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_CS: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Bankovní spis — Belowmark",
      description: "Žádost o financování nemovitosti v nucené dražbě: výše úvěru, vlastní zdroje, zákonný harmonogram plateb po příklepu a dražební jistota — každé číslo doloženo zdrojem.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Bankovní spis", "Financování", "Exekuční dražba"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Financování",
    Title: "Bankovní spis",
    Lead: {
      DE: "Dražební jistotu potřebujete při dražebním jednání a doplatek do rozvrhového jednání. Tento spis předkládá bance vše najednou: výši úvěru, vlastní zdroje, zákonný harmonogram plateb i to, co musí banka zajistit pro složení jistoty. Nenahrazuje úvěrový příslib — ten může vystavit pouze banka.",
      TR: "Jistotu (teminat) skládáte před podáním příhozu a doplatek do 7 dnů od zveřejnění protokolu o dražbě. Tento spis předkládá bance vše najednou: výši úvěru, vlastní zdroje a zákonný harmonogram plateb. Nenahrazuje úvěrový příslib — ten může vystavit pouze banka.",
    },
    Button: "Otevřít bankovní spis",
    ButtonHint: "Otevře spis v nové kartě. Zadejte plánovaný příhoz, vlastní zdroje a způsob složení jistoty a uložte jej jako PDF.",
  },

  File: {
    Kicker: "Žádost o financování · Nucená dražba",
    Title: "Bankovní spis",
    PrintedAt: "Vytvořeno dne {date}",
    DataAsOf: "Údaje z dražební vyhlášky ke dni {date}",
    Print: "Tisk / uložit jako PDF",
    PrintHint: "V dialogovém okně tisku zvolte „Uložit jako PDF“.",
    Back: "Zpět ke spisu nemovitosti",
    Locked: "Bankovní spis je součástí tarifu Investor",
    NoValue: "neuvedeno",
    Sections: {
      ask: "Žádost pro banku",
      request: "Potřeba financování",
      schedule: "Harmonogram plateb od dražebního jednání",
      deposit: "Dražební jistota — co musí banka zajistit",
      collateral: "Zajištění pro banku — kdy vzniká",
      object: "Nemovitost a odhadní cena",
      risks: "Práva a rizika",
      limit: "Odvození maximálního příhozu",
      documents: "Podklady pro banku",
      notThis: "Čím tento spis není",
      sources: "Zdroje",
    },
  },

  Form: {
    Title: "Vaše údaje pro spis",
    Lead: "Vše začíná prázdné. Vlastní zdroje, úroková sazba a splácení se sdílí s kalkulačkou maximálního příhozu — každá změna zde se projeví i tam.",
    StorageHint: "Uloženo pouze v tomto prohlížeči. Samotná formulářová pole se netisknou, pouze výsledný přehled.",
    Fields: {
      plannedBid: { label: "Plánovaný maximální příhoz", hint: "Ponechte prázdné pro převzetí vypočteného limitu příhozu." },
      equity: { label: "Vlastní zdroje", hint: "Částka, kterou přispíváte sami, včetně dražební jistoty." },
      interestPct: { label: "Předpokládaná úroková sazba", hint: "Váš odhad. Skutečnou sazbu stanoví banka." },
      repaymentPct: { label: "Počáteční splátka jistiny", hint: "Ročně, v procentech z výše úvěru." },
      fixedYears: { label: "Požadovaná délka fixace", hint: "" },
    },
    Applicant: { label: "Žadatel (volitelné)", hint: "Zobrazí se v žádosti. Zůstává pouze v tomto prohlížeči.", placeholder: "Jméno a příjmení" },
    Method: { label: "Způsob složení jistoty", empty: "nerozhodnuto" },
    Methods: {
      cheque: "Šek Bundesbanky / certifikovaný bankovní šek",
      guarantee: "Bankovní záruka",
      transfer: "Bankovní převod na účet soudní pokladny",
      portal: "Portál e-Satış",
    },
    Use: { label: "Zamýšlené využití", empty: "nerozhodnuto" },
    Uses: { own: "Vlastní bydlení", rent: "Pronájem", resale: "Další prodej" },
    YearsSuffix: "let",
    Reset: "Vymazat údaje spisu",
  },

  Ask: {
    Salutation: "Vážená paní, vážený pane,",
    Intro: "mám v úmyslu dražit nemovitost {object} v řízení o nucené dražbě sp. zn. {fileNo} u soudu {court}. Termín dražebního jednání: {date}. Odhadní cena dle úřední vyhlášky: {value}.",
    Applicant: "Žadatel: {name}",
    NoApplicant: "Žadatel: ______________________",
    Requests: {
      loan: "Financování ve výši {amount} — celkové náklady {total} po odečtení vlastních zdrojů {equity} (rozpis v oddílu 02).",
      guarantee: "Časově neomezenou, bezpodmínečnou bankovní záruku na první výzvu ve výši {amount} jako dražební jistotu pro jednání (§ 69 odst. 3 ZVG).",
      cheque: "Šek Bundesbanky nebo certifikovaný bankovní šek na částku {amount}, vystavený nejdříve třetí pracovní den před jednáním (§ 69 odst. 2 ZVG).",
      transfer: "Bankovní převod ve výši {amount} na účet soudní pokladny připsaný před jednáním, včetně dokladu o připsání (§ 69 odst. 4 ZVG).",
      portal: "Zajištění jistoty (teminat) ve výši {amount} před podáním příhozu na portálu e-Satış.",
      timing: "Písemné potvrzení financování před dražebním jednáním, jelikož platby po udělení příklepu jsou striktně vázány na zákonné lhůty v oddílu 03.",
    },
    MissingBid: "Chybí maximální příhoz — zadejte jej výše nebo si spočítejte limit příhozu.",
    MissingEquity: "Chybí vlastní zdroje — bez nich nelze určit potřebnou výši úvěru.",
    MissingMethod: "Způsob složení dražební jistoty zatím nebyl zvolen.",
    Closing: "Pro případné dotazy a předložení kompletního znaleckého posudku jsem Vám plně k dispozici.",
  },

  Request: {
    UsesTitle: "Použití prostředků",
    SourcesTitle: "Zdroje financování",
    Bid: "Maximální příhoz",
    BidFromLimit: "z vašeho limitu příhozu",
    BidOwn: "váš údaj",
    Total: "Celkové náklady",
    Equity: "Vlastní zdroje",
    Loan: "Potřeba úvěru",
    LoanToValue: "LTV k odhadní ceně",
    LoanToValueNote: "Odhadní cena dle soudu — banka si stanovuje vlastní zástavní hodnotu.",
    EquityShare: "Podíl vlastních zdrojů",
    TermsTitle: "Požadované podmínky",
    Interest: "Předpokládaná úroková sazba",
    InterestNote: "Váš odhad, nikoli nabídka",
    Repayment: "Počáteční splácení jistiny",
    MonthlyRate: "Měsíční splátka při předpokládané sazbě",
    FixedYears: "Délka fixace",
    Use: "Zamýšlené využití",
    Incomplete: "Chybí zákonná nákladová položka (např. sazba daně ve vyhlášce) — celkové náklady jsou podhodnoceny.",
    EquityShortForDeposit: "Vaše vlastní zdroje nepokryjí dražební jistotu. Banka ji musí předfinancovat nebo vystavit bankovní záruku.",
    Guarantee: "Navíc: bankovní záruka na dražební jistotu",
    GuaranteeBasis: "§ 69 odst. 3 ZVG",
  },

  Schedule: {
    Columns: { when: "Kdy", what: "Co", amount: "Částka" },
    Steps: {
      DE: {
        deposit: { when: "Při jednání, bezprostředně po podání příhozu", text: "Dražební jistota: jedna desetina odhadní ceny, pokud o ni požádá oprávněný účastník. Počítejte s tím, že bude vyžadována.", basis: "§§ 67, 68 odst. 1 ZVG", law: "zvg68" },
        balance: { when: "Před rozvrhovým jednáním (termín určí soud po příklepu)", text: "Peněžní část nejvyššího podání (Bargebot) na účet soudní pokladny — připsáno před jednáním, doklad nutno předložit na jednání. Jistota převedená na soudní pokladnu se započítává.", basis: "§ 49 odst. 3, § 107 odst. 3 ZVG", law: "zvg49" },
        bidInterest: { when: "Společně s peněžní částí podání", text: "4% úrok z peněžní části podání ode dne příklepu do rozvrhového jednání.", basis: "§ 49 odst. 2 ZVG ve spoj. s § 246 BGB", law: "zvg49" },
        transferTax: { when: "Jeden měsíc po doručení daňového výměru", text: "Daň z nabytí nemovitosti z nejvyššího podání a z práv, která na nemovitosti zůstávají.", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Na základě soudního vyúčtování", text: "Soudní poplatek za udělení příklepu.", basis: "KV 2214 GKG" },
        registryFee: { when: "Po zápisu", text: "Zápis vlastnického práva do katastru nemovitostí (Grundbuch).", basis: "KV 14110 GNotKG" },
        own: { when: "Podle vašeho plánu", text: "Rekonstrukce, vyklizení a další náklady.", basis: "Váš údaj" },
      },
      TR: {
        deposit: { when: "Před podáním příhozu", text: "Jistota (teminat) na portálu e-Satış.", basis: "İİK m.114/7", law: "esatis" },
        balance: { when: "Do 7 dnů od zveřejnění protokolu o dražbě", text: "Doplatek kupní ceny (příhoz minus teminat), v hotovosti / převodem. Bez možnosti prodloužení.", basis: "İİK m.130", law: "iik" },
        fees: { when: "Dle výzvy exekučního úřadu před zápisem", text: "DPH (KDV), katastrální poplatek (Tapu), kolkové, poplatek za oběžný fond (döner sermaye).", basis: "Dražební podmínky (şartname)" },
        own: { when: "Podle vašeho plánu", text: "Rekonstrukce, vyklizení a další náklady.", basis: "Váš údaj" },
      },
    },
    BalanceGuaranteeNote: "U bankovní záruky se nic nezapočítává — uhradit je třeba celou peněžní část podání.",
    BalanceOpenNote: "Způsob složení jistoty není zvolen — vypočteno bez zápočtu.",
    MissingInterestDays: "Zadejte počet dnů do rozvrhového jednání v kalkulačce limitu příhozu",
    Unknown: "nelze vypočítat",
    Footnote: {
      DE: "Termíny po udělení příklepu stanovuje soud a finanční úřad. Tento spis proto uvádí zákonnou posloupnost místo smyšlených dat.",
      TR: "Sedmidenní lhůta běží od zveřejnění protokolu na portálu, nikoli ode dne dražby.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Výše: jedna desetina odhadní ceny (§ 68 odst. 1 ZVG). Hotovost je vyloučena (§ 69 odst. 1 ZVG). Přípustné jsou výhradně tyto tři způsoby:",
      TR: "Jistota (teminat) se skládá na portálu e-Satış před podáním příhozu. Přijímané formy jsou uvedeny v dražebních podmínkách (şartname) vyhlášky.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Šek Bundesbanky nebo certifikovaný bankovní šek", text: "Vystavený úvěrovou institucí s licencí v Německu nebo Bundesbankou, splatný v tuzemsku, nejdříve třetí pracovní den před jednáním. Dříve vystavený šek bude odmítnut.", basis: "§ 69 odst. 2 ZVG", law: "zvg69" },
        { id: "guarantee", title: "Bankovní záruka", text: "Časově neomezená, bezpodmínečná a přímo vymahatelná záruka vystavená takovou úvěrovou institucí, plnitelná v tuzemsku. Banka si může účtovat provizi za záruku (Avalprovision).", basis: "§ 69 odst. 3 ZVG", law: "zvg69" },
        { id: "transfer", title: "Převod na účet soudní pokladny", text: "Částka musí být připsána na účet soudní pokladny před jednáním a při jednání musí být předložen doklad o připsání. Číslo účtu a variabilní symbol určuje soud.", basis: "§ 69 odst. 4 ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "Jistota (teminat) na portálu e-Satış", text: "Skládá se na portálu před podáním příhozu, přihlášení přes e-Devlet. Započítává se na kupní cenu; propadá, pokud vydražitel po příklepu nezaplatí.", basis: "İİK m.114/7, m.130", law: "esatis" }],
    },
    Chosen: "zvoleno",
  },

  Collateral: {
    Lead: {
      DE: "Banky u nucených dražeb váhají hlavně z jednoho důvodu: uvolňují peníze dříve, než je jejich zástavní právo (Grundschuld) zapsáno v katastru. Zde je zákonný postup:",
      TR: "Banky u tureckých exekučních dražeb (İcra) váhají hlavně z jednoho důvodu: cena musí být zaplacena do 7 dnů, zatímco zástavní právo (ipotek) se zapisuje až po převodu vlastnictví. Zde je zákonný postup:",
    },
    Items: {
      DE: [
        { text: "Udělením příklepu se stáváte vlastníkem ze zákona — bez notářského zápisu a ještě před zápisem do katastru.", basis: "§ 90 odst. 1 ZVG" },
        { text: "Zástavní právo (Grundschuld) pro banku můžete zřídit po příklepu. Do katastru se však zapíše až poté, co soud požádá katastrální úřad o váš zápis jako vlastníka.", basis: "§ 130 odst. 3 ZVG", law: "zvg130" },
        { text: "Tuto žádost soud podá až po provedení rozvrhového plánu a nabytí právní moci příklepu — tedy po rozvrhovém jednání.", basis: "§ 130 odst. 1 ZVG", law: "zvg130" },
        { text: "K vašemu zápisu vyžaduje katastr potvrzení finančního úřadu o bezdlužnosti (Unbedenklichkeitsbescheinigung), což zpravidla předpokládá zaplacení daně z nabytí nemovitosti.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "Pokud peněžní část podání nezaplatíte, soud převede pohledávku na věřitele, zajistí ji nucenými hypotékami na vaší nemovitosti a hrozí nová dražba.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "Jak banka překlene dobu do zápisu — např. notářským zřízením zástavního práva ihned po příklepu a vyplacením přímo soudní pokladně — je na rozhodnutí banky.", basis: "Rozhodnutí banky" },
      ],
      TR: [
        { text: "Jistota (teminat) se skládá na portálu před podáním příhozu a započítává se na kupní cenu.", basis: "İİK m.114/7", law: "iik" },
        { text: "Doplatek uhradíte v hotovosti / převodem do 7 dnů od zveřejnění protokolu na portálu. Od reformy z roku 2021 nelze lhůtu prodloužit.", basis: "İİK m.130 (zákon č. 7343)", law: "iik" },
        { text: "Zápis vlastnického práva (tescil) proběhne až po nabytí právní moci příklepu. Teprve poté lze pro banku zapsat hypotéku (ipotek).", basis: "İİK m.134", law: "iik" },
        { text: "Při nezaplacení jistota propadá. U dražeb vyhlášených od 31. července 2026 zákon navíc ukládá pokutu 5 % z výše příhozu.", basis: "İİK m.114 odst. 7 č. 9 (zákon č. 7589)", law: "iik" },
        { text: "Důsledek: bez předběžného schválení (ön onay) před dražbou je sedmidenní lhůta s bankovním úvěrem stěží splnitelná.", basis: "Lhůty İİK m.130, m.134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Klíčové údaje ze znaleckého posudku",
    NoReport: "Nebyl nahrán žádný znalecký posudek. Nahrajte jej na kartě případu — banka stejně bude vyžadovat kompletní posudek.",
    ReportFrom: "z „{file}“, doslovně s číslem strany",
    RisksLead: "Semafor rizik z úřední vyhlášky a znaleckého posudku. Šedá znamená, že se o tom žádný zdroj nezmiňuje.",
    RiskFrom: { notice: "Úřední vyhláška", report: "Posudek str. {pages}", none: "bez zdroje" },
  },

  Documents: {
    Lead: "Co banky obvykle požadují vidět. Každá banka má vlastní seznam — zeptejte se svého poradce.",
    Groups: {
      DE: [
        { title: "K nemovitosti", items: ["Kompletní znalecký posudek o tržní hodnotě (od soudu nebo ze zvg-portal.de)", "Usnesení o nařízení jednání / dražební vyhláška", "Výpis z katastru nemovitostí (obvykle příloha posudku)", "Katastrální mapa a výpočet obytné plochy", "Nájemní smlouvy, je-li nemovitost pronajata", "Rozpočet rekonstrukce, pokud ji plánujete"] },
        { title: "K vaší osobě", items: ["Platný občanský průkaz nebo cestovní pas", "Potvrzení o příjmech za poslední měsíce", "Daňová přiznání / platební výměry", "Doklad o vlastních zdrojích", "Bankovní formulář o majetkových poměrech", "Přehled stávajících úvěrů"] },
      ],
      TR: [
        { title: "K nemovitosti", items: ["Dražební vyhláška a podmínky prodeje (şartname)", "Znalecký posudek (kıymet takdir raporu)", "Výpis z Tapu a údaje o parcele (ada / parsel)", "Fotografie a situační plán, jsou-li k dispozici"] },
        { title: "K vaší osobě", items: ["Průkaz totožnosti (Kimlik) / cestovní pas", "Potvrzení o příjmech", "Daňové číslo", "Doklad o vlastních zdrojích"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Nejedná se o úvěrový příslib ani nabídku financování. O tom, zda a za jakých podmínek bude úvěr poskytnut, rozhoduje výhradně banka.", basis: "—" },
      { text: "Žádné zprostředkování úvěrů. Belowmark úvěry nezprostředkovává a nekontaktuje žádnou banku vaším jménem.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Nejedná se o zástavní hodnotu. Odhadní cena pochází ze soudního posudku; banka provádí vlastní ocenění.", basis: "BelWertV" },
      { text: "Nejedná se o právní poradenství. Zákonná ustanovení jsou odkázána pro orientaci.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Úřední vyhláška",
    document: "Úřední vyhláška (PDF)",
    zvg: "Zákon o nucené dražbě a nucené správě (ZVG)",
    grestg: "Zákon o dani z nabytí nemovitosti (GrEStG)",
    gewo: "Živnostenský řád § 34i (GewO)",
    iik: "Exekuční a insolvenční zákon (İİK)",
    esatis: "UYAP e-Satış",
  },
};
