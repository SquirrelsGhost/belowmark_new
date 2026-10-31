import { IAlertsTranslation } from "../IAlertsTranslation";

export const ALERTS_IT: IAlertsTranslation = {
  MetaTags: {
    title: "Avvisi — Belowmark",
    description: "Ricerche salvate con notifica via e-mail: scopri subito quando viene pubblicata una nuova procedura compatibile o cambia la data di un'udienza.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Avvisi", "Asta giudiziaria", "Ricerca salvata"],
    url: "https://belowmark.com/app/alerts",
  },
  Nav: "Avvisi",

  Page: {
    Eyebrow: "Ricerche salvate",
    Title: "Avvisi",
    Lead: "Ogni avviso è una ricerca salvata. Se compare una nuova procedura compatibile o il tribunale modifica una data, ricevi un'e-mail con il numero di ruolo e il link alla scheda del fascicolo.",
    Usage: "{count} di {max} avvisi",
    Empty: {
      Title: "Ancora nessun avviso.",
      Body: "Imposta i filtri negli avvisi pubblici — regione, tipologia, fascia di valore, parola chiave — e salva la ricerca come avviso sotto il numero dei risultati.",
      Cta: "Vai agli avvisi pubblici",
    },
    HowItWorks:
      "Il confronto avviene dopo ogni aggiornamento dei dati ufficiali. Viene segnalato solo ciò che riporta l'avviso ufficiale: una nuova procedura, un rinvio d'udienza o una revoca. L'intervallo di date e l'ordinamento non fanno parte dell'avviso, che guarda sempre avanti.",
  },

  Card: {
    Active: "Attivo",
    Paused: "In pausa",
    Pause: "Metti in pausa",
    Resume: "Riprendi",
    Delete: "Elimina",
    OpenSearch: "Apri ricerca",
    Matches: "{count} risultati aperti",
    MatchesOne: "1 risultato aperto",
    NotifyNew: "Nuove procedure",
    NotifyChanges: "Variazioni di data",
    LastSent: "Ultima e-mail: {date}",
    NeverSent: "Nessuna e-mail inviata",
    LastChecked: "Controllato: {date}",
    Error: "Operazione non riuscita. Riprova.",
  },

  Summary: {
    AllRegions: { DE: "Tutti gli Stati federali", TR: "Tutte le province" },
    AllSegments: "Tutte le tipologie",
    Query: "«{query}»",
    Min: "da {value}",
    Max: "fino a {value}",
  },

  Save: {
    Toggle: "Salva ricerca come avviso",
    Title: "Crea avviso",
    NameLabel: "Nome",
    NotifyNew: "E-mail per nuove procedure",
    NotifyChanges: "E-mail per variazioni di data e revoche",
    Hint: "Vengono salvati parola chiave, regione, tipologia e fascia di valore. I risultati già presenti oggi sono considerati noti — le notifiche riguardano le novità da questo momento.",
    Submit: "Salva avviso",
    Pending: "Salvataggio …",
    Saved: "Salvato. Riceverai un'e-mail non appena ci saranno novità.",
    Manage: "Gestisci avvisi",
    Errors: {
      limit: "Hai già 10 avvisi. Eliminane uno prima di crearne uno nuovo.",
      invalid: "Assegna un nome all'avviso e seleziona almeno un tipo di notifica.",
      failed: "Non è stato possibile salvare l'avviso. Riprova.",
    },
  },

  Mail: {
    Subject: "{count} novità sui tuoi avvisi",
    SubjectOne: "1 novità sui tuoi avvisi",
    Preheader: "Nuove procedure e date modificate dalle tue ricerche salvate.",
    Greeting: "Buongiorno,",
    Intro: "dall'ultimo controllo si sono registrate le seguenti novità nelle tue ricerche salvate:",
    Kinds: { new: "Nuova", cancelled: "Revocata", reinstated: "Ripristinata", rescheduled: "Data modificata" },
    NextDate: "Udienza {date}",
    Moved: "prima {before}, ora {after}",
    Value: { DE: "Valore di stima", TR: "Muhammen bedel" },
    More: "+ altri {count}",
    OpenSearch: "Apri ricerca",
    LockedValues: "Con l'accesso completo puoi vedere gli importi nell'app.",
    Manage: "Gestisci o metti in pausa gli avvisi",
    Source: { DE: "Fonte di tutti i dati: zvg-portal.de", TR: "Fonte di tutti i dati: ilan.gov.tr" },
    Signature: "Il team di Belowmark",
    Footer: "Belowmark · Aste giudiziarie con fonte ufficiale · belowmark.com",
  },
};
