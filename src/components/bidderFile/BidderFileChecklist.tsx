// Reads the ticks of the pre-bid checklist from localStorage (same key as the Aktenblatt)
"use client";

import { useStoredText } from "@/hooks/useStoredText";
import { CHECKLIST_STORAGE_PREFIX } from "@/lib/appConstants";

interface BidderFileChecklistProps {
  listingId: string;
  items: string[];
  doneLabel: string;
  openLabel: string;
}

/** The checklist on paper: ticked items marked done, the rest as open boxes to tick by hand. */
export default function BidderFileChecklist({ listingId, items, doneLabel, openLabel }: BidderFileChecklistProps) {
  const [raw] = useStoredText(`${CHECKLIST_STORAGE_PREFIX}${listingId}`);
  const ticked = new Set(raw.split(",").filter(Boolean).map(Number));
  return (
    <ul className="flex flex-col">
      {items.map((item, index) => {
        const isDone = ticked.has(index);
        return (
          <li key={item} className="flex items-start gap-3 border-b border-rule py-1.5 text-[13px] leading-snug">
            <span aria-hidden="true" className={`mt-0.5 flex size-4 shrink-0 items-center justify-center border border-ink font-mono text-[11px] ${isDone ? "bg-ink text-paper-bright" : ""}`}>
              {isDone ? "✓" : ""}
            </span>
            <span className="flex-1">{item}</span>
            <span className={`font-mono text-[10px] uppercase ${isDone ? "text-verdict" : "text-muted"}`}>{isDone ? doneLabel : openLabel}</span>
          </li>
        );
      })}
    </ul>
  );
}
