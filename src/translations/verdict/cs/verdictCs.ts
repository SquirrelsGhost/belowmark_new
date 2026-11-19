import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_CS: IVerdictTranslation = {
  Section: {
    Eyebrow: "Verdikt",
    Title: "Dražit, nebo dát ruce pryč?",
    Lead: "Verdikt odvozený z úřední vyhlášky, vašeho znaleckého posudku, zákonných pravidel a vašich vlastních čísel. „Dražit“ řekne až ve chvíli, kdy nezůstane otevřený žádný podstatný bod — a ke každému důvodu uvede zdroj.",
    Disclaimer: "Investiční vodítko založené na vašich vstupech, nikoli právní ani investiční poradenství. Směrodatný je katastr nemovitostí, znalecký posudek a sdělení soudu při dražebním jednání.",
  },
  Locked: {
    Title: "Verdikt v tarifu Investor",
    Body: "Verdikt spojuje kontrolu rizik, znalecký posudek a limit příhozu do jasného doporučení pro každou nemovitost. Dostupný v tarifu Investor.",
  },

  States: {
    go: { Stamp: "Dražit", Headline: "Dražit až do {amount}", Sub: "Na základě vašich čísel a dostupných zdrojů. Nad tento strop nepřihazujte." },
    open: { Stamp: "Zatím nepřipraveno k dražbě", Headline: "Předběžný limit {amount}", Sub: "Tento limit je podmíněn otevřenými body. Pevným verdiktem se stane až po vyjasnění níže uvedených položek." },
    stop: { Stamp: "Nedražit", Headline: "Nedražit", Sub: "Alespoň jeden doložený důvod jasně hovoří proti účasti v dražbě — viz níže." },
    none: { Stamp: "Bez verdiktu", Headline: "Verdikt nelze stanovit", Sub: "Toto řízení momentálně nelze vyhodnotit." },
  },
  GoUnverified: "Poznámka: váš rozpočet na rekonstrukci nebyl ověřen na místě ani podložen nabídkou dodavatele. Váš limit je jen tak spolehlivý jako tento odhad.",
  OpenNoLimit: { Headline: "Zatím bez limitu", Sub: "Bez vašich cílových kritérií v kalkulačce limitu příhozu neexistuje žádný cenový strop. Níže vidíte, co ještě chybí." },
  Groups: {
    none: "Proč nelze stanovit verdikt",
    stop: "Proč nedražit",
    gap: "Než budete dražit",
    caution: "Mějte na paměti",
    ok: "Co hovoří pro",
  },

  Reasons: {
    noValue: "Úřední vyhláška neuvádí odhadní cenu. Bez ní nelze vypočítat zákonné hranice ani náklady.",
    cancelled: "Podle portálu bylo dražební jednání zrušeno.",
    past: "Termín dražebního jednání již uplynul.",
    unreachable: "Vaše cíle nelze splnit při žádném příhozu — ani při 0. Běžné náklady a nájemné je nepokryjí.",
    belowStart: "Váš limit {amount} je pod nejnižším podáním {other}. Tak nízký příhoz není přípustný.",
    belowHalf: "Váš limit včetně zůstávajících práv ({amount}) je pod 5/10 odhadní ceny ({other}). Při prvním jednání musí být příklep pod touto hranicí z moci úřední odepřen — vyhodnoťte znovu při opakovaném jednání.",
    rightStays: "{risk} dle zdroje. Může příklepem zůstat zachováno a připravit vás o užívání nebo hodnotu. Dražte až poté, co soud potvrdí, zda zaniká, a jeho hodnota bude zadána v poli „Zůstávající zapsaná práva“ v limitu příhozu (zadejte 0, pokud zaniká).",
    noTargets: "V kalkulačce limitu příhozu zatím nebylo zadáno žádné cílové kritérium (výnos, cashflow nebo prodejní cena). Bez cíle neexistuje strop.",
    noReport: "Nebyl nahrán žádný znalecký posudek. Práva, závady a ekologická zátěž jsou proto známy jen z úřední vyhlášky — která o nich zpravidla mlčí.",
    noRenovation: "Nebyl zadán žádný rozpočet na rekonstrukci. Zadejte svůj odhad — nebo 0, pokud nejsou potřeba žádné práce.",
    noClearance: "Možní nájemníci nebo uživatelé, ale nebyly zadány žádné náklady na vyklizení či přechod (zadejte 0, pokud žádné nevzniknou).",
    askInspection: "Uveďte, zda jste si nemovitost prohlédli.",
    askOccupancy: "Uveďte, kdo nemovitost obývá — pokud je vám to známo.",
    askRights: "Uveďte, zda jste se u soudu dotázali na zůstávající práva.",
    rightsOpen: "Zůstávající práva jste zatím neověřili. Vše, co příklepem zůstává zachováno, musíte zaplatit nebo převzít nad rámec peněžní části podání.",
    askCostBasis: "Uveďte, z čeho vycházejí vaše náklady na rekonstrukci a vyklizení.",
    costsIncomplete: "Z úřední vyhlášky nelze vypočítat jednu ze zákonných nákladových položek — celkové náklady jsou neúplné.",
    contamination: "Ve znaleckém posudku je uvedena ekologická zátěž. Náklady na sanaci dokáže vyčíslit pouze odborný průzkum. Nedražte, dokud váš rozpočet nebude podložen cenovou nabídkou.",
    rightPriced: "{risk} dle zdroje — vyjasněno se soudem a započítáno v limitu příhozu částkou {amount}.",
    notInside: "Nebyli jste uvnitř nemovitosti. Váš rozpočet na rekonstrukci tedy není ověřen — zátěžový test níže ukazuje, jak překročení nákladů ovlivní váš limit.",
    reportOutsideOnly: "Ani soudní znalec nemohl provést (úplnou) vnitřní prohlídku.",
    estimateOnly: "Vaše náklady na rekonstrukci jsou vlastní odhad, nikoli cenová nabídka dodavatele.",
    defects: "Znalecký posudek zmiňuje závady nebo poškození. Ověřte, zda je váš rozpočet na rekonstrukci pokrývá.",
    tenant: "Nemovitost je (pravděpodobně) pronajatá. Nájemní smlouvy přecházejí na vydražitele — počítejte se skutečným nájemným, nikoli s cílovým.",
    heritage: "Památková ochrana dle zdroje. Přestavby a opravy vyžadují souhlas památkářů a bývají dražší.",
    easement: "Znalecký posudek zmiňuje věcná břemena nebo stavební omezení (např. právo cesty). Často zůstávají příklepem zachována.",
    contaminationUnclear: "Znalecký posudek nechává otevřené, zda je přítomna ekologická zátěž.",
    oldValuation: "Datum ocenění je {years} let před dražebním jednáním. Tržní podmínky i stav nemovitosti se od té doby mohly změnit.",
    valueMismatch: "Znalecký posudek uvádí {amount}, úřední vyhláška {other}. Ověřte u soudu, která částka platí.",
    sevenTenths: "Váš limit včetně zůstávajících práv ({amount}) je pod 7/10 ({other}). Oprávněný věřitel může při prvním jednání požádat o odepření příklepu.",
    atCeiling: "Limit naráží na výpočetní strop (trojnásobek odhadní ceny). Vaše cílové předpoklady jsou pravděpodobně příliš mírné.",
    conflicting: "Zdroje si ohledně „{risk}“ navzájem odporují.",
    limitBy: "Vaše kritérium „{criterion}“ umožňuje příhoz až do {amount}.",
    legalClear: "Limit překračuje zákonné minimální hranice pro toto dražební jednání.",
    limitsWaived: "Zákonné hodnotové hranice se v tomto řízení již neuplatňují.",
    rightsClear: "Právo bydlení, požívací právo a právo stavby jsou dle zdroje vyloučeny.",
  },
  MarketReasons: {
    belowStart: {
      DE: "Váš limit {amount} je pod nejnižším podáním {other}.",
      TR: "Váš limit {amount} je pod vyvolávací cenou {other} (50 % odhadní ceny). Tak nízký příhoz není přijat v žádném kole.",
    },
    rightStays: {
      DE: "{risk} dle zdroje. Může příklepem zůstat zachováno a připravit vás o užívání nebo hodnotu. Dražte až poté, co soud potvrdí, zda zaniká, a jeho hodnota bude zadána v poli „Zůstávající zapsaná práva“ v limitu příhozu (zadejte 0, pokud zaniká).",
      TR: "{risk} dle zdroje. Zda toto právo dražbou zůstává zachováno, závisí na zápisu v Tapu a dražebních podmínkách (Satış şartnamesi). Dražte až poté, co to ověříte a zohledníte ve svých číslech.",
    },
    askRights: {
      DE: "Uveďte, zda jste se u soudu dotázali na zůstávající práva.",
      TR: "Uveďte, zda jste prověřili zápis v Tapu a Satış şartnamesi ohledně zatížení.",
    },
    rightsOpen: {
      DE: "U soudu jste se zatím nezeptali na zůstávající práva. Vše, co příklepem zůstává, přebíráte nad rámec svého příhozu.",
      TR: "Zatím jste neprověřili zápis v Tapu ani Satış şartnamesi. Zatížení, která dražbou nezanikají, přecházejí na vás.",
    },
    tenant: {
      DE: "Nemovitost je (pravděpodobně) pronajatá. Nájemní smlouvy přecházejí na vydražitele — počítejte se skutečným nájemným, nikoli s cílovým.",
      TR: "Nemovitost je (pravděpodobně) obývaná nebo pronajatá. Vyklizení může trvat delší dobu a vyžadovat samostatné řízení — započítejte to.",
    },
  },
  Actions: {
    limit: "Zadat do limitu příhozu",
    report: "Nahrát posudek",
    questions: "Odpovědět níže",
  },

  Sources: {
    Label: "Zdroj",
    notice: "Úřední vyhláška",
    report: "Posudek str. {page}",
    input: "Vaše čísla",
    answer: "Vaše odpověď",
    rule: "Pravidlo belowmark",
  },

  Questions: {
    Title: "Co můžete vědět jen vy",
    Lead: "Žádný dokument neřekne, jak nemovitost vypadá uvnitř dnes ani kdo v ní bydlí. Vaše odpovědi vstupují přímo do verdiktu — bez odpovědi zůstává bod otevřený.",
    Items: {
      inspection: {
        Label: "Prohlédli jste si nemovitost?",
        Hint: "Vnitřní prohlídky u nucených dražeb často nejsou možné.",
        Options: { inside: "Ano, zevnitř", outside: "Jen zvenku", none: "Vůbec ne" },
      },
      rights: {
        Label: "Ptali jste se soudu na zůstávající práva?",
        Hint: "Soudní úředník (Rechtspfleger) vám na dotaz před jednáním sdělí nejnižší podání i případná zůstávající práva.",
        Options: { confirmed: "Ano, vyjasněno", open: "Zatím ne" },
      },
      occupancy: {
        Label: "Kdo nemovitost obývá?",
        Hint: "Ze znaleckého posudku, od sousedů nebo od věřitele — pokud je známo.",
        Options: { vacant: "Volná", owner: "Vlastník", tenant: "Nájemník", unknown: "Nevím" },
      },
      costBasis: {
        Label: "Z čeho vycházejí vaše náklady na rekonstrukci a vyklizení?",
        Hint: "Relevantní pouze pokud jste zadali náklady.",
        Options: { quote: "Cenová nabídka / odborník", estimate: "Vlastní odhad" },
      },
    },
    Rights: {
      DE: { Label: "Ptali jste se soudu na zůstávající práva?", Hint: "Soudní úředník (Rechtspfleger) vám na dotaz před jednáním sdělí nejnižší podání i případná zůstávající práva." },
      TR: { Label: "Prověřili jste zápis v Tapu a Satış şartnamesi ohledně zatížení?", Hint: "Poznámky (şerhler), požívací právo (intifa) a právo bydlení (sükna hakkı) jsou uvedeny ve výpisu Tapu a v Satış şartnamesi na e-Satış." },
    },
    Unanswered: "otevřeno",
    Reset: "Vymazat odpovědi",
    StorageHint: "Vaše odpovědi jsou uloženy pouze v tomto prohlížeči.",
  },

  Stress: {
    Title: "Zátěžový test",
    Lead: "Modelový výpočet, nikoli odhad: jaký by byl váš limit příhozu, kdyby rekonstrukce a vyklizení vyšly dráž, než jste zadali?",
    Row: "+{pct} % nákladů: {limit}",
    Unreachable: "žádný příhoz nedává smysl",
    BelowThreshold: "pod zákonnou hranicí",
    NoLimit: "nelze vypočítat",
  },

  Unknowables: {
    Title: "Co belowmark nemůže vědět",
    Items: [
      "Aktuální stav interiéru — fotografie a posudky ukazují jen to, co znalec směl vidět.",
      "Skutečné náklady na rekonstrukci — k tomu je potřeba kvalifikovaný odborník na místě.",
      "Zda se uživatelé vystěhují dobrovolně a jak dlouho potrvá případné vyklizení.",
      "Kolik dalších zájemců bude na jednání dražit a jak vysoko půjdou.",
      "Zda nebude jednání na poslední chvíli zrušeno — ověřte si jej ještě den předem.",
    ],
  },

  File: {
    Title: "Verdikt",
  },
};
