import { ReactNode } from "react";

interface PortfolioSummaryProps {
  label: string;
  children: ReactNode;
}

/** The sums of one group as a strip of figures. */
export default function PortfolioSummary({ label, children }: PortfolioSummaryProps) {
  return (
    <dl aria-label={label} className="mt-4 grid grid-cols-2 gap-px border-2 border-ink bg-rule-strong sm:grid-cols-4">
      {children}
    </dl>
  );
}
