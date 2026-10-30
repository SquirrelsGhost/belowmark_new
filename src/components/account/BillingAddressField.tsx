import FieldMessages from "@/components/auth/FieldMessages";
import { describedBy, FIELD_INPUT_CLASSES, FIELD_LABEL_CLASSES } from "@/lib/auth/fieldStyles";

interface BillingAddressFieldProps {
  id: string;
  name: string;
  label: string;
  number: string;
  defaultValue?: string;
  hint?: string;
  error?: string;
  autoComplete: string;
  /** Several lines (the address) */
  multiline?: boolean;
  /** Printed after the label, e.g. "optional"; the field is then not required */
  optionalLabel?: string;
}

/** Address input in the look of the auth fields, but for normal text: capitals and spell check stay on. */
export default function BillingAddressField({ id, name, label, number, defaultValue, hint, error, autoComplete, multiline = false, optionalLabel }: BillingAddressFieldProps) {
  const shared = {
    id,
    name,
    defaultValue,
    autoComplete,
    required: !optionalLabel,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy(id, hint, error),
  };
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className={FIELD_LABEL_CLASSES}>
        <span className="text-signal">{number}</span> {label}
        {optionalLabel && <span className="ml-2 font-normal tracking-normal text-muted normal-case">({optionalLabel})</span>}
      </label>
      {multiline ? <textarea {...shared} rows={3} className={`${FIELD_INPUT_CLASSES} h-auto py-3 leading-relaxed`} /> : <input {...shared} type="text" className={FIELD_INPUT_CLASSES} />}
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}
