import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_CS } from "./closingTasksCs";

export const CLOSING_CS: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "Po udělení příklepu — Belowmark",
      description: "Kontrolní seznam po příklepu: platba, daň z nabytí, katastr nemovitostí, vyklizení, pojištění a rekonstrukce — včetně lhůt a odkazů na zákonná ustanovení.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Příklep", "Exekuční dražba", "Katastr nemovitostí", "Vyklizení"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "Výsledky dražeb — Belowmark",
      description: "Za kolik se nemovitosti skutečně draží: vítězné příhozy v poměru k odhadní ceně, sestavené z nahlášených výsledků dražeb, anonymně od pěti jednání ve skupině.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Vítězný příhoz", "Odhadní cena", "Výsledek dražby", "Exekuční dražba"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "Po dražebním jednání",
    Title: "Výsledek a příklep",
    Lead: {
      DE: "Byli jste na jednání? Zadejte, za kolik se vydražilo. Oficiální portál výsledky nezveřejňuje — vaše hlášení vytvářejí anonymní cenový přehled. Pokud jste příklep získali sami, kontrolní seznam vás provede až k zápisu do katastru.",
      TR: "Sledovali jste dražbu? Zadejte, za kolik se vydražilo. Portál veřejné výsledky nezveřejňuje — vaše hlášení vytvářejí anonymní cenový přehled. Pokud jste dražbu (ihale) vyhráli sami, kontrolní seznam vás provede až k zápisu do Tapu.",
    },
  },

  Result: {
    Title: "Nahlásit výsledek jednání",
    Lead: "Pouze čísla, žádná jména. Své hlášení můžete kdykoli aktualizovat.",
    NotYet: "Výsledek můžete zaznamenat až ode dne dražebního jednání.",
    HearingDate: "Datum jednání",
    Outcome: "Výsledek",
    Outcomes: {
      awarded: "Příklep udělen",
      refused: "Příklep odepřen",
      pending: "Rozhodnutí odročeno",
      noBids: "Bez příhozů",
      cancelled: "Jednání se nekonalo",
    },
    HighestBid: {
      DE: { label: "Nejvyšší podání (peněžní část / Bargebot)", hint: "Jak je uvedeno v protokolu nebo usnesení o příklepu" },
      TR: { label: "Vítězný příhoz (ihale bedeli)", hint: "Jak je uvedeno v protokolu o výsledku dražby" },
    },
    RetainedRights: { label: "Zůstávající práva", hint: "Jsou-li uvedena — tvoří součást ekonomické ceny" },
    BidderCount: { label: "Počet dražitelů", hint: "Je-li znám" },
    Source: "Odkud pocházejí vaše údaje?",
    Sources: { attended: "Osobní účast", protocol: "Protokol / usnesení", court: "Informace od soudu" },
    IsBuyer: { DE: "Příklep jsem získal(a) já", TR: "Dražbu (ihale) jsem vyhrál(a) já" },
    AwardDate: {
      DE: { label: "Příklep vyhlášen dne", hint: "Ponechte prázdné = datum jednání" },
      TR: { label: "Protokol zveřejněn dne", hint: "Od tohoto dne běží sedmidenní lhůta k zaplacení" },
    },
    Shared: { label: "Zahrnout anonymně do cenového přehledu", hint: "Zobrazuje se pouze medián podle regionu a typu nemovitosti od pěti jednání — nikdy váš jednotlivý záznam." },
    Privacy: "K této spisové značce ukládáme datum jednání, výsledek, částky a počet dražitelů — nikdy jména dražitelů, vydražitelů ani vlastníků.",
    Save: "Uložit výsledek",
    Saved: "Uloženo.",
    SavedBuyer: "Uloženo. Váš kontrolní seznam po příklepu je připraven.",
    Errors: {
      auth: "Přihlaste se prosím znovu.",
      locked: "Kontrolní seznam po příklepu je součástí tarifu Investor.",
      date: "Zadejte prosím platné datum (ne před jednáním).",
      future: "Výsledky lze hlásit až ode dne dražebního jednání.",
      outcome: "Vyberte prosím výsledek.",
      bid: "U uděleného příklepu zadejte vítězný příhoz (celé číslo).",
      ratio: "Příhoz neodpovídá odhadní ceně — zkontrolujte prosím údaj.",
      bidders: "Zadejte prosím věrohodný počet dražitelů.",
      buyer: "Možnost „Příklep jsem získal(a) já“ lze zvolit pouze při výsledku „Příklep udělen“.",
      unknown: "Nepodařilo se uložit. Zkuste to prosím znovu.",
    },
    Ratio: "{pct} odhadní ceny",
    StatsLink: "Zobrazit cenový přehled",
  },

  Teaser: {
    Title: "Váš kontrolní seznam po příklepu",
    Lead: "Platba, daně, katastr, převzetí držby, pojištění, rekonstrukce — spočítáno s vašimi lhůtami.",
    Button: "Otevřít kontrolní seznam",
    Progress: "{done} z {total} splněno",
    Next: "Další: {title} · {date}",
    NoDate: "Zadejte datum příklepu, aby kontrolní seznam mohl vypočítat vaše lhůty.",
  },

  Tasks: {
    Kicker: "Po udělení příklepu",
    Title: "Kontrolní seznam po příklepu",
    Lead: {
      DE: "Od příklepu až po zápis do katastru a předání. Lhůty počítáme striktně z dat, která zadáte. Každé tvrzení uvádí své zákonné ustanovení.",
      TR: "Od dražby (ihale) až po zápis do Tapu a předání. Lhůty počítáme striktně z dat, která zadáte. Každé tvrzení uvádí své zákonné ustanovení.",
    },
    Back: "Zpět ke kartě případu",
    Disclaimer:
      "Tento kontrolní seznam slouží pouze pro orientaci a nepředstavuje právní poradenství. Zjednodušeně shrnuje zákonná ustanovení (stav k 26. 10. 2026) a nezohledňuje okolnosti vašeho konkrétního případu. Ohledně lhůt, výpovědí a vyklizení se obraťte na soud, notáře nebo advokáta.",
    Locked: {
      Title: "Kontrolní seznam v tarifu Investor",
      Body: "Váš výsledek byl uložen. Kontrolní seznam po příklepu s vypočtenými lhůtami a připomínkami je součástí tarifu Investor.",
      Cta: "Přejít na Investor",
    },
    Dates: {
      Title: "Vaše termíny",
      Lead: "Z těchto dat kontrolní seznam počítá lhůty. Co zatím neznáte, ponechte prázdné.",
      Fields: {
        DE: {
          awardDate: { label: "Příklep vyhlášen dne", hint: "Povinné" },
          distributionDate: { label: "Rozvrhové jednání (Verteilungstermin)", hint: "Uvedeno v soudním předvolání" },
          taxNoticeDate: { label: "Výměr daně z nabytí nemovitosti ze dne", hint: "Datum doručení" },
          handoverDate: { label: "Předání / vyklizení dne", hint: "Plánováno nebo provedeno" },
        },
        TR: {
          awardDate: { label: "Protokol o dražbě zveřejněn dne", hint: "Povinné — spouští 7denní lhůtu" },
          handoverDate: { label: "Předání / vyklizení dne", hint: "Plánováno nebo provedeno" },
        },
      },
      FromPortfolio: "Předvyplněno z vašeho portfolia — prosím uložte.",
      Save: "Uložit termíny",
      Saved: "Uloženo.",
      Required: "Zadejte prosím alespoň datum příklepu.",
      Errors: {
        auth: "Přihlaste se prosím znovu.",
        locked: "Kontrolní seznam po příklepu je součástí tarifu Investor.",
        date: "Zadejte prosím alespoň datum příklepu.",
        unknown: "Nepodařilo se uložit. Zkuste to prosím znovu.",
      },
    },
    Conditions: {
      Title: "Vaše situace",
      Lead: "Zobrazí pouze úkoly, které se týkají vaší nemovitosti. Uloženo v tomto prohlížeči.",
      Items: { tenant: "V nemovitosti jsou nájemníci", ownerOccupied: "Bývalý vlastník tam stále bydlí", condo: "Bytová jednotka", house: "Rodinný dům nebo dvojdomek" },
    },
    Phases: { first: "První dny", payment: "Platba", register: "Daně a katastr", possession: "Držba a nájemníci", works: "Rekonstrukce a provoz" },
    Due: { deadline: "do {date}", earliest: "nejdříve {date}", on: "od {date}" },
    Missing: "Chybí datum: {field}",
    States: { done: "Splněno", overdue: "Po termínu", soon: "Blíží se termín", open: "Otevřeno", undated: "Bez data" },
    Basis: { law: "Zákon", practice: "Postup", rule: "Pravidlo Belowmark" },
    Check: "Právní úprava změněna nebo není ustálena — ověřte",
    MarkDone: "Hotovo",
    MarkOpen: "Znovu otevřít",
    Sources: "Zdroje",
    Progress: "{done} z {total} splněno",
    Items: CLOSING_TASKS_CS,
  },

  Results: {
    Kicker: "Výsledky jednání",
    Title: "Za kolik se skutečně draží",
    Lead: "Nahlášené vítězné příhozy v poměru k odhadní ceně. Údaje pocházejí od uživatelů, nikoli od soudů — ukazují obecnou cenovou hladinu, nikoli ocenění vaší nemovitosti.",
    Method: {
      Title: "Jak počítáme",
      Items: [
        "Poměr = (nejvyšší podání + zůstávající práva) ÷ odhadní cena podle úřední vyhlášky.",
        "Pokud totéž jednání nahlásí více uživatelů, započítá se jednou pomocí mediánu hlášení.",
        "Údaje zobrazujeme až od pěti jednání v dané skupině. Pod touto hranicí uvádíme pouze počet.",
        "V přehledu se nezobrazují žádná jména ani spisové značky. Svá vlastní hlášení vidíte pouze vy.",
      ],
    },
    Table: { Region: "Region", Segment: "Typ nemovitosti", Awarded: "Příklepy", Median: "Medián", Range: "Střední polovina (IQR)", Bidders: "Dražitelé (medián)", Reported: "Nahlášená jednání" },
    AllSegments: "Všechny typy nemovitostí",
    Total: "Celkem",
    OtherRegion: "Bez regionu",
    TooFew: "{n} — příliš málo (od {min})",
    Empty: "Ve vašem trhu zatím nejsou žádná hlášení. Přehled se začne plnit, jakmile uživatelé zadají výsledky jednání na kartě případu v sekci „Výsledek a příklep“.",
    Locked: "Cenový přehled je součástí tarifu Investor. Výsledky však můžete hlásit i bez něj.",
    Own: { Title: "Vaše hlášení", Lead: "Viditelné pouze vám.", Empty: "Zatím jste nenahlásili žádné výsledky.", Shared: "v přehledu", Private: "soukromé", Buyer: "Váš příklep" },
  },
};
