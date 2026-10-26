import Redacted from "@/components/ui/Redacted";

interface ListingFiguresProps {
  valueLabel: string;
  /** Formatted value, or null when the notice gives none */
  value: string | null;
  noValueLabel: string;
  entryLabel: string;
  /** Formatted entry bid, or a reason text (limits waived) */
  entry: string | null;
  /** Optional market comparison line (TR), e.g. "−62 % unter Markt" */
  comparison?: string;
  isLocked: boolean;
  lockedLabel: string;
}

/** Value on the red line, the entry bid below it — the brand mark as numbers. */
export default function ListingFigures({ valueLabel, value, noValueLabel, entryLabel, entry, comparison, isLocked, lockedLabel }: ListingFiguresProps) {
  if (value === null && !isLocked) {
    return (
      <div className="flex w-full flex-col justify-center bg-hatch px-3 py-3 sm:w-56">
        <span className="font-mono text-[11px] leading-snug text-muted">{noValueLabel}</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col sm:w-56">
      <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{valueLabel}</span>
      <span className="pb-1 font-mono text-lg font-semibold">{isLocked ? <Redacted label={lockedLabel} width="lg" /> : value}</span>
      <span aria-hidden="true" className="h-[2px] bg-signal" />
      <span className="flex items-baseline justify-between gap-2 pt-1">
        <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{entryLabel}</span>
        <span className="font-mono text-sm">{isLocked ? <Redacted label={lockedLabel} width="sm" /> : entry}</span>
      </span>
      {comparison && !isLocked && <span className="pt-0.5 text-right font-mono text-[11px] text-verdict">{comparison}</span>}
    </div>
  );
}
