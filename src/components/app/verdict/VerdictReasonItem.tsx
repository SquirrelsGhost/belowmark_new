import { ReactNode } from "react";
import { VerdictSeverity } from "@/types/verdict.types";

interface VerdictReasonItemProps {
  severity: VerdictSeverity;
  text: string;
  /** Verbatim words of the source, if any */
  quote: string | null;
  /** VerdictSourceTag items */
  sources: ReactNode;
  /** Link to where the point is closed */
  action: ReactNode;
}

const MARK_CLASSES: Record<VerdictSeverity, string> = {
  none: "bg-rule-strong",
  stop: "bg-signal",
  gap: "bg-caution",
  caution: "bg-ink-soft",
  ok: "bg-verdict",
};

/** One reason of the verdict: what it says, the source's own words, where it comes from. */
export default function VerdictReasonItem({ severity, text, quote, sources, action }: VerdictReasonItemProps) {
  return (
    <li className="flex gap-3 py-3">
      <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 ${MARK_CLASSES[severity]}`} />
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="text-sm leading-snug text-ink">{text}</p>
        {quote && <blockquote className="border-l-2 border-rule-strong pl-3 font-serif text-[15px] leading-snug text-ink-soft italic">{quote}</blockquote>}
        <div className="flex flex-wrap items-center gap-1.5">
          {sources}
          {action}
        </div>
      </div>
    </li>
  );
}
