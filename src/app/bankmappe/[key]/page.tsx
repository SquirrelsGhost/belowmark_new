import { Metadata } from "next";
import BankFileAsk from "@/components/bankFile/BankFileAsk";
import BankFileClauses from "@/components/bankFile/BankFileClauses";
import BankFileDepositWays from "@/components/bankFile/BankFileDepositWays";
import BankFileDocuments from "@/components/bankFile/BankFileDocuments";
import BankFileForm from "@/components/bankFile/BankFileForm";
import BankFileReportFacts from "@/components/bankFile/BankFileReportFacts";
import BankFileRequest from "@/components/bankFile/BankFileRequest";
import BankFileRisks from "@/components/bankFile/BankFileRisks";
import BankFileSchedule from "@/components/bankFile/BankFileSchedule";
import BidderFileFacts from "@/components/bidderFile/BidderFileFacts";
import BidderFileHeader from "@/components/bidderFile/BidderFileHeader";
import BidderFileLimit from "@/components/bidderFile/BidderFileLimit";
import BidderFileMoney from "@/components/bidderFile/BidderFileMoney";
import BidderFileSection from "@/components/bidderFile/BidderFileSection";
import BidderFileSheet from "@/components/bidderFile/BidderFileSheet";
import BidderFileSources from "@/components/bidderFile/BidderFileSources";
import BidderFileToolbar from "@/components/bidderFile/BidderFileToolbar";
import ListingNotFound from "@/components/app/listing/ListingNotFound";
import LockedPanel from "@/components/app/listing/LockedPanel";
import QuotaExceededNotice from "@/components/app/listing/QuotaExceededNotice";
import PageNote from "@/components/ui/PageNote";
import PageStack from "@/components/ui/PageStack";
import { listingHref } from "@/lib/appConstants";
import { fill, formatMoney } from "@/lib/appFormat";
import { getAppPageContext } from "@/lib/appPage";
import { BANK_FILE_PRINT_PARAM, CURRENCY_SUFFIX, bankFileHref } from "@/lib/bankFile/bankFileConstants";
import { getBankFileSources, getDeposit } from "@/lib/bankFile/bankFileSources";
import { getBidContext } from "@/lib/bidding/bidContext";
import { getHearingLines } from "@/lib/bidding/bidderFile";
import { formatDate } from "@/lib/format";
import { getAddressLine, getPlaceTitle } from "@/lib/listingLabels";
import { getHearingStatus } from "@/lib/listingMath";
import { buildRiskCheck } from "@/lib/report/riskCheck";
import { ListingService } from "@/services/ListingService";
import { MetaTagService } from "@/services/MetaTagService";
import { ReportService } from "@/services/ReportService";
import { AntiScrapingService } from "@/services/sicherheit/AntiScrapingService";
import { TranslationService } from "@/services/TranslationService";
import { BankFileTranslations, getBankFileTranslation } from "@/translations/bankFile/BankFileTranslations";
import { getBiddingTranslation } from "@/translations/bidding/BiddingTranslations";
import { ReportTranslations } from "@/translations/report/ReportTranslations";
import { Locale } from "@/translations/Translations";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const labels = BankFileTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(labels.MetaTags.BankFile), robots: { index: false, follow: false } };
}

