import PortfolioLimitCell from "@/components/app/portfolio/PortfolioLimitCell";
import PortfolioMoneyCell from "@/components/app/portfolio/PortfolioMoneyCell";
import PortfolioRowObject from "@/components/app/portfolio/PortfolioRowObject";
import PortfolioVerdictCell from "@/components/app/portfolio/PortfolioVerdictCell";
import { LocaleOption } from "@/lib/constants";
import { moneyOrNull, pctOrNull } from "@/lib/portfolio/portfolioFormat";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow } from "@/types/portfolio.types";
import { VerdictState } from "@/types/verdict.types";

interface PortfolioPipelineRowProps {
  row: PortfolioRow;
  labels: IPortfolioTranslation;
  verdictNames: Record<VerdictState, string>;
  locale: LocaleOption;
}

/** A proceeding still in review, at its bid limit: value, verdict, limit, cost, yield and the deposit it needs. */
export default function PortfolioPipelineRow({ row, labels, verdictNames, locale }: PortfolioPipelineRowProps) {
  const { returns, source } = row;
  const money = (value: number | null | undefined) => moneyOrNull(value, source.market, locale);
  const { Cells } = labels;

  return (
    <tr>
      <PortfolioRowObject row={row} labels={labels} locale={locale} />
      <PortfolioMoneyCell value={money(source.appraisedValue)} missingLabel={Cells.Missing} />
      <PortfolioVerdictCell state={row.verdict} label={verdictNames[row.verdict]} href={source.href} />
      <PortfolioLimitCell
        value={typeof row.limit === "number" ? money(row.limit) : null}
        isUnreachable={row.limit === "unreachable"}
        href={source.href}
        labels={{ missing: source.context ? Cells.NoLimit : Cells.NoValue, unreachable: Cells.Unreachable }}
      />
      <PortfolioMoneyCell value={money(returns?.totalCost)} missingLabel={Cells.Missing} note={row.isIncomplete ? Cells.Incomplete : null} tone={row.isIncomplete ? "caution" : "plain"} />
      <PortfolioMoneyCell value={returns ? money(row.inputs.equity) : null} missingLabel={Cells.Missing} />
      <PortfolioMoneyCell value={pctOrNull(returns?.netYieldPct, locale)} missingLabel={Cells.Missing} />
      <PortfolioMoneyCell value={money(returns?.cashflowMonthly)} missingLabel={Cells.Missing} tone={(returns?.cashflowMonthly ?? 0) < 0 ? "bad" : "plain"} />
      <PortfolioMoneyCell value={money(row.deposit)} missingLabel={Cells.Missing} />
    </tr>
  );
}
