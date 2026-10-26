import BidderFileButton from "@/components/app/bidding/BidderFileButton";
import { bankFileHref } from "@/lib/bankFile/bankFileConstants";
import { MarketCode } from "@/lib/constants";
import { IBankFileTranslation } from "@/translations/bankFile/IBankFileTranslation";

interface BankFileTeaserProps {
  listingKey: string;
  market: MarketCode;
  labels: IBankFileTranslation["Teaser"];
  isLocked: boolean;
}

/** The financing block of the Aktenblatt: why the timing matters, and the way into the bank file. */
export default function BankFileTeaser({ listingKey, market, labels, isLocked }: BankFileTeaserProps) {
  if (isLocked) return null;
  return (
    <section aria-label={labels.Title} className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-ink pt-6">
      <div>
        <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{labels.Eyebrow}</p>
        <h2 className="font-display text-3xl sm:text-4xl">{labels.Title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{labels.Lead[market]}</p>
      </div>
      <BidderFileButton href={bankFileHref(listingKey)} label={labels.Button} hint={labels.ButtonHint} />
    </section>
  );
}
