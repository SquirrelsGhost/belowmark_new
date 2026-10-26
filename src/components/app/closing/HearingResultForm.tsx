// Saves through a Server Action, previews the price ratio while typing and mirrors a won Zuschlag into the portfolio record
"use client";

import Link from "next/link";
import { FormEvent, startTransition, useActionState, useEffect, useState } from "react";
import ResultAmountFields from "@/components/app/closing/ResultAmountFields";
import ResultBuyerFields from "@/components/app/closing/ResultBuyerFields";
import ResultField from "@/components/app/closing/ResultField";
import { fill } from "@/lib/appFormat";
import { CONTROL_CLASSES } from "@/lib/appStyles";
import { saveHearingResultAction, ClosingActionState } from "@/lib/closing/closingActions";
import { CLOSING_ROUTES, HEARING_OUTCOMES, RESULT_SOURCES } from "@/lib/closing/closingConstants";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { formatPercent } from "@/lib/format";
import { holdingKey, parseHolding, writeHolding } from "@/lib/portfolio/holdingStorage";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { HearingOutcome, HearingResult } from "@/types/closing.types";

interface HearingResultFormProps {
  listingKey: string;
  market: MarketCode;
  /** null on the free plan — then no ratio is shown */
  appraisedValue: number | null;
  defaultHearingDate: string;
  result: HearingResult | null;
  labels: IClosingTranslation["Result"];
  locale: LocaleOption;
}

const INITIAL_STATE: ClosingActionState = { ok: true };
const SUBMIT_CLASSES =
  "h-10 cursor-pointer bg-ink px-5 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)] disabled:opacity-60";

/** The user's report of a hearing: outcome, bid, bidders — no names. */
export default function HearingResultForm({ listingKey, market, appraisedValue, defaultHearingDate, result, labels, locale }: HearingResultFormProps) {
  const [state, formAction, isPending] = useActionState(saveHearingResultAction, INITIAL_STATE);
  // onSubmit instead of action={…}: React resets a form after an action, which would blank the saved values
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  };
  const [outcome, setOutcome] = useState<HearingOutcome>(result?.outcome ?? "awarded");
  const [bid, setBid] = useState<number | null>(result?.highestBid ?? null);
  const [rights, setRights] = useState<number | null>(result?.retainedRights ?? null);

  useEffect(() => {
    if (!state.won) return;
    // The portfolio's record is the one place that says "ersteigert" — keep a price typed there if none came now
    let current = parseHolding("");
    try {
      current = parseHolding(window.localStorage.getItem(holdingKey(listingKey)) ?? "");
    } catch {
      // Private mode: start from an empty record
    }
    writeHolding(listingKey, { status: "won", price: state.won.price ?? current.price, date: state.won.date });
  }, [state, listingKey]);

  const ratio = appraisedValue && bid ? ((bid + (rights ?? 0)) / appraisedValue) * 100 : null;
  const message = !state.ok ? labels.Errors[state.error ?? "unknown"] : state.saved ? (state.won ? labels.SavedBuyer : labels.Saved) : "";

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 border border-ink/70 bg-paper-bright p-5">
      <input type="hidden" name="listingKey" value={listingKey} />
      <div>
        <h3 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{labels.Title}</h3>
        <p className="mt-1 text-xs text-muted">{labels.Lead}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ResultField htmlFor="result-date" label={labels.HearingDate}>
          <input id="result-date" name="hearingDate" type="date" required defaultValue={defaultHearingDate} className={CONTROL_CLASSES} />
        </ResultField>
        <ResultField htmlFor="result-outcome" label={labels.Outcome}>
          <select id="result-outcome" name="outcome" value={outcome} onChange={(event) => setOutcome(event.target.value as HearingOutcome)} className={CONTROL_CLASSES}>
            {HEARING_OUTCOMES.map((value) => (
              <option key={value} value={value}>
                {labels.Outcomes[value]}
              </option>
            ))}
          </select>
        </ResultField>
      </div>
      {outcome !== "noBids" && outcome !== "cancelled" && (
        <ResultAmountFields
          market={market}
          labels={labels}
          highestBid={result?.highestBid ?? null}
          retainedRights={result?.retainedRights ?? null}
          bidderCount={result?.bidderCount ?? null}
          bid={bid}
          rights={rights}
          onBidChange={(nextBid, nextRights) => {
            setBid(nextBid);
            setRights(nextRights);
          }}
        />
      )}
      {ratio !== null && <p className="font-mono text-[12px] text-ink-soft">{fill(labels.Ratio, { pct: formatPercent(ratio, locale) })}</p>}
      <ResultField htmlFor="result-source" label={labels.Source}>
        <select id="result-source" name="source" defaultValue={result?.source ?? "attended"} className={CONTROL_CLASSES}>
          {RESULT_SOURCES.map((value) => (
            <option key={value} value={value}>
              {labels.Sources[value]}
            </option>
          ))}
        </select>
      </ResultField>
      {outcome === "awarded" && <ResultBuyerFields market={market} labels={labels} isBuyer={result?.isBuyer ?? false} />}
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="shared" defaultChecked={result?.shared ?? true} className="mt-1 size-4 accent-ink" />
        <span>
          {labels.Shared.label}
          <span className="block text-[11px] leading-snug text-muted">{labels.Shared.hint}</span>
        </span>
      </label>
      <p className="text-[11px] leading-snug text-muted">{labels.Privacy}</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={CLOSING_ROUTES.results} className="font-narrow text-xs font-semibold tracking-[0.1em] uppercase underline-offset-4 hover:underline">
          {labels.StatsLink}
        </Link>
        <button type="submit" disabled={isPending} className={SUBMIT_CLASSES}>
          {labels.Save}
        </button>
      </div>
      <p aria-live="polite" className={`min-h-4 font-mono text-[11px] ${state.ok ? "text-verdict" : "text-signal"}`}>
        {message}
      </p>
    </form>
  );
}
