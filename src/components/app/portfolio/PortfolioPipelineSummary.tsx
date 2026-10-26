import PortfolioFigure from "@/components/app/portfolio/PortfolioFigure";
import PortfolioSummary from "@/components/app/portfolio/PortfolioSummary";
import { fill } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { coverageText, sumText } from "@/lib/portfolio/portfolioFormat";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow, PortfolioSum, PortfolioTotals } from "@/types/portfolio.types";

interface PortfolioPipelineSummaryProps {
  rows: PortfolioRow[];
  totals: PortfolioTotals;
  labels: IPortfolioTranslation["Totals"];
  title: string;
  market: MarketCode;
  locale: LocaleOption;
}

/** What the open proceedings would bind at most: values, limits, cost at the limit, equity and deposits. */
export default function PortfolioPipelineSummary({ rows, totals, labels, title, market, locale }: PortfolioPipelineSummaryProps) {
  const { Pipeline: P } = labels;
  const figure = (label: string, total: PortfolioSum, hint?: string) => (
    <PortfolioFigure label={label} value={sumText(total, market, locale)} emptyLabel={labels.NoneYet} coverage={coverageText(total.count, total.of, labels.Coverage)} hint={hint} />
  );
  const count = (state: PortfolioRow["verdict"]) => rows.filter((row) => row.verdict === state).length;

  return (
    <PortfolioSummary label={title}>
      <PortfolioFigure label={P.Count} value={String(totals.rows)} emptyLabel={labels.NoneYet} isLead />
      {figure(P.Value, totals.value)}
      {figure(P.Limit, totals.basisBid)}
      {figure(P.TotalCost, totals.totalCost)}
      {figure(P.Equity, totals.equity)}
      {figure(P.Deposit, totals.deposit, labels.DepositHint)}
      <div className="col-span-2 flex flex-col gap-1 bg-paper-bright p-4">
        <dt className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{P.Verdicts}</dt>
        <dd className="font-mono text-sm font-semibold">{fill(labels.VerdictCounts, { go: count("go"), open: count("open"), stop: count("stop") })}</dd>
      </div>
    </PortfolioSummary>
  );
}
