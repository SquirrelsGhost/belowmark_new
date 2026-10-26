// Saves the case dates through a Server Action; prefills the award date from the portfolio record in this browser
"use client";

import { FormEvent, startTransition, useActionState, useEffect } from "react";
import ResultField from "@/components/app/closing/ResultField";
import { useStoredText } from "@/hooks/useStoredText";
import { CONTROL_CLASSES } from "@/lib/appStyles";
import { ClosingActionState, saveClosingDatesAction } from "@/lib/closing/closingActions";
import { CLOSING_DATE_FIELDS } from "@/lib/closing/closingConstants";
import { MarketCode } from "@/lib/constants";
import { holdingKey, isWon, parseHolding, writeHolding } from "@/lib/portfolio/holdingStorage";
import { IClosingTranslation } from "@/translations/closing/IClosingTranslation";
import { ClosingDates } from "@/types/closing.types";

interface ClosingDatesFormProps {
  listingKey: string;
  market: MarketCode;
  dates: ClosingDates | null;
  labels: IClosingTranslation["Tasks"]["Dates"];
}

const INITIAL_STATE: ClosingActionState = { ok: true };

/** The dates every deadline is counted from. Nothing is assumed: empty stays empty. */
export default function ClosingDatesForm({ listingKey, market, dates, labels }: ClosingDatesFormProps) {
  const [state, formAction, isPending] = useActionState(saveClosingDatesAction, INITIAL_STATE);
  // onSubmit instead of action={…}: React resets a form after an action, which would blank the saved values
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  };
  const [raw] = useStoredText(holdingKey(listingKey));
  const holding = parseHolding(raw);
  const fromPortfolio = !dates?.awardDate && isWon(holding) && holding.date ? holding.date : null;

  useEffect(() => {
    if (!state.won) return;
    const current = parseHolding(window.localStorage.getItem(holdingKey(listingKey)) ?? "");
    writeHolding(listingKey, { status: "won", price: current.price, date: state.won.date });
  }, [state, listingKey]);

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 border-2 border-ink bg-paper-bright p-5">
      <input type="hidden" name="listingKey" value={listingKey} />
      <div>
        <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{labels.Title}</h2>
        <p className="mt-1 text-xs text-muted">{labels.Lead}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CLOSING_DATE_FIELDS[market].map((field) => {
          const text = labels.Fields[market][field];
          if (!text) return null;
          const value = dates?.[field] ?? (field === "awardDate" ? fromPortfolio : null);
          return (
            <ResultField key={`${field}-${value ?? ""}`} htmlFor={`closing-${field}`} label={text.label} hint={text.hint}>
              <input id={`closing-${field}`} name={field} type="date" required={field === "awardDate"} defaultValue={value ?? ""} className={CONTROL_CLASSES} />
            </ResultField>
          );
        })}
      </div>
      {fromPortfolio && <p className="font-mono text-[11px] text-signal">{labels.FromPortfolio}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className={`font-mono text-[11px] ${state.ok ? "text-verdict" : "text-signal"}`}>
          {!state.ok ? labels.Required : state.saved ? labels.Saved : ""}
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="h-10 cursor-pointer bg-ink px-5 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)] disabled:opacity-60"
        >
          {labels.Save}
        </button>
      </div>
    </form>
  );
}
