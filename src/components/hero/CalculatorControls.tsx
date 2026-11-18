import { LocaleOption } from "@/lib/constants";
import { formatMoney, formatPercent } from "@/lib/format";
import { HomeCalculatorConfig } from "@/lib/homeMarketData";
import { ITranslation } from "@/translations/ITranslation";
import { HearingKind } from "@/types/calculator.types";

interface CalculatorControlsProps {
  t: ITranslation["HomePage"]["Calculator"];
  locale: LocaleOption;
  config: HomeCalculatorConfig;
  value: number;
  regionCode: string;
  hearing: HearingKind;
  onValueChange: (value: number) => void;
  onRegionChange: (code: string) => void;
  onHearingChange: (hearing: HearingKind) => void;
}

const LABEL_CLASSES = "font-mono text-[11px] tracking-wider text-muted uppercase";
const FIELD_CLASSES = "h-10 w-full border border-ink bg-paper px-3 font-mono text-sm focus:outline-2 focus:outline-signal";
const HEARINGS: HearingKind[] = ["first", "followUp"];

/** Inputs: appraised value (slider), active country's province/state/region and hearing round. */
export default function CalculatorControls(props: CalculatorControlsProps) {
  const { t, locale, config } = props;
  const hearingLabel: Record<HearingKind, string> = { first: t.FirstHearing, followUp: t.FollowUpHearing };

  return (
    <div className="grid gap-5 p-5 sm:grid-cols-2">
      <label className="flex flex-col gap-3 sm:col-span-2">
        <span className="flex items-baseline justify-between">
          <span className={LABEL_CLASSES}>{t.ValueLabel}</span>
          <span className="font-display text-3xl tracking-wide">{formatMoney(props.value, config.currency, locale)}</span>
        </span>
        <input
          type="range"
          className="range-ink w-full"
          min={config.minValue}
          max={config.maxValue}
          step={config.valueStep}
          value={props.value}
          onChange={(event) => props.onValueChange(Number(event.target.value))}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className={LABEL_CLASSES}>{t.StateLabel}</span>
        <select className={FIELD_CLASSES} value={props.regionCode} onChange={(event) => props.onRegionChange(event.target.value)}>
          <optgroup label={config.regionGroupLabel}>
            {config.regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name} · {formatPercent(region.transferTaxPct, locale)}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className={`${LABEL_CLASSES} mb-2`}>{t.HearingLabel}</legend>
        <div className="grid h-10 grid-cols-2 border border-ink">
          {HEARINGS.map((hearing) => (
            <button
              key={hearing}
              type="button"
              aria-pressed={props.hearing === hearing}
              onClick={() => props.onHearingChange(hearing)}
              className={`font-narrow text-sm font-semibold tracking-wide uppercase transition-colors ${props.hearing === hearing ? "bg-ink text-paper-bright" : "hover:bg-paper-deep"}`}
            >
              {hearingLabel[hearing]}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
