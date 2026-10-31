import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_IT: ITrMarketTranslation = {
  Age: {
    Title: "Età del valore di stima",
    Lead: "Il Muhammen bedel è un importo nominale risalente all'anno di avvio della procedura. Con l'inflazione turca, nei fascicoli meno recenti non si tratta di un dettaglio trascurabile.",
    FileYear: "Anno del fascicolo",
    Basis: "Determinazione del valore al più tardi a dicembre {year} — l'ultima data possibile di quell'anno, quindi nel dubbio il valore più prudenziale.",
    Factor: "Prezzi al consumo da allora",
    Lost: "Perdita di potere d'acquisto del valore nominale",
    Today: "Valore di stima in lire di {month}",
    TodayNote: "Ricalcolato il solo potere d'acquisto — non è una nuova perizia né un prezzo di mercato.",
    Young: "Fascicolo del {year}: la stima è recente, una correzione per l'inflazione non aggiunge indicazioni utili.",
    NoYear: "Il numero di fascicolo non indica alcun anno. Senza anno non è possibile alcun inquadramento.",
    Unavailable: "La serie ufficiale dei prezzi non è abbastanza aggiornata. Meglio nessun numero che un dato congelato.",
    Source: "{label}, {source} · aggiornato a {month}",
  },

  Euro: {
    Title: "Controvalore in euro",
    Value: "Valore di stima",
    StartingBid: "Offerta base",
    AllIn: "Offerta base incl. spese accessorie",
    Rate: "1 € = {rate} · cambio di acquisto valuta TCMB del {date}",
    Note: "Convertito al tasso giornaliero della Banca Centrale, non al cambio del giorno di pagamento. Il pagamento avviene in lire turche.",
    Unavailable: "Nessun cambio aggiornato della Banca Centrale disponibile{last}. I valori in euro compaiono non appena viene caricato il tasso del giorno — non calcoliamo mai con un cambio obsoleto.",
    LastRate: " (ultimo cambio del {date})",
  },

  CheckKit: {
    Title: "Kit di verifica per e-Satış",
    Lead: "Foto, perizia e condizioni d'asta si trovano su e-Satış, accessibili solo tramite e-Devlet. Un link diretto non trasferisce la ricerca: copia questi dati e incollali sul portale.",
    Copy: "Copia kit di verifica",
    Copied: "Copiato",
    Open: "Apri e-Satış",
    NotStated: "non indicato",
  },

  Converter: {
    Title: "Convertitore di valuta ₺ ↔ €",
    Subtitle: "Al cambio giornaliero della TCMB",
    Lira: "Importo in lire",
    Euro: "Importo in euro",
    Unavailable: "Nessun cambio aggiornato della Banca Centrale disponibile{last}. Il convertitore appare non appena viene caricato il tasso del giorno.",
  },
};
