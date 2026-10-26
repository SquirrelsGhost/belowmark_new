import ClosingLawLinks from "@/components/app/closing/ClosingLawLinks";
import ClosingTaskMeta from "@/components/app/closing/ClosingTaskMeta";
import ClosingTaskToggle from "@/components/app/closing/ClosingTaskToggle";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { ClosingTaskText, IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { ScheduledClosingTask } from "@/types/closing.types";

interface ClosingTaskItemProps {
  task: ScheduledClosingTask;
  text: ClosingTaskText | undefined;
  listingKey: string;
  market: MarketCode;
  labels: IClosingTranslation["Tasks"];
  locale: LocaleOption;
}

/** One task: tick box, what to do and why, its date and its sources. */
export default function ClosingTaskItem({ task, text, listingKey, market, labels, locale }: ClosingTaskItemProps) {
  if (!text) return null;
  const isDone = task.state === "done";
  return (
    <li className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 py-4 ${isDone ? "opacity-60" : ""}`}>
      <ClosingTaskToggle listingKey={listingKey} taskId={task.def.id} isDone={isDone} doneLabel={labels.MarkDone} openLabel={labels.MarkOpen} />
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className={`font-narrow text-lg font-semibold ${isDone ? "line-through" : ""}`}>{text.title}</h3>
        <ClosingTaskMeta task={task} market={market} labels={labels} locale={locale} />
        <p className="max-w-3xl text-sm leading-relaxed text-ink-soft">{text.detail}</p>
        {task.def.check && <p className="font-mono text-[11px] text-signal">⚑ {labels.Check}</p>}
        {task.def.laws.length > 0 && <ClosingLawLinks label={labels.Sources} laws={task.def.laws} />}
      </div>
    </li>
  );
}
