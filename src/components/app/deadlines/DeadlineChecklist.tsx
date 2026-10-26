// Ticks are kept in localStorage and read through useSyncExternalStore
"use client";

import { useSyncExternalStore } from "react";
import { DEADLINE_CHECKLIST_PREFIX } from "@/lib/deadlines/deadlineConstants";
import { DeadlineChecklistStep } from "@/types/deadline.types";

interface DeadlineChecklistProps {
  listingKey: string;
  title: string;
  hint: string;
  /** "{done} von {total} erledigt" */
  progressTemplate: string;
  autoLabel: string;
  steps: DeadlineChecklistStep[];
}

const CHANGE_EVENT = "belowmark:fahrplan";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function read(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

/** The way to the hearing, step by step, each step linked to the belowmark tool that does it. */
export default function DeadlineChecklist({ listingKey, title, hint, progressTemplate, autoLabel, steps }: DeadlineChecklistProps) {
  const storageKey = `${DEADLINE_CHECKLIST_PREFIX}${listingKey}`;
  const raw = useSyncExternalStore(subscribe, () => read(storageKey), () => "");
  const ticked = new Set(raw.split(",").filter(Boolean));
  const isDone = (step: DeadlineChecklistStep) => step.autoDone || ticked.has(step.id);
  const done = steps.filter(isDone).length;

  const toggle = (id: string) => {
    const next = new Set(ticked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    try {
      window.localStorage.setItem(storageKey, [...next].join(","));
    } catch {
      // Private mode: ticks simply are not kept.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <section aria-label={title} className="border border-ink bg-paper-bright p-4 shadow-[4px_4px_0_0_var(--ink)]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h3>
        <span className="font-mono text-[11px] text-muted">{progressTemplate.replace("{done}", String(done)).replace("{total}", String(steps.length))}</span>
      </div>
      <div aria-hidden="true" className="mt-2 h-1 bg-rule">
        {/* Width follows the share of done steps — a dynamic value, so inline style */}
        <div className="h-full bg-verdict transition-[width] duration-300" style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
      <ol className="mt-3 flex flex-col divide-y divide-rule">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-start gap-3 py-2.5">
            <input
              type="checkbox"
              aria-label={step.label}
              checked={isDone(step)}
              disabled={step.autoDone}
              onChange={() => toggle(step.id)}
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-ink disabled:cursor-default"
            />
            <div className="min-w-0">
              <p className={`text-sm leading-snug font-semibold ${isDone(step) ? "text-muted line-through" : "text-ink"}`}>
                <span className="mr-1.5 font-mono text-[11px] text-muted">{String(index + 1).padStart(2, "0")}</span>
                {step.href ? (
                  <a href={step.href} className="underline-offset-4 hover:underline">
                    {step.label}
                  </a>
                ) : (
                  step.label
                )}
                {step.autoDone && <span className="ml-2 font-mono text-[10px] tracking-[0.12em] text-verdict uppercase no-underline">{autoLabel}</span>}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-ink-soft">{step.hint}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-2 font-mono text-[10px] text-muted">{hint}</p>
    </section>
  );
}
