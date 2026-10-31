import Button from "@/components/ui/Button";
import { AccountOfferRowView } from "@/lib/billing/accountOfferView";

interface AccountOfferRowProps {
  row: AccountOfferRowView;
}

/** One price line in a plan card: cadence and price left, the single click right; the term rule below. */
export default function AccountOfferRow({ row }: AccountOfferRowProps) {
  return (
    <div className="grid gap-2 border-t border-rule py-4 first:border-t-0 first:pt-0 last:pb-0">
      <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">{row.cadence}</span>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <span className="font-display text-3xl leading-none whitespace-nowrap">{row.price}</span>
        {row.action && <Button href={row.action.href} label={row.action.label} variant={row.action.isPrimary ? "signal" : "outline"} size="sm" withArrow />}
      </div>
      <p className={`text-xs leading-relaxed ${row.action ? "text-ink-soft" : "text-muted"}`}>{row.note}</p>
    </div>
  );
}
