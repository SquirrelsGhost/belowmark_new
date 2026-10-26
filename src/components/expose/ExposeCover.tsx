import { ReactNode } from "react";
import { ExposePhoto } from "@/types/expose.types";

interface ExposeCoverProps {
  kicker: string;
  headline: string | null;
  headlineMissing: string;
  address: string;
  photo: ExposePhoto | null;
  noPhoto: string;
  /** Printed under the address with a red rule, e.g. that only a share is sold */
  notice?: string;
  /** Price block and key figures */
  children: ReactNode;
}

/** First page: the title photo, the seller's headline, where it is, and what it costs. */
export default function ExposeCover({ kicker, headline, headlineMissing, address, photo, noPhoto, notice, children }: ExposeCoverProps) {
  return (
    <header className="flex flex-col gap-4">
      <p className="font-mono text-[10px] tracking-[0.16em] text-signal uppercase">{kicker}</p>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- a data URL from this browser, nothing for next/image to optimise
        <img src={photo.dataUrl} alt={photo.caption} width={photo.width} height={photo.height} className="aspect-[3/2] w-full border border-ink object-cover" />
      ) : (
        <div className="flex aspect-[3/2] w-full items-center justify-center border border-dashed border-rule-strong bg-hatch p-8 text-center text-[13px] text-ink-soft">{noPhoto}</div>
      )}
      {photo?.caption && <p className="-mt-2 text-[11px] text-muted">{photo.caption}</p>}
      <div>
        {headline ? (
          <h1 className="font-display text-4xl leading-tight">{headline}</h1>
        ) : (
          <h1 className="w-fit bg-hatch px-2 font-mono text-sm text-muted">{headlineMissing}</h1>
        )}
        <p className="mt-1 text-sm text-ink-soft">{address}</p>
        {notice && <p className="mt-2 border-l-4 border-signal pl-2 text-[13px] font-semibold">{notice}</p>}
      </div>
      <div aria-hidden="true" className="h-1.5 bg-signal" />
      {children}
    </header>
  );
}
