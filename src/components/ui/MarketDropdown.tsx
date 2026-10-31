// Needs state, refs, keyboard navigation, and outside-click listener for custom animated dropdown
"use client";

import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { PricingCountryCode } from "@/lib/constants";

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
  hasError?: boolean;
  disabled?: boolean;
  describedBy?: string;
}

const TRIGGER_BASE = [
  "group relative flex w-full min-w-0 max-w-full cursor-pointer items-center justify-between gap-3 overflow-hidden border border-ink/70 bg-paper px-3.5 py-2.5 text-left",
  "outline-none transition-[border-color,box-shadow,background-color] duration-150",
  "hover:border-ink focus-visible:border-ink focus-visible:bg-paper-bright focus-visible:shadow-[inset_0_-3px_0_0_var(--signal)]",
].join(" ");

const MENU_BASE = [
  "absolute left-0 right-0 z-50 mt-1.5 max-h-72 overflow-y-auto overflow-x-hidden border-2 border-ink bg-paper-bright",
  "shadow-[8px_8px_0_var(--ink)] divide-y divide-rule",
  "origin-top transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
].join(" ");

/** Custom animated "Amtlicher Aushang" dropdown replacing native OS <select>. */
export default function MarketDropdown({
  id,
  name,
  value,
  options,
  onChange,
  hasError = false,
  disabled = false,
  describedBy,
}: MarketDropdownProps) {
  const autoId = useId();
  const triggerId = id ?? `market-dropdown-${autoId}`;
  const listboxId = `${triggerId}-listbox`;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((o) => o.code === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selected = options.find((o) => o.code === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const pick = (code: PricingCountryCode) => {
    onChange(code);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (disabled) return;
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setActiveIndex(Math.max(0, options.findIndex((o) => o.code === value)));
      setOpen(true);
      return;
    }
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = (activeIndex + 1) % options.length;
      setActiveIndex(next);
      itemRefs.current[next]?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (activeIndex - 1 + options.length) % options.length;
      setActiveIndex(prev);
      itemRefs.current[prev]?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const target = options[activeIndex];
      if (target) pick(target.code);
    }
  };

  return (
    <div ref={rootRef} className={`relative w-full min-w-0 max-w-full ${disabled ? "opacity-60" : ""}`} onKeyDown={handleKeyDown}>
      {name && <input type="hidden" name={name} value={selected.code} />}
      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((prev) => !prev)}
        className={`${TRIGGER_BASE} ${open ? "border-ink bg-paper-bright shadow-[inset_0_-3px_0_0_var(--signal)]" : ""} ${hasError ? "border-signal shadow-[inset_0_-3px_0_0_var(--signal)]" : ""}`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
          <span className="flex h-8 w-10 shrink-0 items-center justify-center border border-ink bg-ink font-display text-lg leading-none tracking-wider text-signal">
            {selected.code}
          </span>
          <span className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <span className="truncate font-narrow text-sm font-semibold tracking-wide text-ink uppercase">{selected.label}</span>
            <span className="truncate font-mono text-[11px] text-muted">{selected.hint}</span>
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`flex size-7 shrink-0 items-center justify-center border border-ink/30 bg-paper-bright text-ink transition-transform duration-200 ${open ? "rotate-180 border-ink bg-ink text-paper-bright" : "group-hover:border-ink"}`}
        >
          <svg viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current stroke-2">
            <path d="M3.5 6L8 10.5L12.5 6" strokeLinecap="square" />
          </svg>
        </span>
      </button>

      <div
        id={listboxId}
        role="listbox"
        aria-labelledby={triggerId}
        className={`${MENU_BASE} ${
          open ? "pointer-events-auto translate-y-0 scale-y-100 opacity-100" : "pointer-events-none -translate-y-1.5 scale-y-95 opacity-0"
        }`}
      >
        {options.map((option, idx) => {
          const isSelected = option.code === selected.code;
          const isFocused = open && idx === activeIndex;
          return (
            <button
              key={option.code}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              type="button"
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => pick(option.code)}
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
                  {option.code}
                </span>
                <span className="flex min-w-0 flex-1 flex-col overflow-hidden">
                  <span className="truncate font-narrow text-sm font-semibold tracking-wide uppercase">{option.label}</span>
                  <span className={`truncate font-mono text-[11px] ${isSelected ? "text-paper/75" : "text-muted"}`}>{option.hint}</span>
                </span>
              </span>
              {isSelected && (
                <span className="shrink-0 font-mono text-xs font-semibold tracking-widest text-signal uppercase">✓</span>
              )}
              {isSelected && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-signal" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
