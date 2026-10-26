import ClosingTaskItem from "@/components/app/closing/ClosingTaskItem";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { ScheduledClosingTask } from "@/types/closing.types";

interface ClosingPhaseListProps {
  title: string;
  tasks: ScheduledClosingTask[];
  listingKey: string;
  market: MarketCode;
  labels: IClosingTranslation["Tasks"];
  locale: LocaleOption;
}

/** One phase of the list (e.g. "Zahlung") with its tasks in order. */
export default function ClosingPhaseList({ title, tasks, listingKey, market, labels, locale }: ClosingPhaseListProps) {
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <h2 className="border-b-2 border-ink pb-1 font-display text-3xl">{title}</h2>
      <ol className="flex flex-col divide-y divide-rule">
        {tasks.map((task) => (
          <ClosingTaskItem key={task.def.id} task={task} text={labels.Items[market][task.def.id]} listingKey={listingKey} market={market} labels={labels} locale={locale} />
        ))}
      </ol>
    </section>
  );
}
