interface AccountHeaderProps {
  eyebrow: string;
  title: string;
  email: string;
  lineLabel: string;
  /** Confirmation after verify / reset / change, if any */
  notice?: string;
  note: string;
}

/** Account page headline: the address above the line, the outcome below it. */
export default function AccountHeader({ eyebrow, title, email, lineLabel, notice, note }: AccountHeaderProps) {
  return (
    <section className="flex flex-col lg:col-span-5">
      <p className="border-t border-rule-strong pt-3 font-mono text-xs tracking-wider text-muted uppercase">§ {eyebrow}</p>
      <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.86]">{title}</h1>
      <p className="mt-3 font-mono text-base break-all text-ink-soft">{email}</p>
      <div aria-hidden="true" className="relative mt-6 mb-5">
        <span className="block h-[3px] origin-left animate-draw bg-signal" />
        <span className="absolute -top-5 right-0 font-mono text-[10px] tracking-[0.18em] text-signal uppercase">{lineLabel}</span>
      </div>
      {notice && (
        <p role="status" className="border-l-4 border-verdict bg-verdict/[0.08] px-4 py-3 text-sm leading-relaxed text-ink">
          {notice}
        </p>
      )}
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">{note}</p>
    </section>
  );
}
