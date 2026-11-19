import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_SV: ITrMarketTranslation = {
  Age: {
    Title: "Marknadsvärdets ålder",
    Lead: "Muhammen bedel är en nominell siffra från det år då utsökningsärendet inleddes. Med tanke på den turkiska inflationen är det ingen bisak i äldre ärenden.",
    FileYear: "Ärendeår",
    Basis: "Värdering fastställd senast december {year} — det senast möjliga datumet det året, alltså den mest försiktiga siffran.",
    Factor: "Konsumentpriser sedan dess",
    Lost: "Köpkraftsförlust för det nominella beloppet",
    Today: "Marknadsvärde i {month}-lira",
    TodayNote: "Endast köpkraftsjusterat — inte en ny värdering och inte ett marknadspris.",
    Young: "Ärende från {year}: värderingen är färsk, så en inflationsjustering tillför inget mervärde här.",
    NoYear: "Ärendenumret anger inget år. Utan årtal kan ingen inflationsjämförelse göras.",
    Unavailable: "Den officiella prisindexserien är inte tillräckligt uppdaterad. Hellre ingen siffra än en inaktuell.",
    Source: "{label}, {source} · per {month}",
  },

  Euro: {
    Title: "Motsvarande i euro",
    Value: "Marknadsvärde",
    StartingBid: "Utropspris",
    AllIn: "Utropspris inkl. sidokostnader",
    Rate: "1 € = {rate} · TCMB:s köpkurs per {date}",
    Note: "Omräknat till centralbankens dagskurs, inte kursen på betalningsdagen. Betalning sker i turkiska lira.",
    Unavailable: "Ingen aktuell centralbankskurs lagrad{last}. Eurobelopp visas så snart dagens kurs lästs in — vi räknar aldrig fram belopp med en inaktuell kurs.",
    LastRate: " (senaste kurs från {date})",
  },

  CheckKit: {
    Title: "e-Satış-kontrollpaket",
    Lead: "Foton, värderingsutlåtande och auktionsvillkor finns på e-Satış och kräver inloggning via e-Devlet. Direktlänkar för inte med sig sökparametrar — kopiera dessa uppgifter och klistra in dem direkt i portalen.",
    Copy: "Kopiera kontrollpaket",
    Copied: "Kopierat",
    Open: "Öppna e-Satış",
    NotStated: "ej angivet",
  },

  Converter: {
    Title: "Valutaomvandlare ₺ ↔ €",
    Subtitle: "Till dagens TCMB-kurs",
    Lira: "Belopp i lira",
    Euro: "Belopp i euro",
    Unavailable: "Ingen aktuell centralbankskurs lagrad{last}. Omvandlaren visas så snart dagens kurs lästs in.",
  },
};
