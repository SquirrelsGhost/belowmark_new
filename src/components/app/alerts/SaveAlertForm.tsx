// Saves the current search through a Server Action and reports the result inline
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertActionState, createAlertAction } from "@/lib/alerts/alertActions";
import { ALERT_ROUTES, ALERTS } from "@/lib/alerts/alertConfig";
import { CONTROL_CLASSES, LABEL_CLASSES, TEXT_LINK_CLASSES } from "@/lib/appStyles";
import { IAlertsTranslation } from "@/translations/alerts/IAlertsTranslation";

interface SaveAlertFormProps {
  /** The filters to save, under the search's URL parameter names */
  params: Record<string, string>;
  defaultName: string;
  /** Region · type · value range, shown above the form */
  summary: string;
  labels: IAlertsTranslation["Save"];
}

const INITIAL_STATE: AlertActionState = { ok: true };

const SUBMIT_CLASSES =
  "h-10 cursor-pointer bg-ink px-4 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)] disabled:opacity-60";
const CHECKBOX_LABEL_CLASSES = "flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft";
const CHECKBOX_CLASSES = "size-4 cursor-pointer accent-ink";

/** "Suche als Alert speichern" — folded away until needed, so the results stay on top. */
export default function SaveAlertForm({ params, defaultName, summary, labels }: SaveAlertFormProps) {
  const [state, formAction, isPending] = useActionState(createAlertAction, INITIAL_STATE);

  return (
    <details className="group mb-4 border border-ink/70 bg-paper-bright open:shadow-[4px_4px_0_0_var(--ink)]">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 font-narrow text-xs font-semibold tracking-[0.1em] uppercase marker:content-none">
        <span aria-hidden="true" className="size-2.5 rounded-full border-2 border-signal group-open:bg-signal" />
        {labels.Toggle}
      </summary>
      {state.saved ? (
        <p role="status" className="border-t border-rule px-4 py-3 text-sm text-verdict">
          {labels.Saved}{" "}
          <Link href={ALERT_ROUTES.manage} className={`${TEXT_LINK_CLASSES} text-ink`}>
            {labels.Manage} →
          </Link>
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-3 border-t border-rule px-4 py-4">
          {Object.entries(params).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <p className="font-mono text-[11px] text-ink-soft">{summary}</p>
          <label className="flex flex-col gap-1">
            <span className={LABEL_CLASSES}>{labels.NameLabel}</span>
            <input name="name" required maxLength={ALERTS.nameMaxLength} defaultValue={defaultName} className={CONTROL_CLASSES} />
          </label>
          <label className={CHECKBOX_LABEL_CLASSES}>
            <input type="checkbox" name="notifyNew" value="1" defaultChecked className={CHECKBOX_CLASSES} />
            {labels.NotifyNew}
          </label>
          <label className={CHECKBOX_LABEL_CLASSES}>
            <input type="checkbox" name="notifyChanges" value="1" defaultChecked className={CHECKBOX_CLASSES} />
            {labels.NotifyChanges}
          </label>
          <p className="font-mono text-[10px] leading-relaxed text-muted">{labels.Hint}</p>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={isPending} className={SUBMIT_CLASSES}>
              {isPending ? labels.Pending : labels.Submit}
            </button>
            {!state.ok && state.error && (
              <p role="alert" className="font-mono text-[11px] text-signal">
                {labels.Errors[state.error]}
              </p>
            )}
          </div>
        </form>
      )}
    </details>
  );
}
