import EvidenceRow from "@/components/app/evidence/EvidenceRow";
import EvidenceTable from "@/components/app/evidence/EvidenceTable";
import { hostOf, officialPortalHref } from "@/lib/locationLinks";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { Listing } from "@/types/listing.types";

interface ListingEvidenceSectionProps {
  listing: Listing;
  labels: IAppTranslation["Evidence"];
}

/** Belege for one proceeding: the notice itself first, then the law behind each figure. */
export default function ListingEvidenceSection({ listing, labels }: ListingEvidenceSectionProps) {
  return (
    <EvidenceTable title={labels.Title} lead={labels.Lead} figureLabel={labels.Figure} basisLabel={labels.Basis} sourceLabel={labels.Source}>
      <EvidenceRow figure={listing.fileNo} basis={labels.Notice} source={hostOf(listing.officialUrl)} url={officialPortalHref(listing)} />
      {labels.Items[listing.market].map((item) => (
        <EvidenceRow key={item.figure} {...item} />
      ))}
    </EvidenceTable>
  );
}
