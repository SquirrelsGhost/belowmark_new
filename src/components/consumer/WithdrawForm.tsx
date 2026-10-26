// Needs useActionState for the withdrawal action
"use client";

import { useActionState } from "react";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthSubmit from "@/components/auth/AuthSubmit";
import DeclarationField from "@/components/consumer/DeclarationField";
import Honeypot from "@/components/consumer/Honeypot";
import { withdrawContractAction } from "@/lib/billing/actions/declarationActions";
import { INITIAL_DECLARATION_STATE } from "@/lib/billing/billingForm.types";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";

interface WithdrawFormProps {
  t: IBillingTranslation["Withdraw"];
  errorTitle: string;
  pendingLabel: string;
  email?: string;
}

/** "Vertrag widerrufen": name, contract, address for the receipt — then "Widerruf bestätigen" (§ 356a BGB). */
export default function WithdrawForm({ t, errorTitle, pendingLabel, email }: WithdrawFormProps) {
  const [state, action] = useActionState(withdrawContractAction, INITIAL_DECLARATION_STATE);
  const values = state.values ?? {};
  const error = (key: "name" | "email" | "reason") => (state.fields?.[key] ? t.Errors[state.fields[key]] : undefined);

  return (
    <form action={action} className="relative grid gap-6" noValidate>
      {state.code && <AuthErrorSummary title={errorTitle} message={t.Errors[state.code]} />}
      <Honeypot />
      <DeclarationField id="withdraw-name" name="name" number="01" label={t.Name} autoComplete="name" defaultValue={values.name} required error={error("name")} />
      <DeclarationField id="withdraw-contract" name="contract" number="02" label={t.Contract} defaultValue={values.contract} hint={t.ContractHint} />
      <DeclarationField id="withdraw-email" name="email" number="03" type="email" label={t.Email} autoComplete="email" defaultValue={values.email ?? email} required hint={t.EmailHint} error={error("email")} />
      <DeclarationField id="withdraw-statement" name="statement" number="04" label={t.Statement} defaultValue={values.statement || t.StatementDefault} required isMultiline error={error("reason")} />
      <AuthSubmit label={t.Submit} pendingLabel={pendingLabel} variant="signal" />
    </form>
  );
}
