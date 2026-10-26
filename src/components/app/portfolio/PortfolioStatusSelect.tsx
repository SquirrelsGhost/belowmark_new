// Writes the outcome record to localStorage when the bidder changes it
"use client";

import { LABEL_CLASSES } from "@/lib/appStyles";
import { writeHolding } from "@/lib/portfolio/holdingStorage";
import { HOLDING_STATUSES } from "@/lib/portfolio/portfolioConstants";
import { Holding, HoldingStatus } from "@/types/portfolio.types";

interface PortfolioStatusSelectProps {
  listingKey: string;
  holding: Holding;
  label: string;
  statusLabels: Record<HoldingStatus, string>;
}

/** Gemerkt · Geboten · Ersteigert · Nicht erhalten — only the bidder knows the outcome. */
export default function PortfolioStatusSelect({ listingKey, holding, label, statusLabels }: PortfolioStatusSelectProps) {
  const id = `status-${listingKey}`;
  return (
    <label htmlFor={id} className="mt-2 flex items-center gap-2">
      <span className={LABEL_CLASSES}>{label}</span>
      <select
        id={id}
        value={holding.status}
        onChange={(event) => writeHolding(listingKey, { ...holding, status: event.target.value as HoldingStatus })}
        className="h-8 border border-rule-strong bg-paper-bright px-2 font-mono text-[12px] outline-none focus:shadow-[3px_3px_0_0_var(--signal)]"
      >
        {HOLDING_STATUSES.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>
    </label>
  );
}
