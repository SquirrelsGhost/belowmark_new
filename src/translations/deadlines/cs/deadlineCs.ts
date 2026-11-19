import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_CS: IDeadlineTranslation = {
  MetaTags: {
    title: "Průvodce termíny — Belowmark",
    description: "Všechny lhůty od dražební vyhlášky až po příklep s citací zákona: dražební jistota, převod či šek, termín dražby. Připomínky e-mailem a v kalendáři.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Termíny", "Exekuční dražba", "Dražební jistota", "Kalendář"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Termíny",

  Section: {
    Eyebrow: "Průvodce termíny",
    Title: "Lhůty a harmonogram",
    Lead: {
      DE: "Každá lhůta až do udělení příklepu, vypočítaná z termínu v dražební vyhlášce a podložená citací zákona. Sledujte řízení a dostávejte připomínky e-mailem i do kalendáře.",
      TR: "Každá lhůta kol elektronické dražby e-Satış, vypočítaná z dat vyhlášky İlan a podložená zákonnými pravidly. Sledujte řízení pro připomínky e-mailem i v kalendáři.",
    },
    Locked: {
      Title: "Lhůty s připomínkami",
      Body: "Průvodce termíny vypočítává lhůty pro složení dražební jistoty, ověřený šek i termín příklepu přímo z vyhlášky a upozorňuje e-mailem i v kalendáři. Součást tarifu Investor.",
    },
    NoDates: "Dražební vyhláška neuvádí termín dražby, proto nelze vypočítat žádné lhůty.",
    Cancelled: "Řízení bylo zrušeno. Žádné lhůty již neběží.",
    Phases: { before: "Před dražbou", hearing: "Dražba", after: "Po příklepu" },
    Basis: { law: "Zákon", notice: "Dražební vyhláška", user: "Váš záznam", rule: "doporučení belowmark" },
    Kinds: { deadline: "Lhůta", appointment: "Termín", task: "Od tohoto dne", info: "Pro orientaci" },
    AfterAwardEmpty: "Lhůty po příklepu (doplacení podání, vklad do katastru nemovitostí, vyklizení) se zde objeví, jakmile zaznamenáte výsledek dražby.",
    Reminders: "Připomínka",
    ReminderDay: "1 den předem",
    ReminderDays: "{days} dní předem",
    ReminderToday: "v den události",
    Disclaimer: "Vypočítáno bez zohlednění státních svátků a konzervativně tak, aby termín nikdy nebyl pozdě. Závazný je zákon a dražební vyhláška; nejde o právní poradenství.",
  },

  Status: {
    Past: "proběhlo",
    Today: "dnes",
    Tomorrow: "zítra",
    InDays: "za {days} dní",
  },

  Follow: {
    Start: "Sledovat řízení",
    Stop: "Přestat sledovat",
    Following: "Toto řízení sledujete.",
    NotFollowing: "Zatím nejsou nastaveny žádné připomínky.",
    MailOn: "E-mailové připomínky zapnuty",
    MailOff: "E-mailové připomínky vypnuty",
    Download: "Lhůty jako kalendář (.ics)",
    Overview: "Všechny termíny",
    Error: "Tuto akci se nepodařilo provést. Zkuste to prosím znovu.",
  },

  Checklist: {
    Title: "Cesta k dražbě",
    Hint: "Zaškrtnuté body zůstávají uloženy v tomto prohlížeči. Kroky s kontrolou belowmark se rozpoznají automaticky.",
    Progress: "Hotovo {done} z {total}",
    Auto: "rozpoznáno",
    Steps: {
      DE: [
        { id: "gutachten", Label: "Nechat analyzovat znalecký posudek", Hint: "Nahrajte znalecký posudek; kontrola rizik prověří věcná břemena, nájemníky a rok výstavby." },
        { id: "inspection", Label: "Prohlédnout nemovitost", Hint: "Alespoň zvenčí; související otázky najdete v sekci Verdikt." },
        { id: "limit", Label: "Stanovit strop podání", Hint: "Do jaké částky dává koupě ekonomický smysl? Vaše čísla, váš strop." },
        { id: "bank", Label: "Zajistit financování", Hint: "Bankovní podklad ukáže vaší bance platební kalendář a zákonné lhůty." },
        { id: "deposit", Label: "Složit dražební jistotu", Hint: "Bankovní převod, certifikovaný šek nebo bankovní záruka: přesná data jsou na časové ose." },
        { id: "papers", Label: "Vytisknout složku dražitele", Hint: "Občanský průkaz, plná moc, potvrzení o složení jistoty a váš cenový strop na papíře." },
      ],
      TR: [
        { id: "gutachten", Label: "Prostudovat znalecký posudek (kıymet takdir raporu)", Hint: "Nahrajte posudek; kontrola rizik prověří práva, nájemníky a stav nemovitosti." },
        { id: "inspection", Label: "Prohlédnout nemovitost", Hint: "Alespoň zvenčí; související otázky najdete v sekci Verdikt." },
        { id: "limit", Label: "Stanovit strop nabídky (teklif)", Hint: "Do jakého podání dává nákup smysl včetně poplatku tapu harcı a DPH (KDV)?" },
        { id: "bank", Label: "Vyjasnit financování předem", Hint: "Na doplacení zbývá po skončení dražebního kola jen 7 dní; bez předchozího schválení banky je to těsné." },
        { id: "deposit", Label: "Složit jistotu (teminat)", Hint: "Převodem přes portál nebo bankovní zárukou (teminat mektubu): lhůty jsou na časové ose." },
        { id: "papers", Label: "Ověřit přístup e-Devlet a portál", Hint: "Přihazovat lze pouze po přihlášení do portálu e-Satış přes e-Devlet." },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "Zveřejněna dražební vyhláška",
        Detail: "Termín dražby musí být vyhlášen v zákonném předstihu (v DE nejméně šest týdnů, v ČR nejméně 30 dnů předem). Zde začíná vaše příprava.",
      },
      Transfer: {
        Title: "Dražební jistota převodem: připsáno na účet",
        Detail: "Hotovost je vyloučena. Bankovní převod platí pouze tehdy, pokud je částka připsána na účet exekutora či soudní pokladny před zahájením dražby a je doložena. Číslo účtu a variabilní symbol jsou ve vyhlášce. Konzervativně spočítáno na den předem.{amount}",
      },
      Cheque: {
        Title: "Nejdřívější datum vystavení ověřeného bankovního šeku",
        Detail: "Ověřený bankovní šek (Verrechnungsscheck) je v německém řízení platný jen tehdy, byl-li vystaven nejdříve třetí pracovní den před jednáním u licencované banky nebo Bundesbank. Dříve vystavený šek bude odmítnut. Počítáno se sobotou jako pracovním dnem bez svátků.",
      },
      Hearing: {
        Title: "Dražební jednání",
        Detail: "{authority}. Mezi výzvou k podávání nabídek a ukončením musí uplynout zákonná doba (v DE min. 30 minut). S sebou: průkaz totožnosti, doklad o jistotě a úředně ověřenou plnou moc při zastupování.",
      },
      Award: {
        Title: "Nejzazší datum vyhlášení příklepu (orientační lhůta)",
        Detail: "Usnesení o příklepu se vyhlašuje přímo na jednání nebo ve zvláštním termínu, který by neměl být později než za jeden týden. Přesné datum určuje soud či exekutor.",
      },
      Amount: " Výše jistoty, pokud ji účastník požaduje: {amount} (10 % odhadní ceny).",
    },
    TR: {
      Notice: {
        Title: "Vyhláška İlan zveřejněna",
        Detail: "Dražební kolo musí být na portálu e-Satış oznámeno nejméně 15 dnů před jeho zahájením.",
      },
      RoundStart: {
        Title: "Začíná {round}. kolo (Artırma)",
        Detail: "Na portálu e-Satış lze podávat příhozy; dražební kolo trvá sedm dní.{startingBid}",
      },
      Cash: {
        Title: "{round}. kolo (Artırma): peněžní jistota teminat do 23:30",
        Detail: "Uhraďte dražební jistotu přes portál na účet exekučního úřadu (İcra dairesi) nejpozději do 23:30 den před koncem kola.{amount}",
      },
      Letter: {
        Title: "{round}. kolo (Artırma): bankovní záruka teminat mektubu do konce úředních hodin",
        Detail: "Bankovní záruka musí být doručena úřadu İcra dairesi do konce pracovní doby pracovní den před koncem kola. Státní svátky nejsou odečteny: připadne-li den na svátek, platí předchozí pracovní den.",
      },
      RoundEnd: {
        Title: "Končí {round}. kolo (Artırma)",
        Detail: "Pokud je příhoz učiněn v posledních deseti minutách, kolo se prodlužuje o tři minuty za každý příhoz, celkem až o jednu hodinu. Poté je zveřejněn protokol výsledku a běží sedmidenní lhůta k doplacení.",
      },
      Amount: " Částka: {amount} (10 % odhadní ceny).",
      StartingBid: " Vyvolávací cena dle vyhlášky İlan: {amount}.",
    },
  },

  Page: {
    Eyebrow: "Průvodce termíny",
    Title: "Termíny",
    Lead: "Všechny lhůty u řízení, která sledujete, v jednom přehledu. Připomínky chodí e-mailem a synchronizují se do vašeho kalendáře.",
    Count: "Sledováno: {count}",
    Empty: {
      Title: "Zatím nesledujete žádné řízení",
      Body: "Otevřete libovolný dražební spis a klikněte na „Sledovat řízení“ v sekci „Lhůty a harmonogram“.",
      Cta: "Přejít na vyhledávání",
    },
    Next: "Nejbližší",
    NothingAhead: "Žádné nadcházející lhůty.",
    OpenListing: "Otevřít spis",
    Missing: "Již není v aktuální databázi",
    Feed: {
      Title: "Odběr kalendáře",
      Body: "Přidejte tuto adresu jako odběr do Google Kalendáře, Outlooku nebo Apple Kalendáře („Z adresy URL“). Nová řízení i přesunuté termíny se synchronizují automaticky včetně připomínek.",
      Create: "Vygenerovat URL kanálu",
      Renew: "Vygenerovat novou URL",
      Copy: "Kopírovat",
      Copied: "Zkopírováno",
      Shown: "Viditelné pouze právě teď. Tuto adresu neukládáme v čitelné podobě; kdokoli ji zná, uvidí vaše termíny.",
      Hidden: "Kalendářový kanál je aktivní. Ztratili jste URL? Vygenerujte novou — stará adresa okamžitě přestane fungovat.",
      Error: "Nepodařilo se vygenerovat URL kanálu.",
    },
    HowItWorks: "Připomínky se odesílají ráno e-mailem a zobrazují se v kalendářovém kanálu ve dny uvedené u každé lhůty. Termíny pocházejí z úředních vyhlášek; pokud úřad změní datum, lhůta se aktualizuje při další synchronizaci dat.",
  },

  Mail: {
    Subject: "Blíží se {count} termínů",
    SubjectOne: "Blíží se 1 termín",
    Preheader: "Váš průvodce termíny od belowmark.",
    Greeting: "Dobrý den,",
    Intro: "zde je přehled toho, co se blíží u vašich sledovaných řízení:",
    Today: "dnes",
    Tomorrow: "zítra",
    InDays: "za {days} dní",
    OpenListing: "Otevřít spis",
    Manage: "Spravovat připomínky",
    Signature: "Váš tým belowmark",
    Footer: "Tento e-mail dostáváte, protože sledujete dražební řízení. Odhlásit se můžete v sekci „Termíny“.",
    Source: "Právní základ",
  },

  Ics: {
    CalendarName: "belowmark Termíny",
    Source: "Zdroj",
  },
};
