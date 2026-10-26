import ExposeFormGroup from "@/components/expose/ExposeFormGroup";
import ExposeTextField from "@/components/expose/ExposeTextField";
import { TEXT_LIMITS } from "@/lib/expose/exposeConstants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeFormGroupState } from "@/types/expose.types";

interface ExposeFormContactProps extends Pick<ExposeFormGroupState, "inputs" | "setInputs"> {
  labels: IExposeTranslation["Form"];
}

/** Who answers the buyer; company and licence only when selling as an agent. */
export default function ExposeFormContact({ inputs, setInputs, labels }: ExposeFormContactProps) {
  const { Fields } = labels;
  const isAgent = inputs.sellerRole === "agent";
  const max = TEXT_LIMITS.short;
  return (
    <ExposeFormGroup title={labels.Groups.contact}>
      <ExposeTextField id="expose-name" autoComplete="name" label={Fields.contactName.label} hint={Fields.contactName.hint} maxLength={max} value={inputs.contactName} onChange={(contactName) => setInputs({ contactName })} />
      <ExposeTextField id="expose-phone" type="tel" autoComplete="tel" label={Fields.contactPhone.label} hint={Fields.contactPhone.hint} maxLength={max} value={inputs.contactPhone} onChange={(contactPhone) => setInputs({ contactPhone })} />
      <ExposeTextField id="expose-email" type="email" autoComplete="email" label={Fields.contactEmail.label} hint={Fields.contactEmail.hint} maxLength={max} value={inputs.contactEmail} onChange={(contactEmail) => setInputs({ contactEmail })} />
      {isAgent && (
        <>
          <ExposeTextField id="expose-company" autoComplete="organization" label={Fields.contactCompany.label} hint={Fields.contactCompany.hint} maxLength={max} value={inputs.contactCompany} onChange={(contactCompany) => setInputs({ contactCompany })} />
          <ExposeTextField id="expose-license" label={Fields.licenseNo.label} hint={Fields.licenseNo.hint} maxLength={max} value={inputs.licenseNo} onChange={(licenseNo) => setInputs({ licenseNo })} />
        </>
      )}
    </ExposeFormGroup>
  );
}
