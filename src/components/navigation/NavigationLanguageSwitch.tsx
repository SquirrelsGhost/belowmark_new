// Needs onChange event + router.refresh() to switch UI language
"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition } from "react";
import { LOCALE_OPTIONS, LocaleOption } from "@/lib/constants";
import { setLocaleAction } from "@/lib/regionActions";

interface NavigationLanguageSwitchProps {
  current: LocaleOption;
}

const LOCALE_LABELS: Record<LocaleOption, string> = {
  en: "EN",
  de: "DE",
  tr: "TR",
  it: "IT",
  es: "ES",
  fr: "FR",
};

const ARIA_LABELS: Record<LocaleOption, string> = {
  en: "Select language",
  de: "Sprache wählen",
  tr: "Dil seçin",
  it: "Seleziona lingua",
  es: "Seleccionar idioma",
  fr: "Choisir la langue",
};

/** Compact editorial language selector in the sticky masthead. */
export default function NavigationLanguageSwitch({ current }: NavigationLanguageSwitchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as LocaleOption;
    if (next === current) return;
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  };

  return (
    <select
      aria-label={ARIA_LABELS[current]}
      value={current}
      disabled={isPending}
      onChange={handleChange}
      className="cursor-pointer border border-ink/30 bg-paper px-1.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-ink uppercase transition-colors hover:border-ink focus:border-ink focus:outline-none disabled:opacity-50"
    >
      {LOCALE_OPTIONS.map((code) => (
        <option key={code} value={code}>
          {LOCALE_LABELS[code]}
        </option>
      ))}
    </select>
  );
}
