import LockedPanel from "@/components/app/listing/LockedPanel";
import ReportDirectAnalyzeButton from "@/components/app/report/ReportDirectAnalyzeButton";
import ReportRemoveButton from "@/components/app/report/ReportRemoveButton";
import ReportResults from "@/components/app/report/ReportResults";
import ReportSection from "@/components/app/report/ReportSection";
import ReportUploadForm from "@/components/app/report/ReportUploadForm";
import RiskCheckPanel from "@/components/app/risk/RiskCheckPanel";
import { LocaleOption } from "@/lib/constants";
import { DIRECT_ANALYZE_COPY } from "@/lib/listingDetailsCopy";
import { buildRiskCheck } from "@/lib/report/riskCheck";
import { ReportService } from "@/services/ReportService";
import { ReportTranslations } from "@/translations/report/ReportTranslations";
import { Locale } from "@/translations/Translations";
import { Listing, OfficialAttachment } from "@/types/listing.types";

interface ListingReportAreaProps {
  listing: Listing;
  userId: string;
  locale: LocaleOption;
  /** Free plan: risk check from the notice only, no Gutachten reader */
  isLocked: boolean;
  attachments?: OfficialAttachment[];
}

/** Risk check and Gutachten reader on the Aktenblatt — loads the user's stored analysis itself. */
export default async function ListingReportArea({
  listing,
  userId,
  locale,
  isLocked,
  attachments = [],
}: ListingReportAreaProps) {
  const labels = ReportTranslations[(locale.toUpperCase() as Locale)] ?? ReportTranslations[Locale.DE];
  const report = isLocked ? null : await ReportService.get(userId, listing.key);
  const { Report: R } = labels;
  const directCopy = DIRECT_ANALYZE_COPY[locale] ?? DIRECT_ANALYZE_COPY.en;

  return (
    <>
      <RiskCheckPanel check={buildRiskCheck(listing, report)} labels={labels.Risk} />
      <ReportSection title={R.Title} lead={R.Lead} policy={R.Policy}>
        {isLocked ? (
          <LockedPanel title={R.Locked.Title} body={R.Locked.Body} cta={R.Locked.Cta} href="#free-unlock" />
        ) : (
          <>
            {report && <ReportResults report={report} labels={R} locale={locale} />}
            <ReportDirectAnalyzeButton
              listingId={listing.key}
              attachments={attachments}
              title={directCopy.title}
              lead={directCopy.lead}
              pendingLabel={R.Upload.Pending}
              errors={R.Upload.Errors}
              locale={locale}
            />
            <ReportUploadForm
              listingId={listing.key}
              label={report ? R.Upload.Replace : R.Upload.Label}
              hint={R.Upload.Hint}
              submitLabel={R.Upload.Submit}
              pendingLabel={R.Upload.Pending}
              errors={R.Upload.Errors}
            />
            {report && <ReportRemoveButton listingId={listing.key} label={R.Upload.Remove} confirmLabel={R.Upload.RemoveConfirm} />}
          </>
        )}
      </ReportSection>
    </>
  );
}
