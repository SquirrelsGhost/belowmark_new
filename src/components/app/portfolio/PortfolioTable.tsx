import { ReactNode } from "react";

interface PortfolioTableProps {
  label: string;
  /** PortfolioHeadCell children */
  head: ReactNode;
  children: ReactNode;
}

/** The rows of one group; the object column stays put while the figures scroll on small screens. */
export default function PortfolioTable({ label, head, children }: PortfolioTableProps) {
  return (
    <div className="mt-6 overflow-x-auto border-2 border-ink bg-paper-bright">
      <table aria-label={label} className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b-2 border-ink">{head}</tr>
        </thead>
        <tbody className="divide-y divide-rule">{children}</tbody>
      </table>
    </div>
  );
}
