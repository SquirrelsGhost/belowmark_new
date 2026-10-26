import ExposeFormGroup from "@/components/expose/ExposeFormGroup";
import ExposeTextField from "@/components/expose/ExposeTextField";
import { TEXT_LIMITS } from "@/lib/expose/exposeConstants";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeFormGroupState } from "@/types/expose.types";

interface ExposeFormTextsProps extends Pick<ExposeFormGroupState, "inputs" | "setInputs"> {
  labels: IExposeTranslation["Form"];
}

/** The seller's own words. belowmark writes none of them. */
export default function ExposeFormTexts({ inputs, setInputs, labels }: ExposeFormTextsProps) {
  const { Fields } = labels;
  return (
    <ExposeFormGroup title={labels.Groups.texts}>
      <ExposeTextField id="expose-description" wide rows={7} label={Fields.description.label} hint={Fields.description.hint} maxLength={TEXT_LIMITS.description} value={inputs.description} onChange={(description) => setInputs({ description })} />
      <ExposeTextField id="expose-location" wide rows={4} label={Fields.location.label} hint={Fields.location.hint} maxLength={TEXT_LIMITS.location} value={inputs.location} onChange={(location) => setInputs({ location })} />
      <ExposeTextField id="expose-features" wide rows={4} label={Fields.features.label} hint={Fields.features.hint} maxLength={TEXT_LIMITS.features} value={inputs.features} onChange={(features) => setInputs({ features })} />
    </ExposeFormGroup>
  );
}
