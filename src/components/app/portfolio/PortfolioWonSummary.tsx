import PortfolioFigure from "@/components/app/portfolio/PortfolioFigure";
import PortfolioSummary from "@/components/app/portfolio/PortfolioSummary";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { coverageText, sumText } from "@/lib/portfolio/portfolioFormat";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioSum, PortfolioTotals } from "@/types/portfolio.types";

interface PortfolioWonSummaryProps {
  totals: PortfolioTotals;
  labels: IPortfolioTranslation["Totals"];
  title: string;
  market: MarketCode;
  locale: LocaleOption;
}

/** What the won objects add up to: price, full cost, money in, rent, cash flow and the cost-weighted yield. */
export default function PortfolioWonSummary({ totals, labels, title, market, locale }: PortfolioWonSummaryProps) {
  const { Won: W } = labels;
  const figure = (label: string, total: PortfolioSum) => (
    <PortfolioFigure label={label} value={sumText(total, market, locale)} emptyLabel={labels.NoneYet} coverage={coverageText(total.count, total.of, labels.Coverage)} />
  );

  return (
    <PortfolioSummary label={title}>
      <PortfolioFigure label={W.Count} value={String(totals.rows)} emptyLabel={labels.NoneYet} isLead />
      {figure(W.Price, totals.basisBid)}
      {figure(W.TotalCost, totals.totalCost)}
      <PortfolioFigure
        label={W.NetYield}
        value={totals.netYieldPct === null ? null : formatPercent(totals.netYieldPct, locale)}
        emptyLabel={labels.NoneYet}
        coverage={coverageText(totals.netYieldCount, totals.rows, labels.Coverage)}
        hint={labels.YieldHint}
      />
      {figure(W.Equity, totals.equity)}
      {figure(W.Loan, totals.loan)}
      {figure(W.NetIncome, totals.netIncomeYearly)}
      {figure(W.Cashflow, totals.cashflowMonthly)}
    </PortfolioSummary>
  );
}
