// Needs click handling + router.refresh() to re-render server translations
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALE_OPTIONS } from "@/lib/constants";
import { setLocaleAction } from "@/lib/setLocaleAction";

type LocaleOption = (typeof LOCALE_OPTIONS)[number];

interface NavigationLocaleSwitchProps {
  current: LocaleOption;
  label: string;
}

const OPTION_BASE = "rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wider transition-colors duration-200";

/** Compact DE / EN toggle that stores the choice in the locale cookie. */
export default function NavigationLocaleSwitch({ current, label }: NavigationLocaleSwitchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const select = (locale: LocaleOption) => {
    if (locale === current) return;
    startTransition(async () => {
      await setLocaleAction(locale);
      router.refresh();
    });
  };

  return (
    <div role="group" aria-label={label} className={`hidden items-center rounded-full border border-line p-0.5 sm:flex ${isPending ? "opacity-60" : ""}`}>
      {LOCALE_OPTIONS.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => select(locale)}
          aria-pressed={locale === current}
          className={`${OPTION_BASE} ${locale === current ? "bg-glass-strong text-ink" : "text-subtle hover:text-ink"}`}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
