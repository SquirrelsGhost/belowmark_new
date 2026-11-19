// Needs refs and controlled filter input inside the animated MarketDropdown popover
"use client";

import { RefObject } from "react";
import { PricingCountryCode } from "@/lib/constants";
import { MARKET_CURRENCY_BADGES } from "@/lib/marketSearch";

export interface MarketMenuOption {
  code: PricingCountryCode;
  label: string;
  hint: string;
  badge?: string;
}

interface MarketDropdownMenuProps {
  id: string;
  labelledBy: string;
  open: boolean;
  selectedCode: PricingCountryCode;
  filtered: readonly MarketMenuOption[];
  activeIndex: number;
  query: string;
  searchPlaceholder: string;
  emptyLabel: string;
  searchRef: RefObject<HTMLInputElement | null>;
  itemRefs: RefObject<(HTMLButtonElement | null)[]>;
  onQueryChange: (value: string) => void;
  onHoverIndex: (idx: number) => void;
  onPick: (code: PricingCountryCode) => void;
}

const MENU_BASE = [
  "absolute left-0 right-0 z-50 mt-1.5 overflow-hidden border-2 border-ink bg-paper-bright",
  "shadow-[6px_6px_0_var(--ink)] sm:shadow-[8px_8px_0_var(--ink)]",
  "origin-top transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
].join(" ");

export default function MarketDropdownMenu({
  id,
  labelledBy,
  open,
  selectedCode,
  filtered,
  activeIndex,
  query,
  searchPlaceholder,
  emptyLabel,
  searchRef,
  itemRefs,
  onQueryChange,
  onHoverIndex,
  onPick,
}: MarketDropdownMenuProps) {
  return (
    <div
      id={id}
      role="listbox"
      aria-labelledby={labelledBy}
      className={`${MENU_BASE} ${
        open ? "pointer-events-auto translate-y-0 scale-y-100 opacity-100" : "pointer-events-none -translate-y-1.5 scale-y-95 opacity-0"
      }`}
    >
      <div className="border-b-2 border-ink bg-paper p-2">
        <input
          ref={searchRef}
          type="search"
          value={query}
          tabIndex={open ? 0 : -1}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full border border-ink/50 bg-paper-bright px-2.5 py-1.5 font-mono text-xs text-ink placeholder:text-muted focus:border-signal focus:outline-none"
        />
      </div>

      <div className="max-h-72 divide-y divide-rule overflow-x-hidden overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-3.5 py-4 text-center font-mono text-xs text-muted">{emptyLabel}</p>
        ) : (
          filtered.map((option, idx) => {
            const isSelected = option.code === selectedCode;
            const isFocused = open && idx === activeIndex;
            const badgeText = option.badge ?? MARKET_CURRENCY_BADGES[option.code];
            return (
              <button
                key={option.code}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => onHoverIndex(idx)}
                onClick={() => onPick(option.code)}
                className={`group/item relative flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 overflow-hidden px-3.5 py-2.5 text-left transition-colors duration-150 ${
                  isSelected
                    ? "bg-ink text-paper-bright"
                    : isFocused
                      ? "bg-paper-deep text-ink"
                      : "bg-paper-bright text-ink hover:bg-paper-deep"
                }`}
              >
                <span className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
                  <span
                    className={`flex h-7 w-9 shrink-0 items-center justify-center border font-display text-base leading-none tracking-wider transition-colors ${
                      isSelected ? "border-signal bg-signal text-paper-bright" : "border-ink/40 bg-paper text-ink group-hover/item:border-ink"
                    }`}
                  >
                    {option.code === "GB" ? "UK" : option.code}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <span className="truncate font-narrow text-sm font-semibold tracking-wide uppercase">{option.label}</span>
                    <span className={`truncate font-mono text-[11px] ${isSelected ? "text-paper/75" : "text-muted"}`}>{option.hint}</span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className={`border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase ${isSelected ? "border-paper/30 text-paper/85" : "border-rule-strong text-muted"}`}>
                    {badgeText}
                  </span>
                  {isSelected && <span className="font-mono text-xs font-semibold text-signal">✓</span>}
                </span>
                {isSelected && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-signal" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
