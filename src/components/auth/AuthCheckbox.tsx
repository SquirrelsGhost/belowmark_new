import { ReactNode } from "react";
import FieldMessages from "@/components/auth/FieldMessages";

interface AuthCheckboxProps {
  id: string;
  name: string;
  defaultChecked?: boolean;
  required?: boolean;
  error?: string;
  /** Label content — may contain links */
  children: ReactNode;
}

const BOX_CLASSES = [
  "peer size-5 shrink-0 cursor-pointer appearance-none rounded-none border-2 border-ink bg-paper transition-colors",
  "checked:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
  "aria-[invalid=true]:border-signal",
].join(" ");

/** Square ink checkbox; the tick is drawn over the native input. */
export default function AuthCheckbox({ id, name, defaultChecked, required, error, children }: AuthCheckboxProps) {
  return (
    <div className="grid gap-1.5">
      <div className="relative flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={BOX_CLASSES}
        />
        <svg viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute top-0 left-0 size-5 p-0.5 text-paper-bright opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" strokeWidth={3}>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
        <label htmlFor={id} className="cursor-pointer text-sm leading-snug text-ink-soft">
          {children}
        </label>
      </div>
      <FieldMessages id={id} error={error} />
    </div>
  );
}
