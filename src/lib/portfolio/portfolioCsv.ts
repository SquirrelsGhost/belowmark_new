import { LocaleOption, MarketCode } from "@/lib/constants";
import { PORTFOLIO_CSV } from "@/lib/portfolio/portfolioConstants";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow } from "@/types/portfolio.types";
import { VerdictState } from "@/types/verdict.types";

/**
 * The portfolio as a CSV table. Amounts are plain numbers (no currency sign, no
 * thousands separator) with the locale's decimal mark, so a spreadsheet reads
 * them as numbers. A figure the bidder did not enter stays an empty cell.
 */

const CURRENCY: Record<MarketCode, string> = { DE: "EUR", TR: "TRY" };

/** A text cell a spreadsheet would run as a formula ("=…", "+…") gets a leading apostrophe. */
const text = (value: string): string => (/^[=+\-@\t\r]/.test(value) ? `'${value}` : value);

const quote = (cell: string): string => (/[";\n\r]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell);

function number(value: number | null | undefined, locale: LocaleOption, digits = 0): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "";
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "de-DE", { maximumFractionDigits: digits, minimumFractionDigits: digits, useGrouping: false }).format(value);
}

export function portfolioCsv(rows: PortfolioRow[], labels: IPortfolioTranslation, verdictNames: Record<VerdictState, string>, market: MarketCode, locale: LocaleOption): string {
  const { Columns: C, Status, Cells } = labels;
  const money = (label: string) => `${label} (${CURRENCY[market]})`;
  const pct = (label: string) => `${label} (%)`;
  const header = [
    C.Key, C.Object, C.FileNo, C.Status, C.Hearing, money(C.Value), money(C.Limit), C.Verdict, money(C.Price), C.Date, C.Basis,
    money(C.TotalCost), money(C.Equity), money(C.Loan), pct(C.GrossYield), pct(C.NetYield), money(C.Cashflow), pct(C.CashOnCash),
    money(C.Deposit), Cells.Incomplete, C.Note,
  ];
  const lines = rows.map((row) => {
    const { source, holding, returns } = row;
    return [
      text(source.key),
      text(source.title),
      text(source.subtitle),
      Status[holding.status],
      source.hearingAt ? source.hearingAt.slice(0, 10) : "",
      number(source.appraisedValue, locale),
      row.limit === "unreachable" ? Cells.Unreachable : number(row.limit, locale),
      verdictNames[row.verdict],
      number(holding.price, locale),
      holding.date ?? "",
      row.basis === "price" ? Cells.BasisPrice : row.basis === "limit" ? Cells.BasisLimit : "",
      number(returns?.totalCost, locale),
      row.basisBid === null ? "" : number(row.inputs.equity, locale),
      number(row.loan, locale),
      number(returns?.grossYieldPct, locale, 2),
      number(returns?.netYieldPct, locale, 2),
      number(returns?.cashflowMonthly, locale),
      number(returns?.cashOnCashPct, locale, 2),
      number(row.deposit, locale),
      row.isIncomplete ? "x" : "",
      text(source.note ?? ""),
    ];
  });
  return PORTFOLIO_CSV.bom + [header, ...lines].map((line) => line.map(quote).join(PORTFOLIO_CSV.separator)).join("\r\n");
}
