// Deletes the team after the name was typed — a Server Action that redirects on success
"use client";

import { useActionState } from "react";
import TeamFormError from "@/components/app/team/TeamFormError";
import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { deleteTeamAction } from "@/lib/team/teamActions";
import { ITeamTranslation } from "@/translations/team/ITeamTranslation";
import { TeamActionState } from "@/types/team.types";

interface TeamDeleteFormProps {
  teamId: string;
  labels: ITeamTranslation["Members"]["Delete"];
  errors: ITeamTranslation["Errors"];
}

const INITIAL_STATE: TeamActionState = { ok: true };

export default function TeamDeleteForm({ teamId, labels, errors }: TeamDeleteFormProps) {
  const [state, formAction, isPending] = useActionState(deleteTeamAction, INITIAL_STATE);
  return (
    <form action={formAction} className="mt-4 flex max-w-xl flex-col gap-3 border-2 border-signal p-5">
      <input type="hidden" name="teamId" value={teamId} />
      <h3 className="font-narrow text-lg font-bold text-signal">{labels.Title}</h3>
      <p className="text-sm leading-relaxed text-ink-soft">{labels.Body}</p>
      <label className="flex flex-col gap-1">
        <span className={LABEL_CLASSES}>{labels.ConfirmLabel}</span>
        <input name="confirm" required autoComplete="off" className={CONTROL_CLASSES} />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 cursor-pointer bg-signal px-4 font-narrow text-xs font-semibold tracking-[0.1em] text-paper-bright uppercase disabled:opacity-60"
        >
          {labels.Submit}
        </button>
        <TeamFormError state={state} errors={errors} />
      </div>
    </form>
  );
}
