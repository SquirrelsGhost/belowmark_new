import { ReactNode } from "react";
import { LABEL_CLASSES } from "@/lib/appStyles";

interface ResultFieldProps {
  htmlFor: string;
  label: string;
  hint?: string;
  children: ReactNode;
}

/** Label, control and a one-line hint — the field frame of the closing forms. */
export default function ResultField({ htmlFor, label, hint, children }: ResultFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className={LABEL_CLASSES}>
        {label}
      </label>
      {children}
      {hint && <span className="text-[11px] leading-snug text-muted">{hint}</span>}
    </div>
  );
}
