import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export function vatSentenceCs(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") {
    return "Všechny ceny jsou konečné. Podle § 19 německého zákona o dani z přidané hodnoty (UStG) se daň z přidané hodnoty neúčtuje.";
  }
  return "Všechny ceny jsou konečné a zahrnují příslušnou zákonnou daň z přidané hodnoty (DPH).";
}

export function termsCs(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Obchodní podmínky (AGB)",
    asOf: "Stav k 31. říjnu 2026",
    basis: "Pro používání platformy Belowmark (belowmark.com).",
    sections: [
      {
        id: "geltung",
        heading: "1. Rozsah platnosti a smluvní strany",
        paragraphs: [
          `Tyto obchodní podmínky platí pro všechny smlouvy o užívání online služby Belowmark uzavřené mezi ${operatorAddress()} (dále jen „Poskytovatel“) a zákazníkem.`,
          "Spotřebitelem je každá fyzická osoba, která uzavírá právní jednání za účelem, který nelze převážně přičítat její podnikatelské ani samostatné výdělečné činnosti (§ 13 německého občanského zákoníku, BGB). Odchylné podmínky zákazníka platí pouze tehdy, pokud s nimi Poskytovatel výslovně souhlasí.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Předmět služby",
        paragraphs: [
          "Belowmark shromažďuje veřejně vyhlašované informace o soudních a veřejných dražbách nemovitostí v Evropě (Německo, Rakousko, Švýcarsko, Itálie, Španělsko, Francie, Velká Británie, Česká republika a další podporované trhy) a Turecku, strukturuje je a počítá klíčové ukazatele (např. zákonné hranice příhozu, dražební jistoty a pořizovací náklady). Po dobu trvání smlouvy získává zákazník osobní přístup do webové aplikace pro trh zvolený při registraci.",
          "Belowmark je vyhledávací a analytická pomůcka pro due diligence. Služba nepředstavuje právní, daňové, realitní ani investiční poradenství a neobsahuje žádné doporučení podat konkrétní příhoz. Každý údaj musí být před jakýmkoli finančním rozhodnutím ověřen podle oficiálních původních soudních či dražebních spisů.",
          "Data pocházejí ze zdrojů třetích stran (justiční a úřední portály, úřední věstníky a inzertní portály). Poskytovatel nepřebírá žádnou záruku za správnost, úplnost ani aktuálnost těchto údajů; záznamy mohou být neúplné. Vypočtené hodnoty jsou matematickými výsledky vycházejícími z těchto údajů a nepředstavují znalecké posudky.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Tarify a ceny",
        paragraphs: [
          "Free Scout: bezplatný, časově neomezený tarif s omezeným rozsahem (seznam nemovitostí viditelný, odhadní ceny a termíny dražeb uzamčené). Nejsou vyžadovány žádné platební údaje.",
          "Zkušební období: Po ověření e-mailové adresy získává zákazník bezplatně rozsah přístupu Investor na 14 dnů. Zkušební období končí automaticky a nepřejde v placené předplatné.",
          "Investor Měsíční: Plný individuální přístup za 39,00 € / 35 £ / 39 CHF (evropské trhy) nebo 599,00 TL (turecký trh) měsíčně, splatný předem, s automatickým měsíčním prodlužováním do vypovězení.",
          "Investor Tři měsíce: Plný individuální přístup na tři kalendářní měsíce za jednorázovou platbu 99,00 € / 89 £ / 99 CHF (evropské trhy) nebo 1 490,00 TL (turecký trh), splatnou předem. Neprodlužuje se automaticky; výpověď není nutná.",
          "Pro Měsíční: Plný přístup včetně klientských odkazů s vlastní hlavičkou a sdílených týmových seznamů (až 3 týmy po až 5 místech) za 129,00 € / 115 £ / 129 CHF (evropské trhy) nebo 1 990,00 TL (turecký trh) měsíčně, splatný předem, s automatickým měsíčním prodlužováním.",
          "Pro Tři měsíce: Plný přístup Pro na tři kalendářní měsíce za jednorázovou platbu 329,00 € / 295 £ / 329 CHF (evropské trhy) nebo 4 990,00 TL (turecký trh), splatnou předem. Neprodlužuje se automaticky; výpověď není nutná. Rozšířené firemní týmové kvóty (od 299,00 € měsíčně) se sjednávají individuálně po předchozí poptávce.",
          vatSentenceCs(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Uzavření smlouvy",
        paragraphs: [
          "Registrací a ověřením e-mailové adresy vzniká bezplatná uživatelská smlouva (Free Scout se zkušebním obdobím).",
          "Placený přístup Investor nebo Pro se objednává v účtu prostřednictvím souhrnné stránky objednávky, kde jsou shrnuty tarif, cena, doba trvání a podmínky prodlužování. Kliknutím na tlačítko „Objednat s povinností platby“ podává zákazník závazný návrh a je přesměrován na platební stránku poskytovatele Stripe. Smlouva je uzavřena okamžikem, kdy Stripe potvrdí platbu a Poskytovatel aktivuje přístup; zákazník obdrží potvrzení e-mailem.",
          "Poskytovatel uchovává text smlouvy (objednávku, tarif, cenu a aktuální znění těchto podmínek) a zasílá jej zákazníkovi e-mailem spolu s potvrzením objednávky. Aktuální znění těchto podmínek je vždy dostupné na belowmark.com/agb.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Platba a faktury",
        paragraphs: [
          "Platby zpracovává společnost Stripe Payments Europe, Ltd. (Irsko). Platební údaje se zadávají výhradně na platební stránce Stripe a Poskytovatel je nikdy neukládá.",
          "Měsíční předplatná se účtují předem na začátku každého zúčtovacího období. Faktury jsou dostupné v účtu v sekci „Faktury a platební metody“ a jsou zasílány e-mailem.",
          "Pokud inkaso selže, Stripe se pokusí platbu strhnout opakovaně. Zůstane-li platba neuhrazena, plný přístup skončí na konci již zaplaceného období, přičemž bezplatný přístup k účtu zůstane zachován.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Doba trvání a výpověď",
        paragraphs: [
          "Měsíční předplatná Investor a Pro se uzavírají na dobu neurčitou a lze je kdykoli vypovědět ke konci již zaplaceného měsíce. Plný přístup zůstává aktivní do tohoto data. Při řádné výpovědi se poměrná část za běžící zúčtovací měsíc nevrací.",
          `Výpověď lze podat prostřednictvím tlačítka „Zrušit smlouvy zde“ v patičce každé stránky (přístupného i bez přihlášení), v nastavení účtu, v zákaznickém portálu Stripe nebo v textové formě na ${LEGAL_OPERATOR.email}. Po podání výpovědi přes výpovědní tlačítko obdrží zákazník ihned e-mailem potvrzení obsahující text prohlášení, datum a čas přijetí a datum ukončení smlouvy.`,
          "Tříměsíční balíčky končí automaticky uplynutím objednaných kalendářních měsíců. Bezplatnou smlouvu Free Scout lze kdykoli ukončit smazáním účtu.",
          "Právo obou stran na mimořádnou výpověď z důležitého důvodu zůstává nedotčeno.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Právo na odstoupení od smlouvy a jeho zánik u digitálního obsahu (§ 356 odst. 5 BGB)",
        paragraphs: [
          "Belowmark je digitální produkt, který je aktivován okamžitě po přijetí platby. Přijetím těchto obchodních podmínek během objednávkového procesu zákazník výslovně souhlasí s tím, aby Poskytovatel zahájil plnění smlouvy (poskytnutí a okamžitou aktivaci placeného digitálního přístupu) před uplynutím zákonné lhůty pro odstoupení od smlouvy, a potvrzuje, že vzal na vědomí, že aktivací přístupu jeho zákonné právo na odstoupení okamžitě zaniká (podle § 356 odst. 5 německého občanského zákoníku, BGB).",
          "Úplné poučení o zániku práva na odstoupení dle § 356 odst. 5 BGB je dostupné na belowmark.com/widerruf a je zákazníkovi zasíláno e-mailem společně s potvrzením smlouvy.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Dostupnost služby",
        paragraphs: [
          "Poskytovatel usiluje o nepřetržitou dostupnost služby, avšak nezaručuje konkrétní procento dostupnosti. Údržba, výpadky třetích stran nebo nedostupnost oficiálních zdrojových portálů mohou dočasně omezit přístup nebo aktuálnost databáze.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Užívací práva, zákaz scrapingu a zablokování účtu bez nároku na vrácení peněz",
        paragraphs: [
          "Zákazník získává nevýhradní, nepřenosné právo užívat službu po dobu trvání smlouvy výhradně pro vlastní rešeršní účely prostřednictvím běžného webového prohlížeče. Přísně zakázáno je: (a) sdílení přihlašovacích údajů nebo společné užívání účtu více osobami mimo objednaná týmová místa, (b) jakékoli systematické, automatizované nebo skriptované načítání, vytěžování, kopírování či indexování dat, textů, ukazatelů nebo dokumentů (zejména pomocí botů, crawlerů, scraperů, headless prohlížečů či skriptů), (c) obcházení technických ochranných opatření, limitů požadavků nebo bezpečnostních mechanismů (včetně spouštění honeypot pastí) a (d) hromadné stahování, další prodej, sublicencování nebo zveřejňování zpracovaných dat či dokumentů.",
          "Jakékoli porušení výše uvedených zákazů představuje podstatné porušení smlouvy a opravňuje Poskytovatele k okamžité mimořádné výpovědi z důležitého důvodu (§ 314 BGB) a k okamžitému, trvalému zablokování uživatelského účtu i identifikátoru zařízení bez předchozího upozornění.",
          "V případě takového zablokování účtu nebo mimořádné výpovědi zaviněné porušením smlouvy ze strany zákazníka (zejména při scrapingu, automatizovaném stahování dat nebo obcházení bezpečnostních mechanismů) právo užívání zaniká s okamžitou účinností. Jakýkoli nárok zákazníka na vrácení či poměrnou refundaci již zaplacených poplatků za běžící zúčtovací měsíc nebo objednané víceměsíční balíčky je v takovém případě vyloučen. Další nároky Poskytovatele na náhradu škody a zdržení se jednání zůstávají nedotčeny.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Odpovědnost",
        paragraphs: [
          "Poskytovatel odpovídá bez omezení v případě úmyslu a hrubé nedbalosti, při újmě na životě, těle nebo zdraví a podle kogentních předpisů o odpovědnosti za výrobek. V případě lehké nedbalosti odpovídá Poskytovatel pouze za porušení podstatných smluvních povinností (povinností, jejichž splnění teprve umožňuje řádné plnění smlouvy a na jejichž dodržení se zákazník může běžně spoléhat), a to v rozsahu předvídatelné škody typické pro tento typ smlouvy.",
          "Pokud nejde o případ podle předchozího odstavce, neodpovídá Poskytovatel za finanční rozhodnutí zákazníka, zejména za příhozy učiněné v dražbách a jejich důsledky.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Změny těchto podmínek a cen",
        paragraphs: [
          "Poskytovatel oznámí zákazníkovi v textové formě jakékoli změny těchto podmínek nebo cen měsíčních předplatných nejméně šest týdnů před jejich účinností. Změny nabývají účinnosti pouze tehdy, pokud s nimi zákazník souhlasí; nesouhlasí-li zákazník, může kterákoli ze stran smlouvu vypovědět ke dni účinnosti změny.",
        ],
      },
      {
        id: "recht",
        heading: "12. Rozhodné právo a příslušnost soudu",
        paragraphs: [
          "Použije se německé právo s vyloučením Úmluvy OSN o smlouvách o mezinárodní koupi zboží (CISG). Ve vztahu ke spotřebitelům platí tato volba práva pouze tehdy, nezbavuje-li spotřebitele ochrany poskytované kogentními ustanoveními právního řádu státu, v němž má spotřebitel obvyklé bydliště.",
          `Je-li zákazníkem podnikatel (Kaufmann), právnická osoba veřejného práva nebo veřejnoprávní zvláštní majetek, je výlučně místně příslušným soudem sídlo Poskytovatele (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
