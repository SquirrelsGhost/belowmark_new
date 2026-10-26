// Two linked inputs: typing lira updates euro and the other way round
"use client";

import { useState } from "react";
import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { LocaleOption } from "@/lib/constants";

interface TrCurrencyConverterProps {
  title: string;
  subtitle: string;
  liraLabel: string;
  euroLabel: string;
  /** Lira per euro (TCMB forex buying rate) */
  rate: number;
  /** "1 € = … · TCMB … vom …" */
  rateLine: string;
  locale: LocaleOption;
  initialLira: number;
}

const INTL_LOCALES: Record<LocaleOption, string> = { de: "de-DE", tr: "tr-TR" };

/** Accepts "2.500.000", "2 500 000" or "2500000,50" — digits and one decimal comma. */
function parseAmount(text: string): number | null {
  const cleaned = text.replace(/[^\d,]/g, "").replace(",", ".");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/** Lira ↔ euro at the central bank's rate of the day. */
export default function TrCurrencyConverter({ title, subtitle, liraLabel, euroLabel, rate, rateLine, locale, initialLira }: TrCurrencyConverterProps) {
  const number = new Intl.NumberFormat(INTL_LOCALES[locale], { maximumFractionDigits: 2 });
  const [lira, setLira] = useState(number.format(initialLira));
  const [euro, setEuro] = useState(number.format(initialLira / rate));

  const onLira = (text: string) => {
    setLira(text);
    const value = parseAmount(text);
    setEuro(value === null ? "" : number.format(value / rate));
  };
  const onEuro = (text: string) => {
    setEuro(text);
    const value = parseAmount(text);
    setLira(value === null ? "" : number.format(value * rate));
  };

  return (
    <section aria-label={title} className="border-2 border-ink bg-paper-bright shadow-[8px_8px_0_0_var(--ink)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 bg-ink px-4 py-2.5 text-paper-bright">
        <h2 className="font-display text-xl tracking-wide">{title}</h2>
        <span className="font-mono text-[10px] tracking-wider text-paper/60 uppercase">{subtitle}</span>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASSES}>{liraLabel} · ₺</span>
          <input inputMode="decimal" value={lira} onChange={(event) => onLira(event.target.value)} className={`${CONTROL_CLASSES} h-12 text-lg`} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASSES}>{euroLabel} · €</span>
          <input inputMode="decimal" value={euro} onChange={(event) => onEuro(event.target.value)} className={`${CONTROL_CLASSES} h-12 text-lg`} />
        </label>
      </div>
      <p className="border-t border-rule px-4 py-3 font-mono text-[11px] leading-relaxed text-muted">{rateLine}</p>
    </section>
  );
}
