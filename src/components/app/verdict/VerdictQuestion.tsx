import { LABEL_CLASSES } from "@/lib/appStyles";

interface VerdictQuestionProps {
  name: string;
  label: string;
  hint: string;
  options: { value: string; label: string }[];
  value: string | null;
  unansweredLabel: string;
  onChange: (value: string | null) => void;
}

const OPTION_CLASSES =
  "cursor-pointer border border-rule-strong px-2.5 py-1.5 font-narrow text-xs font-semibold tracking-[0.06em] uppercase transition-colors has-[:checked]:bg-ink has-[:checked]:text-paper-bright has-[:focus-visible]:shadow-[3px_3px_0_0_var(--signal)]";

/** One question only the bidder can answer — a row of choices, clicking the chosen one again clears it. */
export default function VerdictQuestion({ name, label, hint, options, value, unansweredLabel, onChange }: VerdictQuestionProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="flex w-full items-baseline justify-between gap-2">
        <span className="text-sm font-semibold leading-snug">{label}</span>
        {value === null && <span className={`${LABEL_CLASSES} text-caution`}>{unansweredLabel}</span>}
      </legend>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <label key={option.value} className={OPTION_CLASSES}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onClick={() => value === option.value && onChange(null)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      <p className="text-[11px] leading-snug text-muted">{hint}</p>
    </fieldset>
  );
}
