import DeadlineEntry from "@/components/app/deadlines/DeadlineEntry";
import DeadlineNote from "@/components/app/deadlines/DeadlineNote";
import DeadlinePhaseGroup from "@/components/app/deadlines/DeadlinePhaseGroup";
import DeadlineTodayMarker from "@/components/app/deadlines/DeadlineTodayMarker";
import { fill } from "@/lib/appFormat";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { daysBetween } from "@/lib/deadlines/deadlineDates";
import { formatDeadlineDistance, formatDeadlineWhen, isDeadlinePast } from "@/lib/deadlines/deadlineFormat";
import { IDeadlineTranslation } from "@/translations/deadlines/IDeadlineTranslation";
import { DeadlineItem, DeadlinePhase } from "@/types/deadline.types";

interface DeadlineTimelineProps {
  items: DeadlineItem[];
  market: MarketCode;
  locale: LocaleOption;
  today: string;
  now: number;
  labels: IDeadlineTranslation;
}

const PHASES: DeadlinePhase[] = ["before", "hearing", "after"];
/** Entries this close are marked in signal red */
const SOON_DAYS = 7;

function reminderLine(days: number[], labels: IDeadlineTranslation["Section"]): string | null {
  if (days.length === 0) return null;
  const parts = [...days].sort((a, b) => b - a).map((day) => (day === 0 ? labels.ReminderToday : day === 1 ? labels.ReminderDay : fill(labels.ReminderDays, { days: day })));
  return `${labels.Reminders}: ${parts.join(" · ")}`;
}

/** The three phases from notice to award (and after, as other modules fill it), with "today" drawn in. */
export default function DeadlineTimeline({ items, market, locale, today, now, labels }: DeadlineTimelineProps) {
  const S = labels.Section;
  return (
    <div className="flex flex-col gap-8">
      {PHASES.map((phase) => {
        const entries = items.filter((item) => item.phase === phase);
        if (entries.length === 0 && phase !== "after") return null;
        const firstAhead = entries.findIndex((item) => !isDeadlinePast(item, today, now));
        const markerAt = firstAhead > 0 ? firstAhead : -1;
        return (
          <DeadlinePhaseGroup key={phase} title={S.Phases[phase]}>
            {entries.length === 0 && (
              <li>
                <DeadlineNote text={S.AfterAwardEmpty} tone="hatch" />
              </li>
            )}
            {entries.flatMap((item, index) => [
              ...(index === markerAt ? [<DeadlineTodayMarker key={`today-${phase}`} label={labels.Status.Today} />] : []),
              <DeadlineEntry
                key={item.id}
                when={formatDeadlineWhen(item, market, locale)}
                distance={formatDeadlineDistance(item, today, now, labels.Status)}
                kind={S.Kinds[item.kind]}
                title={item.title}
                detail={item.detail}
                law={item.law}
                basisLabel={S.Basis[item.basis]}
                reminders={isDeadlinePast(item, today, now) ? null : reminderLine(item.remindDays, S)}
                isPast={isDeadlinePast(item, today, now)}
                isSoon={daysBetween(today, item.date) <= SOON_DAYS}
                isDeadline={item.kind === "deadline"}
                href={item.href}
              />,
            ])}
          </DeadlinePhaseGroup>
        );
      })}
    </div>
  );
}
