// Switches the mail reminders of one followed proceeding through a Server Action
"use client";

import { useActionState } from "react";
import { DeadlineActionState, setDeadlineMailAction } from "@/lib/deadlines/deadlineActions";

interface DeadlineMailSwitchProps {
  listingKey: string;
  isOn: boolean;
  onLabel: string;
  offLabel: string;
  errorLabel: string;
}

export default function DeadlineMailSwitch({ listingKey, isOn, onLabel, offLabel, errorLabel }: DeadlineMailSwitchProps) {
  const [state, formAction, isPending] = useActionState<DeadlineActionState, FormData>(setDeadlineMailAction, { ok: true });
  return (
    <form action={formAction} className="inline-flex flex-col items-start">
      <input type="hidden" name="listingKey" value={listingKey} />
      <input type="hidden" name="mail" value={isOn ? "0" : "1"} />
      <button
        type="submit"
        role="switch"
        aria-checked={isOn}
        disabled={isPending}
        className="inline-flex h-10 cursor-pointer items-center gap-2 border border-rule-strong bg-paper-bright px-3 font-narrow text-xs font-semibold tracking-[0.08em] uppercase hover:border-ink disabled:opacity-60"
      >
        <span aria-hidden="true" className={`relative h-4 w-7 rounded-full transition-colors ${isOn ? "bg-verdict" : "bg-rule-strong/40"}`}>
          <span className={`absolute top-0.5 size-3 rounded-full bg-paper-bright transition-[left] ${isOn ? "left-3.5" : "left-0.5"}`} />
        </span>
        {isOn ? onLabel : offLabel}
      </button>
      {!state.ok && (
        <span role="alert" className="mt-1 font-mono text-[10px] text-signal">
          {errorLabel}
        </span>
      )}
    </form>
  );
}
