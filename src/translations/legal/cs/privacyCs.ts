import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const PRIVACY_CS: LegalDocument = {
  title: "Zásady ochrany osobních údajů",
  asOf: "Stav k 31. říjnu 2026",
  basis: "Informace podle čl. 13 a 14 obecného nařízení EU o ochraně osobních údajů (GDPR).",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Správce osobních údajů",
      paragraphs: [
        `${operatorAddress()}. E-mail ${LEGAL_OPERATOR.email}, telefon ${LEGAL_OPERATOR.phone}. Pověřence pro ochranu osobních údajů jsme nejmenovali, protože k tomu neexistuje zákonná povinnost.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Návštěva webových stránek",
      paragraphs: [
        "Při načtení každé stránky zpracovává server technicky nezbytné údaje: IP adresu, časové razítko, požadovanou URL, hlavičku User-Agent a stavový kód serveru. Právním základem je čl. 6 odst. 1 písm. f) GDPR; naším oprávněným zájmem je bezpečný a bezporuchový provoz.",
        `Samotná aplikace nezapisuje přístupové protokoly. Protokoly mohou vznikat u poskytovatele hostingu: ${filled(LEGAL_OPERATOR.hosting, "Doplnit poskytovatele hostingu, umístění serveru a dobu uchovávání protokolů")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Uživatelský účet a přihlášení",
      paragraphs: [
        "U účtu ukládáme: e-mailovou adresu, kryptografický otisk hesla (scrypt, nikdy v otevřené podobě), zvolený trh a jazyk, časové razítko ověření e-mailu, datum konce zkušební doby, objednaný tarif a jeho trvání a čas posledního přihlášení. Právním základem je čl. 6 odst. 1 písm. b) GDPR (plnění smlouvy).",
        "Pro každé přihlášení vedeme serverovou relaci obsahující hash hlavičky User-Agent prohlížeče, zkrácenou IP adresu a čas vypršení. To nám umožňuje odhalit odcizené relační cookies a odhlásit všechna zařízení. Právním základem je čl. 6 odst. 1 písm. f) GDPR (zabezpečení účtu). Relace vyprší automaticky.",
        "Při registraci a přihlášení vypočítá váš prohlížeč hash hardwarového otisku z technických parametrů (grafický adaptér, obrazovka, jádra CPU, časové pásmo) a uloží jej do lokálního úložiště („ec_hw_id“). Slouží výhradně k rozpoznání zablokovaných zařízení a ochraně účtů před automatizovanými útoky (§ 25 odst. 2 č. 2 TDDDG, čl. 6 odst. 1 písm. f) GDPR).",
        "Nová hesla kontrolujeme proti známým únikům dat (Have I Been Pwned). Přenáší se pouze prvních pět znaků SHA-1 otisku, nikdy samotné heslo (k-anonymita). Právním základem je čl. 6 odst. 1 písm. f) GDPR.",
        "Pro prevenci zneužití počítáme požadavky podle IP adresy a e-mailové adresy v krátkých časových oknech (minuty až hodiny).",
      ],
    },
    {
      id: "app",
      heading: "4. Obsah vytvářený ve vašem účtu",
      paragraphs: [
        "Uložené seznamy sledovaných nemovitostí s poznámkami a uložená vyhledávání (hlídače) se ukládají v naší databázi. U hlídačů zasíláme e-maily, dokud je hlídač aktivní. Nahrané soubory PDF se znaleckými posudky se analyzují; ukládáme pouze vytažený výsledek analýzy (název souboru, nalezené pasáže s čísly stran), nikoli samotný soubor PDF. Právním základem je čl. 6 odst. 1 písm. b) GDPR.",
        "Pokud je aktivována rozšířená analýza posudku, předává se text nahraného posudku našemu zpracovateli AI pro strukturovanou extrakci (na základě standardních smluvních doložek EU dle čl. 46 odst. 2 písm. c) GDPR).",
        "Kontrolní seznamy due diligence, vstupy do kalkulačky limitu příhozu, osobní poznámky k verdiktu, srovnávací hodnoty a bankovní spis se ukládají výhradně do lokálního úložiště vašeho prohlížeče („belowmark:…“). Tyto údaje se na náš server nikdy nedostanou.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Objednávka a platba",
      paragraphs: [
        "Při objednávce ukládáme záznam objednávky: tarif, cenu, trh, verzi obchodních podmínek, časové razítko vašeho souhlasu s okamžitým zahájením plnění a stav platby. Právním základem je čl. 6 odst. 1 písm. b) GDPR a pro zákonnou archivaci čl. 6 odst. 1 písm. c) GDPR.",
        "Platba probíhá na platební stránce společnosti Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublin 2, Irsko. Společnosti Stripe předáváme vaši e-mailovou adresu a údaje o objednávce; platební údaje zadáváte přímo u Stripe a k nám se nikdy nedostanou. Od Stripe obdržíme ID zákazníka, stav platby a fakturu. Stripe rovněž zpracovává údaje jako samostatný správce (např. prevence podvodů a zákonné povinnosti; viz stripe.com/privacy). Pokud dochází k předání údajů propojeným společnostem v USA, děje se tak na základě rámce EU-US Data Privacy Framework a standardních smluvních doložek EU.",
        "Platební stránka Stripe je provozována na doméně Stripe. Na samotné doméně belowmark.com nevkládáme žádné skripty třetí strany Stripe.",
        "Faktury a účetní doklady uchováváme po dobu stanovenou obchodním a daňovým právem (§ 147 AO, § 257 HGB).",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Prohlášení o výpovědi a odstoupení od smlouvy",
      paragraphs: [
        "Prohlášení podaná prostřednictvím „Zrušit smlouvy zde“ a „Odstoupit od smlouvy“ ukládáme spolu se jménem, e-mailovou adresou, označením smlouvy, obsahem prohlášení a datem a časem přijetí a zasíláme potvrzení e-mailem. Uchováváme je po dobu tří let od konce kalendářního roku, ve kterém byla doručena, k doložení souladu se zákonem (čl. 6 odst. 1 písm. c) a f) GDPR).",
      ],
    },
    {
      id: "mail",
      heading: "7. Transakční e-maily",
      paragraphs: [
        `Zasíláme pouze e-maily nezbytné pro plnění smlouvy: ověřovací odkazy, odkazy pro obnovu hesla, potvrzení objednávek a výpovědí a vámi výslovně nastavené hlídače. Žádná reklama, žádné newslettery, žádné sledování otevření ani kliknutí. Odesíláno přes ${filled(LEGAL_OPERATOR.mailProvider, "Doplnit poskytovatele SMTP")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Cookies a lokální úložiště",
      paragraphs: [
        "Nepoužíváme analytické, reklamní ani sledovací cookies a nevkládáme žádné takové služby třetích stran. Proto není vyžadována lišta pro souhlas s cookies.",
        "Relační cookie („__Host-bm_session“): udržuje váš stav přihlášení; technicky nezbytná pro požadovanou službu (§ 25 odst. 2 č. 2 TDDDG). Vyprší při zavření prohlížeče, nebo po 30 dnech při zaškrtnutí „Zůstat přihlášen“.",
        "„BELOWMARK_COUNTRY“ a „BELOWMARK_MARKET“ (každá na jeden rok): pamatují si zvolenou zemi/jazyk a trh, aby odpovídal jazyk i ceny (§ 25 odst. 2 č. 2 TDDDG).",
        "Webová písma hostujeme na vlastním serveru, nenačítají se od společnosti Google.",
      ],
    },
    {
      id: "karten",
      heading: "9. Mapy a letecké snímky",
      paragraphs: [
        "Na detailních stránkách nemovitostí načítá váš prohlížeč mapové dlaždice přímo z basemap.de (Spolkový úřad pro kartografii a geodézii, Německo) nebo OpenStreetMap (OpenStreetMap Foundation, Velká Británie) a letecké snímky od Esri (server.arcgisonline.com, USA). Tito poskytovatelé obdrží vaši IP adresu a souřadnice požadovaných dlaždic. Právním základem je čl. 6 odst. 1 písm. f) GDPR (zobrazení polohy nemovitosti).",
        "Odkazy na Mapy Google, oficiální soudní portály a inzertní portály otevírají externí stránky teprve po vašem kliknutí; na nich platí zásady ochrany osobních údajů příslušných provozovatelů.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Doba uchovávání a výmaz",
      paragraphs: [
        "Údaje o účtu uchováváme, dokud účet nesmažete. Ve svém účtu v sekci „Vaše údaje“ si můžete veškerá uložená data stáhnout ve formátu JSON a účet sami smazat. Po smazání okamžitě odstraníme váš účet, relace, seznam sledovaných, hlídače i analýzy posudků. Záznamy objednávek a zákonná prohlášení zůstávají bez vazby na uživatelský účet po dobu vyžadovanou zákonnými archivačními lhůtami.",
        "Jednorázové tokeny (ověření e-mailu, obnova hesla) se mažou při použití a vyprší po 24 hodinách, resp. po 1 hodině.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Vaše práva",
      paragraphs: [
        "Máte právo na přístup k údajům (čl. 15), opravu (čl. 16), výmaz (čl. 17), omezení zpracování (čl. 18), přenositelnost údajů (čl. 20) a právo vznést námitku proti zpracování založenému na oprávněném zájmu (čl. 21 GDPR). Obraťte se na nás na výše uvedené adrese, nebo proveďte export a smazání přímo ve svém účtu.",
        `Máte právo podat stížnost u dozorového úřadu pro ochranu osobních údajů, zejména u úřadu příslušného pro nás: ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "Automatizované rozhodování ani profilování ve smyslu čl. 22 GDPR neprobíhá.",
      ],
    },
  ],
};
