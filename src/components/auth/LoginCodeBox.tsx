// Needs useState, useRef, useEffect & useActionState for 1-click passwordless 6-digit email code sign-in
"use client";

import { FormEvent, useActionState, useEffect, useRef, useState } from "react";
import AuthBotShield from "@/components/auth/AuthBotShield";
import AuthSubmit from "@/components/auth/AuthSubmit";
import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { requestLoginCodeAction } from "@/lib/auth/actions/requestLoginCodeAction";
import { errorMessage } from "@/lib/auth/errorMessage";
import { detectLoginCodeLang, LOGIN_CODE_COPY } from "@/lib/auth/loginCodeCopy";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { INITIAL_AUTH_STATE } from "@/types/auth.types";

interface LoginCodeBoxProps {
  fields: IAuthTranslation["Fields"];
  errors: IAuthTranslation["Errors"];
  next: string;
  email: string;
  onEmailChange: (value: string) => void;
  readLiveEmail: () => string;
  focusEmailInput: () => void;
  defaultOpen?: boolean;
}

function looksLikeEmail(candidate: string): boolean {
  const trimmed = candidate.trim();
  const at = trimmed.indexOf("@");
  return at > 0 && trimmed.indexOf(".", at + 2) > at;
}

export default function LoginCodeBox({
  fields,
  errors,
  next,
  email,
  onEmailChange,
  readLiveEmail,
  focusEmailInput,
  defaultOpen = false,
}: LoginCodeBoxProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [missingHint, setMissingHint] = useState(false);
  const [state, action] = useActionState(requestLoginCodeAction, INITIAL_AUTH_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const autoSendRef = useRef(false);
  const copy = LOGIN_CODE_COPY[detectLoginCodeLang(fields.Email)];
  const trimmedEmail = email.trim();

  useEffect(() => {
    if (open && autoSendRef.current && formRef.current) {
      autoSendRef.current = false;
      formRef.current.requestSubmit();
    }
  }, [open]);

  const handleToggleOpen = () => {
    const live = readLiveEmail();
    if (live && live !== email) onEmailChange(live);
    if (looksLikeEmail(live)) {
      autoSendRef.current = true;
      setOpen(true);
      return;
    }
    setOpen(true);
    if (!live) focusEmailInput();
  };

  const handleBeforeSubmit = (event: FormEvent<HTMLFormElement>) => {
    const live = readLiveEmail();
    if (live && live !== email) onEmailChange(live);
    if (!live) {
      event.preventDefault();
      setMissingHint(true);
      focusEmailInput();
      return;
    }
    const hidden = event.currentTarget.elements.namedItem("email");
    if (hidden instanceof HTMLInputElement) hidden.value = live;
  };

  if (!open) {
    return (
      <div className="border-t border-rule pt-4 text-center">
        <button
          type="button"
          onClick={handleToggleOpen}
          className="font-mono text-xs font-semibold text-ink underline underline-offset-4 hover:text-signal"
        >
          {copy.toggle}
        </button>
      </div>
    );
  }

  if (state.status === "success" && (trimmedEmail || state.values?.email)) {
    const verifiedTargetEmail = trimmedEmail || state.values?.email || "";
    return (
      <div className="grid gap-3 border-t border-rule pt-4">
        <p className="font-mono text-xs text-ink-soft">
          {copy.sentHint} <span className="font-semibold text-ink">{verifiedTargetEmail}</span>
        </p>
        <VerifyOtpForm
          email={verifiedTargetEmail}
          errors={errors}
          emailLabel={fields.Email}
          emailPlaceholder={fields.EmailPlaceholder}
          next={next}
        />
      </div>
    );
  }

  const emailErr = state.fieldErrors?.email ? errors[state.fieldErrors.email] : undefined;
  const showMissingHint = missingHint && !trimmedEmail;
  const alertMessage =
    (showMissingHint ? copy.enterAboveHint : undefined) ??
    emailErr ??
    (state.code ? errorMessage(state.code, errors, state.retryAfterMinutes) : undefined);

  return (
    <div className="grid gap-3 border-t border-rule pt-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-signal">OTP · 6-DIGIT CODE</span>
        <button type="button" onClick={() => setOpen(false)} className="font-mono text-[11px] text-ink-soft underline hover:text-ink">
          {copy.hide}
        </button>
      </div>
      <form ref={formRef} action={action} onSubmit={handleBeforeSubmit} noValidate className="grid gap-3">
        <AuthBotShield refreshKey={state} />
        <input type="hidden" name="email" value={trimmedEmail} />
        {trimmedEmail ? (
          <p className="truncate border border-rule bg-paper-bright px-3 py-2 font-mono text-xs text-ink">
            <span className="text-signal">→</span> {trimmedEmail}
          </p>
        ) : (
          <p className="font-mono text-xs text-ink-soft">{copy.enterAboveHint}</p>
        )}
        {alertMessage && (
          <p role="alert" className="text-xs font-medium text-signal-deep">
            {alertMessage}
          </p>
        )}
        <AuthSubmit label={copy.send} pendingLabel={copy.sending} variant="signal" />
      </form>
    </div>
  );
}
