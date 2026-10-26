interface PortfolioFigureProps {
  label: string;
  /** null: no row had the figure */
  value: string | null;
  emptyLabel: string;
  /** "aus 3 von 4" when some rows lack the figure */
  coverage?: string | null;
  hint?: string;
  isLead?: boolean;
}

/** One sum of the portfolio, with how many objects it covers. */
export default function PortfolioFigure({ label, value, emptyLabel, coverage, hint, isLead = false }: PortfolioFigureProps) {
  return (
    <div className={`flex flex-col gap-1 border-rule p-4 ${isLead ? "bg-ink text-paper-bright" : "bg-paper-bright"}`}>
      <dt className={`font-mono text-[10px] tracking-[0.16em] uppercase ${isLead ? "text-paper-deep" : "text-muted"}`}>{label}</dt>
      <dd className={`font-mono font-semibold tabular-nums ${value === null ? "text-sm text-muted" : "text-xl sm:text-2xl"}`}>{value ?? emptyLabel}</dd>
      {coverage && <dd className="font-mono text-[11px] text-caution">{coverage}</dd>}
      {hint && <dd className={`text-[11px] leading-snug ${isLead ? "text-paper-deep" : "text-muted"}`}>{hint}</dd>}
    </div>
  );
}
