import { LocaleOption } from "@/lib/constants";
import { formatMoney } from "@/lib/appFormat";
import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { IAppTranslation } from "@/translations/app/IAppTranslation";

interface IcraCalculatorControlsProps {
  labels: IAppTranslation["Calculator"]["Tr"];
  bidLabel: string;
  locale: LocaleOption;
  value: number;
  vatRate: number | null;
  bidPct: number;
  bidRange: { min: number; max: number };
  isFixed: boolean;
  onValueChange: (value: number) => void;
  onVatChange: (rate: number | null) => void;
  onBidChange: (pct: number) => void;
}

/** KDV rates that occur in notices (Katma Değer Vergisi Kanunu). */
const VAT_RATES = [0, 1, 10, 20] as const;
const VALUE_RANGE = { min: 100_000, max: 50_000_000, step: 50_000 } as const;

/** Inputs of the İcra calculator: value and KDV (fixed on a detail page), and the bid. */
export default function IcraCalculatorControls(props: IcraCalculatorControlsProps) {
  const { labels, bidLabel, locale, value, vatRate, bidPct, bidRange, isFixed, onValueChange, onVatChange, onBidChange } = props;
  return (
    <div className="flex flex-col gap-5 border-b border-rule p-4">
      {!isFixed && (
        <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <label className="flex flex-col gap-2">
            <span className="flex items-baseline justify-between">
              <span className={LABEL_CLASSES}>{labels.ValueLabel}</span>
              <span className="font-display text-2xl">{formatMoney(value, "TR", locale)}</span>
            </span>
            <input type="range" className="range-ink w-full" min={VALUE_RANGE.min} max={VALUE_RANGE.max} step={VALUE_RANGE.step} value={value} onChange={(event) => onValueChange(Number(event.target.value))} />
          </label>
          <label className="flex flex-col gap-2">
            <span className={LABEL_CLASSES}>{labels.VatLabel}</span>
            <select className={CONTROL_CLASSES} value={vatRate === null ? "" : String(vatRate)} onChange={(event) => onVatChange(event.target.value === "" ? null : Number(event.target.value))}>
              <option value="">{labels.VatNone}</option>
              {VAT_RATES.map((rate) => (
                <option key={rate} value={rate}>{`% ${rate}`}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      <label className="flex flex-col gap-2">
        <span className="flex items-baseline justify-between">
          <span className={LABEL_CLASSES}>{bidLabel}</span>
          <span className="font-mono text-sm">{`% ${bidPct}`}</span>
        </span>
        <input type="range" className="range-ink w-full" min={bidRange.min} max={bidRange.max} value={bidPct} onChange={(event) => onBidChange(Number(event.target.value))} />
      </label>
    </div>
  );
}
