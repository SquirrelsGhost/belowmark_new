import { HTMLInputTypeAttribute, ReactNode } from "react";
import FieldMessages from "@/components/auth/FieldMessages";
import { describedBy, FIELD_INPUT_CLASSES, FIELD_LABEL_CLASSES } from "@/lib/auth/fieldStyles";

interface AuthFieldProps {
  id: string;
  name: string;
  label: string;
  /** Form position, e.g. "01" — printed like a field number on a paper form */
  number: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: "email" | "text";
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  hint?: string;
  /** Translated error text; marks the field invalid */
  error?: string;
  /** Element on the label line, right-aligned (e.g. "Forgot password?") */
  aside?: ReactNode;
}

/** Label, input, hint and error — wired together for assistive technology. */
export default function AuthField({ id, name, label, number, type = "text", autoComplete, inputMode, placeholder, defaultValue, readOnly, hint, error, aside }: AuthFieldProps) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={FIELD_LABEL_CLASSES}>
          <span className="text-signal">{number}</span> {label}
        </label>
        {aside}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
        required={!readOnly}
        spellCheck={false}
        autoCapitalize="none"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={FIELD_INPUT_CLASSES}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}
