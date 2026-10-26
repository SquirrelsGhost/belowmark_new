// Needs state to show the reason / date fields only when they apply, and useActionState
"use client";

import { useActionState, useState } from "react";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthSubmit from "@/components/auth/AuthSubmit";
import DeclarationChoice from "@/components/consumer/DeclarationChoice";
import DeclarationField from "@/components/consumer/DeclarationField";
import Honeypot from "@/components/consumer/Honeypot";
import { cancelContractAction } from "@/lib/billing/actions/declarationActions";
import { INITIAL_DECLARATION_STATE } from "@/lib/billing/billingForm.types";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";

interface CancelFormProps {
  t: IBillingTranslation["Cancel"];
  errorTitle: string;
  pendingLabel: string;
  /** Prefilled from the session, if signed in */
  email?: string;
}

/** "Verträge hier kündigen": who, which contract, which kind, when — then "Jetzt kündigen". */
export default function CancelForm({ t, errorTitle, pendingLabel, email }: CancelFormProps) {
  const [state, action] = useActionState(cancelContractAction, INITIAL_DECLARATION_STATE);
  const values = state.values ?? {};
  const [type, setType] = useState(values.type || "ordinary");
  const [when, setWhen] = useState(values.when || "next");
  const error = (key: "name" | "email" | "date" | "reason") => (state.fields?.[key] ? t.Errors[state.fields[key]] : undefined);

  return (
    <form action={action} className="relative grid gap-6" noValidate>
      {state.code && <AuthErrorSummary title={errorTitle} message={t.Errors[state.code]} />}
      <Honeypot />
      <DeclarationField id="cancel-name" name="name" number="01" label={t.Name} autoComplete="name" defaultValue={values.name} required error={error("name")} />
      <DeclarationField id="cancel-email" name="email" number="02" type="email" label={t.Email} autoComplete="email" defaultValue={values.email ?? email} required hint={t.EmailHint} error={error("email")} />
      <DeclarationField id="cancel-contract" name="contract" number="03" label={t.Contract} defaultValue={values.contract} hint={t.ContractHint} />
      <DeclarationChoice
        name="type"
        number="04"
        legend={t.Type}
        value={type}
        onChange={setType}
        options={[
          { value: "ordinary", label: t.Ordinary },
          { value: "extraordinary", label: t.Extraordinary },
        ]}
      />
      {type === "extraordinary" && <DeclarationField id="cancel-reason" name="reason" number="04a" label={t.Reason} defaultValue={values.reason} required isMultiline error={error("reason")} />}
      <DeclarationChoice
        name="when"
        number="05"
        legend={t.When}
        value={when}
        onChange={setWhen}
        options={[
          { value: "next", label: t.NextPossible },
          { value: "date", label: t.AtDate },
        ]}
      />
      {when === "date" && <DeclarationField id="cancel-date" name="date" number="05a" type="date" label={t.AtDate} defaultValue={values.date} required error={error("date")} />}
      <AuthSubmit label={t.Submit} pendingLabel={pendingLabel} variant="signal" />
    </form>
  );
}
