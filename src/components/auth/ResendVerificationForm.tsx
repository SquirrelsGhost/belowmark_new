// Needs useActionState to show the "sent" confirmation in place
"use client";

import { useActionState } from "react";
import AuthSubmit from "@/components/auth/AuthSubmit";
import { resendVerificationAction } from "@/lib/auth/actions/resendVerificationAction";
import { errorMessage } from "@/lib/auth/errorMessage";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface ResendVerificationFormProps {
  email: string;
  label: string;
  sentLabel: string;
  errors: IAuthTranslation["Errors"];
}

/** Second chance for the confirmation mail, without retyping the address. */
export default function ResendVerificationForm({ email, label, sentLabel, errors }: ResendVerificationFormProps) {
  const [state, formAction] = useActionState(resendVerificationAction, INITIAL_AUTH_STATE);

  if (state.status === "success") {
    return (
      <p role="status" className="border-l-4 border-verdict bg-verdict/[0.07] px-4 py-3 text-sm text-ink">
        {sentLabel}
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="email" value={email} />
      <AuthSubmit label={label} pendingLabel="…" variant="outline" />
      {state.code && (
        <p role="alert" className="text-sm text-signal-deep">
          {errorMessage(state.code, errors, state.retryAfterMinutes)}
        </p>
      )}
    </form>
  );
}
