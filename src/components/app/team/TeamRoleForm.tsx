// Changes a member's role through a Server Action and shows a failure inline
"use client";

import { useActionState } from "react";
import TeamFormError from "@/components/app/team/TeamFormError";
import { changeRoleAction } from "@/lib/team/teamActions";
import { AssignableRole } from "@/lib/team/teamConfig";
import { BUTTON_TONES, SMALL_BUTTON_CLASSES } from "@/lib/team/teamStyles";
import { TeamActionState, TeamErrorCode } from "@/types/team.types";

interface TeamRoleFormProps {
  teamId: string;
  userId: string;
  current: AssignableRole;
  /** Roles the viewer may give */
  options: { value: AssignableRole; label: string }[];
  label: string;
  submitLabel: string;
  errors: Record<TeamErrorCode, string>;
}

const INITIAL_STATE: TeamActionState = { ok: true };

export default function TeamRoleForm({ teamId, userId, current, options, label, submitLabel, errors }: TeamRoleFormProps) {
  const [state, formAction, isPending] = useActionState(changeRoleAction, INITIAL_STATE);
  return (
    <form action={formAction} className="flex flex-col items-start gap-1">
      <input type="hidden" name="teamId" value={teamId} />
      <input type="hidden" name="userId" value={userId} />
      <div className="flex items-center gap-1">
        <select name="role" aria-label={label} defaultValue={current} className="h-8 border border-rule-strong bg-paper-bright px-2 font-mono text-[12px]">
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={isPending} className={`${SMALL_BUTTON_CLASSES} ${BUTTON_TONES.plain}`}>
          {submitLabel}
        </button>
      </div>
      {!state.ok && <TeamFormError state={state} errors={errors} />}
    </form>
  );
}
