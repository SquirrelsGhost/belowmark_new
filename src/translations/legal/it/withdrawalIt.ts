import { operatorAddress, LEGAL_OPERATOR } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

const contact = `${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email}, Telefono ${LEGAL_OPERATOR.phone}`;

export const WITHDRAWAL_IT: LegalDocument = {
  title: "Informativa sul recesso ed estinzione per i contenuti digitali",
  asOf: "Aggiornato al 31 ottobre 2026",
  basis: "Per i consumatori nei contratti relativi a contenuti digitali non forniti su supporto materiale (§§ 312g, 355, 356 comma 5 BGB / Art. 59 Codice del Consumo).",
  sections: [
    {
      id: "erloeschen",
      heading: "1. Estinzione anticipata del diritto di recesso (§ 356 comma 5 BGB)",
      paragraphs: [
        "Il diritto di recesso si estingue in un contratto per la fornitura di contenuti digitali non forniti su un supporto materiale (attivazione dell'accesso digitale completo a valori di perizia, analisi peritali, offerte minime, calcolatori di scadenze e documenti su Belowmark) immediatamente con l'inizio dell'esecuzione del contratto, qualora:",
        "1. abbiate espressamente acconsentito a che iniziamo l'esecuzione del contratto prima della scadenza del periodo di recesso,",
        "2. abbiate confermato di essere a conoscenza che, con il vostro consenso, il diritto di recesso si estingue all'inizio dell'esecuzione del contratto, e",
        "3. vi abbiamo fornito una conferma ai sensi del § 312f comma 2 BGB su un supporto durevole (via e-mail).",
        "Poiché rilasciate tale consenso e conferma nel processo d'ordine accettando i Termini e Condizioni prima di fare clic su \"Ordina con obbligo di pagamento\" e il vostro accesso completo viene attivato immediatamente dopo la conferma del pagamento, il recesso è escluso ai sensi del § 356 comma 5 BGB una volta attivato l'accesso digitale.",
      ],
    },
    {
      id: "recht",
      heading: "2. Informativa legale sul recesso (prima dell'inizio dell'esecuzione)",
      paragraphs: [
        "Qualora in via eccezionale non sia ancora iniziata l'esecuzione del contratto (attivazione dell'accesso digitale), si applica il seguente diritto di recesso di legge:",
        "Avete il diritto di recedere dal presente contratto entro quattordici giorni senza dover fornire alcuna motivazione. Il periodo di recesso è di quattordici giorni a decorrere dal giorno della conclusione del contratto.",
        `Per esercitare il diritto di recesso, siete tenuti a informarci (${contact}) della vostra decisione di recedere dal presente contratto tramite una dichiarazione esplicita (ad esempio lettera inviata per posta o e-mail). A tal fine potete utilizzare il modulo tipo di recesso allegato, ma non è obbligatorio.`,
        "Per rispettare il termine di recesso, è sufficiente inviare la comunicazione relativa all'esercizio del diritto di recesso prima della scadenza del periodo di recesso e prima dell'attivazione dell'accesso digitale.",
      ],
    },
    {
      id: "folgen",
      heading: "3. Effetti di un recesso valido (prima dell'attivazione)",
      paragraphs: [
        "Se recedete validamente dal presente contratto prima che il diritto di recesso si sia estinto tramite l'attivazione dell'accesso digitale ai sensi del § 356 comma 5 BGB, vi saranno rimborsati tutti i pagamenti che avete effettuato a nostro favore, senza indebito ritardo e in ogni caso non oltre quattordici giorni dal giorno in cui siamo informati della vostra decisione di recedere. Detti rimborsi saranno effettuati utilizzando lo stesso mezzo di pagamento da voi usato per la transazione iniziale.",
      ],
    },
    {
      id: "praxis",
      heading: "4. Disdetta degli abbonamenti in corso",
      paragraphs: [
        "Indipendentemente dall'estinzione del diritto di recesso in caso di attivazione immediata (§ 356 comma 5 BGB), potete disdire in qualsiasi momento un abbonamento mensile in corso (Investor Mensile o Pro Mensile) con effetto alla fine del mese di fatturazione già pagato — con un clic nell'account o tramite \"Disdici i contratti qui\" nel piè di pagina di ogni pagina.",
      ],
    },
    {
      id: "formular",
      heading: "5. Modulo tipo di recesso",
      paragraphs: [
        "(Applicabile solo qualora il diritto di recesso non si sia già estinto ai sensi del § 356 comma 5 BGB con l'attivazione dell'accesso digitale.)",
        `Destinatario: ${operatorAddress()}, E-Mail ${LEGAL_OPERATOR.email}:`,
        "Con la presente io/noi (*) notifico/notifichiamo il recesso dal mio/nostro (*) contratto di fornitura dei seguenti contenuti digitali (*):",
        "Ordinato il (*):",
        "Nome del/dei consumatore(i):",
        "Indirizzo del/dei consumatore(i):",
        "Firma del/dei consumatore(i) (solo se il presente modulo è notificato in versione cartacea):",
        "Data:",
        "(*) Cancellare la dicitura inutile.",
      ],
    },
  ],
};
