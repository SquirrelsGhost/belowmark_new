import BidLimitField from "@/components/app/bidding/BidLimitField";
import BankFileSelect from "@/components/bankFile/BankFileSelect";
import ExposeFormGroup from "@/components/expose/ExposeFormGroup";
import ExposeTextField from "@/components/expose/ExposeTextField";
import { EFFICIENCY_CLASSES, TEXT_LIMITS } from "@/lib/expose/exposeConstants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeFormGroupState } from "@/types/expose.types";

interface ExposeFormEnergyProps extends ExposeFormGroupState {
  labels: IExposeTranslation["Form"];
  energy: IExposeTranslation["Energy"];
}

const CERT_TYPES = ["demand", "consumption", "none"] as const;

/** The figures of the energy certificate — DE: § 87 GEG, TR: class and date of the EKB. */
export default function ExposeFormEnergy({ inputs, setInputs, market, labels, energy }: ExposeFormEnergyProps) {
  const { Fields, Choices } = labels;
  const hasNoCert = inputs.certType === "none";
  return (
    <ExposeFormGroup title={labels.Groups.energy}>
      {market === "DE" && (
        <BankFileSelect id="expose-cert" label={Choices.certType} empty={labels.Empty} options={CERT_TYPES.map((value) => ({ value, label: energy.CertTypes[value] }))} value={inputs.certType} onChange={(certType) => setInputs({ certType })} />
      )}
      {!hasNoCert && (
        <>
          <BankFileSelect
            id="expose-class"
            label={Choices.efficiencyClass}
            empty={labels.Empty}
            options={EFFICIENCY_CLASSES[market].map((value) => ({ value, label: value }))}
            value={inputs.efficiencyClass || null}
            onChange={(efficiencyClass) => setInputs({ efficiencyClass: efficiencyClass ?? "" })}
          />
          <ExposeTextField id="expose-issued" type="date" label={Fields.certIssued.label} hint={Fields.certIssued.hint} maxLength={TEXT_LIMITS.short} value={inputs.certIssued} onChange={(certIssued) => setInputs({ certIssued })} />
        </>
      )}
      {market === "DE" && !hasNoCert && (
        <>
          <BidLimitField id="expose-energy" label={Fields.energyValue.label} hint={Fields.energyValue.hint} suffix="kWh" value={inputs.energyValue} onChange={(energyValue) => setInputs({ energyValue })} />
          <ExposeTextField id="expose-carrier" label={Fields.energyCarrier.label} hint={Fields.energyCarrier.hint} maxLength={TEXT_LIMITS.short} value={inputs.energyCarrier} onChange={(energyCarrier) => setInputs({ energyCarrier })} />
        </>
      )}
    </ExposeFormGroup>
  );
}
