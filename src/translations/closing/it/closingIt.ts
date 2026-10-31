import { IClosingTranslation } from "../IClosingTranslation";
import { CLOSING_TASKS_IT } from "./closingTasksIt";

export const CLOSING_IT: IClosingTranslation = {
  MetaTags: {
    Tasks: {
      title: "Dopo l'aggiudicazione — Belowmark",
      description: "Lista delle attività dopo l'aggiudicazione: pagamento, imposta sul trasferimento immobiliare, libro fondiario, rilascio, assicurazione e ristrutturazione — con scadenze e riferimenti di legge.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Aggiudicazione", "Asta giudiziaria", "Libro fondiario", "Sfratto"],
      url: "https://belowmark.com/app",
    },
    Results: {
      title: "Esiti delle aste — Belowmark",
      description: "I prezzi effettivi delle aste giudiziarie: aggiudicazione in rapporto al valore di stima, dai risultati segnalati, in forma anonima a partire da cinque udienze per gruppo.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Aggiudicazione", "Valore di mercato", "Esito dell'asta", "Asta giudiziaria"],
      url: "https://belowmark.com/app/ergebnisse",
    },
  },

  Section: {
    Eyebrow: "Dopo l'udienza",
    Title: "Esito e aggiudicazione",
    Lead: {
      DE: "Hai partecipato all'udienza? Inserisci quanto è stato offerto. Il portale ufficiale non pubblica gli esiti — dalle tue segnalazioni nasce una panoramica anonima dei prezzi. Se ti sei aggiudicato l'immobile, la lista delle attività ti guida fino al libro fondiario.",
      TR: "Hai seguito l'asta? Inserisci quanto è stato offerto. Il portale non pubblica gli esiti — dalle tue segnalazioni nasce una panoramica anonima dei prezzi. Se ti sei aggiudicato l'asta (ihale), la lista delle attività ti guida fino al Tapu.",
    },
  },

  Result: {
    Title: "Segnala l'esito dell'udienza",
    Lead: "Solo cifre, nessun nome. Puoi correggere la tua segnalazione in qualsiasi momento.",
    NotYet: "Puoi inserire un esito a partire dal giorno dell'udienza.",
    HearingDate: "Data dell'udienza",
    Outcome: "Esito",
    Outcomes: {
      awarded: "Aggiudicazione concessa",
      refused: "Aggiudicazione negata",
      pending: "Decisione rinviata",
      noBids: "Nessuna offerta",
      cancelled: "L'udienza non ha avuto luogo",
    },
    HighestBid: {
      DE: { label: "Offerta massima (Bargebot)", hint: "Come da verbale o decreto di aggiudicazione" },
      TR: { label: "Prezzo di aggiudicazione (ihale bedeli)", hint: "Come da verbale d'asta" },
    },
    RetainedRights: { label: "Diritti che permangono", hint: "Se indicati — fanno parte del prezzo complessivo" },
    BidderCount: { label: "Numero di offerenti", hint: "Se lo conosci" },
    Source: "Da dove provengono i dati?",
    Sources: { attended: "Presente in udienza", protocol: "Verbale / decreto", court: "Informazione del tribunale" },
    IsBuyer: { DE: "Ho ottenuto l'aggiudicazione", TR: "Ho ottenuto l'aggiudicazione (ihale)" },
    AwardDate: {
      DE: { label: "Aggiudicazione pronunciata il", hint: "Vuoto = giorno dell'udienza" },
      TR: { label: "Verbale pubblicato il", hint: "Da questo giorno decorrono i 7 giorni per il pagamento" },
    },
    Shared: { label: "Includi in forma anonima nella panoramica dei prezzi", hint: "Viene mostrata solo una mediana per regione e tipologia d'immobile, a partire da cinque udienze — mai la tua singola voce." },
    Privacy: "Salviamo data dell'udienza, esito, importi e numero di offerenti per questo numero di ruolo; non salviamo mai i nomi di offerenti, aggiudicatari o proprietari.",
    Save: "Salva esito",
    Saved: "Salvato.",
    SavedBuyer: "Salvato. La tua lista delle attività è stata creata.",
    Errors: {
      auth: "Effettua nuovamente l'accesso.",
      locked: "La lista delle attività fa parte del piano Investor.",
      date: "Inserisci una data valida (non anteriore all'udienza).",
      future: "Gli esiti possono essere segnalati solo a partire dal giorno dell'udienza.",
      outcome: "Seleziona l'esito.",
      bid: "In caso di aggiudicazione inserisci l'offerta (numero intero).",
      ratio: "L'offerta non è coerente con il valore di stima — verifica il dato.",
      bidders: "Inserisci un numero plausibile di offerenti.",
      buyer: "«Ho ottenuto l'aggiudicazione» è possibile solo con l'esito «Aggiudicazione concessa».",
      unknown: "Salvataggio non riuscito. Riprova.",
    },
    Ratio: "{pct} del valore di stima",
    StatsLink: "Vedi panoramica dei prezzi",
  },

  Teaser: {
    Title: "La tua lista delle attività dopo l'aggiudicazione",
    Lead: "Pagamento, imposte, libro fondiario, possesso, assicurazione, ristrutturazione — con le tue scadenze.",
    Button: "Apri lista delle attività",
    Progress: "{done} di {total} completate",
    Next: "Prossima: {title} · {date}",
    NoDate: "Inserisci la data di aggiudicazione affinché la lista calcoli le scadenze.",
  },

  Tasks: {
    Kicker: "Dopo l'aggiudicazione",
    Title: "Lista delle attività",
    Lead: {
      DE: "Dall'aggiudicazione all'iscrizione nel libro fondiario e alla consegna. Calcoliamo le scadenze esclusivamente in base alle date che inserisci. Ogni indicazione cita la norma di riferimento.",
      TR: "Dall'ihale all'iscrizione nel Tapu e alla consegna. Calcoliamo le scadenze esclusivamente in base alle date che inserisci. Ogni indicazione cita la norma di riferimento.",
    },
    Back: "Torna alla scheda del fascicolo",
    Disclaimer:
      "Questa lista è uno strumento orientativo e non costituisce consulenza legale. Riporta il testo di legge in forma semplificata (aggiornato al 26.10.2026) e non tiene conto del tuo caso specifico. Per scadenze, disdette e rilascio rivolgiti al tribunale, al notaio o a un avvocato.",
    Locked: {
      Title: "Lista delle attività nel piano Investor",
      Body: "Il tuo esito è salvato. La lista delle attività con scadenze e promemoria fa parte del piano Investor.",
      Cta: "Attiva Investor",
    },
    Dates: {
      Title: "I tuoi dati",
      Lead: "La lista calcola le scadenze a partire da queste date. Lascia vuoti i campi che non conosci ancora.",
      Fields: {
        DE: {
          awardDate: { label: "Aggiudicazione pronunciata il", hint: "Obbligatorio" },
          distributionDate: { label: "Udienza di riparto (Verteilungstermin)", hint: "Indicata nella convocazione" },
          taxNoticeDate: { label: "Avviso imposta trasferimento immobiliare del", hint: "Data di notifica" },
          handoverDate: { label: "Consegna / rilascio il", hint: "Prevista o avvenuta" },
        },
        TR: {
          awardDate: { label: "Verbale d'asta pubblicato il", hint: "Obbligatorio — avvia i 7 giorni" },
          handoverDate: { label: "Consegna / rilascio il", hint: "Prevista o avvenuta" },
        },
      },
      FromPortfolio: "Ripreso dal tuo portafoglio — salva per confermare.",
      Save: "Salva date",
      Saved: "Salvato.",
      Required: "Inserisci almeno la data di aggiudicazione.",
      Errors: {
        auth: "Effettua nuovamente l'accesso.",
        locked: "La lista delle attività fa parte del piano Investor.",
        date: "Inserisci almeno la data di aggiudicazione.",
        unknown: "Salvataggio non riuscito. Riprova.",
      },
    },
    Conditions: {
      Title: "La tua situazione",
      Lead: "Mostra solo le attività pertinenti. L'impostazione resta salvata in questo browser.",
      Items: { tenant: "Ci sono inquilini", ownerOccupied: "Il precedente proprietario ci abita ancora", condo: "Appartamento in condominio", house: "Casa mono- o bifamiliare" },
    },
    Phases: { first: "I primi giorni", payment: "Pagamento", register: "Imposte e Libro fondiario", possession: "Possesso e inquilini", works: "Ristrutturazione e gestione" },
    Due: { deadline: "entro il {date}", earliest: "non prima del {date}", on: "dal {date}" },
    Missing: "Data mancante: {field}",
    States: { done: "Completata", overdue: "Scaduta", soon: "In scadenza", open: "Aperta", undated: "Senza data" },
    Basis: { law: "Legge", practice: "Procedura", rule: "Regola Belowmark" },
    Check: "Quadro normativo modificato o non del tutto chiarito — verificare",
    MarkDone: "Completata",
    MarkOpen: "Riapri",
    Sources: "Fonti",
    Progress: "{done} di {total} completate",
    Items: CLOSING_TASKS_IT,
  },

  Results: {
    Kicker: "Esiti delle udienze",
    Title: "Quanto viene effettivamente pagato",
    Lead: "Aggiudicazioni segnalate in rapporto al valore di stima. I numeri provengono dagli utenti, non dal tribunale — indicano un livello di prezzo, non una valutazione del tuo immobile.",
    Method: {
      Title: "Come calcoliamo",
      Items: [
        "Quota = (offerta massima + diritti che permangono) ÷ valore di stima secondo l'avviso d'asta.",
        "Se più utenti segnalano la stessa udienza, questa conta una sola volta con la mediana delle segnalazioni.",
        "I valori compaiono solo a partire da cinque udienze per gruppo. Sotto tale soglia mostriamo solo il conteggio.",
        "Nessun nome e nessun numero di ruolo nella panoramica. Solo tu puoi vedere le tue segnalazioni.",
      ],
    },
    Table: { Region: "Regione", Segment: "Tipologia", Awarded: "Aggiudicazioni", Median: "Mediana", Range: "Metà centrale", Bidders: "Offerenti (mediana)", Reported: "Udienze segnalate" },
    AllSegments: "Tutte le tipologie",
    Total: "Totale",
    OtherRegion: "Senza regione",
    TooFew: "{n} — troppo poche (da {min})",
    Empty: "Ancora nessuna segnalazione nel tuo mercato. La panoramica si popola non appena gli utenti inseriscono gli esiti delle udienze sulla scheda del fascicolo sotto «Esito e aggiudicazione».",
    Locked: "La panoramica dei prezzi fa parte del piano Investor. Puoi comunque inviare segnalazioni.",
    Own: { Title: "Le tue segnalazioni", Lead: "Visibili solo a te.", Empty: "Non hai ancora segnalato alcun esito.", Shared: "nella panoramica", Private: "privato", Buyer: "Tua aggiudicazione" },
  },
};
