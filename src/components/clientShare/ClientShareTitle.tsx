interface ClientShareTitleProps {
  kicker: string;
  title: string;
  fileNo: string;
  object: string;
  subtitle: string;
}

/** Title block under the letterhead: file number as the loudest fact, the accent line, the object. */
export default function ClientShareTitle({ kicker, title, fileNo, object, subtitle }: ClientShareTitleProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[10px] tracking-[0.16em] text-(--brand-accent) uppercase">{kicker}</p>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6">
        <h1 className="font-display text-4xl leading-none sm:text-5xl">{title}</h1>
        <p className="font-mono text-xl font-semibold sm:text-2xl">{fileNo}</p>
      </div>
      <div aria-hidden="true" className="h-1.5 bg-(--brand-accent)" />
      <div>
        <p className="font-display text-2xl leading-tight">{object}</p>
        <p className="text-sm text-ink-soft">{subtitle}</p>
      </div>
    </div>
  );
}
