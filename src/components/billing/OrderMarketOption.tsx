import { PricingCountryCode } from "@/lib/constants";

interface OrderMarketOptionProps {
  code: PricingCountryCode;
  label: string;
  hint: string;
  isSelected: boolean;
  onSelect: () => void;
}

const CARD_CLASSES = [
  "relative flex h-full cursor-pointer flex-col justify-between gap-1.5 border-2 p-4 text-left transition-colors",
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-signal",
].join(" ");

/** Market radio card on /buchen (DE in EUR vs. TR in TRY). */
export default function OrderMarketOption({ code, label, hint, isSelected, onSelect }: OrderMarketOptionProps) {
  const frame = isSelected ? "border-ink bg-ink text-paper-bright" : "border-ink/60 bg-paper hover:border-ink";
  const inputId = `order-market-${code.toLowerCase()}`;
  return (
    <label htmlFor={inputId} className={`${CARD_CLASSES} ${frame}`}>
      <input id={inputId} type="radio" name="market" value={code} checked={isSelected} onChange={onSelect} className="sr-only" />
      <span className="flex items-center justify-between gap-2">
        <span className="font-narrow text-base font-semibold tracking-wide uppercase">{label}</span>
        <span className={`font-mono text-[11px] font-semibold tracking-[0.18em] ${isSelected ? "text-signal" : "text-muted"}`}>{code}</span>
      </span>
      <span className={`text-xs leading-relaxed ${isSelected ? "text-paper/85" : "text-ink-soft"}`}>{hint}</span>
      {isSelected && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-signal" />}
    </label>
  );
}
