import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";

interface BankFileSelectProps<T extends string> {
  id: string;
  label: string;
  empty: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T | null) => void;
}

/** A choice that starts unanswered — "noch offen" is a real state, not a default. */
export default function BankFileSelect<T extends string>({ id, label, empty, options, value, onChange }: BankFileSelectProps<T>) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1">
      <span className={LABEL_CLASSES}>{label}</span>
      <select
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? null : (event.target.value as T))}
        className={CONTROL_CLASSES}
      >
        <option value="">{empty}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
