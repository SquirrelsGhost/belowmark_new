import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_NL: ITrMarketTranslation = {
  Age: {
    Title: "Ouderdom van de taxatiewaarde",
    Lead: "De Muhammen bedel is een nominaal bedrag uit het jaar waarin de executieprocedure is gestart. Gezien de Turkse inflatie is dat bij oudere dossiers geen detail.",
    FileYear: "Dossierjaar",
    Basis: "Taxatie uiterlijk vastgesteld in december {year} — de laatst mogelijke datum in dat jaar, dus de meest behoudende berekening.",
    Factor: "Consumentenprijzen sindsdien",
    Lost: "Koopkrachtverlies van het nominale bedrag",
    Today: "Taxatiewaarde in lira van {month}",
    TodayNote: "Alleen gecorrigeerd voor koopkracht — geen nieuwe taxatie en geen marktprijs.",
    Young: "Dossier uit {year}: de taxatie is recent, waardoor een inflatiecorrectie hier geen toegevoegde waarde biedt.",
    NoYear: "Het zaaknummer vermeldt geen jaartal. Zonder jaartal is geen inflatievergelijking mogelijk.",
    Unavailable: "De officiële prijsindexreeks is niet actueel genoeg. Liever geen cijfer dan een verouderd cijfer.",
    Source: "{label}, {source} · stand {month}",
  },

  Euro: {
    Title: "Tegenwaarde in euro",
    Value: "Taxatiewaarde",
    StartingBid: "Startbod",
    AllIn: "Startbod incl. bijkomende kosten",
    Rate: "€ 1 = {rate} · TCMB-aankoopkoers van {date}",
    Note: "Omgerekend tegen de dagkoers van de centrale bank, niet de koers op de betaaldag. Afrekening vindt plaats in Turkse lira.",
    Unavailable: "Geen actuele wisselkoers van de centrale bank opgeslagen{last}. Eurobedragen verschijnen zodra de koers van vandaag is geladen — wij rekenen nooit door met een verouderde koers.",
    LastRate: " (laatste koers van {date})",
  },

  CheckKit: {
    Title: "e-Satış Controlekit",
    Lead: "Foto's, taxatierapport en veilingvoorwaarden staan op e-Satış en vereisen inloggen via e-Devlet. Directe links nemen geen zoekparameters mee — kopieer deze gegevens en plak ze rechtstreeks in het portaal.",
    Copy: "Controlekit kopiëren",
    Copied: "Gekopieerd",
    Open: "e-Satış openen",
    NotStated: "niet opgegeven",
  },

  Converter: {
    Title: "Valutaomrekentool ₺ ↔ €",
    Subtitle: "Tegen de dagkoers van de TCMB",
    Lira: "Bedrag in lira",
    Euro: "Bedrag in euro",
    Unavailable: "Geen actuele wisselkoers van de centrale bank opgeslagen{last}. De omrekentool verschijnt zodra de koers van vandaag is geladen.",
  },
};
