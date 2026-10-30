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

const CARD_BASE = [
  "relative flex h-full cursor-pointer flex-col justify-between gap-3 border-2 p-4 transition-colors",
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-signal",
].join(" ");

/** One duration as a radio card: name, price, what happens at the end. */
export default function OrderOfferOption({ id, name, price, period, term, isSelected, blockedReason, badge, onSelect }: OrderOfferOptionProps) {
  const isBlocked = Boolean(blockedReason);
  const frame = isSelected ? "border-ink bg-ink text-paper-bright" : "border-ink/60 bg-paper hover:border-ink";
  return (
    <label htmlFor={id} className={`${CARD_BASE} ${frame} ${isBlocked ? "cursor-not-allowed opacity-60" : ""}`}>
      <input id={id} type="radio" name="offer" value={id} checked={isSelected} disabled={isBlocked} onChange={onSelect} className="sr-only" />
      {badge && (
        <span className="absolute -top-2.5 right-3 border border-ink bg-signal px-2 py-0.5 font-mono text-[9px] font-semibold tracking-[0.14em] text-paper-bright uppercase">
          {badge}
        </span>
      )}
      <span className="grid gap-2">
        <span className={`font-mono text-[11px] leading-snug font-semibold tracking-[0.12em] uppercase ${isSelected ? "text-signal" : "text-muted"}`}>
          {name}
        </span>
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-display text-3xl leading-none whitespace-nowrap sm:text-[2.15rem]">{price}</span>
          <span className={`font-mono text-[11px] tracking-[0.08em] uppercase whitespace-nowrap ${isSelected ? "text-paper/70" : "text-muted"}`}>
            {period}
          </span>
        </span>
      </span>
      <span className={`text-xs leading-relaxed ${isSelected ? "text-paper/85" : "text-ink-soft"}`}>{blockedReason ?? term}</span>
      {isSelected && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-signal" />}
    </label>
  );
}
