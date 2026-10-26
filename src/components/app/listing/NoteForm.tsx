// Saves the note through a Server Action and reports the result inline
"use client";

import { useActionState } from "react";
import { NOTE_MAX_LENGTH } from "@/lib/appConstants";
import { CONTROL_CLASSES } from "@/lib/appStyles";
import { saveNoteAction, WatchlistActionState } from "@/lib/watchlistActions";

interface NoteFormProps {
  listingId: string;
  note: string;
  title: string;
  placeholder: string;
  saveLabel: string;
  savedLabel: string;
  errorLabel: string;
  hint: string;
}

const INITIAL_STATE: WatchlistActionState = { ok: true };

/** Private note on a proceeding; saving it also puts the proceeding on the watch list. */
export default function NoteForm({ listingId, note, title, placeholder, saveLabel, savedLabel, errorLabel, hint }: NoteFormProps) {
  const [state, formAction, isPending] = useActionState(saveNoteAction, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-2 border border-ink/70 bg-paper-bright p-4">
      <input type="hidden" name="listingId" value={listingId} />
      <label htmlFor="listing-note" className="font-narrow text-sm font-bold tracking-[0.12em] uppercase">
        {title}
      </label>
      <textarea
        id="listing-note"
        name="note"
        rows={4}
        maxLength={NOTE_MAX_LENGTH}
        defaultValue={note}
        placeholder={placeholder}
        className={`${CONTROL_CLASSES} h-auto resize-y py-2 font-sans text-sm leading-relaxed`}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] text-muted">{hint}</p>
        <button
          type="submit"
          disabled={isPending}
          className="h-9 cursor-pointer bg-ink px-4 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase shadow-[3px_3px_0_0_var(--signal)] disabled:opacity-60"
        >
          {saveLabel}
        </button>
      </div>
      <p aria-live="polite" className={`min-h-4 font-mono text-[11px] ${state.ok ? "text-verdict" : "text-signal"}`}>
        {!state.ok ? errorLabel : state.saved ? savedLabel : ""}
      </p>
    </form>
  );
}
