// Needs useActionState to show an expired link in place
"use client";

import { useActionState } from "react";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthNotice from "@/components/auth/AuthNotice";
import AuthSubmit from "@/components/auth/AuthSubmit";
import AuthTextLink from "@/components/auth/AuthTextLink";
import { verifyEmailAction } from "@/lib/auth/actions/verifyEmailAction";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { errorMessage } from "@/lib/auth/errorMessage";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface VerifyEmailFormProps {
  t: Pick<IAuthTranslation, "Errors" | "Verify">;
  token: string;
}

/** One button: confirms the address, starts the trial, signs in. */
export default function VerifyEmailForm({ t, token }: VerifyEmailFormProps) {
  const [state, formAction] = useActionState(verifyEmailAction, INITIAL_AUTH_STATE);

  if (!token || state.code === "token_invalid") {
    return (
      <AuthNotice tone="signal" title={t.Verify.InvalidTitle} body={t.Verify.InvalidBody}>
        <AuthTextLink href={AUTH_ROUTES.login} label={t.Verify.InvalidAction} />
      </AuthNotice>
    );
  }

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name={AUTH_PARAMS.token} value={token} />
      {state.code && <AuthErrorSummary title={t.Errors.SummaryTitle} message={errorMessage(state.code, t.Errors, state.retryAfterMinutes)} />}
      <AuthSubmit label={t.Verify.Submit} pendingLabel={t.Verify.Pending} variant="signal" />
    </form>
  );
}
