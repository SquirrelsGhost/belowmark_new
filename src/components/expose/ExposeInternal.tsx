// Reads the hearing result the portfolio feature keeps in localStorage
"use client";

import { useExpose } from "@/hooks/useExpose";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { speculationEnd } from "@/lib/expose/exposeChecks";
import { formatDate } from "@/lib/format";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeBase } from "@/types/expose.types";

interface ExposeInternalProps {
  base: ExposeBase;
  locale: LocaleOption;
  labels: IExposeTranslation["Internal"];
}

/** Screen-only: the seller's own purchase next to the asking price, and the tax period. Never printed. */
export default function ExposeInternal({ base, locale, labels }: ExposeInternalProps) {
  const { inputs, holding } = useExpose(base.listingKey);
  const money = (amount: number) => formatMoney(amount, base.market, locale);
  const end = speculationEnd(holding, base.market);
  const lines: string[] = [];
  if (!holding) lines.push(labels.NoHolding);
  else if (holding.status !== "won") lines.push(labels.NotWon);
  else {
    if (holding.price !== null) lines.push(fill(labels.Won, { price: money(holding.price), date: holding.date ? formatDate(holding.date, locale) : "—" }));
    if (holding.price !== null && inputs.askingPrice) lines.push(fill(labels.Gap, { amount: money(inputs.askingPrice - holding.price) }));
    lines.push(end ? fill(labels.Speculation[base.market], { date: formatDate(end, locale) }) : labels.NoDate);
  }
  return (
    <section aria-label={labels.Title} className="flex flex-col gap-2 border border-dashed border-ink bg-paper p-4">
      <h2 className="font-narrow text-xs font-bold tracking-[0.14em] uppercase">{labels.Title}</h2>
      <p className="text-[11px] text-muted">{labels.Lead}</p>
      <ul className="flex flex-col gap-1 text-[13px] leading-snug">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
