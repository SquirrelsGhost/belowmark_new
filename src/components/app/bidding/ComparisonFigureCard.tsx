import { formatMoney } from "@/lib/appFormat";
import { LABEL_CLASSES } from "@/lib/appStyles";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { ComparisonFigure } from "@/types/bidding.types";

interface ComparisonFigureCardProps {
  figure: ComparisonFigure;
  labels: IBiddingTranslation["Comparables"];
  market: MarketCode;
  locale: LocaleOption;
}

const isQuarter = (value: string) => /^\d{4}-Q\d$/.test(value);

/** One comparison value with its scope, sample, date and source — or the reason it is missing. */
export default function ComparisonFigureCard({ figure, labels, market, locale }: ComparisonFigureCardProps) {
  const money = (amount: number) => formatMoney(amount, market, locale);
  const details = [
    figure.scope && `${labels.Scope}: ${figure.scope}`,
    figure.sampleSize !== null && `${labels.Sample}: ${figure.sampleSize}`,
    figure.confidence && `${labels.Confidence}: ${figure.confidence}`,
    figure.asOf && `${labels.AsOf}: ${isQuarter(figure.asOf) ? figure.asOf : formatDate(figure.asOf, locale)}`,
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-1.5 bg-paper p-4">
      <p className={LABEL_CLASSES}>{labels.Kinds[figure.id]}</p>
      {figure.perM2 === null ? (
        <p className="bg-hatch px-2 py-1.5 text-xs leading-snug text-ink-soft">{figure.gap ? labels.Gaps[figure.gap] : "—"}</p>
      ) : (
        <>
          <p className="font-mono text-xl font-semibold">
            {money(figure.perM2)} <span className="text-xs font-normal text-muted">{labels.PerM2}</span>
          </p>
          {figure.objectPerM2 !== null && (
            <p className="font-mono text-xs text-ink-soft">
              {labels.ObjectPerM2}: {money(figure.objectPerM2)}
              {figure.areaKind && <span className="text-muted"> · {figure.areaKind}</span>}
            </p>
          )}
          {details.length > 0 && <p className="font-mono text-[11px] text-muted">{details.join(" · ")}</p>}
          {figure.id === "tcmb" && <p className="text-[11px] leading-snug text-muted">{labels.GrossNetNote}</p>}
        </>
      )}
      {figure.sourceUrl && (
        <a href={figure.sourceUrl} target="_blank" rel="noreferrer" className="mt-auto font-mono text-[11px] text-ink underline-offset-4 hover:underline">
          {labels.Source}: {figure.sourceName} ↗
        </a>
      )}
    </div>
  );
}
