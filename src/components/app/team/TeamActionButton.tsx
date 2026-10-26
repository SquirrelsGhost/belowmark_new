// Runs one team Server Action from a button and shows a failure inline
"use client";

import { useActionState } from "react";
import { BUTTON_TONES, ButtonTone, SMALL_BUTTON_CLASSES } from "@/lib/team/teamStyles";
import { TeamActionState, TeamErrorCode } from "@/types/team.types";

interface TeamActionButtonProps {
  action: (state: TeamActionState, formData: FormData) => Promise<TeamActionState>;
  /** Hidden fields sent with the action, e.g. teamId and listingId */
  fields: Record<string, string>;
  label: string;
  errors: Record<TeamErrorCode, string>;
  tone?: ButtonTone;
  /** Replaces the button once the action is done (e.g. "Abgelehnt.") */
  doneMessage?: string;
  size?: "small" | "large";
}

const INITIAL_STATE: TeamActionState = { ok: true };

export default function TeamActionButton({ action, fields, label, errors, tone = "plain", doneMessage, size = "small" }: TeamActionButtonProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  if (doneMessage && state.done) {
    return (
      <p role="status" className="font-mono text-[11px] text-verdict">
        {doneMessage}
      </p>
    );
  }
  return (
    <form action={formAction} className="inline-flex flex-col items-start">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" disabled={isPending} className={`${SMALL_BUTTON_CLASSES} ${BUTTON_TONES[tone]} ${size === "large" ? "h-11 px-5 text-sm" : ""}`}>
        {label}
      </button>
      {!state.ok && state.error && (
        <span role="alert" className="mt-1 max-w-xs font-mono text-[10px] text-signal">
          {errors[state.error]}
        </span>
      )}
    </form>
  );
}
