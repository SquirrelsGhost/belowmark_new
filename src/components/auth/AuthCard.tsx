import { ReactNode } from "react";

interface AuthCardProps {
  /** Small caps label in the card's header strip, e.g. "Antrag auf Zugang" */
  label: string;
  /** "Formular BM-02" */
  formNumber: string;
  title: string;
  description?: string;
  /** Form or notice */
  children: ReactNode;
  /** Tear-off strip below the perforation, e.g. "No account yet? …" */
  footer?: ReactNode;
}

const PUNCH_HOLE = "absolute top-0 size-4 -translate-y-1/2 rounded-full border-2 border-ink bg-paper";

/** The form itself, printed like an official slip with a perforated tear-off. */
export default function AuthCard({ label, formNumber, title, description, children, footer }: AuthCardProps) {
  return (
    <section aria-labelledby="auth-card-title" className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
      <div className="relative border-2 border-ink bg-paper-bright shadow-[8px_8px_0_0_var(--ink)]">
        <div className="flex items-center justify-between gap-3 border-b border-ink px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase sm:px-8">
          <span className="font-semibold">{label}</span>
          <span className="text-muted">{formNumber}</span>
        </div>
        <div className="px-5 pt-7 pb-8 sm:px-8 sm:pt-8 sm:pb-9">
          <h2 id="auth-card-title" className="font-display text-[2.6rem] leading-[0.9]">{title}</h2>
          {description && <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}
          <div className="mt-7">{children}</div>
        </div>
        {footer && (
          <div className="relative border-t-2 border-dashed border-ink/40 px-5 py-4 text-sm sm:px-8">
            <span aria-hidden="true" className={`${PUNCH_HOLE} -left-[9px]`} />
            <span aria-hidden="true" className={`${PUNCH_HOLE} -right-[9px]`} />
            {footer}
          </div>
        )}
      </div>
    </section>
  );
}
