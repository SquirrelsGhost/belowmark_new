import FieldMessages from "@/components/auth/FieldMessages";
import { describedBy, FIELD_INPUT_CLASSES, FIELD_LABEL_CLASSES } from "@/lib/auth/fieldStyles";

interface DeclarationFieldProps {
  id: string;
  name: string;
  label: string;
  number: string;
  type?: "text" | "email" | "date";
  autoComplete?: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  /** Multi-line text instead of a single input */
  isMultiline?: boolean;
}

/** Input or textarea of the cancellation / withdrawal form, styled like the auth fields. */
export default function DeclarationField({ id, name, label, number, type = "text", autoComplete, defaultValue, required = false, hint, error, isMultiline = false }: DeclarationFieldProps) {
  const shared = {
    id,
    name,
    defaultValue,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy(id, hint, error),
  };
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className={FIELD_LABEL_CLASSES}>
        <span className="text-signal">{number}</span> {label}
      </label>
      {isMultiline ? (
        <textarea {...shared} rows={4} maxLength={4000} className={`${FIELD_INPUT_CLASSES} h-auto py-3 leading-relaxed`} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} className={FIELD_INPUT_CLASSES} />
      )}
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}
