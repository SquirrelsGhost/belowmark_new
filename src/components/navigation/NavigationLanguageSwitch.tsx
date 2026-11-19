// Needs onChange event + router navigation to switch active country & language everywhere
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useTransition } from "react";
import { MARKET_PARAM } from "@/lib/billing/billingConfig";
import { isPricingCountry } from "@/lib/constants";
import { setSelectorCountryAction } from "@/lib/regionActions";
import type { HomeSelectorCode } from "@/translations/homeCountries/homeCountryTypes";

interface NavigationLanguageSwitchProps {
  current: HomeSelectorCode;
}

const SELECTOR_OPTIONS: ReadonlyArray<{ code: HomeSelectorCode; label: string }> = [
  { code: "DE", label: "DE · Deutschland" },
  { code: "AT", label: "AT · Österreich" },
  { code: "CH", label: "CH · Schweiz" },
  { code: "IT", label: "IT · Italia" },
  { code: "ES", label: "ES · España" },
  { code: "FR", label: "FR · France" },
  { code: "GB", label: "UK · United Kingdom" },
  { code: "NL", label: "NL · Nederland" },
  { code: "PL", label: "PL · Polska" },
  { code: "CZ", label: "CZ · Česko" },
  { code: "SE", label: "SE · Sverige" },
  { code: "TR", label: "TR · Türkiye" },
  { code: "INTL", label: "INTL · English" },
];

function LanguageSwitchInner({ current }: NavigationLanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as HomeSelectorCode;
    if (next === current) return;
    startTransition(async () => {
      await setSelectorCountryAction(next);
      if (isPricingCountry(next) && searchParams.has(MARKET_PARAM)) {
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set(MARKET_PARAM, next);
        router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="relative inline-flex shrink-0 items-center">
      <select
        aria-label="Country & Language"
        value={current}
        disabled={isPending}
        onChange={handleChange}
        className="h-9 max-w-[8.25rem] shrink-0 cursor-pointer border-2 border-ink bg-paper-bright pr-6 pl-2 font-mono text-[11px] font-semibold tracking-tight text-ink transition-colors hover:bg-paper focus:border-signal focus:outline-none disabled:opacity-50 sm:max-w-none sm:px-2.5"
      >
        {SELECTOR_OPTIONS.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Prominent 12-country + International selector in the sticky masthead across marketing, auth & account pages. */
export default function NavigationLanguageSwitch({ current }: NavigationLanguageSwitchProps) {
  return (
    <Suspense
      fallback={
        <span className="inline-flex h-9 items-center border-2 border-ink bg-paper-bright px-2.5 font-mono text-[11px] font-semibold text-ink">
          {current === "GB" ? "UK" : current}
        </span>
      }
    >
      <LanguageSwitchInner current={current} />
    </Suspense>
  );
}
