// Needs state and Server Action transition to switch the active exploration country on /konto Overview
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import MarketDropdown, { MarketDropdownOption } from "@/components/ui/MarketDropdown";
import { LocaleOption, PricingCountryCode } from "@/lib/constants";
import { setMarketAction } from "@/lib/regionActions";

interface AccountMarketSwitcherProps {
  label: string;
  note: string;
  initialCountry: PricingCountryCode;
  locale: LocaleOption;
  options: readonly MarketDropdownOption[];
}

export default function AccountMarketSwitcher({
  label,
  note,
  initialCountry,
  locale,
  options,
}: AccountMarketSwitcherProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<PricingCountryCode>(initialCountry);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (next: PricingCountryCode) => {
    setSelected(next);
    startTransition(async () => {
      await setMarketAction(next);
      router.refresh();
    });
  };

  return (
    <div className="mt-5 grid min-w-0 gap-2 border-2 border-ink/25 bg-paper p-3.5 sm:p-4">
      <label htmlFor="overview-market-select" className="font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
        <span className="text-signal">●</span> {label}
      </label>
      <MarketDropdown
        id="overview-market-select"
        value={selected}
        locale={locale}
        disabled={isPending}
        onChange={handleSelect}
        options={options}
      />
      <p className="text-xs leading-relaxed text-muted">{note}</p>
    </div>
  );
}
