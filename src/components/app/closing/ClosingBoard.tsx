// Reads the situation answers from localStorage and recomputes the list when they change
"use client";

import ClosingConditions from "@/components/app/closing/ClosingConditions";
import ClosingPhaseList from "@/components/app/closing/ClosingPhaseList";
import { useStoredText } from "@/hooks/useStoredText";
import { fill } from "@/lib/appFormat";
import { CLOSING_CONDITIONS, CLOSING_CONDITIONS_STORAGE, CLOSING_PHASES } from "@/lib/closing/closingConstants";
import { scheduleClosingTasks, todayIn } from "@/lib/closing/closingSchedule";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { ClosingCondition, ClosingDates } from "@/types/closing.types";

interface ClosingBoardProps {
  listingKey: string;
  market: MarketCode;
  dates: ClosingDates;
  done: string[];
  /** Request time from the server, so server and browser agree on "today" */
  now: number;
  labels: IClosingTranslation["Tasks"];
  locale: LocaleOption;
}

function parseConditions(raw: string): Set<ClosingCondition> {
  try {
    const parsed: unknown = JSON.parse(raw || "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter((value): value is ClosingCondition => CLOSING_CONDITIONS.includes(value)) : []);
  } catch {
    return new Set();
  }
}

/** The task list itself: situation switches on top, then the phases with their tasks. */
export default function ClosingBoard({ listingKey, market, dates, done, now, labels, locale }: ClosingBoardProps) {
  const [raw, write] = useStoredText(`${CLOSING_CONDITIONS_STORAGE}${listingKey}`);
  const conditions = parseConditions(raw);
  const tasks = scheduleClosingTasks(market, dates, new Set(done), conditions, todayIn(market, now));
  const doneCount = tasks.filter((task) => task.state === "done").length;

  const toggle = (condition: ClosingCondition) => {
    const next = new Set(conditions);
    if (next.has(condition)) next.delete(condition);
    else next.add(condition);
    write(next.size ? JSON.stringify([...next]) : null);
  };

  return (
    <div className="flex flex-col gap-8">
      <ClosingConditions labels={labels.Conditions} selected={conditions} onToggle={toggle} />
      <p className="font-mono text-[12px] text-ink-soft">{fill(labels.Progress, { done: doneCount, total: tasks.length })}</p>
      {CLOSING_PHASES.map((phase) => {
        const inPhase = tasks.filter((task) => task.def.phase === phase);
        if (inPhase.length === 0) return null;
        return <ClosingPhaseList key={phase} title={labels.Phases[phase]} tasks={inPhase} listingKey={listingKey} market={market} labels={labels} locale={locale} />;
      })}
    </div>
  );
}
