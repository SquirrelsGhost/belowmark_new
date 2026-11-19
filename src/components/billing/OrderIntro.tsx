import { ReactNode } from "react";

interface OrderIntroProps {
  eyebrow: string;
  title: string;
  lead: string;
  lineLabel: string;
  points?: string[];
  /** Pairs with <AuthCard wide /> so both columns fit cleanly on lg/xl screens */
  compact?: boolean;
  /** Notices under the line (payment cancelled, test mode) */
  notices?: ReactNode;
  /** <OrderProNote /> */
  children?: ReactNode;
}

/** Left half of the order page: headline above the market line, what to expect below it. */
export default function OrderIntro({ eyebrow, title, lead, lineLabel, points, compact = false, notices, children }: OrderIntroProps) {
  const colSpan = compact
    ? "flex min-w-0 flex-col lg:sticky lg:top-24 lg:col-span-5 xl:col-span-5"
    : "flex min-w-0 flex-col lg:sticky lg:top-24 lg:col-span-6 xl:col-span-6";

  return (
    <section className={colSpan}>
      <p className="border-t border-rule-strong pt-3 font-mono text-xs tracking-wider text-muted uppercase">§ {eyebrow}</p>
      <h1 className="mt-5 font-display text-[clamp(2.35rem,6.5vw,4.75rem)] leading-[0.88] text-balance wrap-break-word sm:mt-6">{title}</h1>
      <div aria-hidden="true" className="relative mt-6 mb-5">
        <span className="block h-[3px] origin-left animate-draw bg-signal" />
        <span className="absolute -top-5 right-0 font-mono text-[10px] tracking-[0.18em] text-signal uppercase">{lineLabel}</span>
      </div>
      <p className="max-w-xl font-narrow text-xl leading-tight font-semibold text-ink-soft text-balance sm:text-2xl">{lead}</p>
      {notices && <div className="mt-6 grid max-w-xl min-w-0 gap-3">{notices}</div>}
      {points?.length ? (
        <ol className="mt-7 max-w-md border-t border-rule sm:mt-8">
          {points.map((point, index) => (
            <li key={point} className="flex items-baseline gap-3.5 border-b border-rule py-3 text-sm text-ink-soft sm:gap-4">
              <span className="shrink-0 font-mono text-xs font-semibold text-signal">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 wrap-break-word">{point}</span>
            </li>
          ))}
        </ol>
      ) : null}
      {children}
    </section>
  );
}
