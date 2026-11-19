// Needs state, refs, keyboard navigation, search filter, and outside-click listener for custom dropdown
"use client";

import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import MarketDropdownMenu from "@/components/ui/MarketDropdownMenu";
import MarketDropdownTrigger from "@/components/ui/MarketDropdownTrigger";
import MarketQuickPills from "@/components/ui/MarketQuickPills";
import { LocaleOption, PricingCountryCode } from "@/lib/constants";
import { MARKET_SEARCH_EMPTY, MARKET_SEARCH_PLACEHOLDERS, matchesMarketSearch } from "@/lib/marketSearch";

export interface MarketDropdownOption {
  code: PricingCountryCode;
  label: string;
  hint: string;
  badge?: string;
}

interface MarketDropdownProps {
  id?: string;
  name?: string;
  value: PricingCountryCode;
  options: readonly MarketDropdownOption[];
  onChange: (next: PricingCountryCode) => void;
  locale?: LocaleOption;
  showQuickPills?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  describedBy?: string;
}

/** Searchable custom "Amtlicher Aushang" country dropdown + optional 1-click country pills. */
export default function MarketDropdown({
  id,
  name,
  value,
  options,
  onChange,
  locale = "de",
  showQuickPills = true,
  hasError = false,
  disabled = false,
  describedBy,
}: MarketDropdownProps) {
  const autoId = useId();
  const triggerId = id ?? `market-dropdown-${autoId}`;
  const listboxId = `${triggerId}-listbox`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = options.find((o) => o.code === value) ?? options[0];
  const filtered = options.filter((o) => matchesMarketSearch(o.code, o.label, o.hint, query));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    const focusTimer = window.setTimeout(() => searchRef.current?.focus(), 20);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setQuery("");
        setActiveIndex(Math.max(0, options.findIndex((o) => o.code === value)));
      }
      return next;
    });
  };

  const pick = (code: PricingCountryCode) => {
    onChange(code);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (disabled) return;
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      toggleOpen();
      return;
    }
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown" && filtered.length > 0) {
      event.preventDefault();
      const next = (activeIndex + 1) % filtered.length;
      setActiveIndex(next);
      itemRefs.current[next]?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "ArrowUp" && filtered.length > 0) {
      event.preventDefault();
      const prev = (activeIndex - 1 + filtered.length) % filtered.length;
      setActiveIndex(prev);
      itemRefs.current[prev]?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      pick(filtered[activeIndex].code);
    }
  };

  return (
    <div className="grid min-w-0 gap-2.5">
      <div ref={rootRef} className={`relative w-full min-w-0 max-w-full ${disabled ? "opacity-60" : ""}`} onKeyDown={handleKeyDown}>
        {name && <input type="hidden" name={name} value={selected.code} />}
        <MarketDropdownTrigger
          id={triggerId} listboxId={listboxId} open={open} disabled={disabled} hasError={hasError}
          describedBy={describedBy} code={selected.code} label={selected.label} hint={selected.hint}
          totalCount={options.length} onClick={toggleOpen}
        />
        <MarketDropdownMenu
          id={listboxId} labelledBy={triggerId} open={open} selectedCode={selected.code} filtered={filtered}
          activeIndex={activeIndex} query={query}
          searchPlaceholder={MARKET_SEARCH_PLACEHOLDERS[locale] ?? MARKET_SEARCH_PLACEHOLDERS.de}
          emptyLabel={MARKET_SEARCH_EMPTY[locale] ?? MARKET_SEARCH_EMPTY.de}
          searchRef={searchRef} itemRefs={itemRefs}
          onQueryChange={(val) => { setQuery(val); setActiveIndex(0); }}
          onHoverIndex={setActiveIndex} onPick={pick}
        />
      </div>
      {showQuickPills && options.length > 1 && <MarketQuickPills value={selected.code} options={options} onSelect={pick} disabled={disabled} />}
    </div>
  );
}
