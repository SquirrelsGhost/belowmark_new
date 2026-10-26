import PortfolioHeadCell from "@/components/app/portfolio/PortfolioHeadCell";
import PortfolioPipelineRow from "@/components/app/portfolio/PortfolioPipelineRow";
import PortfolioTable from "@/components/app/portfolio/PortfolioTable";
import { LocaleOption } from "@/lib/constants";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow } from "@/types/portfolio.types";
import { VerdictState } from "@/types/verdict.types";

interface PortfolioPipelineTableProps {
  rows: PortfolioRow[];
  title: string;
  labels: IPortfolioTranslation;
  verdictNames: Record<VerdictState, string>;
  locale: LocaleOption;
}

/** Proceedings in review, one row each, computed at the bid limit. */
export default function PortfolioPipelineTable({ rows, title, labels, verdictNames, locale }: PortfolioPipelineTableProps) {
  const { Columns: C } = labels;
  return (
    <PortfolioTable
      label={title}
      head={
        <>
          <PortfolioHeadCell label={C.Object} isSticky />
          <PortfolioHeadCell label={C.Value} isNumeric />
          <PortfolioHeadCell label={C.Verdict} />
          <PortfolioHeadCell label={C.Limit} isNumeric />
          <PortfolioHeadCell label={C.TotalCost} isNumeric />
          <PortfolioHeadCell label={C.Equity} isNumeric />
          <PortfolioHeadCell label={C.NetYield} isNumeric />
          <PortfolioHeadCell label={C.Cashflow} isNumeric />
          <PortfolioHeadCell label={C.Deposit} isNumeric />
        </>
      }
    >
      {rows.map((row) => (
        <PortfolioPipelineRow key={row.source.key} row={row} labels={labels} verdictNames={verdictNames} locale={locale} />
      ))}
    </PortfolioTable>
  );
}
