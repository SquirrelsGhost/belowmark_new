import BidderFileButton from "@/components/app/bidding/BidderFileButton";
import { exposeHref } from "@/lib/expose/exposeConstants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";

interface ExposeTeaserProps {
  listingKey: string;
  labels: IExposeTranslation["Teaser"];
  isLocked: boolean;
}

/** The resale block of the Aktenblatt: what the exposé takes over, and the way into it. */
export default function ExposeTeaser({ listingKey, labels, isLocked }: ExposeTeaserProps) {
  if (isLocked) return null;
  return (
    <section aria-label={labels.Title} className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-ink pt-6">
      <div>
        <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{labels.Eyebrow}</p>
        <h2 className="font-display text-3xl sm:text-4xl">{labels.Title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{labels.Lead}</p>
      </div>
      <BidderFileButton href={exposeHref(listingKey)} label={labels.Button} hint={labels.ButtonHint} />
    </section>
  );
}
