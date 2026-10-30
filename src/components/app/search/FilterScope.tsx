import type { FilterOption } from "@/components/app/search/FilterSelect";

interface FilterScopeProps {
  name: string;
  value: string;
  options: FilterOption[];
}

/** Segmented radio group (upcoming / all / past). */
export default function FilterScope({ name, value, options }: FilterScopeProps) {
  return (
    <div className="grid grid-cols-3 border border-rule-strong">
      {options.map((option) => (
        <label
          key={option.value}
          className="relative flex h-9 cursor-pointer items-center justify-center border-r border-rule-strong font-narrow text-xs font-semibold tracking-[0.06em] uppercase last:border-r-0 has-checked:bg-ink has-checked:text-paper-bright has-focus-visible:outline-2 has-focus-visible:outline-signal"
        >
          <input type="radio" name={name} value={option.value} defaultChecked={option.value === value} className="sr-only" />
          {option.label}
        </label>
      ))}
    </div>
  );
}
