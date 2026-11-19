import { ReactNode } from "react";

interface AuthCardProps {
  /** Small caps label in the card's header strip, e.g. "Antrag auf Zugang" */
  label: string;
  /** "Formular BM-02" */
  formNumber: string;
  title: string;
  description?: string;
  /** Wider 6/7-column sheet for multi-column checkout & tariff grids (/buchen) */
  wide?: boolean;
  /** Form or notice */
  children: ReactNode;
  /** Tear-off strip below the perforation, e.g. "No account yet? …" */
  footer?: ReactNode;
}

const PUNCH_HOLE = "absolute top-0 size-4 -translate-y-1/2 rounded-full border-2 border-ink bg-paper";

/** The form itself, printed like an official slip with a perforated tear-off. */
export default function AuthCard({ label, formNumber, title, description, wide = false, children, footer }: AuthCardProps) {
  const colSpan = wide
    ? "min-w-0 w-full lg:col-span-7 xl:col-span-6 xl:col-start-7"
    : "min-w-0 w-full lg:col-span-6 xl:col-span-5 xl:col-start-8";

  return (
    <section aria-labelledby="auth-card-title" className={colSpan}>
      <div className="relative min-w-0 max-w-full border-2 border-ink bg-paper-bright shadow-[5px_5px_0_0_var(--ink)] sm:shadow-[8px_8px_0_0_var(--ink)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase sm:px-7">
          <span className="min-w-0 truncate font-semibold">{label}</span>
          <span className="shrink-0 text-muted">{formNumber}</span>
        </div>
        <div className="min-w-0 px-4 pt-6 pb-7 sm:px-7 sm:pt-8 sm:pb-9">
          <h2 id="auth-card-title" className="font-display text-[clamp(2rem,6vw,2.6rem)] leading-[0.92] wrap-break-word">
            {title}
          </h2>
          {description && <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}
          <div className="mt-6 min-w-0 sm:mt-7">{children}</div>
        </div>
        {footer && (
          <div className="relative border-t-2 border-dashed border-ink/40 px-4 py-4 text-sm sm:px-7">
            <span aria-hidden="true" className={`${PUNCH_HOLE} -left-[9px]`} />
            <span aria-hidden="true" className={`${PUNCH_HOLE} -right-[9px]`} />
            {footer}
          </div>
        )}
      </div>
    </section>
  );
}
