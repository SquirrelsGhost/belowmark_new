interface OrderOfferOptionProps {
  id: string;
  name: string;
  price: string;
  period: string;
  term: string;
  isSelected: boolean;
  /** Why this offer cannot be ordered right now (shown instead of selecting it) */
  blockedReason?: string;
  badge?: string;
  onSelect: () => void;
}

/** One duration as a radio card: name, price, what happens at the end. */
export default function OrderOfferOption({ id, name, price, period, term, isSelected, blockedReason, badge, onSelect }: OrderOfferOptionProps) {
  const isBlocked = Boolean(blockedReason);
  const frame = isSelected ? "border-ink bg-ink text-paper-bright" : "border-ink/60 bg-paper hover:border-ink";
  return (
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer flex-col gap-2 border-2 p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-signal ${frame} ${isBlocked ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <input id={id} type="radio" name="offer" value={id} checked={isSelected} disabled={isBlocked} onChange={onSelect} className="sr-only" />
      <span className="flex items-center justify-between gap-3">
        <span className={`font-mono text-[11px] tracking-[0.14em] uppercase ${isSelected ? "text-signal" : "text-muted"}`}>{name}</span>
        {badge && <span className="border border-current px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase">{badge}</span>}
      </span>
      <span className="flex items-baseline gap-2">
        <span className="font-display text-4xl leading-none">{price}</span>
        <span className={`font-mono text-xs uppercase ${isSelected ? "text-paper/70" : "text-muted"}`}>{period}</span>
      </span>
      <span className={`text-sm leading-snug ${isSelected ? "text-paper/85" : "text-ink-soft"}`}>{blockedReason ?? term}</span>
      {isSelected && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-signal" />}
    </label>
  );
}
