import LockedPanel from "@/components/app/listing/LockedPanel";
import ReportDirectAnalyzeButton from "@/components/app/report/ReportDirectAnalyzeButton";
import ReportRemoveButton from "@/components/app/report/ReportRemoveButton";
import ReportResults from "@/components/app/report/ReportResults";
import ReportSection from "@/components/app/report/ReportSection";
import ReportUploadForm from "@/components/app/report/ReportUploadForm";
import RiskCheckPanel from "@/components/app/risk/RiskCheckPanel";
import { LocaleOption } from "@/lib/constants";
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
  const labels = ReportTranslations[locale === "tr" ? Locale.TR : Locale.DE];
  const report = isLocked ? null : await ReportService.get(userId, listing.key);
  const { Report: R } = labels;
  const directTitle =
    locale === "tr"
      ? "Resmî portal belgesini tek tıkla analiz et"
      : "Amtliches Portaldokument mit 1 Klick auswerten";
  const directLead =
    locale === "tr"
      ? "İndirip tekrar yüklemeye gerek yok: mahkeme portalındaki PDF doğrudan sunucuda çekilir ve incelenir."
      : "Kein manuelles Herunter- und Hochladen nötig: Das hinterlegte PDF wird direkt vom Justizportal abgerufen und auf Risiken & Kennzahlen geprüft.";

  return (
    <>
      <RiskCheckPanel check={buildRiskCheck(listing, report)} labels={labels.Risk} />
      <ReportSection title={R.Title} lead={R.Lead} policy={R.Policy}>
        {isLocked ? (
          <LockedPanel title={R.Locked.Title} body={R.Locked.Body} cta={R.Locked.Cta} />
        ) : (
          <>
            {report && <ReportResults report={report} labels={R} locale={locale} />}
            <ReportDirectAnalyzeButton
              listingId={listing.key}
              attachments={attachments}
              title={directTitle}
              lead={directLead}
              pendingLabel={R.Upload.Pending}
              errors={R.Upload.Errors}
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
