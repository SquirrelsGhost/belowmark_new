import { ReactNode } from "react";

interface OrderIntroProps {
  eyebrow: string;
  title: string;
  lead: string;
  lineLabel: string;
  points?: string[];
  /** Notices under the line (payment cancelled, test mode) */
  notices?: ReactNode;
  /** <OrderProNote /> */
  children?: ReactNode;
}

/** Left half of the order page: headline above the market line, what to expect below it. */
export default function OrderIntro({ eyebrow, title, lead, lineLabel, points, notices, children }: OrderIntroProps) {
  return (
    <section className="flex flex-col lg:sticky lg:top-24 lg:col-span-6 xl:col-span-6">
      <p className="border-t border-rule-strong pt-3 font-mono text-xs tracking-wider text-muted uppercase">§ {eyebrow}</p>
      <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.25rem)] leading-[0.86] text-balance">{title}</h1>
      <div aria-hidden="true" className="relative mt-6 mb-5">
        <span className="block h-[3px] origin-left animate-draw bg-signal" />
        <span className="absolute -top-5 right-0 font-mono text-[10px] tracking-[0.18em] text-signal uppercase">{lineLabel}</span>
      </div>
      <p className="max-w-xl font-narrow text-2xl leading-tight font-semibold text-ink-soft text-balance">{lead}</p>
      {notices && <div className="mt-6 grid max-w-xl gap-3">{notices}</div>}
      {points?.length ? (
      <ol className="mt-8 max-w-md border-t border-rule">
        {points.map((point, index) => (
          <li key={point} className="flex items-baseline gap-4 border-b border-rule py-3 text-sm text-ink-soft">
            <span className="font-mono text-xs font-semibold text-signal">{String(index + 1).padStart(2, "0")}</span>
            {point}
          </li>
        ))}
      </ol>
      ) : null}
      {children}
    </section>
  );
}
