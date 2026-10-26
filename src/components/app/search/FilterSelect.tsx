import { CONTROL_CLASSES } from "@/lib/appStyles";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  id: string;
  name: string;
  value: string;
  options: FilterOption[];
  /** Accessible name when there is no visible label of its own */
  ariaLabel?: string;
}

/** Native select in ledger style — fast, accessible, works on every phone. */
export default function FilterSelect({ id, name, value, options, ariaLabel }: FilterSelectProps) {
  return (
    <select id={id} name={name} defaultValue={value} aria-label={ariaLabel} className={`${CONTROL_CLASSES} cursor-pointer`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
