import { TeamActionState, TeamErrorCode } from "@/types/team.types";

interface TeamFormErrorProps {
  state: TeamActionState;
  errors: Record<TeamErrorCode, string>;
  /** Shown after a successful submit */
  doneLabel?: string;
}

/** The result line under a team form: the translated error, or a short confirmation. */
export default function TeamFormError({ state, errors, doneLabel }: TeamFormErrorProps) {
  if (!state.ok && state.error) {
    return (
      <p role="alert" className="font-mono text-[11px] text-signal">
        {errors[state.error]}
      </p>
    );
  }
  return (
    <p aria-live="polite" className="min-h-4 font-mono text-[11px] text-verdict">
      {state.done && doneLabel ? doneLabel : ""}
    </p>
  );
}
