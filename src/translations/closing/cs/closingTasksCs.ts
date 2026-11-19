import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Texty úkolů v češtině pro oba trhy. Každé tvrzení má svůj zdroj v closingTasks.ts. */
export const CLOSING_TASKS_CS: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Zajistěte si usnesení o příklepu (Zuschlagsbeschluss)",
      detail:
        "Udělením příklepu se stáváte vlastníkem ještě před zápisem do katastru nemovitostí (§ 90 ZVG). Nechte si usnesení předat nebo zaslat a pečlivě jej uschovejte: později slouží také jako exekuční titul pro vyklizení. Soudní poplatek za příklep soud vyúčtuje zvlášť (0,5 poplatku dle KV 2214 GKG).",
    },
    "de.appeal": {
      title: "Vyčkejte na nabytí právní moci (Rechtskraft)",
      detail:
        "Proti příklepu lze podat okamžitou stížnost (sofortige Beschwerde). Pro všechny přítomné při dražebním nebo vyhlašovacím jednání začíná lhůta vyhlášením (§ 98 ZVG) a trvá dva týdny (§ 569 ZPO). Pro nepřítomné účastníky běží až od doručení — právní moc tak může nastat později. Do té doby neobjednávejte žádné práce, které nelze zrušit.",
    },
    "de.risk": {
      title: "Nakládejte s nemovitostí ode dneška jako se svou",
      detail:
        "Nebezpečí nahodilé zkázy přechází na vás udělením příklepu spolu s užitky a břemeny (§ 56 ZVG). Zkontrolujte, zda je nemovitost zabezpečena (neobsazenost, mráz, přístup), a zdokumentujte její stav datovanými fotografiemi.",
    },
    "de.insurerNotice": {
      title: "Informujte pojistitele budovy",
      detail:
        "Stávající pojištění budovy přechází na vás (§ 99 ve spojení s § 95 VVG). Nabytí musíte pojistiteli bezodkladně oznámit, jinak se pojistitel může zprostit plnění (§ 97 VVG). Zjistěte si pojišťovnu a číslo pojistky u exekučního soudu nebo ve znaleckém posudku. Pokud žádné pojištění neexistuje, pojistěte nemovitost okamžitě sami.",
    },
    "de.insuranceCancel": {
      title: "Prověřte převzaté pojištění a případně jej vypovězte",
      detail:
        "Převzatou pojistku můžete vypovědět s okamžitou účinností nebo ke konci běžného pojistného období, ale pouze do jednoho měsíce od nabytí — případně do jednoho měsíce poté, co jste se o pojistce dozvěděli, pokud jste o ní nevěděli (§ 96 odst. 2 VVG). Vypovídejte až ve chvíli, kdy máte zajištěno plynulé náhradní krytí.",
    },
    "de.charges": {
      title: "Převezměte běžné poplatky a energie",
      detail:
        "Od udělení příklepu nesete všechny běžné náklady (§ 56 ZVG): poměrnou daň z nemovitosti, příspěvky SVJ (Hausgeld) u bytů, elektřinu, vodu a topení. Zapište stavy měřidel a informujte dodavatele energií a případně správce domu (WEG-Verwaltung). Nedoplatky předchozího vlastníka na Hausgeld se hradí z výtěžku dražby (2. pořadí, § 10 odst. 1 č. 2 ZVG); podle Spolkového soudního dvora (BGH V ZR 209/12) toto privilegium nezakládá věcnou odpovědnost vydražitele.",
    },
    "de.interest": {
      title: "Pamatujte na 4% úrok z peněžní části podání (Bargebot)",
      detail:
        "Peněžní část nejvyššího podání se ode dne příklepu úročí (§ 49 odst. 2 ZVG) sazbou 4 % ročně (§ 246 BGB). Úroky běží až do zaplacení. Ověřte si u soudního úředníka (Rechtspfleger), zda má ve vašem případě smysl dřívější složení do soudní úschovy (§ 49 odst. 4 ZVG).",
    },
    "de.summons": {
      title: "Zadejte předvolání k rozvrhovému jednání (Verteilungstermin)",
      detail:
        "Po příklepu soud nařídí rozvrhové jednání a předvolá vás jako vydražitele; předvolání musí být doručeno alespoň dva týdny předem (§ 105 ZVG). Zadejte datum výše — kontrolní seznam z něj vypočte lhůty pro platbu a jednání.",
    },
    "de.financing": {
      title: "Slaďte čerpání úvěru s bankou",
      detail:
        "Pravidlo Belowmark: vaše banka by měla znát datum čerpání alespoň dva týdny před rozvrhovým jednáním. Předejte jí spisovou značku, údaje soudní pokladny (Gerichtskasse) a platební referenci z předvolání. Bankovní spis toto vše pro banku přehledně shrnuje.",
    },
    "de.pay": {
      title: "Převeďte peněžní část podání (Bargebot)",
      detail:
        "Peněžní část podání musí být uhrazena před rozvrhovým jednáním bankovním převodem na účet soudní pokladny (Gerichtskasse); částka musí být připsána před jednáním a doklad o platbě předložen na jednání (§ 49 odst. 1, 3 ZVG). Hotovostní platba není přípustná. Tento seznam plánuje převod pět dnů předem — jde o bezpečnostní rezervu, nikoli zákonnou lhůtu.",
    },
    "de.attend": {
      title: "Rozvrhové jednání (Verteilungstermin)",
      detail:
        "Vezměte s sebou doklad o zaplacení (§ 49 odst. 3 ZVG). Na jednání se sestaví a provede rozvrhový plán (Teilungsplan) — to je nezbytný předpoklad pro váš zápis do katastru nemovitostí (§ 130 ZVG).",
    },
    "de.default": {
      title: "Poznejte důsledky nezaplacení",
      detail:
        "Pokud nezaplatíte, rozvrhový plán se provede převodem pohledávky vůči vám na oprávněné věřitele (§ 118 ZVG). Ti pak proti vám mohou okamžitě vést novou dražbu (Wiederversteigerung) bez nového exekučního titulu (§ 133 ZVG). Zůstáváte vlastníkem i dlužníkem — odstoupení není možné.",
    },
    "de.taxNotice": {
      title: "Zaplaťte daň z nabytí nemovitosti (Grunderwerbsteuer)",
      detail:
        "Soud oznámí udělení příklepu finančnímu úřadu (§ 18 odst. 1 č. 3 GrEStG). Daň je splatná jeden měsíc po doručení platebního výměru (§ 15 GrEStG). Datum výměru zadejte výše.",
    },
    "de.clearance": {
      title: "Potvrzení o bezdlužnosti (Unbedenklichkeitsbescheinigung)",
      detail:
        "Bez něj nebudete zapsáni do katastru nemovitostí (§ 22 odst. 1 GrEStG). Finanční úřad jej vystaví po zaplacení, zajištění nebo odložení daně (§ 22 odst. 2 GrEStG) a obvykle jej zasílá přímo soudu nebo katastru. Pokud po platbě uplyne několik týdnů, urgujte jej.",
    },
    "de.courtFees": {
      title: "Uhraďte soudní a katastrální poplatky",
      detail:
        "Poplatek za příklep (0,5 poplatku dle KV 2214 GKG z nejvyššího podání plus zůstávajících práv) a později poplatek za zápis vlastnictví do katastru (1,0 poplatku dle KV 14110 GNotKG). Tyto částky zobrazuje kalkulačka limitu příhozu na kartě případu.",
    },
    "de.registry": {
      title: "Vyčkejte na žádost soudu o zápis do katastru (Grundbuchersuchen)",
      detail:
        "Jakmile je proveden rozvrhový plán a příklep je pravomocný, požádá soud katastrální úřad o váš zápis jako vlastníka a o výmaz zaniklých práv i poznámky o dražbě (§ 130 odst. 1 ZVG). Zástavní právo (Grundschuld) pro vaši banku lze zapsat až poté (§ 130 odst. 3 ZVG).",
    },
    "de.extract": {
      title: "Zkontrolujte výpis z katastru nemovitostí",
      detail:
        "Po zápisu si vyžádejte výpis: jste zapsáni jako vlastník? Byly vymazány poznámka o dražbě a zaniklá práva? Zůstala jen ta práva, která podle dražebních podmínek měla zůstat zachována?",
    },
    "de.eviction": {
      title: "Vyklizení na základě usnesení o příklepu",
      detail:
        "Proti uživateli bez zachovaného práva — například bývalému vlastníkovi — slouží samotné usnesení o příklepu jako exekuční titul k vyklizení (§ 93 odst. 1 ZVG). Potřebujete vykonatelný stejnopis s doložkou o doručení (§ 750 ZPO) a pověříte soudního vykonavatele (§ 885 ZPO); omezený příkaz k vyklizení podle § 885a ZPO může ušetřit náklady. Nelze použít proti osobám s právem, které příklepem nezaniká (§ 93 odst. 1 věta 2 ZVG). Náklady vynaložené před příklepem nemusíte hradit (§ 93 odst. 2 ZVG).",
    },
    "de.tenantTakeover": {
      title: "Převezměte stávající nájemní vztahy",
      detail:
        "Stávající nájemní a pachtovní smlouvy přecházejí na vás (§ 57 ZVG ve spojení s § 566 BGB). Písemně informujte nájemníky o změně vlastníka a novém bankovním účtu. Za vrácení kauce můžete odpovídat i tehdy, pokud jste ji od předchozího vlastníka nikdy neobdrželi (§ 566a BGB) — vyžádejte si doklad o kauci.",
    },
    "de.tenantNotice": {
      title: "Zvláštní právo výpovědi: pouze k nejbližšímu možnému termínu",
      detail:
        "Můžete podat výpověď se zákonnou výpovědní lhůtou, ale pouze k prvnímu přípustnému termínu — jinak toto zvláštní právo zaniká (§ 57a ZVG). U nájmu bytu musí výpověď dojít nájemníkovi nejpozději třetí pracovní den v měsíci (§ 573c BGB). Zákonná ochrana nájemníků nadále platí: potřebujete oprávněný zájem, např. vlastní potřebu (§ 573 BGB). Zde uvedené datum je vypočteno konzervativně (soboty se počítají jako pracovní dny, svátky nejsou odečteny) — nechte výpověď zkontrolovat právníkem.",
    },
    "de.handover": {
      title: "Zdokumentujte předání nemovitosti",
      detail:
        "Klíče, stavy měřidel, stav nemovitosti na fotografiích, závady, zanechané věci — s datem a podpisy. Jakmile nabudete držbu, vyměňte zámky.",
    },
    "de.inspect": {
      title: "Zmapujte skutečný stav a naplánujte rekonstrukci",
      detail:
        "Záruka za vady se neposkytuje (§ 56 ZVG). Porovnejte skutečný stav se znaleckým posudkem a před zadáním prací si vyžádejte cenové nabídky. Odhady rekonstrukce v kalkulačce limitu příhozu pak můžete nahradit skutečnými nabídkami.",
    },
    "de.energy": {
      title: "Povinné energetické úpravy po změně vlastníka",
      detail:
        "U rodinných domů a dvojdomků, které předchozí vlastník obýval k 1. 2. 2002, přecházejí některé povinnosti dodatečných úprav (např. zateplení stropu nejvyššího podlaží) na nového vlastníka s dvouletou lhůtou od přechodu vlastnictví (dříve § 47 GEG). Zákon GEG byl v roce 2026 nahrazen zákonem o modernizaci budov (Gebäudemodernisierungsgesetz) — aktuální pravidla ověřte u energetického poradce.",
    },
    "de.permits": {
      title: "Před stavebními úpravami ověřte povolení",
      detail:
        "Zda přestavby, změna užívání nebo zásahy do památkově chráněné budovy vyžadují povolení, se řídí zemským právem (stavební řád, zákon o památkové péči). Před zahájením prací se informujte na místním stavebním úřadě.",
    },
    "de.condo": {
      title: "Vyžádejte si podklady společenství vlastníků (WEG)",
      detail:
        "U bytových jednotek: oznamte správci domu změnu vlastníka a vyžádejte si hospodářský plán (Wirtschaftsplan), poslední roční vyúčtování, sbírku usnesení a prohlášení o rozdělení domu (Teilungserklärung). Dejte pozor na schválené mimořádné příspěvky (Sonderumlagen).",
    },
  },
  TR: {
    "tr.pay": {
      title: "Zaplaťte vydraženou cenu (ihale bedeli) — 7 dnů",
      detail:
        "Kupní cenu a poplatky je nutné uhradit do sedmi dnů od zveřejnění protokolu o výsledku dražby (artırma sonuç tutanağı), a to i v případě, že někdo podal návrh na zrušení dražby (Elektronik Satış Yönetmeliği čl. 20/1; İİK čl. 130). Od zákona č. 7343 již neexistuje desetidenní prodloužení. Datum zveřejnění protokolu zadejte výše.",
    },
    "tr.fees": {
      title: "Připravte daně a poplatky podle dražebních podmínek (Şartname)",
      detail:
        "Katastrální poplatek (tapu harcı) činí 20 ‰ z prodejní ceny pro každou stranu (zákon č. 492 Harçlar Kanunu, sazebník 4 čl. 20/a). Pokud dražební podmínky (Şartname) ukládají veškeré poplatky Tapu kupujícímu, ministerstvo spravedlnosti to považuje za přípustné (İİDB, 12. 1. 2023) — celkem tedy 40 ‰. Připočtěte DPH (KDV) dle vyhlášky a kolkové (damga vergisi). Pročtěte si Şartname vašeho řízení.",
    },
    "tr.default": {
      title: "Poznejte důsledky nezaplacení",
      detail:
        "Pokud není zaplaceno včas, exekuční úřad příklep (ihale) zruší a vy odpovídáte za případný cenový rozdíl (İİK čl. 133). U dražeb vyhlášených od 31. 7. 2026 platí navíc pokuta 5 % z výše příhozu (İİK čl. 114 ve znění zákona č. 7589).",
    },
    "tr.annulment": {
      title: "Vyčkejte na uplynutí lhůty pro zrušení dražby (ihalenin feshi)",
      detail:
        "Zúčastněné osoby mohou do sedmi dnů požádat o zrušení dražby (ihalenin feshi, İİK čl. 134), ve zvláštních případech od nabytí vědomosti až do jednoho roku. Dokud řízení probíhá, nelze vlastnictví zapsat. Do té doby neobjednávejte žádné práce, které nelze zrušit.",
    },
    "tr.registry": {
      title: "Sledujte zápis do katastru (tescil)",
      detail:
        "Jakmile příklep nabude právní moci (kesinleşme) a je zaplacen, zašle exekuční úřad katastrálnímu úřadu Tapu úřední žádost (tescil müzekkeresi) o váš zápis jako vlastníka (İİK čl. 134). Ověřte si, zda byla žádost odeslána.",
    },
    "tr.deed": {
      title: "Zkontrolujte zápis v Tapu",
      detail:
        "Po zápisu si přes e-Devlet (Tapu Bilgileri) ověřte: jste uveden jako vlastník a byly vymazány exekuce (haciz) a hypotéky (ipotek)?",
    },
    "tr.dask": {
      title: "Uzavřete nové pojištění proti zemětřesení DASK",
      detail:
        "Povinné pojištění proti zemětřesení je ze zákona povinné (zákon č. 6305). Od 5. 9. 2026 pojistka předchozího vlastníka již nepřechází a zápisem zaniká (Všeobecné podmínky DASK, Úřední věstník 21. 8. 2026/33347). Uzavřete vlastní pojistku; dodavatelé energií ji často vyžadují pro nové přípojky. Ověřte na úřadu Tapu, zda ji kontrolují při zápisu po dražbě.",
    },
    "tr.propertyTax": {
      title: "Vyřiďte registraci k dani z nemovitosti (emlak vergisi)",
      detail:
        "Převod vlastnictví zakládá ohlašovací povinnost u obce (zákon č. 1319 čl. 23); vaše daňová povinnost začíná následujícím kalendářním rokem (čl. 33). Ověřte u obce, zda postačuje oznámení úřadu Tapu, a vyžádejte si výpis případných daňových nedoplatků na nemovitosti.",
    },
    "tr.eviction": {
      title: "Vyklizení prostřednictvím exekučního úřadu",
      detail:
        "Pokud v nemovitosti bydlí dlužník nebo uživatel bez právního titulu, doručí exekuční úřad na vaši žádost 15denní výzvu k vyklizení a následně provede nucené vyklizení (İİK čl. 135/2). Nájemníci s úředně datovanou smlouvou z doby před obstavením jsou chráněni (viz Nájemníci). S podáním žádosti neotálejte.",
    },
    "tr.tenant": {
      title: "Nájemníci: nájemní smlouva přechází na vás",
      detail:
        "Nový vlastník vstupuje do nájemní smlouvy (TBK čl. 310). Pokud chcete vypovědět nájem pro vlastní potřebu, musíte nájemníka písemně vyrozumět do jednoho měsíce od nabytí a žalobu na vyklizení můžete podat nejdříve po šesti měsících (TBK čl. 351). Ověřte u právníka, které datum se u dražby počítá jako nabytí — tento seznam počítá konzervativně ode dne dražby.",
    },
    "tr.handover": {
      title: "Zdokumentujte předání nemovitosti",
      detail:
        "Klíče, stavy měřidel, stav nemovitosti s datovanými fotografiemi. Převeďte odběry elektřiny, vody a plynu (abonelik) na své jméno a vyměňte zámky.",
    },
    "tr.inspect": {
      title: "Zmapujte skutečný stav a naplánujte rekonstrukci",
      detail:
        "Porovnejte skutečný stav se znaleckým posudkem (kıymet takdir raporu) a před zadáním zakázek si vyžádejte cenové nabídky.",
    },
    "tr.permits": {
      title: "Povolení ke stavebním úpravám",
      detail:
        "Přestavby mohou vyžadovat stavební povolení (yapı ruhsatı, zákon č. 3194 İmar Kanunu čl. 21). Před zahájením prací se informujte na obci.",
    },
    "tr.condo": {
      title: "Informujte správu domu",
      detail:
        "U bytů v osobním vlastnictví: oznamte změnu správě domu (yönetim) a vyžádejte si výši měsíčních poplatků (aidat) a plán správy (yönetim planı, zákon č. 634 Kat Mülkiyeti Kanunu).",
    },
  },
};
