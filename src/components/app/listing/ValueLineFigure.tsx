import Redacted from "@/components/ui/Redacted";
import { LABEL_CLASSES } from "@/lib/appStyles";

interface ValueLineFigureProps {
  label: string;
  value: string;
  note?: string;
  isLocked: boolean;
  lockedLabel: string;
  /** Highlights the figure that decides (the entry bid) */
  isKey?: boolean;
}

/** One figure below the market line. */
export default function ValueLineFigure({ label, value, note, isLocked, lockedLabel, isKey = false }: ValueLineFigureProps) {
  return (
    <div className={`flex flex-col gap-1 p-4 ${isKey ? "bg-ink text-paper-bright" : "bg-paper"}`}>
      <p className={`${LABEL_CLASSES} ${isKey ? "text-paper/70" : ""}`}>{label}</p>
      <p className="font-mono text-xl font-semibold">{isLocked ? <Redacted label={lockedLabel} width="md" /> : value}</p>
      {note && <p className={`text-xs leading-snug ${isKey ? "text-paper/70" : "text-muted"}`}>{note}</p>}
    </div>
  );
}
