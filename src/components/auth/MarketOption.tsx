interface MarketOptionProps {
  value: string;
  label: string;
  hint: string;
  /** Two-letter code printed like a file stamp */
  code: string;
}

/** One country/market option inside the <MarketPicker /> dropdown. */
export default function MarketOption({ value, label, hint, code }: MarketOptionProps) {
  return (
    <option value={value}>
      {label} ({code}) — {hint}
    </option>
  );
}
