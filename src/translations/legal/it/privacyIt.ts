import { filled, LEGAL_OPERATOR, operatorAddress } from "../../../lib/legal/legalOperator";
import { LegalDocument } from "../../../types/legal.types";

export const PRIVACY_IT: LegalDocument = {
  title: "Informativa sulla privacy",
  asOf: "Aggiornato al 31 ottobre 2026",
  basis: "Informazioni ai sensi degli artt. 13 e 14 del Regolamento generale sulla protezione dei dati (GDPR).",
  sections: [
    {
      id: "verantwortlicher",
      heading: "1. Titolare del trattamento",
      paragraphs: [
        `${operatorAddress()}. E-Mail ${LEGAL_OPERATOR.email}, Telefono ${LEGAL_OPERATOR.phone}. Non abbiamo nominato un responsabile della protezione dei dati (DPO) in quanto non sussiste alcun obbligo di legge.`,
      ],
    },
    {
      id: "aufruf",
      heading: "2. Navigazione sul sito web",
      paragraphs: [
        "All'apertura di ogni pagina il server elabora i dati tecnicamente necessari: indirizzo IP, data e ora, indirizzo richiesto, user-agent del browser e codice di risposta del server. La base giuridica è l'art. 6 par. 1 lett. f GDPR (legittimo interesse a un funzionamento sicuro e regolare).",
        `L'applicazione stessa non registra log di accesso. Presso il fornitore di hosting possono essere generati log tecnici: ${filled(LEGAL_OPERATOR.hosting, "Inserire fornitore di hosting, sede del server e durata di conservazione")}.`,
      ],
    },
    {
      id: "konto",
      heading: "3. Account e accesso",
      paragraphs: [
        "Per ciascun account memorizziamo: indirizzo e-mail, valore di controllo crittografico della password (scrypt, nessun testo in chiaro), mercato e lingua scelti, data di conferma dell'e-mail, fine del periodo di prova, piano prenotato e relativa durata nonché l'ultimo accesso. La base giuridica è l'art. 6 par. 1 lett. b GDPR (contratto).",
        "Per ogni accesso manteniamo una sessione con un hash del browser, un indirizzo IP abbreviato e la scadenza per rilevare cookie di sessione sottratti e disconnettere tutti i dispositivi (art. 6 par. 1 lett. f GDPR).",
        "Durante la registrazione e l'accesso il browser calcola un valore di controllo del dispositivo dalle caratteristiche tecniche (scheda grafica, schermo, core della CPU, fuso orario) e lo salva nella memoria locale (\"ec_hw_id\") al solo scopo di riconoscere dispositivi bloccati e proteggere gli account da attacchi automatizzati (§ 25 comma 2 n. 2 TDDDG, art. 6 par. 1 lett. f GDPR).",
        "Verifichiamo le nuove password rispetto a violazioni di dati note (Have I Been Pwned) trasmettendo solo i primi cinque caratteri di un hash SHA-1 (k-anonymity, art. 6 par. 1 lett. f GDPR).",
        "Per prevenire abusi contiamo le richieste per indirizzo IP e indirizzo e-mail su brevi finestre temporali.",
      ],
    },
    {
      id: "app",
      heading: "4. Contenuti salvati nell'account",
      paragraphs: [
        "La lista dei preferiti con note e le ricerche salvate (alert) sono archiviate nel nostro database. Le perizie caricate vengono analizzate; viene salvato il risultato dell'estrazione (nome file, passaggi estratti con pagina), non il file PDF. Base giuridica: art. 6 par. 1 lett. b GDPR.",
        "Se è attiva l'analisi avanzata delle perizie, il testo della perizia viene trasmesso al nostro responsabile del trattamento IA (clausole contrattuali standard UE ai sensi dell'art. 46 par. 2 lett. c GDPR).",
        "Liste di controllo, calcoli del limite d'offerta, note di valutazione, valori comparabili e fascicolo bancario sono salvati solo nel browser (memoria locale \"belowmark:…\") e non raggiungono il nostro server.",
      ],
    },
    {
      id: "zahlung",
      heading: "5. Prenotazione e pagamento",
      paragraphs: [
        "In caso di prenotazione memorizziamo l'ordine: piano, prezzo, mercato, versione delle condizioni generali, momento del consenso all'esecuzione immediata e stato del pagamento (art. 6 par. 1 lett. b e c GDPR).",
        "Il pagamento avviene sulla pagina di Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Dublino 2, Irlanda. I dati di pagamento vengono inseriti direttamente presso Stripe e non ci raggiungono mai. Da Stripe riceviamo identificativo cliente, stato del pagamento e fattura (informativa Stripe: stripe.com/it/privacy).",
        "La pagina di pagamento di Stripe risiede su un dominio Stripe. Su belowmark.com non integriamo script esterni di Stripe.",
        "Conserviamo fatture e documenti contabili per i periodi previsti dal diritto commerciale e fiscale (§ 147 AO, § 257 HGB).",
      ],
    },
    {
      id: "erklaerungen",
      heading: "6. Disdetta e recesso",
      paragraphs: [
        "Le dichiarazioni inviate tramite \"Disdici i contratti qui\" e \"Recedi dal contratto\" vengono memorizzate con nome, e-mail, riferimento contrattuale, contenuto nonché data e ora di ricezione e confermate via e-mail. Vengono conservate per tre anni dalla fine dell'anno di ricezione (art. 6 par. 1 lett. c e f GDPR).",
      ],
    },
    {
      id: "mail",
      heading: "7. Comunicazioni via e-mail",
      paragraphs: [
        `Inviamo solo e-mail strettamente legate al contratto: link di conferma, link per la password, conferme d'ordine e di disdetta e alert attivati dall'utente. Nessuna pubblicità, nessuna newsletter, nessun tracciamento di apertura o clic. Invio tramite ${filled(LEGAL_OPERATOR.mailProvider, "Inserire fornitore SMTP")}.`,
      ],
    },
    {
      id: "cookies",
      heading: "8. Cookie e archiviazione locale",
      paragraphs: [
        "Non utilizziamo cookie di analisi, profilazione o pubblicità e non integriamo servizi di tracciamento. Pertanto non è necessario alcun banner di consenso.",
        "Cookie di sessione (\"__Host-bm_session\"): mantiene attivo l'accesso; strettamente necessario per il servizio richiesto (§ 25 comma 2 n. 2 TDDDG). Scade alla chiusura del browser o dopo 30 giorni se si sceglie \"Resta collegato\".",
        "\"BELOWMARK_COUNTRY\" e \"BELOWMARK_MARKET\" (durata un anno): memorizzano il paese e il mercato scelti per adattare lingua e valuta.",
        "I caratteri tipografici sono caricati direttamente dal nostro server, non da Google.",
      ],
    },
    {
      id: "karten",
      heading: "9. Mappe e immagini aeree",
      paragraphs: [
        "Nella pagina di dettaglio di un immobile il browser carica i tasselli di mappa direttamente da basemap.de, OpenStreetMap e le immagini aeree da Esri (server.arcgisonline.com). Tali fornitori ricevono l'indirizzo IP e le coordinate del tassello (art. 6 par. 1 lett. f GDPR).",
        "I link a Google Maps, portali giudiziari e portali immobiliari aprono siti esterni solo al clic dell'utente.",
      ],
    },
    {
      id: "dauer",
      heading: "10. Periodo di conservazione e cancellazione",
      paragraphs: [
        "Conserviamo i dati dell'account finché l'utente non elimina l'account. Nell'account alla voce \"I tuoi dati\" è possibile scaricare tutti i dati in formato JSON ed eliminare direttamente l'account. Gli ordini e le dichiarazioni restano conservati senza riferimento all'account per i soli obblighi fiscali e di legge.",
        "I link monouso (conferma e-mail, reimpostazione password) vengono eliminati all'uso e scadono rispettivamente dopo 24 ore o un'ora.",
      ],
    },
    {
      id: "rechte",
      heading: "11. Diritti dell'interessato",
      paragraphs: [
        "Avete il diritto di accesso (art. 15), rettifica (art. 16), cancellazione (art. 17), limitazione del trattamento (art. 18), portabilità dei dati (art. 20) e opposizione (art. 21 GDPR). Potete rivolgervi ai recapiti sopra indicati o utilizzare le funzioni dirette di esportazione e cancellazione nell'account.",
        `Avete il diritto di proporre reclamo a un'autorità di controllo per la protezione dei dati personali, in particolare a quella competente per la nostra sede: ${LEGAL_OPERATOR.supervisoryAuthority}.`,
        "Non viene effettuato alcun processo decisionale automatizzato o di profilazione ai sensi dell'art. 22 GDPR.",
      ],
    },
  ],
};
