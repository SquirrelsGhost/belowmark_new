import { Metadata } from "next";
import BidderFileSheet from "@/components/bidderFile/BidderFileSheet";
import BidderFileToolbar from "@/components/bidderFile/BidderFileToolbar";
import ExposeChecks from "@/components/expose/ExposeChecks";
import ExposeDocument from "@/components/expose/ExposeDocument";
import ExposeForm from "@/components/expose/ExposeForm";
import ExposeInternal from "@/components/expose/ExposeInternal";
import ExposePhotoManager from "@/components/expose/ExposePhotoManager";
import ExposeWorkbench from "@/components/expose/ExposeWorkbench";
import ListingNotFound from "@/components/app/listing/ListingNotFound";
import LockedPanel from "@/components/app/listing/LockedPanel";
import QuotaExceededNotice from "@/components/app/listing/QuotaExceededNotice";
import { listingHref } from "@/lib/appConstants";
import { getAppPageContext } from "@/lib/appPage";
import { CURRENCY_SUFFIX } from "@/lib/bankFile/bankFileConstants";
import { buildExposeBase } from "@/lib/expose/exposeBase";
import { EXPOSE_PRINT_PARAM, exposeHref } from "@/lib/expose/exposeConstants";
import { formatDate } from "@/lib/format";
import { ListingService } from "@/services/ListingService";
import { MetaTagService } from "@/services/MetaTagService";
import { OfficialPortalService } from "@/services/OfficialPortalService";
import { ReportService } from "@/services/ReportService";
import { AntiScrapingService } from "@/services/sicherheit/AntiScrapingService";
import { TranslationService } from "@/services/TranslationService";
import { ExposeTranslations, getExposeTranslation } from "@/translations/expose/ExposeTranslations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const labels = ExposeTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(labels.MetaTags.Expose), robots: { index: false, follow: false } };
}

export default async function ExposePage({ params, searchParams }: PageProps<"/expose/[key]">) {
  const key = decodeURIComponent((await params).key);
  const { viewer, app, locale } = await getAppPageContext(exposeHref(key));
  const isLocked = viewer.plan === "free";
  const quota = await AntiScrapingService.enforceDetailQuota(viewer.id, isLocked, key);
  if (!quota.allowed) {
    return (
      <BidderFileSheet lang={locale}>
        <QuotaExceededNotice locale={locale} retryAfterMinutes={quota.retryAfterMinutes} isLocked={isLocked} />
      </BidderFileSheet>
    );
  }
  const labels = getExposeTranslation(locale);
  const L = app.Listing;
  const listing = isLocked ? null : await ListingService.getByKey(viewer.market, key);

  if (!listing || isLocked) {
    return (
      <BidderFileSheet lang={locale}>
        {isLocked ? (
          <LockedPanel title={labels.Sheet.Locked} body={L.Locked.Body} cta={L.Locked.Cta} />
        ) : (
          <ListingNotFound title={L.NotFound.Title} body={L.NotFound.Body} backLabel={L.Back} />
        )}
      </BidderFileSheet>
    );
  }

  const [portal, report] = await Promise.all([OfficialPortalService.getDetails(listing).catch(() => null), ReportService.get(viewer.id, listing.key)]);
  const base = buildExposeBase(listing, portal, report, locale);
  const autoPrint = (await searchParams)[EXPOSE_PRINT_PARAM] === "1";

  return (
    <BidderFileSheet
      lang={locale}
      toolbar={
        <>
          <BidderFileToolbar printLabel={labels.Sheet.Print} printHint={labels.Sheet.PrintHint} backLabel={labels.Sheet.Back} backHref={listingHref(listing.key)} autoPrint={autoPrint} />
          <ExposeWorkbench>
            <ExposeForm listingId={listing.key} market={listing.market} currency={CURRENCY_SUFFIX[listing.market]} labels={labels} />
            <ExposePhotoManager listingId={listing.key} labels={labels.Photos} />
            <ExposeChecks base={base} locale={locale} labels={labels.Checks} />
            <ExposeInternal base={base} locale={locale} labels={labels.Internal} />
          </ExposeWorkbench>
        </>
      }
    >
      <ExposeDocument base={base} locale={locale} printedAt={formatDate(new Date(viewer.now).toISOString(), locale)} labels={labels} />
    </BidderFileSheet>
  );
}
