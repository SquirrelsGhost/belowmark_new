import PortfolioObjectCell from "@/components/app/portfolio/PortfolioObjectCell";
import PortfolioPriceFields from "@/components/app/portfolio/PortfolioPriceFields";
import PortfolioStatusSelect from "@/components/app/portfolio/PortfolioStatusSelect";
import { formatHearing } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { IPortfolioTranslation } from "@/translations/portfolio/IPortfolioTranslation";
import { PortfolioRow } from "@/types/portfolio.types";

interface PortfolioRowObjectProps {
  row: PortfolioRow;
  labels: IPortfolioTranslation;
  locale: LocaleOption;
}

const CURRENCY_SIGN = { DE: "€", TR: "₺" } as const;

/** The object cell of every row: name, court, hearing, status — and the Zuschlag fields once it is won. */
export default function PortfolioRowObject({ row, labels, locale }: PortfolioRowObjectProps) {
  const { source, holding } = row;
  const when = source.hearingAt ? `${formatHearing(source.hearingAt, source.market, locale)} · ${source.statusLabel}` : source.statusLabel;
  return (
    <PortfolioObjectCell href={source.href} title={source.title} subtitle={source.subtitle} meta={when}>
      <PortfolioStatusSelect listingKey={source.key} holding={holding} label={labels.Columns.Status} statusLabels={labels.Status} />
      {holding.status === "won" && (
        <PortfolioPriceFields
          listingKey={source.key}
          holding={holding}
          labels={{ price: labels.Columns.Price, date: labels.Columns.Date, hint: labels.Cells.PriceHint }}
          currency={CURRENCY_SIGN[source.market]}
        />
      )}
    </PortfolioObjectCell>
  );
}
