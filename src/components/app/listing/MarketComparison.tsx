import ValueLineFigure from "@/components/app/listing/ValueLineFigure";
import { formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing } from "@/types/listing.types";

interface MarketComparisonProps {
  listing: Listing;
  labels: IAppTranslation["Listing"]["Tr"];
  locale: LocaleOption;
  isLocked: boolean;
  lockedLabel: string;
}

/** Ratings the old pipeline considered solid enough to show a discount. */
const SHOWN_CONFIDENCE = ["belastbar", "mittel"];

/** Starting bid against the median of listed offers per m² — or the reason there is none. */
export default function MarketComparison({ listing, labels, locale, isLocked, lockedLabel }: MarketComparisonProps) {
  const tr = listing.tr;
  const isShown = tr && tr.discountPct !== null && tr.marketMedianPerM2 !== null && SHOWN_CONFIDENCE.includes(tr.confidence ?? "");

  if (!isShown) return <ValueLineFigure label={labels.MarketTitle} value="—" note={labels.NoMarket} isLocked={false} lockedLabel={lockedLabel} />;

  return (
    <ValueLineFigure
      label={`${labels.Discount} · ${labels.Confidence}: ${tr.confidence}`}
      value={`−${Math.round(tr.discountPct ?? 0)} %`}
      note={`${labels.MarketMedian}: ${formatMoney(tr.marketMedianPerM2 ?? 0, "TR", locale)} · ${labels.Sample}: ${tr.marketSampleSize ?? "—"}`}
      isLocked={isLocked}
      lockedLabel={lockedLabel}
    />
  );
}
