import { ReactNode } from "react";
import Redacted from "@/components/ui/Redacted";

interface ValueLineProps {
  label: string;
  /** Formatted value; null when the notice gives none */
  value: string | null;
  basis: string;
  notStated: string;
  isLocked: boolean;
  lockedLabel: string;
  /** Figures below the line */
  children?: ReactNode;
}

/**
 * The brand idea as layout: the appraised value sits on the red market line,
 * everything you actually pay sits below it.
 */
export default function ValueLine({ label, value, basis, notStated, isLocked, lockedLabel, children }: ValueLineProps) {
  return (
    <section aria-label={label} className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 pb-2">
        <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{label}</p>
        <p className="font-mono text-[11px] text-muted">{basis}</p>
      </div>
      <p className="font-display text-6xl leading-none sm:text-8xl">
        {isLocked ? <Redacted label={lockedLabel} width="lg" /> : (value ?? <span className="text-3xl text-muted normal-case">{notStated}</span>)}
      </p>
      <div aria-hidden="true" className="mt-3 h-1.5 origin-left animate-draw bg-signal" />
      {children && <div className="grid gap-px bg-rule sm:grid-cols-2 xl:grid-cols-4">{children}</div>}
    </section>
  );
}
