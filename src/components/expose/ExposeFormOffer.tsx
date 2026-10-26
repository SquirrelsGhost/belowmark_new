import BidLimitField from "@/components/app/bidding/BidLimitField";
import BankFileSelect from "@/components/bankFile/BankFileSelect";
import ExposeFormGroup from "@/components/expose/ExposeFormGroup";
import ExposeTextField from "@/components/expose/ExposeTextField";
import { TEXT_LIMITS } from "@/lib/expose/exposeConstants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeFormGroupState } from "@/types/expose.types";

interface ExposeFormOfferProps extends ExposeFormGroupState {
  labels: IExposeTranslation["Form"];
  priceTypes: IExposeTranslation["Sheet"]["PriceTypes"];
  roles: IExposeTranslation["Contact"]["Roles"];
}

/** Headline, price, who sells and the commission. */
export default function ExposeFormOffer({ inputs, setInputs, currency, labels, priceTypes, roles }: ExposeFormOfferProps) {
  const { Fields, Choices } = labels;
  return (
    <ExposeFormGroup title={labels.Groups.offer}>
      <ExposeTextField id="expose-headline" wide label={Fields.headline.label} hint={Fields.headline.hint} maxLength={TEXT_LIMITS.headline} value={inputs.headline} onChange={(headline) => setInputs({ headline })} />
      <BidLimitField id="expose-price" label={Fields.askingPrice.label} hint={Fields.askingPrice.hint} suffix={currency} value={inputs.askingPrice} onChange={(askingPrice) => setInputs({ askingPrice })} />
      <BankFileSelect
        id="expose-price-type"
        label={Choices.priceType}
        empty={labels.Empty}
        options={(["fixed", "negotiable"] as const).map((value) => ({ value, label: priceTypes[value] }))}
        value={inputs.priceType}
        onChange={(priceType) => setInputs({ priceType })}
      />
      <BankFileSelect
        id="expose-role"
        label={Choices.sellerRole}
        empty={labels.Empty}
        options={(["private", "agent"] as const).map((value) => ({ value, label: roles[value] }))}
        value={inputs.sellerRole}
        onChange={(sellerRole) => setInputs({ sellerRole })}
      />
      {inputs.sellerRole === "agent" && (
        <BidLimitField id="expose-commission" label={Fields.commissionPct.label} hint={Fields.commissionPct.hint} suffix="%" value={inputs.commissionPct} onChange={(commissionPct) => setInputs({ commissionPct })} />
      )}
    </ExposeFormGroup>
  );
}
