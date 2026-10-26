import Link from "next/link";
import { VERDICT_ANCHORS } from "@/lib/verdict/verdictConstants";

interface PortfolioLimitCellProps {
  /** Formatted limit, or null when the bidder's figures do not yield one */
  value: string | null;
  isUnreachable: boolean;
  href: string;
  labels: { missing: string; unreachable: string };
}

/** The bid limit; without one the cell leads to the calculator on the Aktenblatt instead of showing a number. */
export default function PortfolioLimitCell({ value, isUnreachable, href, labels }: PortfolioLimitCellProps) {
  return (
    <td className="border-l border-rule p-3 text-right align-top whitespace-nowrap">
      {value !== null ? (
        <span className="font-mono font-semibold tabular-nums">{value}</span>
      ) : (
        <Link href={`${href}#${VERDICT_ANCHORS.limit}`} className={`font-mono text-[12px] underline-offset-4 hover:underline ${isUnreachable ? "text-signal" : "text-muted"}`}>
          {isUnreachable ? labels.unreachable : labels.missing}
        </Link>
      )}
    </td>
  );
}
