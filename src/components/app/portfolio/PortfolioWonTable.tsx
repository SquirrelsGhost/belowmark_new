import PortfolioHeadCell from "@/components/app/portfolio/PortfolioHeadCell";
import PortfolioTable from "@/components/app/portfolio/PortfolioTable";
import PortfolioWonRow from "@/components/app/portfolio/PortfolioWonRow";
import { LocaleOption } from "@/lib/constants";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow } from "@/types/portfolio.types";

interface PortfolioWonTableProps {
  rows: PortfolioRow[];
  title: string;
  labels: IPortfolioTranslation;
  locale: LocaleOption;
}

/** Won objects, one row each, computed at the Zuschlag price. */
export default function PortfolioWonTable({ rows, title, labels, locale }: PortfolioWonTableProps) {
  const { Columns: C } = labels;
  return (
    <PortfolioTable
      label={title}
      head={
        <>
          <PortfolioHeadCell label={C.Object} isSticky />
          <PortfolioHeadCell label={C.TotalCost} isNumeric />
          <PortfolioHeadCell label={C.Equity} isNumeric />
          <PortfolioHeadCell label={C.Loan} isNumeric />
          <PortfolioHeadCell label={C.GrossYield} isNumeric />
          <PortfolioHeadCell label={C.NetYield} isNumeric />
          <PortfolioHeadCell label={C.Cashflow} isNumeric />
          <PortfolioHeadCell label={C.CashOnCash} isNumeric />
        </>
      }
    >
      {rows.map((row) => (
        <PortfolioWonRow key={row.source.key} row={row} labels={labels} locale={locale} />
      ))}
    </PortfolioTable>
  );
}
