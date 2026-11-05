// Needs useActionState and useEffect to auto-submit valid verification tokens in the browser
"use client";

import { useActionState, useEffect, useRef } from "react";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthNotice from "@/components/auth/AuthNotice";
import AuthSubmit from "@/components/auth/AuthSubmit";
import AuthTextLink from "@/components/auth/AuthTextLink";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { verifyEmailAction } from "@/lib/auth/actions/verifyEmailAction";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { errorMessage } from "@/lib/auth/errorMessage";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface VerifyEmailFormProps {
  t: Pick<IAuthTranslation, "Fields" | "Errors" | "Verify">;
  token: string;
  targetKey?: string;
  targetCity?: string;
}

/**
 * Confirms the address and signs in.
 * Automatically submits once in the browser when a link token is present
 * (safe against non-JS mail link scanners, zero extra click for human users),
 * and offers direct 6-digit OTP verification if opened without a token.
 */
export default function VerifyEmailForm({ t, token, targetKey, targetCity }: VerifyEmailFormProps) {
  const [state, formAction] = useActionState(verifyEmailAction, INITIAL_AUTH_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (token && !autoSubmittedRef.current && state.status === "idle") {
      autoSubmittedRef.current = true;
      formRef.current?.requestSubmit();
    }
  }, [token, state.status]);

  if (!token || state.code === "token_invalid") {
    return (
      <div className="grid gap-4">
        <AuthNotice tone="signal" title={t.Verify.InvalidTitle} body={t.Verify.InvalidBody}>
          <AuthTextLink href={AUTH_ROUTES.login} label={t.Verify.InvalidAction} />
        </AuthNotice>
        <VerifyOtpForm
          errors={t.Errors}
          emailLabel={t.Fields.Email}
          emailPlaceholder={t.Fields.EmailPlaceholder}
          targetKey={targetKey}
          targetCity={targetCity}
        />
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="grid gap-5">
      <input type="hidden" name={AUTH_PARAMS.token} value={token} />
      {targetKey && <input type="hidden" name="targetKey" value={targetKey} />}
      {targetCity && <input type="hidden" name="targetCity" value={targetCity} />}
      {state.code && <AuthErrorSummary title={t.Errors.SummaryTitle} message={errorMessage(state.code, t.Errors, state.retryAfterMinutes)} />}
      <AuthSubmit label={t.Verify.Submit} pendingLabel={t.Verify.Pending} variant="signal" />
    </form>
  );
}
