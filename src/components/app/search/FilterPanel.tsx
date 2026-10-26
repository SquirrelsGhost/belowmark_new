import Form from "next/form";
import { ReactNode } from "react";
import FilterAutoSubmit from "@/components/app/search/FilterAutoSubmit";
import { APP_ROUTES } from "@/lib/appConstants";

interface FilterPanelProps {
  title: string;
  /** Hidden fields that must survive a filter change (e.g. the sort order) */
  hidden: Record<string, string>;
  children: ReactNode;
}

/**
 * The "Register": a plain GET form, so every filter ends up in the URL.
 * With JavaScript it navigates client-side and applies changes instantly;
 * without, the apply button does the same.
 */
export default function FilterPanel({ title, hidden, children }: FilterPanelProps) {
  return (
    <details open className="group border-2 border-ink bg-paper-bright shadow-[6px_6px_0_0_var(--ink)] lg:sticky lg:top-24">
      <summary className="flex cursor-pointer items-center justify-between bg-ink px-4 py-2.5 text-paper-bright lg:cursor-default">
        <h2 className="font-display text-xl tracking-wide">{title}</h2>
        <span aria-hidden="true" className="font-mono text-sm transition-transform group-open:rotate-45 lg:hidden">
          +
        </span>
      </summary>
      <Form action={APP_ROUTES.search} className="flex flex-col gap-4 p-4">
        {Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        {children}
        <FilterAutoSubmit />
      </Form>
    </details>
  );
}
