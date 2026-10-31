import { LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export function vatSentenceIt(vatMode: "inclusive" | "kleinunternehmer" | null): string {
  if (vatMode === "kleinunternehmer") {
    return "Tutti i prezzi sono prezzi finali. Ai sensi del § 19 della legge tedesca sull'IVA (UStG), non viene addebitata l'imposta sul valore aggiunto.";
  }
  return "Tutti i prezzi sono prezzi finali e includono l'imposta sul valore aggiunto (IVA) di legge applicabile.";
}

export function termsIt(vatMode: "inclusive" | "kleinunternehmer" | null): LegalDocument {
  return {
    title: "Termini e Condizioni Generali (AGB)",
    asOf: "Aggiornato al 31 ottobre 2026",
    basis: "Per l'utilizzo della piattaforma Belowmark (belowmark.com).",
    sections: [
      {
        id: "geltung",
        heading: "1. Ambito di applicazione e parti contrattuali",
        paragraphs: [
          `Le presenti condizioni generali si applicano a tutti i contratti relativi all'utilizzo del servizio online Belowmark stipulati tra ${operatorAddress()} (di seguito "Fornitore") e il cliente.`,
          "È consumatore qualsiasi persona fisica che concluda il contratto per scopi prevalentemente estranei alla propria attività commerciale o professionale autonoma (§ 13 BGB / Codice del Consumo). Condizioni divergenti del cliente si applicano solo se espressamente approvate dal Fornitore.",
        ],
      },
      {
        id: "leistung",
        heading: "2. Oggetto del servizio",
        paragraphs: [
          "Belowmark raccoglie informazioni rese pubbliche su aste immobiliari giudiziarie e pubbliche in Europa (Germania, Austria, Svizzera, Italia, Spagna, Francia, Regno Unito) e in Turchia, le ordina e ne calcola indicatori analitici (ad esempio offerta minima, cauzione, costi accessori di acquisto). Per la durata del contratto il cliente riceve un accesso personale all'applicazione web per il mercato scelto al momento della registrazione.",
          "Belowmark è uno strumento di ricerca e analisi preliminare. Il servizio non costituisce consulenza legale, fiscale, immobiliare o di investimento e non contiene alcuna raccomandazione a presentare una determinata offerta. Ogni informazione deve essere verificata sui documenti ufficiali del tribunale prima di qualsiasi decisione economica.",
          "I dati provengono da fonti di terzi (portali giudiziari come PVP Giustizia, portali pubblici e siti di annunci). Il Fornitore non assume alcuna garanzia circa l'esattezza, la completezza e l'attualità dei dati; l'elenco può essere incompleto. I valori calcolati sono risultati matematici basati su tali dati e non costituiscono perizie ufficiali.",
        ],
      },
      {
        id: "tarife",
        heading: "3. Piani e tariffe",
        paragraphs: [
          "Free Scout: utilizzo gratuito a tempo indeterminato con ambito limitato (elenco immobili visibile, valori di perizia e date d'asta bloccati). Non vengono richiesti dati di pagamento.",
          "Periodo di prova: dopo la conferma dell'indirizzo e-mail, il cliente riceve gratuitamente per 14 giorni l'ambito dell'accesso Investor. Il periodo di prova termina automaticamente e non si trasforma in un abbonamento a pagamento.",
          "Investor Mensile: accesso completo individuale a 39,00 € / £35 / CHF 39 (mercati europei) o 599,00 TL (mercato Turchia) al mese, pagabile in anticipo, con rinnovo automatico mensile salvo disdetta.",
          "Investor Tre Mesi: accesso completo per tre mesi solari con pagamento unico anticipato di 99,00 € / £89 / CHF 99 (mercati europei) o 1.490,00 TL (mercato Turchia). Non si rinnova automaticamente; non è necessaria alcuna disdetta.",
          "Pro Mensile: accesso completo inclusi link clienti con propria carta intestata e liste team condivise (fino a 3 team con massimo 5 postazioni ciascuno) a 129,00 € / £115 / CHF 129 (mercati europei) o 1.990,00 TL (mercato Turchia) al mese, pagabile in anticipo, con rinnovo automatico mensile.",
          "Pro Tre Mesi: accesso completo Pro per tre mesi solari con pagamento unico anticipato di 329,00 € / £295 / CHF 329 (mercati europei) o 4.990,00 TL (mercato Turchia). Non si rinnova automaticamente; non è necessaria alcuna disdetta. Contingenti team estesi (da 299,00 € al mese) vengono concordati individualmente su richiesta.",
          vatSentenceIt(vatMode),
        ],
      },
      {
        id: "vertragsschluss",
        heading: "4. Conclusione del contratto",
        paragraphs: [
          "Con la registrazione e la conferma dell'indirizzo e-mail si conclude un contratto d'uso gratuito (Free Scout con periodo di prova).",
          "L'accesso a pagamento Investor o Pro viene prenotato nell'account tramite il riepilogo dell'ordine, dove sono indicati piano, prezzo, durata e rinnovo. Facendo clic sul pulsante \"Ordina con obbligo di pagamento\", il cliente invia un'offerta vincolante e viene indirizzato alla pagina di pagamento di Stripe. Il contratto si conclude non appena Stripe conferma il pagamento e il Fornitore attiva l'accesso; il cliente riceve conferma via e-mail.",
          "Il Fornitore memorizza il testo contrattuale (ordine, piano, prezzo e versione delle presenti condizioni) e lo invia via e-mail insieme alla conferma. La versione aggiornata è sempre consultabile su belowmark.com/agb.",
        ],
      },
      {
        id: "zahlung",
        heading: "5. Pagamento e fatture",
        paragraphs: [
          "Il pagamento è gestito tramite Stripe Payments Europe, Ltd. (Irlanda). I dati di pagamento vengono inseriti esclusivamente sulla pagina di pagamento di Stripe e non vengono memorizzati dal Fornitore.",
          "L'abbonamento mensile viene addebitato in anticipo all'inizio di ogni mese. Le fatture sono disponibili nell'account alla voce \"Fatture e metodi di pagamento\" e vengono inviate via e-mail.",
          "Se un addebito non va a buon fine, Stripe effettua un nuovo tentativo. In caso di mancato pagamento, l'accesso completo termina alla scadenza del periodo pagato, mentre resta attivo il profilo gratuito.",
        ],
      },
      {
        id: "laufzeit",
        heading: "6. Durata e disdetta",
        paragraphs: [
          "L'abbonamento mensile Investor o Pro è a tempo indeterminato e può essere disdetto in qualsiasi momento con effetto alla fine del mese già pagato. Fino a tale data l'accesso completo resta attivo. Non è previsto alcun rimborso pro-quota per il mese in corso in caso di disdetta ordinaria.",
          `La disdetta può essere effettuata tramite il pulsante "Disdici i contratti qui" presente nel piè di pagina di ogni pagina (accessibile senza login), nell'account, tramite il portale clienti Stripe o in forma scritta a ${LEGAL_OPERATOR.email}. Dopo la disdetta tramite l'apposito pulsante, il cliente riceve immediatamente una conferma via e-mail con contenuto, data e ora di ricezione nonché la data di cessazione del contratto.`,
          "Il pacchetto di tre mesi termina automaticamente alla scadenza dei mesi prenotati. Il contratto gratuito Free Scout può essere terminato in qualsiasi momento eliminando l'account.",
          "Resta fermo per entrambe le parti il diritto di recesso straordinario per giusta causa.",
        ],
      },
      {
        id: "widerruf",
        heading: "7. Diritto di recesso ed estinzione per i contenuti digitali (§ 356 comma 5 BGB / Art. 59 Cod. Cons.)",
        paragraphs: [
          "Belowmark è un prodotto digitale con attivazione immediata dopo la ricezione del pagamento. Accettando i presenti Termini e Condizioni nel processo d'ordine, il cliente acconsente espressamente a che il Fornitore inizi l'esecuzione del contratto (fornitura e attivazione immediata dell'accesso digitale a pagamento) prima della scadenza del periodo di recesso, e conferma di essere a conoscenza che il proprio diritto di recesso di legge si estingue immediatamente con l'attivazione dell'accesso (§ 356 comma 5 BGB).",
          "L'informativa completa sull'estinzione del diritto di recesso ai sensi del § 356 comma 5 BGB è consultabile su belowmark.com/widerruf e viene trasmessa al cliente via e-mail con la conferma del contratto.",
        ],
      },
      {
        id: "verfuegbarkeit",
        heading: "8. Disponibilità del servizio",
        paragraphs: [
          "Il Fornitore si impegna a garantire una disponibilità continua del servizio, ma non garantisce una specifica percentuale di operatività. Manutenzione, guasti presso terzi o interruzioni dei portali ufficiali possono limitare temporaneamente l'accesso o l'aggiornamento dei dati.",
        ],
      },
      {
        id: "nutzung",
        heading: "9. Diritti d'uso, divieto di scraping e blocco dell'account senza rimborso",
        paragraphs: [
          "Il cliente riceve un diritto semplice e non trasferibile di utilizzare il servizio durante la durata del contratto esclusivamente per propri scopi di ricerca tramite un normale browser web. Sono severamente vietati in particolare: (a) la cessione delle credenziali o l'uso condiviso di un account da parte di più persone al di fuori dei posti team prenotati, (b) qualsiasi lettura, estrazione, copia o indicizzazione sistematica, automatizzata o basata su script di dati, testi, indicatori o documenti (in particolare tramite bot, crawler, scraper, browser headless o script), (c) l'elusione di misure tecniche di protezione, limiti di richieste (rate-limit) o meccanismi di sicurezza (incluso l'innesco di trappole honeypot) nonché (d) il download di massa, la rivendita, la concessione in sublicenza o la messa a disposizione del pubblico dei dati o documenti elaborati.",
          "Una violazione dei suddetti divieti costituisce una grave violazione degli obblighi contrattuali essenziali e legittima il Fornitore alla risoluzione straordinaria immediata per giusta causa (§ 314 BGB) nonché al blocco immediato e permanente dell'account utente e dell'identificativo del dispositivo utilizzato senza preavviso.",
          "In caso di tale blocco dell'account o risoluzione straordinaria causati dalla violazione contrattuale del cliente (in particolare mediante scraping, estrazione automatizzata di dati o elusione dei meccanismi di sicurezza), il diritto d'uso cessa con effetto immediato. In tal caso è escluso qualsiasi diritto del cliente al rimborso totale o parziale dei corrispettivi già versati per il mese di fatturazione in corso o per i periodi fissi plurimensili prenotati. Restano salve ulteriori pretese di risarcimento danni e azioni inibitorie del Fornitore.",
        ],
      },
      {
        id: "haftung",
        heading: "10. Limitazione di responsabilità",
        paragraphs: [
          "Il Fornitore risponde illimitatamente in caso di dolo e colpa grave, di lesioni alla vita, al corpo o alla salute nonché ai sensi della normativa sulla responsabilità da prodotto. In caso di colpa lieve risponde solo per la violazione di obblighi contrattuali essenziali, limitatamente al danno prevedibile e tipico del contratto.",
          "Salvo quanto previsto dal comma precedente, il Fornitore non risponde delle decisioni economiche del cliente, in particolare delle offerte presentate in asta e delle relative conseguenze.",
        ],
      },
      {
        id: "aenderungen",
        heading: "11. Modifiche delle presenti condizioni e dei prezzi",
        paragraphs: [
          "Il Fornitore comunica in forma testuale eventuali modifiche delle presenti condizioni o del prezzo dell'abbonamento mensile almeno sei settimane prima della loro entrata in vigore. Esse divengono efficaci solo con il consenso del cliente; in mancanza di consenso, ciascuna parte può recedere dal contratto alla data di entrata in vigore della modifica.",
        ],
      },
      {
        id: "recht",
        heading: "12. Legge applicabile e foro competente",
        paragraphs: [
          "Si applica il diritto tedesco con esclusione della Convenzione ONU sulla compravendita internazionale di merci (CISG). Nei confronti dei consumatori tale scelta di legge si applica solo nella misura in cui non privi il consumatore della tutela garantita dalle disposizioni inderogabili della legge dello Stato in cui il consumatore ha la propria residenza abituale.",
          `Se il cliente è un imprenditore, una persona giuridica di diritto pubblico o un patrimonio separato di diritto pubblico, il foro competente esclusivo è la sede del Fornitore (${LEGAL_OPERATOR.court}).`,
        ],
      },
    ],
  };
}
