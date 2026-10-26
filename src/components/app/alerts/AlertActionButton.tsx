// Runs a Server Action on one alert (pause, resume, delete) and shows a failure inline
"use client";

import { useActionState } from "react";
import { AlertActionState, deleteAlertAction, setAlertActiveAction } from "@/lib/alerts/alertActions";

interface AlertActionButtonProps {
  alertId: string;
  /** "pause" / "resume" switch the alert, "delete" removes it */
  intent: "pause" | "resume" | "delete";
  label: string;
  errorLabel: string;
}

const ACTIONS = { pause: setAlertActiveAction, resume: setAlertActiveAction, delete: deleteAlertAction } as const;

const INTENT_CLASSES: Record<AlertActionButtonProps["intent"], string> = {
  pause: "border-rule-strong bg-paper-bright text-ink hover:border-ink",
  resume: "border-ink bg-ink text-paper-bright",
  delete: "border-transparent text-signal hover:border-signal",
};

export default function AlertActionButton({ alertId, intent, label, errorLabel }: AlertActionButtonProps) {
  const [state, formAction, isPending] = useActionState<AlertActionState, FormData>(ACTIONS[intent], { ok: true });
  return (
    <form action={formAction} className="inline-flex flex-col items-start">
      <input type="hidden" name="alertId" value={alertId} />
      {intent !== "delete" && <input type="hidden" name="active" value={intent === "resume" ? "1" : "0"} />}
      <button
        type="submit"
        disabled={isPending}
        className={`h-8 cursor-pointer border px-3 font-narrow text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors disabled:opacity-60 ${INTENT_CLASSES[intent]}`}
      >
        {label}
      </button>
      {!state.ok && (
        <span role="alert" className="mt-1 font-mono text-[10px] text-signal">
          {errorLabel}
        </span>
      )}
    </form>
  );
}
