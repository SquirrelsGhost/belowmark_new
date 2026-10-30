import { CALCULATOR, LocaleOption } from "@/lib/constants";
import { formatEuro, formatPercent } from "@/lib/format";
import { AT_STATES, CH_CANTONS, STATES, StateCode } from "@/lib/snapshot";
import { ITranslation } from "@/translations/ITranslation";
import { HearingKind } from "@/types/calculator.types";

interface CalculatorControlsProps {
  t: ITranslation["HomePage"]["Calculator"];
  locale: LocaleOption;
  value: number;
  stateCode: StateCode;
  hearing: HearingKind;
  onValueChange: (value: number) => void;
  onStateChange: (code: StateCode) => void;
  onHearingChange: (hearing: HearingKind) => void;
}

const LABEL_CLASSES = "font-mono text-[11px] tracking-wider text-muted uppercase";
const FIELD_CLASSES = "h-10 w-full border border-ink bg-paper px-3 font-mono text-sm focus:outline-2 focus:outline-signal";
const HEARINGS: HearingKind[] = ["first", "followUp"];

/** Inputs: appraised value (slider), federal state and hearing type. */
export default function CalculatorControls(props: CalculatorControlsProps) {
  const { t, locale } = props;
  const hearingLabel: Record<HearingKind, string> = { first: t.FirstHearing, followUp: t.FollowUpHearing };

  return (
    <div className="grid gap-5 p-5 sm:grid-cols-2">
      <label className="flex flex-col gap-3 sm:col-span-2">
        <span className="flex items-baseline justify-between">
          <span className={LABEL_CLASSES}>{t.ValueLabel}</span>
          <span className="font-display text-3xl tracking-wide">{formatEuro(props.value, locale)}</span>
        </span>
        <input
          type="range"
          className="range-ink w-full"
          min={CALCULATOR.minValue}
          max={CALCULATOR.maxValue}
          step={CALCULATOR.valueStep}
          value={props.value}
          onChange={(event) => props.onValueChange(Number(event.target.value))}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className={LABEL_CLASSES}>{t.StateLabel}</span>
        <select className={FIELD_CLASSES} value={props.stateCode} onChange={(event) => props.onStateChange(event.target.value as StateCode)}>
          <optgroup label="Deutschland (ZVG)">
            {STATES.filter((s) => s.country === "DE").map((state) => (
              <option key={state.code} value={state.code}>
                {state.name} · {formatPercent(state.transferTaxPct, locale)}
              </option>
            ))}
          </optgroup>
          <optgroup label="Österreich (EO)">
            {AT_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name} · {formatPercent(state.transferTaxPct, locale)}
              </option>
            ))}
          </optgroup>
          <optgroup label="Schweiz (SchKG)">
            {CH_CANTONS.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name} · {formatPercent(state.transferTaxPct, locale)}
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
