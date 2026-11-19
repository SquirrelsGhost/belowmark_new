import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_CS: IAlertsTranslation = {
  MetaTags: {
    title: "Hlídací psi — Belowmark",
    description: "Uložená vyhledávání s e-mailovými upozorněními: okamžitě se dozvíte o nové exekuční dražbě podle vašich filtrů nebo o změně termínu jednání.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Hlídací pes", "Exekuční dražba", "Uložené vyhledávání"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Hlídací psi",

  Page: {
    Eyebrow: "Uložená vyhledávání",
    Title: "Hlídací psi",
    Lead: "Každý hlídací pes je uložené vyhledávání. Jakmile se objeví nová odpovídající dražba nebo úřad změní termín jednání, obdržíte e-mail — se spisovou značkou a přímým odkazem na spis.",
    Usage: "{count} z {max} hlídacích psů",
    Empty: {
      Title: "Zatím nemáte žádného hlídacího psa.",
      Body: "Nastavte si filtry v přehledu vyhlášek — kraj, druh nemovitosti, cenové rozpětí, klíčové slovo — a uložte vyhledávání jako hlídacího psa přímo pod počtem výsledků.",
      Cta: "Přejít na vyhlášky",
    },
    HowItWorks:
      "Porovnání probíhá po každé aktualizaci oficiálních rejstříků. Hlásíme pouze to, co uvádí samotná dražební vyhláška: nové řízení, přesunutý termín nebo zrušení dražby. Časové rozpětí a řazení nejsou součástí hlídacího psa — vždy sleduje budoucí termíny.",
  },

  Card: {
    Active: "Aktivní",
    Paused: "Pozastaveno",
    Pause: "Pozastavit",
    Resume: "Obnovit",
    Delete: "Smazat",
    OpenSearch: "Otevřít vyhledávání",
    Matches: "{count} otevřených shod",
    MatchesOne: "1 otevřená shoda",
    NotifyNew: "Nová řízení",
    NotifyChanges: "Změny termínů",
    LastSent: "Poslední e-mail: {date}",
    NeverSent: "Zatím neodeslán žádný e-mail",
    LastChecked: "Zkontrolováno: {date}",
    Error: "Něco se nepovedlo. Zkuste to prosím znovu.",
  },

  Summary: {
    AllRegions: { DE: "Všechny kraje / země", TR: "Všechny provincie" },
    AllSegments: "Všechny druhy nemovitostí",
    Query: "„{query}“",
    Min: "od {value}",
    Max: "do {value}",
  },

  Save: {
    Toggle: "Uložit vyhledávání jako hlídacího psa",
    Title: "Vytvořit hlídacího psa",
    NameLabel: "Název",
    NotifyNew: "E-mail při novém řízení",
    NotifyChanges: "E-mail při změně termínu nebo zrušení",
    Hint: "Uloží klíčové slovo, kraj/region, druh nemovitosti a cenové rozpětí. Stávající shody se označí jako známé — upozornění pokrývají změny od tohoto okamžiku.",
    Submit: "Uložit hlídacího psa",
    Pending: "Ukládání …",
    Saved: "Uloženo. Jakmile se něco změní, dostanete e-mail.",
    Manage: "Spravovat hlídací psy",
    Errors: {
      limit: "Máte již 10 hlídacích psů. Před vytvořením nového prosím jednoho smažte.",
      invalid: "Pojmenujte prosím hlídacího psa a vyberte alespoň jednu možnost upozornění.",
      failed: "Hlídacího psa se nepodařilo uložit. Zkuste to prosím znovu.",
    },
  },

  Mail: {
    Subject: "{count} novinek od vašich hlídacích psů",
    SubjectOne: "1 novinka od vašich hlídacích psů",
    Preheader: "Nové dražby a změněné termíny z vašich uložených vyhledávání.",
    Greeting: "Dobrý den,",
    Intro: "od naší poslední kontroly došlo ve vašich uložených vyhledáváních k následujícím změnám:",
    Kinds: { new: "Nové", cancelled: "Zrušeno", reinstated: "Obnoveno", rescheduled: "Přesunuto" },
    NextDate: "Dražba {date}",
    Moved: "původně {before}, nově {after}",
    Value: { DE: "Výsledná cena", TR: "Odhadní cena (Muhammen bedel)" },
    More: "+ dalších {count}",
    OpenSearch: "Otevřít vyhledávání",
    LockedValues: "Úplné spisové značky, přesné adresy a PDF znalecké posudky se odemykají s plným přístupem (nebo přes váš 1 bezplatný spis).",
    TrialTitle: "Odemkněte všechny spisové značky, adresy a úřední PDF dokumenty",
    TrialBody: "Váš účet hlídacího psa a 1 bezplatný spis zůstávají trvale zdarma (žádná platební karta, žádné automatické prodloužení). Volitelně můžete vyzkoušet plný přístup Investor na 7 dní za 0 Kč dnes.",
    TrialCta: "Spustit 7denní zkoušku zdarma (0 Kč)",
    Manage: "Spravovat nebo pozastavit hlídací psy",
    Source: { DE: "Zdroj všech dat: Portál dražeb EKČR / oficiální justiční portály", TR: "Zdroj všech dat: ilan.gov.tr" },
    Signature: "Váš tým Belowmark",
    Footer: "Belowmark · Zdrojově ověřené exekuční dražby · belowmark.com",
  },
};
