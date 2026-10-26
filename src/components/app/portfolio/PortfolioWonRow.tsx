import PortfolioMoneyCell from "@/components/app/portfolio/PortfolioMoneyCell";
import PortfolioRowObject from "@/components/app/portfolio/PortfolioRowObject";
import { LocaleOption } from "@/lib/constants";
import { moneyOrNull, pctOrNull } from "@/lib/portfolio/portfolioFormat";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow } from "@/types/portfolio.types";

interface PortfolioWonRowProps {
  row: PortfolioRow;
  labels: IPortfolioTranslation;
  locale: LocaleOption;
}

const signTone = (value: number | null | undefined) => (value === null || value === undefined ? "plain" : value < 0 ? "bad" : "good");

/** A won object at its Zuschlag price: full cost, equity, loan, yields and cash flow. */
export default function PortfolioWonRow({ row, labels, locale }: PortfolioWonRowProps) {
  const { returns } = row;
  const { market } = row.source;
  const missing = row.holding.price === null ? labels.Cells.NoPrice : labels.Cells.Missing;
  const money = (value: number | null | undefined) => moneyOrNull(value, market, locale);
  const pct = (value: number | null | undefined) => pctOrNull(value, locale);

  return (
    <tr>
      <PortfolioRowObject row={row} labels={labels} locale={locale} />
      <PortfolioMoneyCell value={money(returns?.totalCost)} missingLabel={missing} note={row.isIncomplete ? labels.Cells.Incomplete : null} tone={row.isIncomplete ? "caution" : "plain"} />
      <PortfolioMoneyCell value={returns ? money(row.inputs.equity) : null} missingLabel={labels.Cells.Missing} />
      <PortfolioMoneyCell value={money(row.loan)} missingLabel={labels.Cells.Missing} />
      <PortfolioMoneyCell value={pct(returns?.grossYieldPct)} missingLabel={labels.Cells.Missing} />
      <PortfolioMoneyCell value={pct(returns?.netYieldPct)} missingLabel={labels.Cells.Missing} />
      <PortfolioMoneyCell value={money(returns?.cashflowMonthly)} missingLabel={labels.Cells.Missing} tone={signTone(returns?.cashflowMonthly)} />
      <PortfolioMoneyCell value={pct(returns?.cashOnCashPct)} missingLabel={labels.Cells.Missing} />
    </tr>
  );
}
