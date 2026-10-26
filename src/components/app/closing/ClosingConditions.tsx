import { CLOSING_CONDITIONS } from "@/lib/closing/closingConstants";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { ClosingCondition } from "@/types/closing.types";

interface ClosingConditionsProps {
  labels: IClosingTranslation["Tasks"]["Conditions"];
  selected: ReadonlySet<ClosingCondition>;
  onToggle: (condition: ClosingCondition) => void;
}

/** Four switches that decide which situational tasks appear. */
export default function ClosingConditions({ labels, selected, onToggle }: ClosingConditionsProps) {
  return (
    <fieldset className="flex flex-col gap-3 border border-rule-strong p-4">
      <legend className="px-1 font-narrow text-sm font-bold tracking-[0.12em] uppercase">{labels.Title}</legend>
      <p className="text-xs text-muted">{labels.Lead}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {CLOSING_CONDITIONS.map((condition) => (
          <label key={condition} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={selected.has(condition)} onChange={() => onToggle(condition)} className="size-4 accent-ink" />
            {labels.Items[condition]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
