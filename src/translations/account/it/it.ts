import { IAccountTranslation } from "../IAccountTranslation";

export const ACCOUNT_IT: IAccountTranslation = {
  Nav: {
    Label: "Sezioni del tuo account",
    Sections: {
      uebersicht: { Title: "Panoramica", Hint: "Dati e stato" },
      tarif: { Title: "Piano e fatture", Hint: "Durata, PDF, indirizzo" },
      sicherheit: { Title: "Sicurezza", Hint: "Password, dispositivi" },
      daten: { Title: "I tuoi dati", Hint: "Esporta, elimina" },
    },
  },

  Overview: {
    Title: "A colpo d'occhio",
    Description: "Lo stato del tuo account. I dettagli si trovano nelle sezioni a sinistra.",
    Plan: "Piano",
    PlanCta: "Piano e fatture",
    LatestInvoice: "Ultima fattura",
    NoInvoice: "Nessuna fattura presente.",
    AllInvoices: "Tutte le fatture",
    Research: "Ricerca",
    ResearchBody: "Avvisi, mappa, preferiti e calcolatore d'offerta.",
    ResearchCta: "Vai alla ricerca",
  },

  Portal: {
    Label: "Metodi di pagamento su Stripe",
    Hint: "Apre il portale clienti di Stripe per modificare la carta o gestire l'abbonamento. Le tue fatture sono elencate qui sotto.",
    Unavailable: "Potrai gestire i metodi di pagamento su Stripe non appena avrai effettuato il primo pagamento tramite Stripe.",
  },

  Invoices: {
    Title: "Fatture",
    Description: "Ogni pagamento riceve una fattura dedicata con numerazione progressiva. Disponibile in PDF in qualsiasi momento, tutte le volte che vuoi.",
    Empty: "Ancora nessuna fattura. Apparirà qui non appena un pagamento sarà confermato.",
    Count: "{count} fatture",
    CountOne: "1 fattura",
    Columns: { Number: "Numero · Data", Service: "Servizio", Amount: "Importo", Document: "Documento" },
    Paid: "Pagata",
    Test: "Test",
    Upgrade: "Upgrade",
    Renewal: "Rinnovo",
    Download: "PDF",
    View: "Visualizza",
    DownloadLabel: "Scarica la fattura {number} in PDF",
    Note: "Conserva le fatture per il tuo archivio. Dopo l'eliminazione dell'account, le conserviamo esclusivamente a fini fiscali e contabili.",
  },

  Address: {
    Title: "Indirizzo di fatturazione",
    Description: "Appare sulle tue fatture. Per importi fino a 250 € basta l'indirizzo e-mail; oltre tale soglia e per la tua contabilità servono nome e recapito.",
    Missing: "Nessun indirizzo di fatturazione inserito. Le fatture precedenti prive di indirizzo lo recepiranno una tantum non appena lo salverai.",
    Empty: "Nessun indirizzo di fatturazione inserito.",
    Add: "Aggiungi indirizzo",
    Name: "Nome o azienda",
    NameHint: "Esattamente come deve comparire in fattura.",
    Address: "Indirizzo",
    AddressHint: "Via e numero civico, CAP e città, Paese — un dato per riga.",
    VatId: "Partita IVA",
    VatIdHint: "Solo per aziende, es. DE123456789.",
    Optional: "facoltativo",
    Edit: "Modifica",
    Cancel: "Annulla",
    Submit: "Salva indirizzo",
    Pending: "Salvataggio in corso …",
    Saved: "Salvato. Le nuove fatture riporteranno questo indirizzo.",
    ErrorTitle: "Controlla i dati inseriti",
    Errors: {
      name_required: "Inserisci un nome.",
      address_required: "Inserisci un indirizzo.",
      too_long: "Uno dei campi inseriti è troppo lungo.",
      rate_limited: "Troppi tentativi. Attendi un istante.",
      unknown: "Operazione non riuscita. Riprova.",
    },
  },
};
