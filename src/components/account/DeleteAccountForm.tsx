// Needs useActionState to show a wrong password without losing the page
"use client";

import { useActionState } from "react";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthSubmit from "@/components/auth/AuthSubmit";
import PasswordField from "@/components/auth/PasswordField";
import { deleteAccountAction } from "@/lib/billing/actions/accountBillingActions";
import { INITIAL_DELETE_STATE } from "@/lib/billing/billingForm.types";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";

interface DeleteAccountFormProps {
  t: IBillingTranslation["Data"];
  fields: IAuthTranslation["Fields"];
  errorTitle: string;
  pendingLabel: string;
  email: string;
  /** A monthly subscription would end with the account */
  hasRunningPlan: boolean;
}

/** Password + explicit confirmation, then the account is gone (Art. 17 DSGVO). */
export default function DeleteAccountForm({ t, fields, errorTitle, pendingLabel, email, hasRunningPlan }: DeleteAccountFormProps) {
  const [state, action] = useActionState(deleteAccountAction, INITIAL_DELETE_STATE);
  const summary = state.code && state.code !== "password_wrong" && state.code !== "confirm_required" ? t.Errors[state.code] : undefined;

  return (
    <form action={action} noValidate className="grid gap-5">
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <p className="max-w-lg text-sm leading-relaxed text-ink-soft">{t.DeleteBody}</p>
      {hasRunningPlan && <p className="max-w-lg border-l-4 border-signal bg-signal/[0.07] px-4 py-3 text-sm leading-relaxed">{t.DeletePlanWarning}</p>}
      {summary && <AuthErrorSummary title={errorTitle} message={summary} />}
      <PasswordField
        id="delete-password"
        name="password"
        number="01"
        label={t.Password}
        autoComplete="current-password"
        fields={fields}
        error={state.code === "password_wrong" ? t.Errors.password_wrong : undefined}
      />
      <AuthCheckbox id="delete-confirm" name="confirm" required error={state.code === "confirm_required" ? t.Errors.confirm_required : undefined}>
        {t.Confirm}
      </AuthCheckbox>
      <div>
        <AuthSubmit label={t.DeleteSubmit} pendingLabel={pendingLabel} variant="signal" />
      </div>
    </form>
  );
}
