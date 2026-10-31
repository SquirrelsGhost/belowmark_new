import { IDeadlineTranslation } from "../IDeadlineTranslation";

export const DEADLINE_IT: IDeadlineTranslation = {
  MetaTags: {
    title: "Assistente Scadenze — Belowmark",
    description: "Tutte le scadenze dalla pubblicazione all'aggiudicazione con fonte normativa: cauzione, data dell'assegno circolare, udienza, teminat. Promemoria via e-mail e calendario.",
    imgUrl: "https://belowmark.com/og/home.png",
    tags: ["Scadenze", "Asta giudiziaria", "Cauzione", "Calendario"],
    url: "https://belowmark.com/app/termine",
  },
  Nav: "Scadenze",

  Section: {
    Eyebrow: "Assistente Scadenze",
    Title: "Scadenze e tabella di marcia",
    Lead: {
      DE: "Ogni scadenza fino all'aggiudicazione, calcolata dalla data dell'udienza nell'avviso d'asta e corredata dal riferimento di legge. Segui la procedura per ricevere promemoria via e-mail e nel calendario.",
      TR: "Ogni scadenza dei turni e-Satış, calcolata dai dati dell'İlan e corredata dal riferimento normativo. Segui la procedura per ricevere promemoria via e-mail e nel calendario.",
    },
    Locked: {
      Title: "Scadenze con promemoria",
      Body: "L'Assistente Scadenze calcola cauzione, giorno utile per l'assegno e aggiudicazione a partire dall'avviso d'asta e ti invia promemoria via e-mail e calendario. Incluso nel piano Investor.",
    },
    NoDates: "L'avviso non indica alcuna data d'udienza, pertanto non è possibile calcolare scadenze.",
    Cancelled: "La procedura è stata revocata. I termini non decorrono più.",
    Phases: { before: "Prima dell'udienza", hearing: "Udienza", after: "Dopo l'aggiudicazione" },
    Basis: { law: "Legge", notice: "Avviso d'asta", user: "Tuo dato", rule: "Consiglio belowmark" },
    Kinds: { deadline: "Termine", appointment: "Udienza", task: "Da allora", info: "Orientamento" },
    AfterAwardEmpty: "Le scadenze successive all'aggiudicazione (pagamento, imposte, libro fondiario, rilascio) compariranno qui non appena inserirai l'esito dell'udienza.",
    Reminders: "Promemoria",
    ReminderDay: "1 giorno prima",
    ReminderDays: "{days} giorni prima",
    ReminderToday: "il giorno stesso",
    Disclaimer: "Calcolato senza giorni festivi e in modo prudenziale affinché una data non risulti mai tardiva. Fanno fede la legge e la convocazione del tribunale; non costituisce consulenza legale.",
  },

  Status: {
    Past: "trascorso",
    Today: "oggi",
    Tomorrow: "domani",
    InDays: "tra {days} giorni",
  },

  Follow: {
    Start: "Segui procedura",
    Stop: "Non seguire più",
    Following: "Stai seguendo questa procedura.",
    NotFollowing: "Nessun promemoria ancora attivo.",
    MailOn: "Promemoria e-mail attivo",
    MailOff: "Promemoria e-mail disattivato",
    Download: "Scadenze come calendario (.ics)",
    Overview: "Tutte le scadenze",
    Error: "Operazione non riuscita. Riprova.",
  },

  Checklist: {
    Title: "Tabella di marcia fino all'udienza",
    Hint: "Le spunte restano salvate in questo browser. I passaggi con spunta belowmark vengono riconosciuti automaticamente.",
    Progress: "{done} di {total} completati",
    Auto: "rilevato",
    Steps: {
      DE: [
        { id: "gutachten", Label: "Far analizzare la perizia", Hint: "Carica la perizia: il controllo rischi verifica diritti, inquilini e anno di costruzione." },
        { id: "inspection", Label: "Visionare l'immobile", Hint: "Almeno dall'esterno; le relative domande si trovano nella sezione Giudizio." },
        { id: "limit", Label: "Fissare il limite d'offerta", Hint: "Fino a quale offerta l'operazione conviene? I tuoi numeri, il tuo tetto." },
        { id: "bank", Label: "Richiedere il finanziamento", Hint: "Il fascicolo bancario mostra alla banca piano dei pagamenti e scadenze." },
        { id: "deposit", Label: "Predisporre la cauzione", Hint: "Bonifico, assegno circolare/sbarrato o fideiussione: i giorni utili sono nella cronologia." },
        { id: "papers", Label: "Stampare la cartella dell'offerente", Hint: "Documento d'identità, procura, ricevuta della cauzione e il tuo limite su carta." },
      ],
      TR: [
        { id: "gutachten", Label: "Leggere il kıymet takdir raporu", Hint: "Carica la relazione: il controllo rischi verifica diritti, inquilini e stato." },
        { id: "inspection", Label: "Visionare l'immobile", Hint: "Almeno dall'esterno; le relative domande si trovano nella sezione Giudizio." },
        { id: "limit", Label: "Fissare il limite di teklif", Hint: "Fino a quale offerta conviene, inclusi tapu harcı e KDV?" },
        { id: "bank", Label: "Chiarire il finanziamento in anticipo", Hint: "Dopo il turno d'asta restano solo 7 giorni per pagare; senza pre-delibera bancaria i tempi sono stretti." },
        { id: "deposit", Label: "Versare il teminat", Hint: "In contanti tramite portale o teminat mektubu: le scadenze sono nella cronologia." },
        { id: "papers", Label: "Verificare accesso e-Devlet e portale", Hint: "È possibile offrire solo accedendo al portale e-Satış tramite e-Devlet." },
      ],
    },
  },

  Items: {
    DE: {
      Notice: {
        Title: "Avviso d'asta pubblicato",
        Detail: "L'udienza deve essere resa pubblica almeno sei settimane prima. Da qui inizia la tua preparazione.",
      },
      Transfer: {
        Title: "Cauzione tramite bonifico: accredito",
        Detail: "Il denaro contante è escluso. Un bonifico è valido solo se accreditato sul conto della cassa del tribunale prima dell'udienza e se presenti la contabile in udienza. Conto e causale sono indicati dal tribunale. Calcolo prudenziale: il giorno precedente.{amount}",
      },
      Cheque: {
        Title: "Primo giorno utile per l'emissione dell'assegno (Verrechnungsscheck)",
        Detail: "Un assegno sbarrato (Verrechnungsscheck) è valido solo se emesso non prima del terzo giorno lavorativo antecedente l'udienza, da una banca autorizzata in Germania o dalla Bundesbank e pagabile sul territorio nazionale. Se emesso prima viene rifiutato. Calcolato considerando il sabato come giorno lavorativo e senza festività, quindi mai troppo presto.",
      },
      Hearing: {
        Title: "Udienza d'asta",
        Detail: "{authority}. Tra l'invito a presentare offerte e la chiusura dell'asta trascorrono almeno 30 minuti. Da portare: documento d'identità, prova della cauzione e, in caso di rappresentanza, procura autenticata da notaio.",
      },
      Award: {
        Title: "Aggiudicazione entro (termine ordinatorio)",
        Detail: "L'aggiudicazione viene pronunciata in udienza o in un'apposita udienza di pronuncia che non dovrebbe essere fissata oltre una settimana dopo. Con la pronuncia diventi proprietario. La data effettiva è stabilita dal tribunale.",
      },
      Amount: " Importo se un interessato richiede cauzione: {amount} (10% del valore di stima).",
    },
    TR: {
      Notice: {
        Title: "İlan pubblicato",
        Detail: "Il turno d'asta deve essere annunciato sul portale e-Satış almeno 15 giorni prima dell'inizio.",
      },
      RoundStart: {
        Title: "Inizia il {round}° turno (Artırma)",
        Detail: "Da questo momento sono possibili offerte sul portale e-Satış; il turno dura sette giorni.{startingBid}",
      },
      Cash: {
        Title: "{round}° Artırma: teminat in contanti entro le ore 23:30",
        Detail: "Versare la cauzione tramite il portale sul conto dell'İcra dairesi entro le ore 23:30 del giorno precedente la chiusura del turno.{amount}",
      },
      Letter: {
        Title: "{round}° Artırma: teminat mektubu entro fine orario d'ufficio",
        Detail: "Una garanzia bancaria deve pervenire all'İcra dairesi entro la chiusura degli uffici del giorno lavorativo precedente la fine del turno. I giorni festivi non sono detratti: se cade in un festivo, vale il giorno lavorativo precedente.",
      },
      RoundEnd: {
        Title: "Termina il {round}° turno (Artırma)",
        Detail: "Se negli ultimi dieci minuti perviene un'offerta, il turno si prolunga di tre minuti per volta, fino a un massimo complessivo di un'ora. Successivamente viene pubblicato il verbale d'esito; da quel momento decorrono sette giorni per il pagamento.",
      },
      Amount: " Importo: {amount} (10% del valore di stima).",
      StartingBid: " Offerta base secondo l'İlan: {amount}.",
    },
  },

  Page: {
    Eyebrow: "Assistente Scadenze",
    Title: "Scadenze",
    Lead: "Tutte le scadenze delle procedure che segui in un unico elenco. Promemoria via e-mail e abbonamento nel tuo calendario personale.",
    Count: "{count} seguite",
    Empty: {
      Title: "Nessuna procedura ancora seguita",
      Body: "Apri una scheda del fascicolo e clicca su «Segui procedura» nella sezione «Scadenze e tabella di marcia».",
      Cta: "Vai alla ricerca",
    },
    Next: "Prossima scadenza",
    NothingAhead: "Nessuna scadenza futura aperta.",
    OpenListing: "Alla scheda del fascicolo",
    Missing: "Non più presente nei dati attuali",
    Feed: {
      Title: "Abbonamento calendario",
      Body: "Aggiungi questo indirizzo in Google Calendar, Outlook o Apple Calendario come abbonamento («Da URL»). Nuove procedure e date modificate si aggiornano automaticamente, con promemoria anticipato.",
      Create: "Genera indirizzo abbonamento",
      Renew: "Genera nuovo indirizzo",
      Copy: "Copia",
      Copied: "Copiato",
      Shown: "Visibile solo ora. Non salviamo l'indirizzo in chiaro; chiunque lo conosca può vedere le tue scadenze.",
      Hidden: "Un abbonamento è attivo. Hai perso l'indirizzo? Generane uno nuovo: quello vecchio smetterà subito di funzionare.",
      Error: "Impossibile generare l'indirizzo.",
    },
    HowItWorks: "I promemoria vengono inviati al mattino via e-mail e nel calendario nei giorni indicati accanto a ogni scadenza. Le date provengono dagli avvisi ufficiali; se il tribunale modifica una data, la scadenza si aggiorna con la sincronizzazione successiva.",
  },

  Mail: {
    Subject: "{count} scadenze in arrivo",
    SubjectOne: "Una scadenza in arrivo",
    Preheader: "Il tuo Assistente Scadenze di belowmark.",
    Greeting: "Buongiorno,",
    Intro: "per le procedure che segui sono previste le seguenti scadenze:",
    Today: "oggi",
    Tomorrow: "domani",
    InDays: "tra {days} giorni",
    OpenListing: "Apri scheda del fascicolo",
    Manage: "Gestisci promemoria",
    Signature: "Il team belowmark",
    Footer: "Ricevi questa e-mail perché segui una procedura. Puoi disattivare gli avvisi nella sezione «Scadenze».",
    Source: "Base normativa",
  },

  Ics: {
    CalendarName: "belowmark Scadenze",
    Source: "Fonte",
  },
};
