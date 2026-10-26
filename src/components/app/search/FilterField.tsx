import { ReactNode } from "react";
import { LABEL_CLASSES } from "@/lib/appStyles";

interface FilterFieldProps {
  label: string;
  /** id of the control the label points to; omit for groups (fieldset) */
  htmlFor?: string;
  children: ReactNode;
}

/** Label above a filter control — or a fieldset legend for grouped controls. */
export default function FilterField({ label, htmlFor, children }: FilterFieldProps) {
  if (!htmlFor) {
    return (
      <fieldset className="flex flex-col gap-1.5">
        <legend className={`${LABEL_CLASSES} mb-1.5`}>{label}</legend>
        {children}
      </fieldset>
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className={LABEL_CLASSES}>
        {label}
      </label>
      {children}
    </div>
  );
}
