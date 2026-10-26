/** Shared look of every auth input, so fields, password fields and pickers match. */

export const FIELD_LABEL_CLASSES = "font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase";

/** 16px text on purpose: anything smaller makes iOS zoom into the field. */
export const FIELD_INPUT_CLASSES = [
  "h-12 w-full rounded-none border border-ink/70 bg-paper px-3.5 font-mono text-base text-ink",
  "placeholder:text-muted/70 outline-none transition-[border-color,box-shadow,background-color] duration-150",
  "hover:border-ink focus:border-ink focus:bg-paper-bright focus:shadow-[inset_0_-3px_0_0_var(--signal)]",
  "aria-[invalid=true]:border-signal aria-[invalid=true]:shadow-[inset_0_-3px_0_0_var(--signal)]",
  "read-only:cursor-default read-only:border-dashed read-only:text-ink-soft",
].join(" ");

/** aria-describedby value: error first, then hint, then anything extra. */
export function describedBy(id: string, hint?: string, error?: string, extra?: string): string | undefined {
  const ids = [error && `${id}-error`, hint && `${id}-hint`, extra].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

