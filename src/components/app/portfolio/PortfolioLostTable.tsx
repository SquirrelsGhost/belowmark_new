import PortfolioHeadCell from "@/components/app/portfolio/PortfolioHeadCell";
import PortfolioLostRow from "@/components/app/portfolio/PortfolioLostRow";
import PortfolioTable from "@/components/app/portfolio/PortfolioTable";
import { LocaleOption } from "@/lib/constants";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow } from "@/types/portfolio.types";

interface PortfolioLostTableProps {
  rows: PortfolioRow[];
  title: string;
  labels: IPortfolioTranslation;
  locale: LocaleOption;
}

/** Proceedings that went elsewhere: value and own limit, nothing summed. */
export default function PortfolioLostTable({ rows, title, labels, locale }: PortfolioLostTableProps) {
  const { Columns: C } = labels;
  return (
    <PortfolioTable
      label={title}
      head={
        <>
          <PortfolioHeadCell label={C.Object} isSticky />
          <PortfolioHeadCell label={C.Value} isNumeric />
          <PortfolioHeadCell label={C.Limit} isNumeric />
        </>
      }
    >
      {rows.map((row) => (
        <PortfolioLostRow key={row.source.key} row={row} labels={labels} locale={locale} />
      ))}
    </PortfolioTable>
  );
}
