// Ticks are kept in localStorage and read through useSyncExternalStore
"use client";

import { useSyncExternalStore } from "react";
import { CHECKLIST_STORAGE_PREFIX } from "@/lib/appConstants";

interface PreBidChecklistProps {
  listingId: string;
  title: string;
  hint: string;
  /** "{done} von {total} erledigt" */
  progressTemplate: string;
  items: string[];
}

const CHANGE_EVENT = "belowmark:checklist";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readTicks(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

/** The things to do before bidding, ticked off per proceeding. */
export default function PreBidChecklist({ listingId, title, hint, progressTemplate, items }: PreBidChecklistProps) {
  const storageKey = `${CHECKLIST_STORAGE_PREFIX}${listingId}`;
  const raw = useSyncExternalStore(subscribe, () => readTicks(storageKey), () => "");
  const ticked = new Set(raw.split(",").filter(Boolean).map(Number));

  const toggle = (index: number) => {
    const next = new Set(ticked);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    try {
      window.localStorage.setItem(storageKey, [...next].join(","));
    } catch {
      // Private mode: ticks simply are not kept.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const progress = progressTemplate.replace("{done}", String(ticked.size)).replace("{total}", String(items.length));

  return (
    <section aria-label={title} className="border border-ink/70 bg-paper-bright p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">{title}</h2>
        <span className="font-mono text-[11px] text-muted">{progress}</span>
      </div>
      <div aria-hidden="true" className="mt-2 h-1 bg-rule">
        {/* Width follows the share of ticked items — a dynamic value, so inline style */}
        <div className="h-full bg-verdict transition-[width] duration-300" style={{ width: `${(ticked.size / items.length) * 100}%` }} />
      </div>
      <ul className="mt-3 flex flex-col">
        {items.map((item, index) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-3 py-1.5 text-sm leading-snug">
              <input type="checkbox" checked={ticked.has(index)} onChange={() => toggle(index)} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-ink" />
              <span className={ticked.has(index) ? "text-muted line-through" : "text-ink"}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[10px] text-muted">{hint}</p>
    </section>
  );
}
