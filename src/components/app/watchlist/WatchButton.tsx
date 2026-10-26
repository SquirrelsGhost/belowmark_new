// Toggles the watch list with a Server Action and shows the new state at once
"use client";

import { useActionState, useOptimistic, useTransition } from "react";
import { toggleWatchAction, WatchlistActionState } from "@/lib/watchlistActions";

interface WatchButtonProps {
  listingId: string;
  isSaved: boolean;
  watchLabel: string;
  unwatchLabel: string;
  errorLabel: string;
  /** "row" in lists, "large" on the detail page */
  size?: "row" | "large";
}

const SIZE_CLASSES: Record<NonNullable<WatchButtonProps["size"]>, string> = {
  row: "h-8 px-2.5 text-[11px]",
  large: "h-11 px-4 text-xs",
};

/** "Merken" / "Gemerkt" — a filled marker once the proceeding is on the list. */
export default function WatchButton({ listingId, isSaved, watchLabel, unwatchLabel, errorLabel, size = "row" }: WatchButtonProps) {
  const [state, formAction] = useActionState<WatchlistActionState, FormData>(toggleWatchAction, { ok: true, saved: isSaved });
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(state.saved ?? isSaved);
  const [, startTransition] = useTransition();
  const saved = optimisticSaved;

  const submit = (formData: FormData) => {
    startTransition(() => {
      setOptimisticSaved(!saved);
      formAction(formData);
    });
  };

  return (
    <form action={submit} className="inline-flex flex-col items-end">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="save" value={saved ? "0" : "1"} />
      <button
        type="submit"
        aria-pressed={saved}
        className={`inline-flex cursor-pointer items-center gap-2 border font-narrow font-semibold tracking-[0.08em] uppercase transition-colors ${SIZE_CLASSES[size]} ${
          saved ? "border-ink bg-ink text-paper-bright" : "border-rule-strong bg-paper-bright text-ink hover:border-ink"
        }`}
      >
        <span aria-hidden="true" className={`size-2.5 rounded-full border-2 ${saved ? "border-signal bg-signal" : "border-ink"}`} />
        {saved ? unwatchLabel : watchLabel}
      </button>
      {!state.ok && (
        <span role="alert" className="mt-1 font-mono text-[10px] text-signal">
          {errorLabel}
        </span>
      )}
    </form>
  );
}
