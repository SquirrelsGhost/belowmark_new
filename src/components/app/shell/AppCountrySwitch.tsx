// Needs useOptimistic, useTransition and URL hooks for instant 1-click country switching in the topbar
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { SEARCH_PARAMS } from "@/lib/appConstants";
import { switchAppCountryAction } from "@/lib/appCountryActions";
import { ListingCountry } from "@/types/listing.types";

export interface AppCountryOption {
  code: ListingCountry;
  name: string;
}

interface AppCountrySwitchProps {
  current: ListingCountry;
  currentLabel: string;
  options: AppCountryOption[];
}

const PILL_BASE = "px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors cursor-pointer disabled:opacity-50";
const PILL_ACTIVE = `${PILL_BASE} bg-paper-bright font-semibold text-ink`;
const PILL_INACTIVE = `${PILL_BASE} text-paper/65 hover:bg-paper/15 hover:text-paper-bright`;

/**
 * Topbar country switcher shown in AppStatusLine whenever the viewer holds
 * multiple countries (multi-country plans or superusers).
 */
export default function AppCountrySwitch({ current, currentLabel, options }: AppCountrySwitchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlCountry = searchParams.get(SEARCH_PARAMS.country);
  const effectiveCurrent = options.find((o) => o.code === urlCountry)?.code ?? current;
  const [optimisticCode, setOptimisticCode] = useOptimistic(effectiveCurrent);
  const activeOption = options.find((o) => o.code === optimisticCode);
  const displayLabel = activeOption?.name ?? currentLabel;

  const handleSelect = (code: ListingCountry) => {
    if (code === optimisticCode) return;
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete(SEARCH_PARAMS.country);
    nextParams.delete(SEARCH_PARAMS.region);
    nextParams.delete(SEARCH_PARAMS.page);
    const qs = nextParams.toString();
    const targetHref = qs ? `${pathname}?${qs}` : pathname;

    startTransition(async () => {
      setOptimisticCode(code);
      await switchAppCountryAction(code, targetHref);
    });
  };

  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-signal" />
      <span>{displayLabel}</span>
      <span className="ml-1 flex items-center gap-0.5 border-l border-paper/20 pl-2" role="group" aria-label="Land wechseln">
        {options.map((opt) => {
          const isActive = opt.code === optimisticCode;
          return (
            <button
              key={opt.code}
              type="button"
              disabled={isPending}
              onClick={() => handleSelect(opt.code)}
              title={opt.name}
              aria-pressed={isActive}
              className={isActive ? PILL_ACTIVE : PILL_INACTIVE}
            >
              {opt.code}
            </button>
          );
        })}
      </span>
    </span>
  );
}
