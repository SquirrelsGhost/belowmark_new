import { CONTROL_CLASSES } from "@/lib/appStyles";

export interface FilterOption {
  value: string;
  label: string;
  group?: string;
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
  const ungrouped = options.filter((o) => !o.group);
  const groups = new Map<string, FilterOption[]>();
  for (const option of options) {
    if (!option.group) continue;
    const list = groups.get(option.group) ?? [];
    list.push(option);
    groups.set(option.group, list);
  }

  return (
    <select id={id} name={name} defaultValue={value} aria-label={ariaLabel} className={`${CONTROL_CLASSES} cursor-pointer`}>
      {ungrouped.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      {[...groups.entries()].map(([groupName, groupOptions]) => (
        <optgroup key={groupName} label={groupName}>
          {groupOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
