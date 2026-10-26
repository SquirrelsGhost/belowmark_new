// Renames the team through a Server Action
"use client";

import { useActionState } from "react";
import TeamFormError from "@/components/app/team/TeamFormError";
import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { renameTeamAction } from "@/lib/team/teamActions";
import { TEAMS } from "@/lib/team/teamConfig";
import { BUTTON_TONES, SMALL_BUTTON_CLASSES } from "@/lib/team/teamStyles";
import { TeamActionState, TeamErrorCode } from "@/types/team.types";

interface TeamRenameFormProps {
  teamId: string;
  name: string;
  label: string;
  submitLabel: string;
  savedLabel: string;
  errors: Record<TeamErrorCode, string>;
}

const INITIAL_STATE: TeamActionState = { ok: true };

export default function TeamRenameForm({ teamId, name, label, submitLabel, savedLabel, errors }: TeamRenameFormProps) {
  const [state, formAction, isPending] = useActionState(renameTeamAction, INITIAL_STATE);
  return (
    <form action={formAction} className="mt-4 flex max-w-xl flex-col gap-1">
      <input type="hidden" name="teamId" value={teamId} />
      <label className="flex flex-col gap-1">
        <span className={LABEL_CLASSES}>{label}</span>
        <span className="flex gap-2">
          <input name="name" required maxLength={TEAMS.nameMaxLength} defaultValue={name} className={CONTROL_CLASSES} />
          <button type="submit" disabled={isPending} className={`${SMALL_BUTTON_CLASSES} ${BUTTON_TONES.ink} h-10`}>
            {submitLabel}
          </button>
        </span>
      </label>
      <TeamFormError state={state} errors={errors} doneLabel={savedLabel} />
    </form>
  );
}
