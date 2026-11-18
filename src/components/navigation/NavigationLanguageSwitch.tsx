// Needs onChange event + router.refresh() to switch active country & language
"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition } from "react";
import { setSelectorCountryAction } from "@/lib/regionActions";
import type { HomeSelectorCode } from "@/translations/homeCountries/homeCountryTypes";

interface NavigationLanguageSwitchProps {
  current: HomeSelectorCode;
}

const SELECTOR_OPTIONS: ReadonlyArray<{ code: HomeSelectorCode; label: string }> = [
  { code: "DE", label: "🇩🇪 DE · Deutsch" },
  { code: "AT", label: "🇦🇹 AT · Österreich" },
  { code: "CH", label: "🇨🇭 CH · Schweiz" },
  { code: "IT", label: "🇮🇹 IT · Italia" },
  { code: "ES", label: "🇪🇸 ES · España" },
  { code: "FR", label: "🇫🇷 FR · France" },
  { code: "GB", label: "🇬🇧 UK · English" },
  { code: "NL", label: "🇳🇱 NL · Nederland" },
  { code: "PL", label: "🇵🇱 PL · Polska" },
  { code: "CZ", label: "🇨🇿 CZ · Česko" },
  { code: "SE", label: "🇸🇪 SE · Sverige" },
  { code: "TR", label: "🇹🇷 TR · Türkiye" },
  { code: "INTL", label: "🌐 EN · International" },
];

/** Compact 12-country + International selector in the sticky masthead. */
export default function NavigationLanguageSwitch({ current }: NavigationLanguageSwitchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as HomeSelectorCode;
    if (next === current) return;
    startTransition(async () => {
      await setSelectorCountryAction(next);
      router.refresh();
    });
  };

  return (
    <select
      aria-label="Country & Language"
      value={current}
      disabled={isPending}
      onChange={handleChange}
      className="max-w-[7.25rem] cursor-pointer border border-ink/30 bg-paper px-1.5 py-1 font-mono text-[11px] font-semibold tracking-tight text-ink transition-colors hover:border-ink focus:border-ink focus:outline-none disabled:opacity-50 sm:max-w-[8.75rem]"
    >
      {SELECTOR_OPTIONS.map((item) => (
        <option key={item.code} value={item.code}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
