interface DeclarationChoiceOption {
  value: string;
  label: string;
}

interface DeclarationChoiceProps {
  name: string;
  legend: string;
  number: string;
  options: DeclarationChoiceOption[];
  value: string;
  onChange: (value: string) => void;
}

/** Two or three radio options in a row of framed tiles. */
export default function DeclarationChoice({ name, legend, number, options, value, onChange }: DeclarationChoiceProps) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
        <span className="text-signal">{number}</span> {legend}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-3 border-2 px-3.5 py-3 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-signal ${
              value === option.value ? "border-ink bg-ink text-paper-bright" : "border-ink/50 bg-paper hover:border-ink"
            }`}
          >
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="sr-only" />
            <span aria-hidden="true" className={`size-3 shrink-0 rounded-full border-2 ${value === option.value ? "border-signal bg-signal" : "border-ink"}`} />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
