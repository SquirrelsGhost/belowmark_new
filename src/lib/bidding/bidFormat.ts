import { fill } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { CostLine } from "@/types/bidding.types";

/** "Grunderwerbsteuer 6,5 %" — the rate only where the line has one. */
export function costLineLabel(line: CostLine, labels: IBiddingTranslation["Limit"]["Costs"], locale: LocaleOption): string {
  return fill(labels.Lines[line.code], { pct: line.pct === null ? "" : formatPercent(line.pct, locale) }).trim();
}

/** Where the amount comes from: the statute, "Ihre Angabe" or "nicht bekannt". */
export function costLineBasis(line: CostLine, labels: IBiddingTranslation["Limit"]["Costs"]): string {
  if (line.isUnknown) return labels.Unknown;
  if (line.isOwn) return labels.Own;
  return labels.Basis[line.code] ?? "";
}

/** Amounts per m² (and month) keep their cents below 100 — a rent of 9,80 €/m² is not "10 €". */
export function formatUnitAmount(value: number, market: "DE" | "TR", locale: LocaleOption): string {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "de-DE", {
    style: "currency",
    currency: market === "TR" ? "TRY" : "EUR",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: value < 100 ? 2 : 0,
  }).format(value);
}
