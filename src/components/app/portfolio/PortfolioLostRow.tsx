import PortfolioMoneyCell from "@/components/app/portfolio/PortfolioMoneyCell";
import PortfolioRowObject from "@/components/app/portfolio/PortfolioRowObject";
import { LocaleOption } from "@/lib/constants";
import { moneyOrNull } from "@/lib/portfolio/portfolioFormat";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow } from "@/types/portfolio.types";

interface PortfolioLostRowProps {
  row: PortfolioRow;
  labels: IPortfolioTranslation;
  locale: LocaleOption;
}

/** A proceeding that went to someone else — kept with value and own limit for later comparison. */
export default function PortfolioLostRow({ row, labels, locale }: PortfolioLostRowProps) {
  const { source } = row;
  return (
    <tr className="text-ink-soft">
      <PortfolioRowObject row={row} labels={labels} locale={locale} />
      <PortfolioMoneyCell value={moneyOrNull(source.appraisedValue, source.market, locale)} missingLabel={labels.Cells.Missing} />
      <PortfolioMoneyCell value={typeof row.limit === "number" ? moneyOrNull(row.limit, source.market, locale) : null} missingLabel={labels.Cells.Missing} />
    </tr>
  );
}
