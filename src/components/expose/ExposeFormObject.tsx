import BidLimitField from "@/components/app/bidding/BidLimitField";
import BankFileSelect from "@/components/bankFile/BankFileSelect";
import ExposeFormGroup from "@/components/expose/ExposeFormGroup";
import ExposeTextField from "@/components/expose/ExposeTextField";
import { TEXT_LIMITS } from "@/lib/expose/exposeConstants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeFormGroupState } from "@/types/expose.types";

interface ExposeFormObjectProps extends ExposeFormGroupState {
  labels: IExposeTranslation["Form"];
  facts: IExposeTranslation["Facts"];
}

const CONDITIONS = ["new", "renovated", "maintained", "needsWork"] as const;
const OCCUPANCIES = ["vacant", "rented", "owner"] as const;

/** The object as the seller knows it today: own measurements, condition, use, registration. */
export default function ExposeFormObject({ inputs, setInputs, market, currency, labels, facts }: ExposeFormObjectProps) {
  const { Fields, Choices } = labels;
  const registered = labels.Registered[market];
  return (
    <ExposeFormGroup title={labels.Groups.object}>
      <BidLimitField id="expose-living" label={labels.LivingAreaLabel[market]} hint={Fields.livingArea.hint} suffix="m²" value={inputs.livingArea} onChange={(livingArea) => setInputs({ livingArea })} />
      <BidLimitField id="expose-plot" label={Fields.plotArea.label} hint={Fields.plotArea.hint} suffix="m²" value={inputs.plotArea} onChange={(plotArea) => setInputs({ plotArea })} />
      <BidLimitField id="expose-rooms" label={Fields.rooms.label} hint={Fields.rooms.hint} suffix="" value={inputs.rooms} onChange={(rooms) => setInputs({ rooms })} />
      <BidLimitField id="expose-year" label={Fields.yearBuilt.label} hint={Fields.yearBuilt.hint} suffix="" value={inputs.yearBuilt} onChange={(yearBuilt) => setInputs({ yearBuilt })} />
      <BankFileSelect id="expose-condition" label={Choices.condition} empty={labels.Empty} options={CONDITIONS.map((value) => ({ value, label: facts.Conditions[value] }))} value={inputs.condition} onChange={(condition) => setInputs({ condition })} />
      <BankFileSelect id="expose-occupancy" label={Choices.occupancy} empty={labels.Empty} options={OCCUPANCIES.map((value) => ({ value, label: facts.Occupancies[value] }))} value={inputs.occupancy} onChange={(occupancy) => setInputs({ occupancy })} />
      {inputs.occupancy === "rented" && (
        <BidLimitField id="expose-rent" label={Fields.netRent.label} hint={Fields.netRent.hint} suffix={currency} value={inputs.netRent} onChange={(netRent) => setInputs({ netRent })} />
      )}
      <ExposeTextField id="expose-available" label={Fields.availableFrom.label} hint={Fields.availableFrom.hint} maxLength={TEXT_LIMITS.short} value={inputs.availableFrom} onChange={(availableFrom) => setInputs({ availableFrom })} />
      <ExposeTextField id="expose-heating" label={Fields.heating.label} hint={Fields.heating.hint} maxLength={TEXT_LIMITS.short} value={inputs.heating} onChange={(heating) => setInputs({ heating })} />
      <BankFileSelect
        id="expose-registered"
        label={Choices.registered}
        empty={labels.Empty}
        options={[{ value: "yes" as const, label: registered.yes }, { value: "no" as const, label: registered.no }]}
        value={inputs.registered === null ? null : inputs.registered ? "yes" : "no"}
        onChange={(value) => setInputs({ registered: value === null ? null : value === "yes" })}
      />
      {market === "DE" && (
        <BankFileSelect
          id="expose-address"
          label={Choices.addressMode}
          empty={labels.AddressModes.place}
          options={[{ value: "exact" as const, label: labels.AddressModes.exact }]}
          value={inputs.addressMode === "exact" ? "exact" : null}
          onChange={(value) => setInputs({ addressMode: value ?? "place" })}
        />
      )}
    </ExposeFormGroup>
  );
}
