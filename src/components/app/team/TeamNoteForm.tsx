// Shares a note with the team through a Server Action and clears the field after success
"use client";

import { useActionState } from "react";
import TeamFormError from "@/components/app/team/TeamFormError";
import { CONTROL_CLASSES } from "@/lib/appStyles";
import { addTeamNoteAction } from "@/lib/team/teamBoardActions";
import { TEAMS } from "@/lib/team/teamConfig";
import { SUBMIT_CLASSES } from "@/lib/team/teamStyles";
import { TeamActionState, TeamErrorCode } from "@/types/team.types";

interface TeamNoteFormProps {
  teamId: string;
  listingId: string;
  placeholder: string;
  submitLabel: string;
  hint: string;
  savedLabel: string;
  errors: Record<TeamErrorCode, string>;
}

const INITIAL_STATE: TeamActionState = { ok: true };

export default function TeamNoteForm({ teamId, listingId, placeholder, submitLabel, hint, savedLabel, errors }: TeamNoteFormProps) {
  const [state, formAction, isPending] = useActionState(addTeamNoteAction, INITIAL_STATE);
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="teamId" value={teamId} />
      <input type="hidden" name="listingId" value={listingId} />
      <textarea
        name="body"
        rows={3}
        required
        maxLength={TEAMS.noteMaxLength}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`${CONTROL_CLASSES} h-auto resize-y py-2 font-sans text-sm leading-relaxed`}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] text-muted">{hint}</p>
        <button type="submit" disabled={isPending} className={SUBMIT_CLASSES}>
          {submitLabel}
        </button>
      </div>
      <TeamFormError state={state} errors={errors} doneLabel={savedLabel} />
    </form>
  );
}
