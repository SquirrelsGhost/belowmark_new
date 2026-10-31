import { ITrMarketTranslation } from "../ITrMarketTranslation";

export const TR_MARKET_EN: ITrMarketTranslation = {
  Age: {
    Title: "Age of the Appraised Value",
    Lead: "The Muhammen bedel is a nominal figure from the year the enforcement proceeding started. Given Turkish inflation, that is no minor detail on older files.",
    FileYear: "Case year",
    Basis: "Valuation set no later than December {year} — the latest possible date in that year, meaning the most conservative figure.",
    Factor: "Consumer prices since then",
    Lost: "Loss of purchasing power of the nominal amount",
    Today: "Appraised value in {month} lira",
    TodayNote: "Purchasing power adjusted only — not a new appraisal and not a market price.",
    Young: "File from {year}: the appraisal is recent, so an inflation adjustment adds no value here.",
    NoYear: "The case number does not state a year. Without a year, no inflation comparison can be made.",
    Unavailable: "The official price index series is not up to date enough. Better no figure than a stale one.",
    Source: "{label}, {source} · as of {month}",
  },

  Euro: {
    Title: "Euro Equivalent",
    Value: "Appraised value",
    StartingBid: "Starting bid",
    AllIn: "Starting bid incl. ancillary costs",
    Rate: "€1 = {rate} · TCMB forex buying rate of {date}",
    Note: "Converted at the central bank's daily rate, not the rate on payment day. Settlement is in Turkish lira.",
    Unavailable: "No current central bank exchange rate stored{last}. Euro amounts appear as soon as today's rate is loaded — we never extrapolate with an outdated rate.",
    LastRate: " (last rate from {date})",
  },

  CheckKit: {
    Title: "e-Satış Check Kit",
    Lead: "Photos, valuation report, and bidding terms are hosted on e-Satış and require signing in via e-Devlet. Deep links do not carry search parameters across — copy these details and paste them directly into the portal.",
    Copy: "Copy check kit",
    Copied: "Copied",
    Open: "Open e-Satış",
    NotStated: "not stated",
  },

  Converter: {
    Title: "Currency Converter ₺ ↔ €",
    Subtitle: "At the daily TCMB rate",
    Lira: "Amount in lira",
    Euro: "Amount in euros",
    Unavailable: "No current central bank exchange rate stored{last}. The converter appears as soon as today's rate is loaded.",
  },
};
