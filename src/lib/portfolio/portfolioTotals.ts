import { PortfolioRow, PortfolioSum, PortfolioTotals } from "@/types/portfolio.types";

/** Adds up what the rows have; `count` says how many had it, so a sum is never mistaken for complete. */
function sum(rows: PortfolioRow[], pick: (row: PortfolioRow) => number | null | undefined): PortfolioSum {
  let value = 0;
  let count = 0;
  for (const row of rows) {
    const figure = pick(row);
    if (figure === null || figure === undefined || !Number.isFinite(figure)) continue;
    value += figure;
    count += 1;
  }
  return { value, count, of: rows.length };
}

export function getPortfolioTotals(rows: PortfolioRow[]): PortfolioTotals {
  // The portfolio yield is weighted by cost: Σ income / Σ cost over rows that have both
  const yieldRows = rows.filter((row) => row.netIncomeYearly !== null && row.returns !== null && row.returns.totalCost > 0);
  const income = yieldRows.reduce((total, row) => total + (row.netIncomeYearly ?? 0), 0);
  const cost = yieldRows.reduce((total, row) => total + (row.returns?.totalCost ?? 0), 0);
  return {
    rows: rows.length,
    value: sum(rows, (row) => row.source.appraisedValue),
    basisBid: sum(rows, (row) => row.basisBid),
    totalCost: sum(rows, (row) => row.returns?.totalCost),
    equity: sum(rows, (row) => (row.basisBid === null ? null : row.inputs.equity)),
    loan: sum(rows, (row) => row.loan),
    netIncomeYearly: sum(rows, (row) => row.netIncomeYearly),
    cashflowMonthly: sum(rows, (row) => row.returns?.cashflowMonthly),
    deposit: sum(rows, (row) => row.deposit),
    netYieldPct: cost > 0 ? (income / cost) * 100 : null,
    netYieldCount: yieldRows.length,
  };
}
