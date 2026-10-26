// Sets the team status through a Server Action; each status is its own submit button
"use client";

import { useActionState } from "react";
import TeamFormError from "@/components/app/team/TeamFormError";
import { setTeamStatusAction } from "@/lib/team/teamBoardActions";
import { TEAM_STATUSES, TeamStatus } from "@/lib/team/teamConfig";
import { STATUS_TONES } from "@/lib/team/teamStyles";
import { TeamActionState, TeamErrorCode } from "@/types/team.types";

interface TeamStatusPickerProps {
  teamId: string;
  listingId: string;
  /** null = not on the team's list yet; choosing a status adds it */
  current: TeamStatus | null;
  labels: Record<TeamStatus, string>;
  groupLabel: string;
  errors: Record<TeamErrorCode, string>;
  isDisabled: boolean;
  size?: "small" | "large";
}

const INITIAL_STATE: TeamActionState = { ok: true };

export default function TeamStatusPicker({ teamId, listingId, current, labels, groupLabel, errors, isDisabled, size = "large" }: TeamStatusPickerProps) {
  const [state, formAction, isPending] = useActionState(setTeamStatusAction, INITIAL_STATE);
  const height = size === "large" ? "h-10 px-3 text-xs" : "h-8 px-2.5 text-[11px]";
  return (
    <form action={formAction} className="flex flex-col gap-1">
      <input type="hidden" name="teamId" value={teamId} />
      <input type="hidden" name="listingId" value={listingId} />
      <div role="group" aria-label={groupLabel} className="flex flex-wrap gap-1.5">
        {TEAM_STATUSES.map((status) => {
          const isCurrent = status === current;
          const tone = STATUS_TONES[status];
          return (
            <button
              key={status}
              type="submit"
              name="status"
              value={status}
              aria-pressed={isCurrent}
              disabled={isDisabled || isPending || isCurrent}
              className={`inline-flex cursor-pointer items-center gap-1.5 border-2 font-narrow font-semibold tracking-[0.08em] uppercase transition-colors disabled:cursor-default ${height} ${
                isCurrent ? `${tone.border} bg-paper-bright ${tone.text} shadow-[3px_3px_0_0_var(--ink)]` : "border-rule bg-paper text-ink-soft hover:border-ink disabled:opacity-60"
              }`}
            >
              <span aria-hidden="true" className={`size-2 rounded-full ${tone.dot}`} />
              {labels[status]}
            </button>
          );
        })}
      </div>
      {!state.ok && <TeamFormError state={state} errors={errors} />}
    </form>
  );
}
