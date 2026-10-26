import { ReactNode } from "react";
import { LABEL_CLASSES } from "@/lib/appStyles";

interface FactRowProps {
  label: string;
  /** Missing values are shown as missing, with the reason — never filled in. */
  value: ReactNode | null;
  notStated: string;
  mono?: boolean;
}

/** One line of the fact sheet. */
export default function FactRow({ label, value, notStated, mono = false }: FactRowProps) {
  const isMissing = value === null || value === "";
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 py-2.5">
      <dt className={`${LABEL_CLASSES} pt-0.5`}>{label}</dt>
      <dd className={isMissing ? "bg-hatch px-1 font-mono text-[11px] text-muted" : mono ? "font-mono text-[13px]" : "text-sm"}>{isMissing ? notStated : value}</dd>
    </div>
  );
}
