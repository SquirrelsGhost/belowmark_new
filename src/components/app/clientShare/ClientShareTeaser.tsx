import Link from "next/link";
import ClientShareForm from "@/components/app/clientShare/ClientShareForm";
import { TEXT_LINK_CLASSES } from "@/lib/appStyles";
import { BILLING_ROUTES, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { CLIENT_SHARE_ROUTES } from "@/lib/clientShare/clientShareConfig";
import { LocaleOption } from "@/lib/constants";
import { IClientShareTranslation } from "@/translations/clientShare/IClientShareTranslation";

interface ClientShareTeaserProps {
  listingKey: string;
  locale: LocaleOption;
  isPro: boolean;
  hasBrand: boolean;
  labels: IClientShareTranslation;
}

/** The client-link block of the Aktenblatt: the form for Pro, one honest line about Pro for everyone else. */
export default function ClientShareTeaser({ listingKey, locale, isPro, hasBrand, labels }: ClientShareTeaserProps) {
  const { Teaser } = labels;
  return (
    <section aria-label={Teaser.Title} className="mt-10 flex flex-col gap-4 border-t border-ink pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-signal uppercase">{Teaser.Eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl">{Teaser.Title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{isPro ? Teaser.Lead : Teaser.ProOnly}</p>
        </div>
        {isPro ? (
          <Link href={CLIENT_SHARE_ROUTES.manage} className={TEXT_LINK_CLASSES}>
            {Teaser.Manage} →
          </Link>
        ) : (
          <Link href={`${BILLING_ROUTES.order}?${OFFER_PARAM}=pro-monat`} className={TEXT_LINK_CLASSES}>
            {Teaser.ProCta} →
          </Link>
        )}
      </div>
      {isPro && !hasBrand && (
        <p className="border-l-4 border-caution bg-caution/10 px-3 py-2 text-sm text-ink-soft">
          {Teaser.NoBrand}{" "}
          <Link href={CLIENT_SHARE_ROUTES.manage} className="font-semibold underline underline-offset-2">
            {Teaser.NoBrandCta}
          </Link>
        </p>
      )}
      {isPro && <ClientShareForm listingKey={listingKey} defaultLocale={locale} labels={labels} />}
    </section>
  );
}
