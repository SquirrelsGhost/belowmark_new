import BrandMark from "@/components/brand/BrandMark";

interface BidderFileHeaderProps {
  kicker: string;
  title: string;
  fileNo: string;
  object: string;
  subtitle: string;
  printedAt: string;
  dataAsOf: string;
}

/** Letterhead of the file: brand, file number as the loudest fact, object, dates. */
export default function BidderFileHeader({ kicker, title, fileNo, object, subtitle, printedAt, dataAsOf }: BidderFileHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <BrandMark alwaysWordmark />
        <div className="text-right font-mono text-[10px] leading-relaxed text-muted">
          <p>{printedAt}</p>
          <p>{dataAsOf}</p>
        </div>
      </div>
      <p className="font-mono text-[10px] tracking-[0.16em] text-signal uppercase">{kicker}</p>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6">
        <h1 className="font-display text-5xl leading-none">{title}</h1>
        <p className="font-mono text-2xl font-semibold">{fileNo}</p>
      </div>
      <div aria-hidden="true" className="h-1.5 bg-signal" />
      <div>
        <p className="font-display text-2xl leading-tight">{object}</p>
        <p className="text-sm text-ink-soft">{subtitle}</p>
      </div>
    </header>
  );
}