export default async function BankFilePage({ params, searchParams }: PageProps<"/bankmappe/[key]">) {
  const key = decodeURIComponent((await params).key);
  const { viewer, app, locale, dataDate } = await getAppPageContext(bankFileHref(key));
  const isLocked = viewer.plan === "free";
  const quota = await AntiScrapingService.enforceDetailQuota(viewer.id, isLocked, key);
  if (!quota.allowed) {
    return (
      <BidderFileSheet lang={locale}>
        <QuotaExceededNotice locale={locale} retryAfterMinutes={quota.retryAfterMinutes} isLocked={isLocked} />
      </BidderFileSheet>
    );
  }
  const labels = getBankFileTranslation(locale);
  const bidding = getBiddingTranslation(locale);
  const reportLabels = ReportTranslations[locale === "tr" ? Locale.TR : Locale.DE];
  const { File } = labels;
  const L = app.Listing;
  const listing = isLocked ? null : await ListingService.getByKey(viewer.market, key);
  const context = listing ? getBidContext(listing) : null;

  if (!listing || !context || isLocked) {
    return (
      <BidderFileSheet lang={locale}>
        {isLocked ? (
          <LockedPanel title={File.Locked} body={L.Locked.Body} cta={L.Locked.Cta} />
        ) : listing ? (
          <PageNote variant="mutedSmall" text={L.NotStated} />
        ) : (
          <ListingNotFound title={L.NotFound.Title} body={L.NotFound.Body} backLabel={L.Back} />
        )}
      </BidderFileSheet>
    );
  }

  const market = listing.market;
  const money = (amount: number) => formatMoney(amount, market, locale);
  const report = await ReportService.get(viewer.id, listing.key);
  const hearing = getHearingLines(listing, getHearingStatus(listing, viewer.now), locale, app.Row);
  const object = getPlaceTitle(listing);
  const intro = fill(labels.Ask.Intro, { fileNo: listing.fileNo, court: listing.authority, object, date: hearing.when, value: money(context.value) });
  const autoPrint = (await searchParams)[BANK_FILE_PRINT_PARAM] === "1";
  const live = { listingId: listing.key, context, locale };

  return (
    <BidderFileSheet
      lang={locale}
      toolbar={
        <>
          <BidderFileToolbar printLabel={File.Print} printHint={File.PrintHint} backLabel={File.Back} backHref={listingHref(listing.key)} autoPrint={autoPrint} />
          <BankFileForm listingId={listing.key} context={context} labels={labels.Form} currency={CURRENCY_SUFFIX[market]} />
        </>
      }
    >
      <BidderFileHeader
        kicker={File.Kicker}
        title={File.Title}
        fileNo={listing.fileNo}
        object={object}
        subtitle={[listing.authority, app.Segments[listing.segment], getAddressLine(listing)].filter(Boolean).join(" · ")}
        printedAt={fill(File.PrintedAt, { date: formatDate(new Date(viewer.now).toISOString(), locale) })}
        dataAsOf={fill(File.DataAsOf, { date: dataDate })}
      />
      <BidderFileSection number="01" title={File.Sections.ask}>
        <BankFileAsk {...live} labels={labels.Ask} intro={intro} />
      </BidderFileSection>
      <BidderFileSection number="02" title={File.Sections.request}>
        <BankFileRequest {...live} labels={labels} costLabels={bidding.Limit.Costs} />
      </BidderFileSection>
      <BidderFileSection number="03" title={File.Sections.schedule}>
        <BankFileSchedule {...live} labels={labels.Schedule} />
      </BidderFileSection>
      <BidderFileSection number="04" title={File.Sections.deposit}>
        <BankFileDepositWays listingId={listing.key} context={context} labels={labels.Deposit} amount={money(getDeposit(context))} />
      </BidderFileSection>
      <BidderFileSection number="05" title={File.Sections.collateral}>
        <BankFileClauses lead={labels.Collateral.Lead[market]} clauses={labels.Collateral.Items[market]} />
      </BidderFileSection>
      <BidderFileSection number="06" title={File.Sections.object}>
        <BidderFileMoney listing={listing} labels={L} locale={locale} />
        <PageStack variant="top3">
          <BidderFileFacts listing={listing} labels={L} locale={locale} />
        </PageStack>
        <BankFileReportFacts report={report} title={labels.Object.ReportTitle} noReport={labels.Object.NoReport} reportFrom={labels.Object.ReportFrom} factLabels={reportLabels.Report.Facts} pageLabel={reportLabels.Report.Page} />
      </BidderFileSection>
      <BidderFileSection number="07" title={File.Sections.risks}>
        <BankFileRisks check={buildRiskCheck(listing, report)} labels={reportLabels.Risk} lead={labels.Object.RisksLead} sourceLabels={labels.Object.RiskFrom} />
      </BidderFileSection>
      <BidderFileSection number="08" title={File.Sections.limit}>
        <BidderFileLimit listingId={listing.key} context={context} labels={bidding.Limit} noLimit={bidding.File.NoLimit} locale={locale} />
      </BidderFileSection>
      <BidderFileSection number="09" title={File.Sections.documents}>
        <BankFileDocuments lead={labels.Documents.Lead} groups={labels.Documents.Groups[market]} />
      </BidderFileSection>
      <BidderFileSection number="10" title={File.Sections.notThis}>
        <BankFileClauses clauses={labels.NotThis.Items} />
      </BidderFileSection>
      <BidderFileSection number="11" title={File.Sections.sources}>
        <BidderFileSources links={getBankFileSources(listing, labels.SourceNames)} disclaimer={bidding.File.Disclaimer} />
      </BidderFileSection>
    </BidderFileSheet>
  );
}
