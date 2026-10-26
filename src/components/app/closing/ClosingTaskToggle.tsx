// Ticks a task through a Server Action; the page re-renders with the new state
"use client";

import { useActionState } from "react";
import { ClosingActionState, toggleClosingTaskAction } from "@/lib/closing/closingActions";

interface ClosingTaskToggleProps {
  listingKey: string;
  taskId: string;
  isDone: boolean;
  doneLabel: string;
  openLabel: string;
}

const INITIAL_STATE: ClosingActionState = { ok: true };

/** Square tick box in the margin of a task. */
export default function ClosingTaskToggle({ listingKey, taskId, isDone, doneLabel, openLabel }: ClosingTaskToggleProps) {
  const [state, formAction, isPending] = useActionState(toggleClosingTaskAction, INITIAL_STATE);
  return (
    <form action={formAction}>
      <input type="hidden" name="listingKey" value={listingKey} />
      <input type="hidden" name="taskId" value={taskId} />
      <input type="hidden" name="done" value={isDone ? "0" : "1"} />
      <button
        type="submit"
        disabled={isPending}
        aria-pressed={isDone}
        aria-label={isDone ? openLabel : doneLabel}
        title={isDone ? openLabel : doneLabel}
        className={`mt-1 flex size-6 cursor-pointer items-center justify-center border-2 font-mono text-sm leading-none disabled:opacity-50 ${
          isDone ? "border-verdict bg-verdict text-paper-bright" : state.ok ? "border-ink bg-paper-bright" : "border-signal bg-paper-bright"
        }`}
      >
        {isDone ? "✓" : ""}
      </button>
    </form>
  );
}
