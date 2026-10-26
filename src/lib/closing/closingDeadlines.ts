import "server-only";
import { closingHref } from "@/lib/closing/closingConstants";
import { scheduleClosingTasks, todayIn } from "@/lib/closing/closingSchedule";
import { ClosingCaseService } from "@/services/ClosingCaseService";
import { getClosingTranslation } from "@/translations/closing/ClosingTranslations";
import { ClosingBasis, ClosingDueRule } from "@/types/closing.types";
import { DeadlineBasis, DeadlineContext, DeadlineItem, DeadlineKind } from "@/types/deadline.types";

const KINDS: Record<ClosingDueRule["kind"], DeadlineKind> = { deadline: "deadline", on: "task", earliest: "info" };
const BASES: Record<ClosingBasis, DeadlineBasis> = { law: "law", rule: "rule", practice: "user" };
const NO_CONDITIONS = new Set<never>();

/**
 * Termin-Begleiter provider: the dated, open tasks of the buyer's case after
 * the Zuschlag. Situational tasks (tenant, owner still living there …) are left
 * out — those answers live in the browser, and a reminder that does not apply is noise.
 */
export async function closingDeadlines({ userId, listing, locale }: DeadlineContext): Promise<DeadlineItem[]> {
  const closingCase = await ClosingCaseService.get(userId, listing.key);
  if (!closingCase?.dates.awardDate) return [];
  const { Tasks } = getClosingTranslation(locale);
  const tasks = scheduleClosingTasks(listing.market, closingCase.dates, new Set(closingCase.done), NO_CONDITIONS, todayIn(listing.market, Date.now()));
  return tasks
    .filter((task) => task.due && task.def.due && task.state !== "done")
    .map(({ def, due }) => {
      const text = Tasks.Items[listing.market][def.id];
      return {
        id: `closing.${def.id}`,
        date: due as string,
        title: text?.title ?? def.id,
        detail: text?.detail ?? "",
        law: def.laws[0] ?? null,
        basis: BASES[def.basis],
        phase: "after",
        kind: def.id === "de.attend" ? "appointment" : KINDS[(def.due as ClosingDueRule).kind],
        remindDays: def.remindDays ?? [],
        href: closingHref(listing.key),
      };
    });
}
