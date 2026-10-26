interface MarketOptionProps {
  value: string;
  label: string;
  hint: string;
  /** Two-letter code printed like a file stamp */
  code: string;
  defaultChecked?: boolean;
}

const CARD_CLASSES = [
  "flex h-full cursor-pointer flex-col gap-1 border border-ink/70 bg-paper p-3 transition-colors duration-150",
  "hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper-bright",
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal",
].join(" ");

/** One market as a selectable card; inverts to ink when chosen. */
export default function MarketOption({ value, label, hint, code, defaultChecked }: MarketOptionProps) {
  const id = `market-${value.toLowerCase()}`;
  return (
    <div className="relative">
      <input id={id} type="radio" name="market" value={value} defaultChecked={defaultChecked} required className="peer sr-only" />
      <label htmlFor={id} className={CARD_CLASSES}>
        <span className="flex items-center justify-between">
          <span className="font-narrow text-base font-semibold tracking-wide uppercase">{label}</span>
          <span className="font-mono text-[10px] font-semibold tracking-[0.18em] opacity-70">{code}</span>
        </span>
        <span className="text-xs leading-snug opacity-75">{hint}</span>
      </label>
    </div>
  );
}
