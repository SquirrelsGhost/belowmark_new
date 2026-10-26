interface LegalPageHeaderProps {
  title: string;
  asOf: string;
  basis: string;
  lineLabel: string;
}

/** Title above the red market line, version and legal basis below it. */
export default function LegalPageHeader({ title, asOf, basis, lineLabel }: LegalPageHeaderProps) {
  return (
    <header>
      <p className="border-t border-rule-strong pt-3 font-mono text-xs tracking-wider text-muted uppercase">§ {asOf}</p>
      <h1 className="mt-6 font-display text-[clamp(2.4rem,6.5vw,4.75rem)] leading-[0.9] text-balance hyphens-auto">{title}</h1>
      <div aria-hidden="true" className="relative mt-6 mb-5">
        <span className="block h-[3px] origin-left animate-draw bg-signal" />
        <span className="absolute -top-5 right-0 font-mono text-[10px] tracking-[0.18em] text-signal uppercase">{lineLabel}</span>
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-muted">{basis}</p>
    </header>
  );
}
