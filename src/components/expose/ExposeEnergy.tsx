import BidderFileRow from "@/components/bidderFile/BidderFileRow";
import { formatDate, formatNumber } from "@/lib/format";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeInputs } from "@/types/expose.types";

interface ExposeEnergyProps {
  inputs: ExposeInputs;
  market: MarketCode;
  yearBuilt: string | null;
  locale: LocaleOption;
  labels: IExposeTranslation["Energy"];
}

const isoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

/** The energy certificate's figures; every missing one is printed as a missing mandatory figure. */
export default function ExposeEnergy({ inputs, market, yearBuilt, locale, labels }: ExposeEnergyProps) {
  const { Labels, Missing } = labels;
  const issued = inputs.certIssued ? (isoDate(inputs.certIssued) ? formatDate(inputs.certIssued, locale) : inputs.certIssued) : null;
  if (inputs.certType === "none") return <p className="text-[13px] text-ink-soft">{labels.NoCert[market]}</p>;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] text-muted">{labels.Lead[market]}</p>
      <dl className="grid grid-cols-1 gap-x-8 divide-y divide-rule sm:grid-cols-2 print:grid-cols-2">
        {market === "DE" && <BidderFileRow label={Labels.certType} value={inputs.certType ? labels.CertTypes[inputs.certType] : null} missing={Missing} />}
        {market === "DE" && <BidderFileRow label={Labels.value} value={inputs.energyValue === null ? null : `${formatNumber(inputs.energyValue, locale)} ${labels.Unit}`} missing={Missing} />}
        {market === "DE" && <BidderFileRow label={Labels.carrier} value={inputs.energyCarrier.trim() || null} missing={Missing} />}
        <BidderFileRow label={Labels.efficiencyClass} value={inputs.efficiencyClass || null} missing={Missing} />
        <BidderFileRow label={Labels.certIssued} value={issued} missing={Missing} />
        {market === "DE" && <BidderFileRow label={Labels.yearBuilt} value={yearBuilt} missing={Missing} />}
      </dl>
    </div>
  );
}
