// Needs useActionState to show consent and failure messages in place
"use client";

import { useActionState } from "react";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthIcon from "@/components/auth/AuthIcon";
import AuthSubmit from "@/components/auth/AuthSubmit";
import OrderSummaryRow from "@/components/billing/OrderSummaryRow";
import OrderTermsNote from "@/components/billing/OrderTermsNote";
import { upgradeAction } from "@/lib/billing/actions/upgradeAction";
import { INITIAL_ORDER_STATE } from "@/lib/billing/billingForm.types";
import { UpgradeView } from "@/lib/billing/upgradeView";

interface UpgradeFormProps {
  view: UpgradeView;
  labels: {
    Today: string;
    ConsentLabel: string;
    ConsentRequired: string;
    TermsNote: string;
    TermsLink: string;
    WithdrawalLink: string;
    PrivacyLink: string;
    Submit: string;
    Pending: string;
    PaymentNote: string;
    ErrorTitle: string;
    Failed: string;
    Blocked: string;
  };
}

/** Summary of the switch, the one consent and the button — the same order of things § 312j BGB asks for on /buchen. */
export default function UpgradeForm({ view, labels }: UpgradeFormProps) {
  const [state, action] = useActionState(upgradeAction, INITIAL_ORDER_STATE);
  const formError = state.code === "failed" ? labels.Failed : state.code === "blocked" ? labels.Blocked : undefined;
  return (
    <form action={action} className="grid gap-7" noValidate>
      {formError && <AuthErrorSummary title={labels.ErrorTitle} message={formError} />}
      <dl className="border-t border-rule" aria-live="polite">
        {view.rows.map((row) => (
          <OrderSummaryRow key={row.label} label={row.label} value={row.value} />
        ))}
        <OrderSummaryRow label={labels.Today} value={view.total} note={view.totalNote} isTotal />
      </dl>
      <div className="grid gap-4">
        <AuthCheckbox id="upgrade-consent" name="consent" required error={state.code === "consent_required" ? labels.ConsentRequired : undefined}>
          {labels.ConsentLabel}
        </AuthCheckbox>
        <OrderTermsNote template={labels.TermsNote} labels={{ terms: labels.TermsLink, withdrawal: labels.WithdrawalLink, privacy: labels.PrivacyLink }} />
      </div>
      <div className="grid gap-3">
        <AuthSubmit label={labels.Submit} pendingLabel={labels.Pending} variant="signal" />
        <p className="flex items-start gap-2 font-mono text-[11px] leading-relaxed text-muted">
          <AuthIcon name="lock" className="mt-0.5 size-3.5 shrink-0 text-ink" />
          {labels.PaymentNote}
        </p>
      </div>
    </form>
  );
}
