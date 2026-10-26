// Writes the Zuschlag price and date to localStorage as the bidder types
"use client";

import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { writeHolding } from "@/lib/portfolio/holdingStorage";
import { Holding } from "@/types/portfolio.types";

interface PortfolioPriceFieldsProps {
  listingKey: string;
  holding: Holding;
  labels: { price: string; date: string; hint: string };
  /** "€" / "₺" */
  currency: string;
}

/** Zuschlag price and date of a won object — typed from the ruling, never taken from the limit. */
export default function PortfolioPriceFields({ listingKey, holding, labels, currency }: PortfolioPriceFieldsProps) {
  const priceId = `preis-${listingKey}`;
  const dateId = `datum-${listingKey}`;
  return (
    <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label htmlFor={priceId} className="flex flex-col gap-1">
        <span className={LABEL_CLASSES}>{labels.price}</span>
        <span className="relative flex">
          <input
            id={priceId}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={holding.price ?? ""}
            onChange={(event) => writeHolding(listingKey, { ...holding, price: event.target.value === "" ? null : Math.max(0, Number(event.target.value)) || null })}
            className={`${CONTROL_CLASSES} h-8 pr-8 text-right`}
          />
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-2 flex items-center font-mono text-[11px] text-muted">
            {currency}
          </span>
        </span>
      </label>
      <label htmlFor={dateId} className="flex flex-col gap-1">
        <span className={LABEL_CLASSES}>{labels.date}</span>
        <input
          id={dateId}
          type="date"
          value={holding.date ?? ""}
          onChange={(event) => writeHolding(listingKey, { ...holding, date: event.target.value || null })}
          className={`${CONTROL_CLASSES} h-8 px-2`}
        />
      </label>
      <span className="text-[11px] sm:col-span-2 leading-snug text-muted">{labels.hint}</span>
    </div>
  );
}
