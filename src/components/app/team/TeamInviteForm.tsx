// Sends an invitation through a Server Action and resets after success
"use client";

import { useActionState } from "react";
import TeamFormError from "@/components/app/team/TeamFormError";
import { CONTROL_CLASSES, LABEL_CLASSES } from "@/lib/appStyles";
import { EMAIL_MAX_LENGTH } from "@/lib/auth/authConfig";
import { inviteMemberAction } from "@/lib/team/teamActions";
import { AssignableRole } from "@/lib/team/teamConfig";
import { PANEL_CLASSES, SUBMIT_CLASSES } from "@/lib/team/teamStyles";
import { ITeamTranslation } from "@/translations/team/ITeamTranslation";
import { TeamActionState } from "@/types/team.types";

interface TeamInviteFormProps {
  teamId: string;
  roles: { value: AssignableRole; label: string }[];
  labels: ITeamTranslation["Members"]["Invite"];
  errors: ITeamTranslation["Errors"];
}

const INITIAL_STATE: TeamActionState = { ok: true };

/** "Jemanden einladen": address and role; the mail goes out at once. */
export default function TeamInviteForm({ teamId, roles, labels, errors }: TeamInviteFormProps) {
  const [state, formAction, isPending] = useActionState(inviteMemberAction, INITIAL_STATE);
  return (
    <form action={formAction} className={`${PANEL_CLASSES} mt-4 flex flex-col gap-3`}>
      <input type="hidden" name="teamId" value={teamId} />
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASSES}>{labels.EmailLabel}</span>
          <input type="email" name="email" required maxLength={EMAIL_MAX_LENGTH} autoComplete="off" className={CONTROL_CLASSES} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL_CLASSES}>{labels.RoleLabel}</span>
          <select name="role" defaultValue={roles.find((role) => role.value === "member")?.value ?? roles[0]?.value} className={CONTROL_CLASSES}>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="font-mono text-[10px] leading-relaxed text-muted">{labels.Hint}</p>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={isPending} className={SUBMIT_CLASSES}>
          {isPending ? labels.Pending : labels.Submit}
        </button>
        <TeamFormError state={state} errors={errors} doneLabel={labels.Sent} />
      </div>
    </form>
  );
}
