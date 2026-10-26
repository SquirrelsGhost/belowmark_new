import { ReactNode } from "react";
import { LABEL_CLASSES } from "@/lib/appStyles";

interface VerdictReasonGroupProps {
  title: string;
  /** VerdictReasonItem items */
  children: ReactNode;
}

/** Reasons of one weight under a heading ("Warum nicht", "Bevor Sie bieten" …). */
export default function VerdictReasonGroup({ title, children }: VerdictReasonGroupProps) {
  return (
    <section aria-label={title}>
      <h3 className={LABEL_CLASSES}>{title}</h3>
      <ul className="mt-1 divide-y divide-rule border-t border-rule-strong">{children}</ul>
    </section>
  );
}
