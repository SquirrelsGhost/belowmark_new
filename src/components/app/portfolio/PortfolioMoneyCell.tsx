interface PortfolioMoneyCellProps {
  /** Formatted figure; null when the bidder has not entered what it needs */
  value: string | null;
  missingLabel: string;
  /** Small line under the figure, e.g. "bei Bietlimit" or "Kosten unvollständig" */
  note?: string | null;
  tone?: "plain" | "good" | "bad" | "caution";
}

const TONE = { plain: "", good: "text-verdict", bad: "text-signal", caution: "text-caution" } as const;

/** A figure of the table, right-aligned; a missing one says so instead of showing 0. */
export default function PortfolioMoneyCell({ value, missingLabel, note, tone = "plain" }: PortfolioMoneyCellProps) {
  return (
    <td className="border-l border-rule p-3 text-right align-top whitespace-nowrap">
      <span className={`font-mono tabular-nums ${value === null ? "text-muted" : TONE[tone]}`}>{value ?? missingLabel}</span>
      {note && <span className="mt-1 block font-mono text-[10px] tracking-wide text-muted uppercase">{note}</span>}
    </td>
  );
}
