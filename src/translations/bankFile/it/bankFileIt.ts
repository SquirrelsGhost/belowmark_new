import { IBankFileTranslation } from "../IBankFileTranslation";

export const BANK_FILE_IT: IBankFileTranslation = {
  MetaTags: {
    BankFile: {
      title: "Fascicolo bancario — Belowmark",
      description: "Richiesta di finanziamento per un immobile all'asta: importo, capitale proprio, piano dei pagamenti dopo l'aggiudicazione e cauzione — ogni cifra con la sua fonte.",
      imgUrl: "https://belowmark.com/og/home.png",
      tags: ["Fascicolo bancario", "Finanziamento", "Asta giudiziaria"],
      url: "https://belowmark.com/app",
    },
  },

  Teaser: {
    Eyebrow: "Finanziamento",
    Title: "Fascicolo bancario",
    Lead: {
      DE: "La cauzione serve in udienza, il saldo entro l'udienza di riparto. Il fascicolo presenta alla banca tutto in un unico documento: importo, capitale proprio, scadenze di legge e cosa deve fare la banca per la cauzione. Non sostituisce una delibera — quella la rilascia solo la banca.",
      TR: "Il teminat si versa prima di offrire, il saldo entro 7 giorni dal verbale. Il fascicolo presenta alla banca tutto in un unico documento: importo, capitale proprio e scadenze di legge. Non sostituisce una delibera — quella la rilascia solo la banca.",
    },
    Button: "Apri fascicolo bancario",
    ButtonHint: "Apre il fascicolo in una nuova scheda. Inserisci offerta, capitale proprio e modalità di cauzione e salvalo in PDF.",
  },

  File: {
    Kicker: "Richiesta di finanziamento · Asta giudiziaria",
    Title: "Fascicolo bancario",
    PrintedAt: "Creato il {date}",
    DataAsOf: "Dati dell'avviso al {date}",
    Print: "Stampa / salva in PDF",
    PrintHint: "Nella finestra di stampa scegli «Salva come PDF».",
    Back: "Torna alla scheda del fascicolo",
    Locked: "Il fascicolo bancario fa parte del piano Investor",
    NoValue: "non indicato",
    Sections: {
      ask: "Richiesta alla banca",
      request: "Fabbisogno finanziario",
      schedule: "Piano dei pagamenti dall'udienza",
      deposit: "Cauzione — cosa deve fare la banca",
      collateral: "Garanzia per la banca — quando sorge",
      object: "Immobile e valore di stima",
      risks: "Diritti e rischi",
      limit: "Calcolo dell'offerta massima",
      documents: "Documenti per la banca",
      notThis: "Cosa non è questo fascicolo",
      sources: "Fonti",
    },
  },

  Form: {
    Title: "I tuoi dati per il fascicolo",
    Lead: "Tutto parte vuoto. Capitale proprio, tasso e ammortamento sono condivisi con il calcolatore del limite d'offerta — ogni modifica qui vale anche lì.",
    StorageHint: "Salvato solo in questo browser. Questi campi di input non vengono stampati, solo il risultato.",
    Fields: {
      plannedBid: { label: "Offerta massima prevista", hint: "Lascia vuoto per usare il tuo limite d'offerta." },
      equity: { label: "Capitale proprio", hint: "Ciò che apporti personalmente, inclusa la cauzione." },
      interestPct: { label: "Tasso d'interesse ipotizzato", hint: "Tua ipotesi. Il tasso effettivo lo indica la banca." },
      repaymentPct: { label: "Ammortamento iniziale", hint: "Annuo, in percentuale sul prestito." },
      fixedYears: { label: "Durata tasso fisso desiderata", hint: "" },
    },
    Applicant: { label: "Richiedente (facoltativo)", hint: "Compare nella richiesta. Resta in questo browser.", placeholder: "Nome e cognome" },
    Method: { label: "Cauzione tramite", empty: "ancora aperto" },
    Methods: {
      cheque: "Assegno circolare / Bundesbank",
      guarantee: "Fideiussione bancaria",
      transfer: "Bonifico alla cassa del tribunale",
      portal: "Portale e-Satış",
    },
    Use: { label: "Utilizzo", empty: "ancora aperto" },
    Uses: { own: "Abitazione propria", rent: "Locazione", resale: "Rivendita" },
    YearsSuffix: "anni",
    Reset: "Cancella dati del fascicolo",
  },

  Ask: {
    Salutation: "Gentili Signore, Egregi Signori,",
    Intro: "intendo presentare offerta nella procedura esecutiva {fileNo} presso il {court} per l'immobile {object}. Udienza: {date}. Valore di stima secondo l'avviso: {value}.",
    Applicant: "Richiedente: {name}",
    NoApplicant: "Richiedente: ______________________",
    Requests: {
      loan: "Finanziamento di {amount} — costi totali {total} meno capitale proprio {equity} (dettaglio nella sezione 02).",
      guarantee: "Una fideiussione a tempo indeterminato, incondizionata e a prima richiesta di {amount} come cauzione per l'udienza (§ 69 cpv. 3 ZVG).",
      cheque: "Un assegno Bundesbank o circolare di {amount}, emesso non prima del terzo giorno lavorativo antecedente l'udienza (§ 69 cpv. 2 ZVG).",
      transfer: "Un bonifico di {amount} alla cassa del tribunale, accreditato prima dell'udienza con relativa contabile (§ 69 cpv. 4 ZVG).",
      portal: "Messa a disposizione del teminat di {amount} prima dell'offerta nel portale e-Satış.",
      timing: "Una conferma scritta di finanziamento prima dell'udienza, poiché i pagamenti successivi sono vincolati alle scadenze della sezione 03.",
    },
    MissingBid: "Manca l'offerta massima — inseriscila sopra o calcola il tuo limite d'offerta.",
    MissingEquity: "Manca il capitale proprio — senza non è possibile indicare l'importo del prestito.",
    MissingMethod: "La modalità di cauzione è ancora aperta.",
    Closing: "Resto a disposizione per eventuali chiarimenti e per l'esame della perizia.",
  },

  Request: {
    UsesTitle: "Impiego dei fondi",
    SourcesTitle: "Fonti di copertura",
    Bid: "Offerta massima",
    BidFromLimit: "dal tuo limite d'offerta",
    BidOwn: "tua indicazione",
    Total: "Costi totali",
    Equity: "Capitale proprio",
    Loan: "Fabbisogno di finanziamento",
    LoanToValue: "Prestito su valore di stima",
    LoanToValueNote: "Valore di stima del tribunale — la banca calcola il proprio valore cauzionale.",
    EquityShare: "Quota di capitale proprio",
    TermsTitle: "Condizioni desiderate",
    Interest: "Tasso ipotizzato",
    InterestNote: "Tua ipotesi, non un'offerta",
    Repayment: "Ammortamento iniziale",
    MonthlyRate: "Rata al tasso ipotizzato",
    FixedYears: "Vincolo del tasso",
    Use: "Utilizzo",
    Incomplete: "Manca una voce di costo di legge (es. aliquota fiscale assente nell'avviso) — i costi totali sono sottostimati.",
    EquityShortForDeposit: "Il tuo capitale proprio non copre la cauzione. La banca dovrà prefinanziarla o prestare fideiussione.",
    Guarantee: "Inoltre: fideiussione per la cauzione",
    GuaranteeBasis: "§ 69 cpv. 3 ZVG",
  },

  Schedule: {
    Columns: { when: "Quando", what: "Cosa", amount: "Importo" },
    Steps: {
      DE: {
        deposit: { when: "In udienza, subito dopo l'offerta", text: "Cauzione: un decimo del valore di stima, se richiesta da un interessato. Mettila in conto.", basis: "§§ 67, 68 cpv. 1 ZVG", law: "zvg68" },
        balance: { when: "Prima dell'udienza di riparto (data fissata dal tribunale dopo l'aggiudicazione)", text: "Saldo prezzo alla cassa del tribunale — accreditato prima dell'udienza, con ricevuta in udienza. La cauzione bonificata alla cassa viene scomputata.", basis: "§ 49 cpv. 3, § 107 cpv. 3 ZVG", law: "zvg49" },
        bidInterest: { when: "Con il saldo prezzo", text: "Interessi del 4% sul saldo dall'aggiudicazione all'udienza di riparto.", basis: "§ 49 cpv. 2 ZVG in comb. disp. § 246 BGB", law: "zvg49" },
        transferTax: { when: "Un mese dopo l'avviso di liquidazione", text: "Imposta sul trasferimento immobiliare su offerta e diritti che restano iscritti.", basis: "§§ 9, 15 GrEStG", law: "grestg" },
        courtFee: { when: "Dopo la nota spese del tribunale", text: "Tassa per il decreto di aggiudicazione.", basis: "KV 2214 GKG" },
        registryFee: { when: "Dopo l'iscrizione", text: "Iscrizione come proprietario nel libro fondiario.", basis: "KV 14110 GNotKG" },
        own: { when: "Secondo il tuo piano", text: "Ristrutturazione, sgombero e altro.", basis: "Tua indicazione" },
      },
      TR: {
        deposit: { when: "Prima di offrire", text: "Teminat nel portale e-Satış.", basis: "İİK m.114/7", law: "esatis" },
        balance: { when: "Entro 7 giorni dalla pubblicazione del verbale d'asta", text: "Prezzo residuo (offerta meno teminat), in contanti. Nessuna proroga.", basis: "İİK m.130", law: "iik" },
        fees: { when: "Su richiesta dell'ufficio esecuzioni, prima della trascrizione", text: "KDV, imposta Tapu, imposta di bollo, Döner sermaye.", basis: "Condizioni di vendita (şartname)" },
        own: { when: "Secondo il tuo piano", text: "Ristrutturazione, sgombero e altro.", basis: "Tua indicazione" },
      },
    },
    BalanceGuaranteeNote: "Con una fideiussione non si scomputa nulla — va versato l'intero saldo prezzo.",
    BalanceOpenNote: "Modalità di cauzione aperta — calcolato senza scomputo.",
    MissingInterestDays: "Inserire i giorni fino all'udienza di riparto nel limite d'offerta",
    Unknown: "non calcolabile",
    Footnote: {
      DE: "Le date successive all'aggiudicazione sono fissate da tribunale e fisco. Il fascicolo indica pertanto la sequenza di legge, non una data inventata.",
      TR: "Il termine di 7 giorni decorre dalla pubblicazione del verbale nel portale, non dal giorno dell'asta.",
    },
  },

  Deposit: {
    Lead: {
      DE: "Importo: un decimo del valore di stima (§ 68 cpv. 1 ZVG). Il contante è escluso (§ 69 cpv. 1 ZVG). Sono ammesse esattamente queste tre modalità:",
      TR: "Il teminat va depositato nel portale e-Satış prima di offrire. Le forme accettate dall'ufficio esecuzioni sono indicate nelle condizioni di vendita (şartname) dell'avviso.",
    },
    Ways: {
      DE: [
        { id: "cheque", title: "Assegno Bundesbank o circolare", text: "Emesso da un istituto di credito autorizzato in Germania o dalla Bundesbank, pagabile sul territorio nazionale, non prima del terzo giorno lavorativo antecedente l'udienza. Un assegno emesso prima viene rifiutato.", basis: "§ 69 cpv. 2 ZVG", law: "zvg69" },
        { id: "guarantee", title: "Fideiussione bancaria", text: "A tempo indeterminato, incondizionata e a prima richiesta, emessa da tale istituto di credito, eseguibile sul territorio nazionale. La banca può richiedere una commissione di firma (Avalprovision).", basis: "§ 69 cpv. 3 ZVG", law: "zvg69" },
        { id: "transfer", title: "Bonifico alla cassa del tribunale", text: "L'importo deve essere accreditato sul conto della cassa del tribunale prima dell'udienza e la ricevuta deve essere presente in udienza. Coordinate e causale sono indicate dal tribunale.", basis: "§ 69 cpv. 4 ZVG", law: "zvg69" },
      ],
      TR: [{ id: "portal", title: "Teminat nel portale e-Satış", text: "Da depositare nel portale prima di offrire, accesso tramite e-Devlet. Viene imputato al prezzo; chi non paga dopo l'aggiudicazione lo perde.", basis: "İİK m.114/7, m.130", law: "esatis" }],
    },
    Chosen: "scelto",
  },

  Collateral: {
    Lead: {
      DE: "Le banche esitano nelle aste giudiziarie soprattutto per un motivo: erogano prima che il loro debito fondiario (Grundschuld) sia iscritto nel libro fondiario. Ecco l'iter previsto dalla legge:",
      TR: "Le banche esitano nelle aste İcra soprattutto per un motivo: devono pagare entro 7 giorni, ma l'ipoteca viene iscritta solo dopo il trasferimento di proprietà. Ecco l'iter previsto dalla legge:",
    },
    Items: {
      DE: [
        { text: "Con l'aggiudicazione diventi proprietario — senza atto notarile e prima di ogni iscrizione.", basis: "§ 90 cpv. 1 ZVG" },
        { text: "Dopo l'aggiudicazione puoi concedere un debito fondiario (Grundschuld) alla banca. Sarà però iscritto solo dopo che il tribunale avrà richiesto all'ufficio tavolare di iscriverti come proprietario.", basis: "§ 130 cpv. 3 ZVG", law: "zvg130" },
        { text: "Il tribunale presenta tale richiesta solo quando il piano di riparto è stato eseguito e l'aggiudicazione è passata in giudicato — ossia dopo l'udienza di riparto.", basis: "§ 130 cpv. 1 ZVG", law: "zvg130" },
        { text: "Per la tua iscrizione l'ufficio tavolare richiede il nulla osta fiscale (Unbedenklichkeitsbescheinigung), che di norma presuppone il pagamento dell'imposta sul trasferimento immobiliare.", basis: "§ 22 GrEStG", law: "grestg" },
        { text: "Se non versi il saldo prezzo, il tribunale trasferisce il credito agli aventi diritto, lo garantisce con ipoteche legali sull'immobile e si rischia la rivendita in danno.", basis: "§§ 118, 128, 133 ZVG", law: "zvg118" },
        { text: "Come tutelare il periodo fino all'iscrizione — ad es. atto notarile di Grundschuld subito dopo l'aggiudicazione e versamento diretto alla cassa del tribunale — lo decide la banca.", basis: "Decisione della banca" },
      ],
      TR: [
        { text: "Il teminat viene depositato nel portale prima dell'offerta e imputato al prezzo.", basis: "İİK m.114/7", law: "iik" },
        { text: "Il prezzo residuo va pagato in contanti entro 7 giorni dalla pubblicazione del verbale nel portale. Dal 2021 non sono più previste proroghe.", basis: "İİK m.130 (Legge n. 7343)", law: "iik" },
        { text: "La trascrizione (tescil) avviene solo quando l'aggiudicazione è definitiva. Solo dopo può essere iscritta un'ipoteca (ipotek) a favore della banca.", basis: "İİK m.134", law: "iik" },
        { text: "In caso di mancato pagamento, il teminat viene incamerato. Per le aste pubblicate dal 31.07.2026 la legge prevede inoltre una sanzione del 5% dell'offerta.", basis: "İİK m.114 cpv. 7 n. 9 (Legge n. 7589)", law: "iik" },
        { text: "Conseguenza: senza una pre-delibera (ön onay) prima di offrire, il termine di 7 giorni è difficilmente rispettabile con una banca.", basis: "Termini İİK m.130, m.134" },
      ],
    },
  },

  Object: {
    ReportTitle: "Dati chiave dalla perizia",
    NoReport: "Nessuna perizia caricata. Caricala nella scheda del fascicolo — la banca la richiederà comunque integralmente.",
    ReportFrom: "da «{file}», citazione testuale con pagina",
    RisksLead: "Semaforo dei rischi da avviso e perizia. Grigio significa che nessuna fonte ne parla.",
    RiskFrom: { notice: "Avviso ufficiale", report: "Perizia p. {pages}", none: "nessuna fonte" },
  },

  Documents: {
    Lead: "Cosa chiedono di solito le banche. Ogni banca ha la propria lista — chiedila al consulente.",
    Groups: {
      DE: [
        { title: "Sull'immobile", items: ["Perizia di stima completa (presso il tribunale o su zvg-portal.de)", "Ordinanza di fissazione d'udienza / avviso", "Visura tavolare (spesso allegata alla perizia)", "Mappa catastale e calcolo delle superfici", "Contratti di locazione, se locato", "Preventivo di ristrutturazione, se prevista"] },
        { title: "Su di te", items: ["Documento d'identità", "Ultime buste paga o attestazioni di reddito", "Dichiarazioni dei redditi", "Attestazione del capitale proprio", "Modulo di autodichiarazione della banca", "Elenco dei finanziamenti in corso"] },
      ],
      TR: [
        { title: "Sull'immobile", items: ["Avviso d'asta e condizioni di vendita (şartname)", "Relazione di stima (kıymet takdir raporu)", "Estratto Tapu e dati catastali (ada / parsel)", "Foto e planimetria, se disponibili"] },
        { title: "Su di te", items: ["Kimlik / passaporto", "Attestazioni di reddito", "Codice fiscale", "Attestazione del capitale proprio"] },
      ],
    },
  },

  NotThis: {
    Items: [
      { text: "Nessuna delibera di mutuo né offerta. Se e a quali condizioni finanziare lo decide esclusivamente la banca.", basis: "—" },
      { text: "Nessuna mediazione creditizia. Belowmark non intermedia prestiti e non parla con alcuna banca a tuo nome.", basis: "§ 34i GewO", law: "gewo34i" },
      { text: "Nessun valore cauzionale. Il valore di mercato proviene dalla perizia del tribunale; la banca effettua una propria valutazione.", basis: "BelWertV" },
      { text: "Nessuna consulenza legale. I riferimenti normativi sono collegati per la consultazione.", basis: "—" },
    ],
  },

  SourceNames: {
    notice: "Avviso ufficiale",
    document: "Avviso ufficiale (PDF)",
    zvg: "Legge sulle aste giudiziarie (ZVG)",
    grestg: "Legge sull'imposta di trasferimento immobiliare (GrEStG)",
    gewo: "Codice delle attività produttive § 34i (GewO)",
    iik: "İcra ve İflas Kanunu (İİK)",
    esatis: "UYAP e-Satış",
  },
};
