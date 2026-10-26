import TrCheckKit from "@/components/app/tr/TrCheckKit";
import TrEuroEquivalent from "@/components/app/tr/TrEuroEquivalent";
import TrValueAge from "@/components/app/tr/TrValueAge";
import { LocaleOption } from "@/lib/constants";
import { checkKitFields } from "@/lib/tr/trLinks";
import { TranslationService } from "@/services/TranslationService";
import { TrIndicatorService } from "@/services/TrIndicatorService";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { TrMarketTranslations } from "@/translations/trMarket/TrMarketTranslations";
import { Listing } from "@/types/listing.types";

interface TrListingExtrasProps {
  listing: Listing;
  app: IAppTranslation;
  locale: LocaleOption;
  now: number;
  isLocked: boolean;
}

/**
 * The Turkish proceeding next to official reference figures: how old the
 * appraised value is in today's lira (TÜFE), what it is in euro (TCMB rate),
 * and the check kit for e-Satış.
 */
export default async function TrListingExtras({ listing, app, locale, now, isLocked }: TrListingExtrasProps) {
  const [labels, indicators] = await Promise.all([TranslationService.GetUserLocale().then((userLocale) => TrMarketTranslations[userLocale]), TrIndicatorService.get(now)]);
  const L = app.Listing;
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <TrValueAge
        value={listing.appraisedValue}
        fileYear={listing.fileYear}
        tufe={indicators.tufe}
        labels={labels.Age}
        notStated={L.NotStated}
        locale={locale}
        isLocked={isLocked}
        lockedLabel={app.Row.Locked}
      />
      <TrEuroEquivalent
        value={listing.appraisedValue}
        vatRate={listing.tr?.vatRate ?? null}
        rate={indicators.euro}
        lastRateDate={indicators.euroDate}
        labels={labels.Euro}
        notStated={L.NotStated}
        vatUnknown={L.Tr.VatUnknown}
        locale={locale}
        isLocked={isLocked}
        lockedLabel={app.Row.Locked}
      />
      <TrCheckKit fields={checkKitFields(listing)} labels={labels.CheckKit} />
    </div>
  );
}
