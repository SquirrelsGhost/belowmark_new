import PageRef from "@/components/app/report/PageRef";
import { FindingStance } from "@/types/report.types";

interface ReportFindingItemProps {
  kindLabel: string;
  stance: FindingStance;
  stanceLabel: string;
  quote: string;
  pageLabel: string;
  /** Claude's reading of the quote, already prefixed */
  note: string | null;
}

const STANCE_CLASSES: Record<FindingStance, string> = {
  present: "border-signal",
  absent: "border-verdict",
  unclear: "border-caution",
};

const STANCE_TEXT: Record<FindingStance, string> = {
  present: "text-signal",
  absent: "text-verdict",
  unclear: "text-caution",
};

/** One passage of the Gutachten: subject, what it says, the words, the page. */
export default function ReportFindingItem({ kindLabel, stance, stanceLabel, quote, pageLabel, note }: ReportFindingItemProps) {
  return (
    <li className={`border-l-4 bg-paper-bright px-3 py-2 ${STANCE_CLASSES[stance]}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
          <span className="text-ink">{kindLabel}</span> · <span className={STANCE_TEXT[stance]}>{stanceLabel}</span>
        </span>
        <PageRef label={pageLabel} />
      </div>
      <blockquote className="mt-1.5 font-serif text-[15px] leading-snug text-ink-soft italic">„{quote}“</blockquote>
      {note && <p className="mt-1.5 text-xs text-muted">{note}</p>}
    </li>
  );
}
