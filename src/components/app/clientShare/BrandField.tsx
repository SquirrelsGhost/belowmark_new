import { ReactNode } from "react";
import { LABEL_CLASSES } from "@/lib/appStyles";

interface BrandFieldProps {
  label: string;
  hint?: string;
  /** The input */
  children: ReactNode;
}

/** Label, control and an optional hint underneath. */
export default function BrandField({ label, hint, children }: BrandFieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className={LABEL_CLASSES}>{label}</span>
      {children}
      {hint && <span className="text-[11px] leading-snug text-muted">{hint}</span>}
    </label>
  );
}
