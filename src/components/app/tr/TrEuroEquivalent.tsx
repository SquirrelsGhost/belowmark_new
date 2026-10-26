import FactRow from "@/components/app/listing/FactRow";
import TrPanel from "@/components/app/tr/TrPanel";
import TrPanelNote from "@/components/app/tr/TrPanelNote";
import Redacted from "@/components/ui/Redacted";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getIcraFigures } from "@/lib/listingMath";
import { liraToEuro } from "@/lib/tr/currency";
import { formatRate } from "@/lib/tr/trFormat";
import { ITrMarketTranslation } from "@/translations/trMarket/ITrMarketTranslation";
import { TcmbEuroRate } from "@/types/trIndicators.types";

interface TrEuroEquivalentProps {
  value: number | null;
  vatRate: number | null;
  /** null = no rate fetched, or older than five days */
  rate: TcmbEuroRate | null;
  /** Date of the last rate on file, to say why there is none */
  lastRateDate: string | null;
  labels: ITrMarketTranslation["Euro"];
  notStated: string;
  vatUnknown: string;
  locale: LocaleOption;
  isLocked: boolean;
  lockedLabel: string;
}

/** Appraised value, starting bid and the sum with costs in euro, at the central bank's rate of the day. */
export default function TrEuroEquivalent({ value, vatRate, rate, lastRateDate, labels, notStated, vatUnknown, locale, isLocked, lockedLabel }: TrEuroEquivalentProps) {
  if (!rate) {
    const last = lastRateDate ? fill(labels.LastRate, { date: formatDate(lastRateDate, locale) }) : "";
    return (
      <TrPanel title={labels.Title}>
        <TrPanelNote text={fill(labels.Unavailable, { last })} tone="caution" />
      </TrPanel>
    );
  }

  const euro = (lira: number) => (isLocked ? <Redacted label={lockedLabel} width="sm" /> : formatMoney(liraToEuro(lira, rate), "DE", locale));
  const figures = value === null ? null : getIcraFigures(value, vatRate);
  return (
    <TrPanel title={labels.Title}>
      <dl className="divide-y divide-rule px-4">
        <FactRow label={labels.Value} value={value === null ? null : euro(value)} notStated={notStated} mono />
        <FactRow label={labels.StartingBid} value={figures ? euro(figures.startingBid) : null} notStated={notStated} mono />
        <FactRow label={labels.AllIn} value={figures ? euro(figures.allIn) : null} notStated={notStated} mono />
      </dl>
      {figures && !figures.vatKnown && <TrPanelNote text={vatUnknown} tone="caution" />}
      <TrPanelNote text={`${fill(labels.Rate, { rate: formatRate(rate.eur.buying, locale), date: formatDate(rate.meta.date, locale) })}. ${labels.Note}`} />
    </TrPanel>
  );
}
