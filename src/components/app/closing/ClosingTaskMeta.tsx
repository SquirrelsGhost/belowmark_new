import { fill } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { ClosingTaskState, ScheduledClosingTask } from "@/types/closing.types";

interface ClosingTaskMetaProps {
  task: ScheduledClosingTask;
  market: MarketCode;
  labels: IClosingTranslation["Tasks"];
  locale: LocaleOption;
}

const STATE_CLASSES: Record<ClosingTaskState, string> = {
  done: "bg-verdict/15 text-verdict",
  overdue: "bg-signal text-paper-bright",
  soon: "bg-signal/15 text-signal",
  open: "bg-ink/10 text-ink",
  undated: "bg-ink/5 text-muted",
};

/** State badge, the date with its kind ("spätestens", "frühestens") and how the task is backed. */
export default function ClosingTaskMeta({ task, market, labels, locale }: ClosingTaskMetaProps) {
  const missingLabel = task.missing ? labels.Dates.Fields[market][task.missing]?.label : null;
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px]">
      <span className={`px-1.5 py-0.5 tracking-[0.08em] uppercase ${STATE_CLASSES[task.state]}`}>{labels.States[task.state]}</span>
      {task.due && task.def.due && <span>{fill(labels.Due[task.def.due.kind], { date: formatDate(task.due, locale) })}</span>}
      {missingLabel && <span className="text-muted">{fill(labels.Missing, { field: missingLabel })}</span>}
      <span className="text-muted">· {labels.Basis[task.def.basis]}</span>
    </p>
  );
}
