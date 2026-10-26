import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { MarketCode } from "@/lib/constants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeInputs } from "@/types/expose.types";

interface ExposeContactProps {
  inputs: ExposeInputs;
  market: MarketCode;
  labels: IExposeTranslation["Contact"];
}

/** Who sells and how to reach them; an agent's company and licence are printed as missing when empty. */
export default function ExposeContact({ inputs, market, labels }: ExposeContactProps) {
  const isAgent = inputs.sellerRole === "agent";
  const text = (value: string) => value.trim() || null;
  return (
    <dl className="grid grid-cols-1 gap-x-8 divide-y divide-rule sm:grid-cols-2 print:grid-cols-2">
      <BidderFileRow label={labels.Labels.name} value={text(inputs.contactName)} missing={labels.Missing} note={inputs.sellerRole ? labels.Roles[inputs.sellerRole] : undefined} />
      <BidderFileRow label={labels.Labels.phone} value={text(inputs.contactPhone)} missing="—" />
      <BidderFileRow label={labels.Labels.email} value={text(inputs.contactEmail)} missing="—" />
      {isAgent && <BidderFileRow label={labels.Labels.company} value={text(inputs.contactCompany)} missing={labels.NotStated} />}
      {isAgent && <BidderFileRow label={labels.License[market]} value={text(inputs.licenseNo)} missing={labels.NotStated} />}
    </dl>
  );
}
