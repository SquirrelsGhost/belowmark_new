// Needs useActionState to keep the typed address and show the outcome in place
"use client";

import { useActionState, useEffect } from "react";
import BillingAddressField from "@/components/account/BillingAddressField";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthSubmit from "@/components/auth/AuthSubmit";
import BillingNotice from "@/components/billing/BillingNotice";
import { saveBillingProfileAction } from "@/lib/invoice/actions/billingProfileActions";
import { INITIAL_BILLING_PROFILE_STATE } from "@/lib/invoice/billingProfileForm";
import { IAccountTranslation } from "@/translations/account/IAccountTranslation";

export interface BillingAddressValues {
  name: string;
  address: string;
  vatId: string;
}

interface BillingAddressFormProps {
  t: IAccountTranslation["Address"];
  /** Saved address, if any */
  initial: BillingAddressValues | null;
  /** Called once the server confirmed the save */
  onSaved?: (values: BillingAddressValues) => void;
  /** Shown as "Abbrechen" when an address is already saved */
  onCancel?: () => void;
}

/** Name, address lines and an optional VAT id — what the invoices print. */
export default function BillingAddressForm({ t, initial, onSaved, onCancel }: BillingAddressFormProps) {
  const [state, action] = useActionState(saveBillingProfileAction, INITIAL_BILLING_PROFILE_STATE);
  useEffect(() => {
    if (state.status === "saved" && state.values) onSaved?.(state.values);
  }, [state, onSaved]);
  const values = state.values ?? initial ?? { name: "", address: "", vatId: "" };
  const fieldError = (key: "name" | "address" | "vatId") => (state.fields?.[key] ? t.Errors[state.fields[key]] : undefined);

  return (
    <form action={action} noValidate className="grid gap-5">
      {!initial && state.status !== "saved" && <BillingNotice tone="signal" message={t.Missing} />}
      {state.code && <AuthErrorSummary title={t.ErrorTitle} message={t.Errors[state.code]} />}
      <BillingAddressField id="billing-name" name="name" number="01" label={t.Name} hint={t.NameHint} autoComplete="billing name" defaultValue={values.name} error={fieldError("name")} />
      <BillingAddressField
        id="billing-address"
        name="address"
        number="02"
        label={t.Address}
        hint={t.AddressHint}
        autoComplete="billing street-address"
        defaultValue={values.address}
        error={fieldError("address")}
        multiline
      />
      <BillingAddressField
        id="billing-vat"
        name="vatId"
        number="03"
        label={t.VatId}
        hint={t.VatIdHint}
        autoComplete="off"
        defaultValue={values.vatId}
        error={fieldError("vatId")}
        optionalLabel={t.Optional}
      />
      <div className="flex flex-wrap items-center gap-5">
        <AuthSubmit label={t.Submit} pendingLabel={t.Pending} variant="ink" />
        {onCancel && (
          <button type="button" onClick={onCancel} className="border-b border-rule-strong font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase hover:text-ink">
            {t.Cancel}
          </button>
        )}
      </div>
    </form>
  );
}
