interface PortfolioHeadCellProps {
  label: string;
  /** The first column stays visible while the table scrolls sideways */
  isSticky?: boolean;
  isNumeric?: boolean;
}

/** Column heading of a portfolio table. */
export default function PortfolioHeadCell({ label, isSticky = false, isNumeric = false }: PortfolioHeadCellProps) {
  return (
    <th
      scope="col"
      className={`p-3 align-bottom font-mono text-[10px] font-normal tracking-[0.14em] whitespace-nowrap text-muted uppercase ${isNumeric ? "text-right" : ""} ${isSticky ? "sticky left-0 z-10 min-w-56 bg-paper-bright sm:min-w-72" : "border-l border-rule"}`}
    >
      {label}
    </th>
  );
}
