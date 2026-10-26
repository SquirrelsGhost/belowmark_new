// Holds the half-typed entry in state until it has a value, a source and a date
"use client";

import { FormEvent, useState } from "react";
import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { COMPARABLE_SOURCE_MAX } from "@/lib/bidding/biddingConstants";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { OwnComparable } from "@/types/bidding.types";

interface OwnComparableFormProps {
  labels: IBiddingTranslation["Comparables"]["Own"];
  onAdd: (item: OwnComparable) => void;
}

const KINDS: OwnComparable["kind"][] = ["landValue", "salePrice", "rent", "other"];
const UNITS: OwnComparable["unit"][] = ["perM2", "perMonthPerM2", "total"];

/** Adds a comparison value — only with a source and a date, so nothing unsourced lands in the file. */
export default function OwnComparableForm({ labels, onAdd }: OwnComparableFormProps) {
  const [kind, setKind] = useState<OwnComparable["kind"]>("landValue");
  const [unit, setUnit] = useState<OwnComparable["unit"]>("perM2");
  const [value, setValue] = useState("");
  const [source, setSource] = useState("");
  const [asOf, setAsOf] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(value);
    if (!value || !Number.isFinite(amount) || amount <= 0 || !source.trim() || !asOf) {
      setIsInvalid(true);
      return;
    }
    onAdd({ id: `${Date.now()}`, kind, unit, value: amount, source: source.trim(), asOf });
    setValue("");
    setSource("");
    setIsInvalid(false);
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-end">
      <label className="flex flex-col gap-1">
        <span className={LABEL_CLASSES}>{labels.Kind}</span>
        <select className={CONTROL_CLASSES} value={kind} onChange={(event) => setKind(event.target.value as OwnComparable["kind"])}>
          {KINDS.map((option) => <option key={option} value={option}>{labels.Kinds[option]}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className={LABEL_CLASSES}>{labels.Value}</span>
        <input className={CONTROL_CLASSES} type="number" inputMode="decimal" min={0} step="any" value={value} onChange={(event) => setValue(event.target.value)} />
      </label>
      <label className="flex flex-col gap-1">
        <span className={LABEL_CLASSES}>{labels.Unit}</span>
        <select className={CONTROL_CLASSES} value={unit} onChange={(event) => setUnit(event.target.value as OwnComparable["unit"])}>
          {UNITS.map((option) => <option key={option} value={option}>{labels.Units[option]}</option>)}
        </select>
      </label>
      <label className="col-span-2 flex flex-col gap-1 sm:col-span-1">
        <span className={LABEL_CLASSES}>{labels.Source}</span>
        <input className={CONTROL_CLASSES} maxLength={COMPARABLE_SOURCE_MAX} placeholder={labels.SourcePlaceholder} value={source} onChange={(event) => setSource(event.target.value)} />
      </label>
      <label className="flex flex-col gap-1">
        <span className={LABEL_CLASSES}>{labels.AsOf}</span>
        <input className={CONTROL_CLASSES} type="date" value={asOf} onChange={(event) => setAsOf(event.target.value)} />
      </label>
      <button type="submit" className="h-10 cursor-pointer bg-ink px-4 font-narrow text-xs font-semibold tracking-[0.08em] text-paper-bright uppercase hover:bg-ink-soft">
        {labels.Add}
      </button>
      {isInvalid && <p role="alert" className="col-span-full text-sm text-signal">{labels.Invalid}</p>}
    </form>
  );
}
