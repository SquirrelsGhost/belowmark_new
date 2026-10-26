import { ReactNode } from "react";

interface DevQuickLoginProps {
  label: string;
  title: string;
  note: string;
  /** <DevQuickLoginButton /> elements */
  children: ReactNode;
}

/**
 * Development-only strip under the sign-in form, hatched and dashed so it
 * can never be mistaken for part of the real product.
 */
export default function DevQuickLogin({ label, title, note, children }: DevQuickLoginProps) {
  return (
    <aside aria-label={title} className="mt-8 border-2 border-dashed border-caution bg-hatch p-4 sm:p-5">
      <p className="flex items-baseline justify-between gap-3 font-mono text-[11px] tracking-[0.14em] uppercase">
        <span className="font-semibold text-ink">{title}</span>
        <span className="text-caution">{label}</span>
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{note}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">{children}</div>
    </aside>
  );
}
