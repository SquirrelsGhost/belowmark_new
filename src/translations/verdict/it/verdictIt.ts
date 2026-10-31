import { IVerdictTranslation } from "../IVerdictTranslation";

export const VERDICT_IT: IVerdictTranslation = {
  Section: {
    Eyebrow: "Giudizio",
    Title: "Offrire o lasciare?",
    Lead: "Un giudizio basato su avviso d'asta, perizia, legge e sui tuoi numeri. Dice «offrire» solo quando non resta aperto alcun punto essenziale — e per ogni motivo indica la fonte.",
    Disclaimer: "Indicazione basata sui tuoi dati, non consulenza legale o di investimento. Fanno fede il libro fondiario, la perizia e le comunicazioni del tribunale in udienza.",
  },
  Locked: {
    Title: "Giudizio nel piano Investor",
    Body: "Il Giudizio unisce controllo rischi, perizia e limite d'offerta in una raccomandazione chiara per ciascun immobile. È disponibile nel piano Investor.",
  },

  States: {
    go: { Stamp: "Offrire", Headline: "Offrire fino a {amount}", Sub: "In base ai tuoi numeri e alle fonti disponibili. Non rilanciare oltre questa soglia." },
    open: { Stamp: "Non ancora pronto", Headline: "Provvisorio fino a {amount}", Sub: "Questo limite è con riserva. Diventerà un giudizio definitivo solo una volta chiariti i punti aperti qui sotto." },
    stop: { Stamp: "Non offrire", Headline: "Non offrire", Sub: "Almeno un motivo documentato dalle fonti sconsiglia chiaramente l'offerta — vedi sotto." },
    none: { Stamp: "Nessun giudizio", Headline: "Giudizio non possibile", Sub: "Per questa procedura non è attualmente possibile formulare una valutazione." },
  },
  GoUnverified: "Attenzione: i costi di ristrutturazione non sono stati verificati né sul posto né tramite preventivo. Il limite vale solo quanto questa cifra.",
  OpenNoLimit: { Headline: "Ancora nessun limite", Sub: "Senza i tuoi obiettivi nel calcolatore del limite d'offerta non c'è un tetto massimo. L'elenco qui sotto mostra cosa manca." },
  Groups: {
    none: "Perché nessun giudizio",
    stop: "Perché non offrire",
    gap: "Prima di offrire",
    caution: "Da tenere d'occhio",
    ok: "Cosa depone a favore",
  },

  Reasons: {
    noValue: "L'avviso d'asta non indica alcun valore di stima. Senza di esso non è possibile calcolare né soglie di legge né costi.",
    cancelled: "Secondo il portale l'udienza è stata revocata.",
    past: "L'udienza è nel passato.",
    unreachable: "I tuoi obiettivi non sono raggiungibili con alcuna offerta — nemmeno a 0. Costi e canone non sono sufficienti.",
    belowStart: "Il tuo limite di {amount} è inferiore all'offerta minima di {other}. Non è possibile offrire una cifra così bassa.",
    belowHalf: "Il tuo limite comprensivo dei diritti che permangono ({amount}) è inferiore ai 5/10 del valore di stima ({other}). Nella prima udienza l'aggiudicazione viene negata d'ufficio: da rivalutare non prima dell'udienza successiva.",
    rightStays: "{risk} secondo la fonte. Può permanere dopo l'aggiudicazione sottraendo utilizzo o valore. Offri solo dopo che il tribunale ha confermato se si estingue e dopo averne inserito il valore nel limite d'offerta alla voce «Diritti che permangono» (anche 0).",
    noTargets: "Nel limite d'offerta non è ancora impostato alcun obiettivo (rendimento, cashflow o valore di rivendita). Senza obiettivo non esiste un tetto massimo.",
    noReport: "Nessuna perizia caricata. Diritti, vizi e contaminazioni sono quindi noti solo dall'avviso d'asta, che di solito non ne parla.",
    noRenovation: "Nessun importo di ristrutturazione inserito. Inserisci la tua stima — anche 0 se non ci sono lavori da fare.",
    noClearance: "Possibile presenza di inquilini o occupanti, ma nessun costo di rilascio o transizione inserito (anche 0).",
    askInspection: "Indica se hai visitato l'immobile.",
    askOccupancy: "Indica chi utilizza l'immobile — per quanto a tua conoscenza.",
    askRights: "Indica se hai verificato presso il tribunale i diritti che permangono.",
    rightsOpen: "Non hai ancora verificato i diritti. Ciò che permane dopo l'aggiudicazione va pagato o assunto in aggiunta all'offerta.",
    askCostBasis: "Indica su cosa si basano i tuoi costi di ristrutturazione e rilascio.",
    costsIncomplete: "Una voce di costo di legge non è calcolabile dall'avviso d'asta: i costi totali sono incompleti.",
    contamination: "Contaminazioni (Altlasten) secondo la perizia. Solo una perizia specialistica può quantificare i costi di bonifica. Offri solo quando i tuoi costi si basano su un preventivo.",
    rightPriced: "{risk} secondo la fonte — chiarito presso il tribunale e conteggiato nel limite d'offerta per {amount}.",
    notInside: "Non sei entrato nell'immobile. Il tuo budget di ristrutturazione non è quindi verificato: lo stress test qui sotto mostra l'effetto di eventuali extracosti sul limite.",
    reportOutsideOnly: "Anche il perito non ha potuto ispezionare (completamente) l'interno.",
    estimateOnly: "I tuoi costi di ristrutturazione sono una stima personale, non un preventivo.",
    defects: "La perizia segnala vizi o danni. Verifica che il tuo budget di ristrutturazione li copra.",
    tenant: "L'immobile è (probabilmente) locato. I contratti di locazione passano all'aggiudicatario: calcola con il canone effettivo, non con un canone ipotetico.",
    heritage: "Vincolo monumentale secondo la fonte. Modifiche e risanamento richiedono il consenso della soprintendenza e sono spesso più onerosi.",
    easement: "La perizia menziona servitù o oneri edilizi (es. diritto di passaggio). Spesso permangono dopo l'aggiudicazione.",
    contaminationUnclear: "La perizia lascia aperta la questione di eventuali contaminazioni del suolo.",
    oldValuation: "La data di riferimento della stima precede l'udienza di {years} anni. Mercato e stato dell'immobile possono essere cambiati nel frattempo.",
    valueMismatch: "La perizia indica {amount}, l'avviso d'asta {other}. Chiarisci con il tribunale quale valore faccia fede.",
    sevenTenths: "Il tuo limite comprensivo dei diritti che permangono ({amount}) è inferiore ai 7/10 ({other}). Nella prima udienza un avente diritto può chiedere il diniego dell'aggiudicazione.",
    atCeiling: "Il limite raggiunge il tetto massimo di calcolo (il triplo del valore di stima). I tuoi obiettivi sono probabilmente impostati in modo troppo generoso.",
    conflicting: "Sulla voce «{risk}» le fonti si contraddicono.",
    limitBy: "Il tuo obiettivo «{criterion}» sostiene un'offerta fino a {amount}.",
    legalClear: "Il limite supera le soglie minime di legge per questa udienza.",
    limitsWaived: "I limiti minimi di valore sono già venuti meno in questa procedura.",
    rightsClear: "Diritto di abitazione, usufrutto e diritto di superficie sono esclusi secondo la fonte.",
  },
  MarketReasons: {
    belowStart: {
      DE: "Il tuo limite di {amount} è inferiore all'offerta minima di {other}.",
      TR: "Il tuo limite di {amount} è inferiore all'offerta base di {other} (50% del valore di stima). In nessun turno è possibile offrire una cifra così bassa.",
    },
    rightStays: {
      DE: "{risk} secondo la fonte. Può permanere dopo l'aggiudicazione sottraendo utilizzo o valore. Offri solo dopo che il tribunale ha confermato se si estingue e dopo averne inserito il valore nel limite d'offerta alla voce «Diritti che permangono» (anche 0).",
      TR: "{risk} secondo la fonte. La permanenza del diritto dopo l'aggiudicazione risulta dal Tapu e dalla Satış şartnamesi. Offri solo dopo aver verificato questo punto e averlo considerato nei tuoi numeri.",
    },
    askRights: {
      DE: "Indica se hai verificato presso il tribunale i diritti che permangono.",
      TR: "Indica se hai controllato i gravami nel registro Tapu e nella Satış şartnamesi.",
    },
    rightsOpen: {
      DE: "Non hai ancora chiesto al tribunale quali diritti permangono. Ciò che resta dopo l'aggiudicazione si aggiunge alla tua offerta.",
      TR: "Non hai ancora controllato il registro Tapu e la Satış şartnamesi. I gravami che permangono dopo l'asta restano a tuo carico.",
    },
    tenant: {
      DE: "L'immobile è (probabilmente) locato. I contratti di locazione passano all'aggiudicatario: calcola con il canone effettivo, non con un canone ipotetico.",
      TR: "L'immobile è (probabilmente) occupato o locato. Uno sgombero può richiedere tempo e un procedimento separato: tienine conto nel calcolo.",
    },
  },
  Actions: {
    limit: "Inserisci nel limite d'offerta",
    report: "Carica perizia",
    questions: "Rispondi qui sotto",
  },

  Sources: {
    Label: "Fonte",
    notice: "Avviso d'asta",
    report: "Perizia pag. {page}",
    input: "I tuoi numeri",
    answer: "Tua indicazione",
    rule: "Regola belowmark",
  },

  Questions: {
    Title: "Ciò che solo tu puoi sapere",
    Lead: "Nessun documento dice come si presenta oggi l'interno o chi vi abita. Le tue risposte confluiscono nel giudizio: senza risposta il punto resta aperto.",
    Items: {
      inspection: {
        Label: "Hai visitato l'immobile?",
        Hint: "Nelle aste giudiziarie le visite interne spesso non sono possibili.",
        Options: { inside: "Sì, anche dentro", outside: "Solo dall'esterno", none: "Per niente" },
      },
      rights: {
        Label: "Chiesto al tribunale quali diritti permangono?",
        Hint: "Su richiesta prima dell'udienza, il funzionario giudiziario (Rechtspfleger) comunica l'offerta minima e i diritti che permangono.",
        Options: { confirmed: "Sì, chiarito", open: "Non ancora" },
      },
      occupancy: {
        Label: "Chi utilizza l'immobile?",
        Hint: "Da perizia, vicini o creditore — per quanto noto.",
        Options: { vacant: "Libero", owner: "Proprietario", tenant: "Inquilino", unknown: "Non lo so" },
      },
      costBasis: {
        Label: "Su cosa si basano i tuoi costi di ristrutturazione e rilascio?",
        Hint: "Rilevante solo se hai inserito dei costi.",
        Options: { quote: "Preventivo / tecnico", estimate: "Stima personale" },
      },
    },
    Rights: {
      DE: { Label: "Chiesto al tribunale quali diritti permangono?", Hint: "Su richiesta prima dell'udienza, il funzionario giudiziario (Rechtspfleger) comunica l'offerta minima e i diritti che permangono." },
      TR: { Label: "Verificati i gravami nel registro Tapu e nella Satış şartnamesi?", Hint: "Annotazioni (şerhler), usufrutto (intifa) e diritto di abitazione (sükna hakkı) figurano nella visura Tapu e nella Satış şartnamesi su e-Satış." },
    },
    Unanswered: "aperto",
    Reset: "Cancella risposte",
    StorageHint: "Le tue risposte restano salvate solo in questo browser.",
  },

  Stress: {
    Title: "Stress test",
    Lead: "Esempio di calcolo, non una stima: quale sarebbe il tuo limite se ristrutturazione e rilascio costassero più di quanto inserito?",
    Row: "+{pct}% costi: {limit}",
    Unreachable: "nessuna offerta sensata",
    BelowThreshold: "sotto la soglia di legge",
    NoLimit: "non calcolabile",
  },

  Unknowables: {
    Title: "Ciò che belowmark non può sapere",
    Items: [
      "Lo stato interno effettivo — foto e perizia mostrano solo ciò che il perito ha potuto vedere.",
      "I reali costi di ristrutturazione — per quelli serve un professionista sul posto.",
      "Se gli occupanti lasceranno l'immobile spontaneamente e quanto durerà uno sfratto.",
      "Quanti altri offerenti parteciperanno e fino a dove rilanceranno.",
      "Se l'udienza verrà revocata all'ultimo momento — verifica nuovamente il giorno prima.",
    ],
  },

  File: {
    Title: "Giudizio",
  },
};
