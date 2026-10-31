import { MarketCode } from "../../../lib/constants";
import { ClosingTaskText } from "../IClosingTranslation";

/** Task texts in Italian, for both markets. Every statement has its source in closingTasks.ts. */
export const CLOSING_TASKS_IT: Record<MarketCode, Record<string, ClosingTaskText>> = {
  DE: {
    "de.ruling": {
      title: "Conservare il decreto di aggiudicazione (Zuschlagsbeschluss)",
      detail:
        "Con l'aggiudicazione diventi proprietario ancora prima dell'iscrizione nel libro fondiario (§ 90 ZVG). Fatti consegnare o inviare il provvedimento e conservalo con cura: in seguito costituirà anche il titolo esecutivo per lo sfratto. Il tribunale fattura separatamente l'imposta di aggiudicazione (aliquota 0,5 secondo KV 2214 GKG).",
    },
    "de.appeal": {
      title: "Attendere il passaggio in giudicato (Rechtskraft)",
      detail:
        "Contro l'aggiudicazione è ammesso reclamo immediato (sofortige Beschwerde). Per tutti i presenti all'udienza d'asta o di pronuncia, il termine decorre dalla pronuncia (§ 98 ZVG) ed è di due settimane (§ 569 ZPO). Per gli assenti decorre solo dalla notifica — il passaggio in giudicato può quindi intervenire più tardi. Fino ad allora non affidare incarichi che non puoi revocare.",
    },
    "de.risk": {
      title: "Trattare l'immobile come tuo da oggi",
      detail:
        "Il rischio di perimento fortuito passa a te con l'aggiudicazione, così come i frutti e gli oneri (§ 56 ZVG). Verifica che l'immobile sia messo in sicurezza (stato di abbandono, gelo, accessi) e documentane lo stato con foto datate.",
    },
    "de.insurerNotice": {
      title: "Informare l'assicurazione del fabbricato",
      detail:
        "Un'assicurazione del fabbricato esistente si trasferisce a te (§ 99 in combinato disposto con § 95 VVG). Il trasferimento deve essere comunicato tempestivamente all'assicuratore; in caso contrario questi può essere liberato dall'obbligo di prestazione (§ 97 VVG). Chiedi al tribunale dell'esecuzione o verifica nella perizia il nome dell'assicuratore e il numero di polizza. Se non esiste alcun contratto, assicura subito l'immobile.",
    },
    "de.insuranceCancel": {
      title: "Verificare l'assicurazione subentrata ed eventualmente disdirla",
      detail:
        "Puoi disdire il contratto acquisito con effetto immediato o alla fine del periodo assicurativo in corso, ma solo entro un mese dall'acquisto; se non ne eri a conoscenza, il termine decorre dal momento in cui ne hai avuto notizia (§ 96 co. 2 VVG). Disdici solo se la nuova copertura subentra senza interruzioni.",
    },
    "de.charges": {
      title: "Subentrare nelle spese correnti",
      detail:
        "Dall'aggiudicazione sostieni gli oneri correnti (§ 56 ZVG): imposta fondiaria pro quota, spese condominiali (Hausgeld), elettricità, acqua e riscaldamento. Rileva le letture dei contatori e informa i fornitori e, se presente, l'amministrazione condominiale (WEG-Verwaltung). Gli arretrati condominiali del precedente proprietario vengono soddisfatti sul ricavato (classe di rango 2, § 10 co. 1 n. 2 ZVG); secondo la Corte federale di giustizia (BGH V ZR 209/12), tale privilegio non comporta una responsabilità reale dell'acquirente.",
    },
    "de.interest": {
      title: "Considerare il decorso degli interessi sull'offerta in contanti (Bargebot)",
      detail:
        "L'offerta da versare (Bargebot) produce interessi a partire dall'aggiudicazione (§ 49 co. 2 ZVG) al tasso del 4% annuo (§ 246 BGB). Gli interessi maturano fino al pagamento. Chiarisci con il funzionario giudiziario (Rechtspfleger) se un deposito anticipato presso il tribunale (§ 49 co. 4 ZVG) sia opportuno nel tuo caso.",
    },
    "de.summons": {
      title: "Inserire la convocazione all'udienza di riparto (Verteilungstermin)",
      detail:
        "Dopo l'aggiudicazione il tribunale fissa l'udienza di riparto e ti convoca quale aggiudicatario; la convocazione deve pervenire almeno due settimane prima (§ 105 ZVG). Inserisci la data qui sopra: la lista calcolerà così pagamento e udienza.",
    },
    "de.financing": {
      title: "Concordare l'erogazione con la banca",
      detail:
        "Regola Belowmark: due settimane prima dell'udienza di riparto la banca dovrebbe conoscere la data di erogazione. Comunica numero di ruolo, cassa del tribunale (Gerichtskasse) e causale indicati nella convocazione. Il fascicolo bancario riassume questi dati per la tua banca.",
    },
    "de.pay": {
      title: "Versare l'offerta (Bargebot) tramite bonifico",
      detail:
        "Il Bargebot deve essere versato prima dell'udienza di riparto tramite bonifico alla cassa del tribunale (Gerichtskasse); l'importo deve risultare accreditato prima dell'udienza e la ricevuta deve essere prodotta in udienza (§ 49 co. 1, 3 ZVG). Il pagamento in contanti non è ammesso. La lista fissa il bonifico cinque giorni prima: è un margine di sicurezza, non un termine di legge.",
    },
    "de.attend": {
      title: "Udienza di riparto (Verteilungstermin)",
      detail:
        "Portare la prova del pagamento (§ 49 co. 3 ZVG). Durante l'udienza viene redatto ed eseguito il piano di riparto (Teilungsplan), presupposto necessario per la tua iscrizione nel libro fondiario (§ 130 ZVG).",
    },
    "de.default": {
      title: "Sapere cosa accade in caso di mancato pagamento",
      detail:
        "Se non paghi, il piano di riparto viene eseguito trasferendo il credito nei tuoi confronti agli aventi diritto (§ 118 ZVG). I creditori possono quindi promuovere immediatamente la rivendita in danno (Wiederversteigerung) contro di te, senza bisogno di un nuovo titolo (§ 133 ZVG). Rimani proprietario e debitore: il recesso non è previsto.",
    },
    "de.taxNotice": {
      title: "Pagare l'imposta sul trasferimento immobiliare (Grunderwerbsteuer)",
      detail:
        "Il tribunale comunica l'aggiudicazione all'ufficio delle imposte (§ 18 co. 1 n. 3 GrEStG). L'imposta scade un mese dopo la notifica dell'avviso di liquidazione (§ 15 GrEStG). Inserisci qui sopra la data dell'avviso.",
    },
    "de.clearance": {
      title: "Nulla osta fiscale (Unbedenklichkeitsbescheinigung)",
      detail:
        "Senza questo certificato non verrai iscritto nel libro fondiario (§ 22 co. 1 GrEStG). L'ufficio delle imposte lo rilascia una volta che l'imposta è stata pagata, garantita o dilazionata (§ 22 co. 2 GrEStG) e di norma lo invia direttamente al tribunale o all'ufficio tavolare. Sollecita se passano settimane dal pagamento.",
    },
    "de.courtFees": {
      title: "Pagare le spese giudiziarie",
      detail:
        "Spese di aggiudicazione (aliquota 0,5 secondo KV 2214 GKG, calcolata su offerta massima più diritti che permangono) e successivamente la tassa per l'iscrizione nel libro fondiario (aliquota 1,0 secondo KV 14110 GNotKG). Il calcolo del limite d'offerta sulla scheda del fascicolo mostra gli importi.",
    },
    "de.registry": {
      title: "Attendere la richiesta d'iscrizione al libro fondiario (Grundbuchersuchen)",
      detail:
        "Una volta eseguito il piano di riparto e divenuta definitiva l'aggiudicazione, il tribunale richiede all'ufficio del libro fondiario di iscriverti come proprietario e di cancellare i diritti estinti nonché l'annotazione di pignoramento/asta (§ 130 co. 1 ZVG). Un'ipoteca (Grundschuld) a favore della tua banca viene iscritta solo successivamente (§ 130 co. 3 ZVG).",
    },
    "de.extract": {
      title: "Controllare la visura del libro fondiario (Grundbuchauszug)",
      detail:
        "Dopo l'iscrizione richiedi un estratto: risulti iscritto come proprietario? L'annotazione dell'asta e i diritti estinti sono stati cancellati? Rimangono iscritti solo i diritti che dovevano permanere secondo le condizioni d'asta?",
    },
    "de.eviction": {
      title: "Sfratto e rilascio in base al decreto di aggiudicazione",
      detail:
        "Nei confronti del possessore, ad esempio il precedente proprietario, il decreto di aggiudicazione costituisce di per sé titolo esecutivo per il rilascio (§ 93 co. 1 ZVG). Occorre una copia esecutiva notificata (§ 750 ZPO) per incaricare l'ufficiale giudiziario (§ 885 ZPO); un incarico limitato ai sensi del § 885a ZPO può ridurre i costi. Non vale contro chi possiede in forza di un diritto che sopravvive all'aggiudicazione (§ 93 co. 1 frase 2 ZVG). Non devi rimborsare le spese sostenute prima dell'aggiudicazione (§ 93 co. 2 ZVG).",
    },
    "de.tenantTakeover": {
      title: "Subentrare nel rapporto di locazione",
      detail:
        "I contratti di locazione e affitto esistenti si trasferiscono a te (§ 57 ZVG in combinato disposto con § 566 BGB). Informa per iscritto gli inquilini del cambio di proprietà e del nuovo conto corrente. Potresti dover rispondere della restituzione della cauzione anche se non l'hai mai ricevuta dal precedente proprietario (§ 566a BGB) — richiedi la prova del deposito cauzionale.",
    },
    "de.tenantNotice": {
      title: "Recesso straordinario: solo alla prima scadenza utile",
      detail:
        "Puoi recedere con il preavviso di legge, ma solo per la prima scadenza consentita — altrimenti il diritto speciale decade (§ 57a ZVG). Per le locazioni abitative la disdetta deve pervenire entro il terzo giorno lavorativo del mese (§ 573c BGB). Resta ferma la tutela del conduttore: occorre un interesse legittimo, ad es. uso proprio (§ 573 BGB). La data indicata qui è calcolata in modo prudenziale (i sabati contano, le festività non sono sottratte): fai verificare la disdetta da un avvocato.",
    },
    "de.handover": {
      title: "Documentare la consegna",
      detail:
        "Chiavi, letture dei contatori, stato dell'immobile con foto, difetti, oggetti lasciati sul posto — con data e firma. Sostituisci le serrature non appena entri in possesso.",
    },
    "de.inspect": {
      title: "Rilevare lo stato di fatto e pianificare la ristrutturazione",
      detail:
        "Non vi è alcuna garanzia per vizi (§ 56 ZVG). Confronta lo stato effettivo con la perizia e richiedi preventivi prima di affidare i lavori. Potrai così sostituire le stime di ristrutturazione nel calcolatore del limite d'offerta con offerte reali.",
    },
    "de.energy": {
      title: "Obblighi di adeguamento energetico dopo il cambio di proprietà",
      detail:
        "Per le case mono- e bifamiliari abitate dal precedente proprietario al 01.02.2002, determinati obblighi di adeguamento (ad es. isolamento dell'ultimo solaio) gravano sul nuovo proprietario con un termine di due anni dal trasferimento della proprietà (già § 47 GEG). Nel 2026 il GEG è stato sostituito dal Gebäudemodernisierungsgesetz: verifica il testo vigente con un consulente energetico.",
    },
    "de.permits": {
      title: "Chiarire i permessi prima dei lavori",
      detail:
        "Se una ristrutturazione, un cambio di destinazione d'uso o lavori su un immobile vincolato richiedano un'autorizzazione dipende dalla normativa regionale (regolamento edilizio, legge sulla tutela dei monumenti). Informati presso l'ufficio tecnico prima di iniziare i lavori.",
    },
    "de.condo": {
      title: "Richiedere la documentazione condominiale (WEG)",
      detail:
        "In caso di condominio: informa l'amministratore del cambio di proprietà e richiedi bilancio preventivo (Wirtschaftsplan), ultimo consuntivo annuale, registro delle delibere e regolamento di divisione (Teilungserklärung). Presta attenzione a eventuali contributi straordinari deliberati (Sonderumlagen).",
    },
  },
  TR: {
    "tr.pay": {
      title: "Pagare il prezzo di aggiudicazione (ihale bedeli) — 7 giorni",
      detail:
        "Il prezzo di acquisto e le spese devono essere pagati entro sette giorni dalla pubblicazione del verbale di esito dell'asta (artırma sonuç tutanağı), anche se qualcuno ha chiesto l'annullamento dell'asta (Elektronik Satış Yönetmeliği art. 20/1; İİK art. 130). Dalla Legge n. 7343 non è più prevista la proroga di dieci giorni. Inserisci qui sopra la data di pubblicazione del verbale.",
    },
    "tr.fees": {
      title: "Predisporre le spese secondo la Şartname",
      detail:
        "L'imposta catastale (tapu harcı) ammonta al 20‰ del prezzo di vendita per ciascuna parte (Legge n. 492 Harçlar Kanunu, Tariffa 4 art. 20/a). Se il disciplinare d'asta (Şartname) pone le imposte di Tapu interamente a carico dell'acquirente, il Ministero della Giustizia lo ritiene ammissibile (İİDB, 12.01.2023) — l'aliquota sale così al 40‰. Si aggiungono l'IVA (KDV) secondo il bando e l'imposta di bollo (damga vergisi). Leggi la Şartname della tua procedura.",
    },
    "tr.default": {
      title: "Sapere cosa accade in caso di mancato pagamento",
      detail:
        "In caso di mancato pagamento, l'ufficio esecuzioni annulla l'aggiudicazione (ihale) e rispondi del minor ricavato (İİK art. 133). Per le vendite pubblicate a partire dal 31.07.2026 si aggiunge una penale del 5% dell'offerta (İİK art. 114 come modificato dalla Legge n. 7589).",
    },
    "tr.annulment": {
      title: "Attendere il termine per l'impugnazione dell'asta (ihalenin feshi)",
      detail:
        "Gli interessati possono chiedere l'annullamento dell'asta entro sette giorni (ihalenin feshi, İİK art. 134), o in casi particolari dalla presa di conoscenza fino a un massimo di un anno. Finché pende un giudizio non si procede all'iscrizione. Fino ad allora non affidare incarichi che non puoi revocare.",
    },
    "tr.registry": {
      title: "Seguire l'iscrizione nel registro fondiario (tescil)",
      detail:
        "Una volta divenuta definitiva l'aggiudicazione (kesinleşme) ed effettuato il pagamento, l'ufficio esecuzioni scrive all'ufficio del Tapu per iscriverti come proprietario (İİK art. 134). Verifica se la comunicazione ufficiale (tescil müzekkeresi) è stata inviata.",
    },
    "tr.deed": {
      title: "Controllare l'iscrizione al Tapu",
      detail:
        "Dopo l'iscrizione controlla tramite e-Devlet (Tapu Bilgileri): risulti come proprietario e i pignoramenti (haciz) e le ipoteche (ipotek) sono stati cancellati?",
    },
    "tr.dask": {
      title: "Stipulare una nuova polizza antisismica DASK",
      detail:
        "L'assicurazione contro i terremoti è obbligatoria (Legge n. 6305). Dal 05.09.2026 la polizza del precedente proprietario non si trasferisce più, ma cessa con l'iscrizione (Condizioni generali DASK, Gazzetta Ufficiale 21.08.2026/33347). Stipula una polizza a tuo nome; i fornitori di utenze la richiedono spesso per i nuovi allacciamenti. Chiedi all'ufficio del Tapu se ne verifica la presenza al momento dell'iscrizione da asta.",
    },
    "tr.propertyTax": {
      title: "Regolarizzare l'imposta immobiliare (emlak vergisi)",
      detail:
        "Il trasferimento di proprietà comporta l'obbligo di dichiarazione al Comune (Legge n. 1319 art. 23); l'obbligo tributario decorre dall'anno successivo (art. 33). Chiedi al Comune se basta la comunicazione dell'ufficio Tapu e fatti indicare eventuali imposte arretrate sull'immobile.",
    },
    "tr.eviction": {
      title: "Rilascio tramite l'ufficio esecuzioni",
      detail:
        "Se nell'immobile abita il debitore o qualcuno senza titolo, su tua istanza l'ufficio esecuzioni notifica un ordine di rilascio con termine di 15 giorni, dopodiché si procede allo sgombero forzato (İİK art. 135/2). Gli inquilini con contratto di data certa anteriore al pignoramento sono tutelati (vedi Inquilini). Non rimandare la presentazione dell'istanza.",
    },
    "tr.tenant": {
      title: "Inquilini: il contratto di locazione prosegue",
      detail:
        "Il nuovo proprietario subentra nel contratto di locazione (TBK art. 310). Se intendi disdire per necessità abitativa propria, devi comunicarlo per iscritto all'inquilino entro un mese dall'acquisto e puoi agire in giudizio non prima di sei mesi (TBK art. 351). Chiarisci con un avvocato quale data valga come acquisto in un'asta: la lista calcola prudenzialmente dalla data dell'ihale.",
    },
    "tr.handover": {
      title: "Documentare la consegna",
      detail:
        "Chiavi, letture dei contatori, stato con foto datate. Volturare le utenze di luce, acqua e gas (abonelik) a proprio nome e sostituire le serrature.",
    },
    "tr.inspect": {
      title: "Rilevare lo stato di fatto e pianificare la ristrutturazione",
      detail:
        "Confronta lo stato effettivo con la perizia di stima (kıymet takdir raporu) e richiedi preventivi prima di affidare i lavori.",
    },
    "tr.permits": {
      title: "Permessi per lavori edilizi",
      detail:
        "Per le modifiche edilizie può essere necessaria una concessione edilizia (yapı ruhsatı, Legge n. 3194 İmar Kanunu art. 21). Informati prima presso il Comune.",
    },
    "tr.condo": {
      title: "Informare l'amministrazione condominiale",
      detail:
        "Negli appartamenti in condominio: informa l'amministrazione (yönetim) e richiedi l'importo delle spese condominiali (aidat) e il regolamento condominiale (yönetim planı, Legge n. 634 Kat Mülkiyeti Kanunu).",
    },
  },
};
