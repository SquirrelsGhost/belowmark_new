import BrandMark from "@/components/brand/BrandMark";
import { BrokerBrandView } from "@/types/clientShare.types";

interface ClientShareLetterheadProps {
  brand: BrokerBrandView | null;
  /** Dates on the right: assessed, data as of, valid until */
  dates: string[];
}

/** The broker's letterhead — logo, name, contact — or the belowmark mark when none is set up. */
export default function ClientShareLetterhead({ brand, dates }: ClientShareLetterheadProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between print:flex-row print:items-start print:justify-between">
      {brand ? (
        <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          {brand.logoSrc && (
            // A data: URL from the database — next/image cannot optimise it and does not need to
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoSrc} alt={brand.displayName} className="h-14 max-w-[55mm] object-contain object-left" />
          )}
          <div className="flex min-w-0 flex-col break-words">
            <p className="font-display text-2xl leading-tight">{brand.displayName}</p>
            {brand.contactLine && <p className="text-[12px] text-ink-soft">{brand.contactLine}</p>}
            {brand.website && (
              <a href={brand.website} rel="noopener noreferrer" className="font-mono text-[11px] break-all text-ink-soft underline-offset-2 hover:underline">
                {brand.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
          </div>
        </div>
      ) : (
        <BrandMark alwaysWordmark />
      )}
      <div className="font-mono text-[10px] leading-relaxed text-muted sm:text-right print:text-right">
        {dates.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}
