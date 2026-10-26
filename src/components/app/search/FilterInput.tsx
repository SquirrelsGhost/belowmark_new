import { CONTROL_CLASSES } from "@/lib/appStyles";

interface FilterInputProps {
  id: string;
  name: string;
  value: string;
  type: "search" | "date";
  placeholder?: string;
  ariaLabel?: string;
}

/** Text search or date field in ledger style. */
export default function FilterInput({ id, name, value, type, placeholder, ariaLabel }: FilterInputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      autoComplete="off"
      className={`${CONTROL_CLASSES} placeholder:text-muted/70`}
    />
  );
}
