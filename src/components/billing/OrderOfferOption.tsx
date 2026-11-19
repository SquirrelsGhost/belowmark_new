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
  "relative flex h-full min-w-0 cursor-pointer flex-col justify-between gap-3 border-2 px-3.5 pb-4 transition-colors sm:px-4",
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-signal",
].join(" ");

/** One duration as a radio card: name, price, what happens at the end. */
export default function OrderOfferOption({ id, name, price, period, term, isSelected, blockedReason, badge, onSelect }: OrderOfferOptionProps) {
  const isBlocked = Boolean(blockedReason);
  const frame = isSelected ? "border-ink bg-ink text-paper-bright" : "border-ink/60 bg-paper hover:border-ink";
  const topPad = badge ? "pt-5" : "pt-4";
  return (
    <label htmlFor={id} className={`${CARD_BASE} ${topPad} ${frame} ${isBlocked ? "cursor-not-allowed opacity-60" : ""}`}>
      <input id={id} type="radio" name="offer" value={id} checked={isSelected} disabled={isBlocked} onChange={onSelect} className="sr-only" />
      {badge && (
        <span className="absolute -top-2.5 right-2.5 max-w-[calc(100%-1.25rem)] truncate border border-ink bg-signal px-2 py-0.5 font-mono text-[9px] font-semibold tracking-[0.12em] text-paper-bright uppercase">
          {badge}
        </span>
      )}
      <span className="grid min-w-0 gap-2">
        <span className={`font-mono text-[11px] leading-snug font-semibold tracking-[0.1em] wrap-break-word uppercase ${isSelected ? "text-signal" : "text-muted"}`}>
          {name}
        </span>
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-display text-[1.75rem] leading-none sm:text-3xl">{price}</span>
          <span className={`font-mono text-[10px] tracking-[0.08em] wrap-break-word uppercase sm:text-[11px] ${isSelected ? "text-paper/70" : "text-muted"}`}>
            {period}
          </span>
        </span>
      </span>
      <span className={`min-w-0 text-xs leading-relaxed wrap-break-word ${isSelected ? "text-paper/85" : "text-ink-soft"}`}>{blockedReason ?? term}</span>
      {isSelected && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-signal" />}
    </label>
  );
}
