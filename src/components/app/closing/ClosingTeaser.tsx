import Button from "@/components/ui/Button";
import { fill } from "@/lib/appFormat";
import { closingHref } from "@/lib/closing/closingConstants";
import { scheduleClosingTasks, todayIn } from "@/lib/closing/closingSchedule";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { ClosingCase } from "@/types/closing.types";

interface ClosingTeaserProps {
  listingKey: string;
  market: MarketCode;
  closingCase: ClosingCase | null;
  labels: IClosingTranslation;
  locale: LocaleOption;
  now: number;
}

const NO_CONDITIONS = new Set<never>();

/** Card next to the result form once the user is the buyer: progress and the next open date. */
export default function ClosingTeaser({ listingKey, market, closingCase, labels, locale, now }: ClosingTeaserProps) {
  const { Teaser } = labels;
  const dates = closingCase?.dates ?? { awardDate: null, distributionDate: null, taxNoticeDate: null, handoverDate: null };
  // Situation answers live in the browser, so the card counts the tasks every case has
  const tasks = scheduleClosingTasks(market, dates, new Set(closingCase?.done ?? []), NO_CONDITIONS, todayIn(market, now));
  const done = tasks.filter((task) => task.state === "done").length;
  const next = tasks.filter((task) => task.due && task.state !== "done").sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""))[0];

  return (
    <aside aria-label={Teaser.Title} className="flex flex-col items-start gap-3 border-2 border-ink bg-paper-bright p-5 shadow-[6px_6px_0_0_var(--signal)]">
      <h3 className="font-display text-2xl">{Teaser.Title}</h3>
      <p className="text-sm leading-relaxed text-ink-soft">{Teaser.Lead}</p>
      <p className="font-mono text-[12px]">{fill(Teaser.Progress, { done, total: tasks.length })}</p>
      <p className="text-sm">
        {next?.due ? fill(Teaser.Next, { title: labels.Tasks.Items[market][next.def.id]?.title ?? next.def.id, date: formatDate(next.due, locale) }) : Teaser.NoDate}
      </p>
      <Button label={Teaser.Button} href={closingHref(listingKey)} variant="ink" size="sm" withArrow />
    </aside>
  );
}
