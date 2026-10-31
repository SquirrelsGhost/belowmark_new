import { PricingCountryCode } from "@/lib/constants";

interface OrderMarketOptionProps {
  code: PricingCountryCode;
  label: string;
  hint: string;
}

/** Country option inside the market dropdown on /buchen. */
export default function OrderMarketOption({ code, label, hint }: OrderMarketOptionProps) {
  return (
    <option value={code}>
      {label} ({code}) — {hint}
    </option>
  );
}
