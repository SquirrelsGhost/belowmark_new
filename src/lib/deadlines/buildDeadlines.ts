import { MARKET_TIME_ZONES } from "@/lib/appConstants";
import { fill, formatMoney } from "@/lib/appFormat";
import { DEADLINE_LAWS, DEADLINE_REMIND, DEADLINE_RULES } from "@/lib/deadlines/deadlineConstants";
import { addDays, dayIn, instantAt, previousBusinessDay, workdaysBeforeIncludingSaturday } from "@/lib/deadlines/deadlineDates";
import { IDeadlineTranslation } from "@/translations/deadlines/IDeadlineTranslation";
import { DeadlineContext, DeadlineItem } from "@/types/deadline.types";

/**
 * The dated entries up to and including the award, computed only from the
 * notice and the law. Pure: same listing, same strings → same entries.
 * Everything after the award comes from AFTER_AWARD_PROVIDERS.
 */

type Labels = IDeadlineTranslation["Items"];

/** By day, then by time of day; untimed entries close their day. */
const byDate = (a: DeadlineItem, b: DeadlineItem): number => a.date.localeCompare(b.date) || (a.time ?? "~").localeCompare(b.time ?? "~");

function noticeItem(ctx: DeadlineContext, text: Labels["DE"]["Notice"], law: DeadlineItem["law"], id: string): DeadlineItem[] {
  const { listing } = ctx;
  if (!listing.firstSeenAt) return [];
  return [{ id, date: dayIn(listing.firstSeenAt, MARKET_TIME_ZONES[listing.market]), title: text.Title, detail: text.Detail, law, basis: "notice", phase: "before", kind: "info", remindDays: [...DEADLINE_REMIND.notice] }];
}

function germanItems(ctx: DeadlineContext, labels: Labels["DE"]): DeadlineItem[] {
  const { listing, locale, hideAmounts } = ctx;
  if (!listing.hearingAt) return [];
  const zone = MARKET_TIME_ZONES.DE;
  const hearingDay = dayIn(listing.hearingAt, zone);
  const amount =
    !hideAmounts && listing.appraisedValue !== null ? fill(labels.Amount, { amount: formatMoney(listing.appraisedValue * DEADLINE_RULES.depositShare, "DE", locale) }) : "";

  return [
    ...noticeItem(ctx, labels.Notice, DEADLINE_LAWS.zvg43, "de.notice"),
    {
      id: "de.deposit.transfer",
      date: addDays(hearingDay, -1),
      title: labels.Transfer.Title,
      detail: fill(labels.Transfer.Detail, { amount }),
      law: DEADLINE_LAWS.zvg69Transfer,
      basis: "law",
      phase: "before",
      kind: "deadline",
      remindDays: [...DEADLINE_REMIND.transfer],
    },
    {
      id: "de.deposit.cheque",
      date: workdaysBeforeIncludingSaturday(hearingDay, DEADLINE_RULES.chequeWorkdays),
      title: labels.Cheque.Title,
      detail: labels.Cheque.Detail,
      law: DEADLINE_LAWS.zvg69Cheque,
      basis: "law",
      phase: "before",
      kind: "task",
      remindDays: [...DEADLINE_REMIND.cheque],
    },
    {
      id: "de.hearing",
      date: hearingDay,
      time: new Date(Date.parse(listing.hearingAt)).toISOString(),
      title: labels.Hearing.Title,
      detail: fill(labels.Hearing.Detail, { authority: listing.authority }),
      law: DEADLINE_LAWS.zvg73,
      basis: "notice",
      phase: "hearing",
      kind: "appointment",
      remindDays: [...DEADLINE_REMIND.hearing],
    },
    {
      id: "de.award",
      date: addDays(hearingDay, DEADLINE_RULES.awardMaxDays),
      title: labels.Award.Title,
      detail: labels.Award.Detail,
      law: DEADLINE_LAWS.zvg87,
      basis: "law",
      phase: "hearing",
      kind: "info",
      remindDays: [...DEADLINE_REMIND.award],
    },
  ];
}

function turkishItems(ctx: DeadlineContext, labels: Labels["TR"]): DeadlineItem[] {
  const { listing, locale, hideAmounts } = ctx;
  const zone = MARKET_TIME_ZONES.TR;
  const rounds = listing.rounds.length > 0 ? listing.rounds : [];
  const money = (value: number | null | undefined, template: string) => (!hideAmounts && value != null ? fill(template, { amount: formatMoney(value, "TR", locale) }) : "");
  const amount = money(listing.appraisedValue === null ? null : listing.appraisedValue * DEADLINE_RULES.depositShare, labels.Amount);

  const perRound = rounds.flatMap((round): DeadlineItem[] => {
    const endDay = dayIn(round.end, zone);
    const values = { round: round.round };
    // The notice states the starting bid of the first round; the second starts at the law's 50 % (İİK m.129)
    const startingBid = round.round === 1 ? money(listing.tr?.startingBid, labels.StartingBid) : "";
    return [
      {
        id: `tr.r${round.round}.start`,
        date: dayIn(round.start, zone),
        time: new Date(Date.parse(round.start)).toISOString(),
        title: fill(labels.RoundStart.Title, values),
        detail: fill(labels.RoundStart.Detail, { startingBid }),
        law: DEADLINE_LAWS.esy14,
        basis: "notice",
        phase: "hearing",
        kind: "appointment",
        remindDays: [...DEADLINE_REMIND.roundStart],
      },
      {
        id: `tr.r${round.round}.cash`,
        date: addDays(endDay, -1),
        time: instantAt(addDays(endDay, -1), DEADLINE_RULES.cashDepositTime, zone),
        title: fill(labels.Cash.Title, values),
        detail: fill(labels.Cash.Detail, { amount }),
        law: DEADLINE_LAWS.esy13Cash,
        basis: "law",
        // Deposits belong to their round: the timeline reads start → deposit → end per round
        phase: "hearing",
        kind: "deadline",
        remindDays: [...DEADLINE_REMIND.deposit],
      },
      {
        id: `tr.r${round.round}.letter`,
        date: previousBusinessDay(endDay),
        title: fill(labels.Letter.Title, values),
        detail: labels.Letter.Detail,
        law: DEADLINE_LAWS.esy13Letter,
        basis: "law",
        phase: "hearing",
        kind: "deadline",
        remindDays: [...DEADLINE_REMIND.deposit],
      },
      {
        id: `tr.r${round.round}.end`,
        date: endDay,
        time: new Date(Date.parse(round.end)).toISOString(),
        title: fill(labels.RoundEnd.Title, values),
        detail: labels.RoundEnd.Detail,
        law: DEADLINE_LAWS.esy14End,
        basis: "notice",
        phase: "hearing",
        kind: "appointment",
        remindDays: [...DEADLINE_REMIND.roundEnd],
      },
    ];
  });

  return [...noticeItem(ctx, labels.Notice, DEADLINE_LAWS.esy12, "tr.notice"), ...perRound];
}

/** Entries up to the award, sorted by date. */
export function buildDeadlines(ctx: DeadlineContext, labels: Labels): DeadlineItem[] {
  if (ctx.listing.cancelled) return [];
  const items = ctx.listing.market === "TR" ? turkishItems(ctx, labels.TR) : germanItems(ctx, labels.DE);
  return items.sort(byDate);
}

export const sortDeadlines = (items: DeadlineItem[]): DeadlineItem[] => [...items].sort(byDate);
