// Creates a team through a Server Action and shows a failure inline
"use client";

import { useActionState } from "react";
import TeamFormError from "@/components/app/team/TeamFormError";
import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { createTeamAction } from "@/lib/team/teamActions";
import { TEAMS } from "@/lib/team/teamConfig";
import { PANEL_CLASSES, SUBMIT_CLASSES } from "@/lib/team/teamStyles";
import { ITeamTranslation } from "@/translations/team/ITeamTranslation";
import { TeamActionState } from "@/types/team.types";

interface TeamCreateFormProps {
  labels: ITeamTranslation["Overview"]["Create"];
  errors: ITeamTranslation["Errors"];
  /** Filled hint ("Arbeitet im Markt …") and usage ("1 von 3 eigenen Teams") */
  hint: string;
  usage: string;
}

const INITIAL_STATE: TeamActionState = { ok: true };

/** "Neues Team": a name, and the creator becomes owner. */
export default function TeamCreateForm({ labels, errors, hint, usage }: TeamCreateFormProps) {
  const [state, formAction, isPending] = useActionState(createTeamAction, INITIAL_STATE);
  return (
    <form action={formAction} className={`${PANEL_CLASSES} flex flex-col gap-3 shadow-[5px_5px_0_0_var(--ink)]`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-narrow text-2xl font-bold">{labels.Title}</h2>
        <p className="font-mono text-[10px] text-muted">{usage}</p>
      </div>
      <label className="flex flex-col gap-1">
        <span className={LABEL_CLASSES}>{labels.NameLabel}</span>
        <input name="name" required maxLength={TEAMS.nameMaxLength} placeholder={labels.Placeholder} className={CONTROL_CLASSES} />
      </label>
      <p className="font-mono text-[10px] leading-relaxed text-muted">{hint}</p>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={isPending} className={SUBMIT_CLASSES}>
          {isPending ? labels.Pending : labels.Submit}
        </button>
        <TeamFormError state={state} errors={errors} />
      </div>
    </form>
  );
}
