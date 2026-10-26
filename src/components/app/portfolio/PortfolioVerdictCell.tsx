import Link from "next/link";
import { VerdictState } from "@/types/verdict.types";

interface PortfolioVerdictCellProps {
  state: VerdictState;
  label: string;
  /** Aktenblatt anchor of the verdict */
  href: string;
}

const TONE = {
  go: "border-verdict text-verdict",
  open: "border-caution text-caution",
  stop: "border-signal text-signal",
  none: "border-rule-strong text-muted",
} as const;

/** The verdict of the Aktenblatt as a small stamp that leads back to its reasons. */
export default function PortfolioVerdictCell({ state, label, href }: PortfolioVerdictCellProps) {
  return (
    <td className="border-l border-rule p-3 align-top">
      <Link href={href} className={`inline-flex border-2 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase hover:bg-paper-deep ${TONE[state]}`}>
        {label}
      </Link>
    </td>
  );
}
