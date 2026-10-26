interface FilterCheckboxProps {
  name: string;
  label: string;
  checked: boolean;
}

/** Square ink checkbox with label; sends "1" when ticked. */
export default function FilterCheckbox({ name, label, checked }: FilterCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
      <input type="checkbox" name={name} value="1" defaultChecked={checked} className="size-4 cursor-pointer accent-ink" />
      {label}
    </label>
  );
}
