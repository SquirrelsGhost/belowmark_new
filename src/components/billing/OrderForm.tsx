// Needs state for the chosen duration and useActionState for the order action
"use client";

import { useActionState, useState } from "react";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthIcon from "@/components/auth/AuthIcon";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthSubmit from "@/components/auth/AuthSubmit";
import OrderOfferOption from "@/components/billing/OrderOfferOption";
import OrderSummaryRow from "@/components/billing/OrderSummaryRow";
import OrderTermsNote from "@/components/billing/OrderTermsNote";
import { placeOrderAction } from "@/lib/billing/actions/placeOrderAction";
import { INITIAL_ORDER_STATE } from "@/lib/billing/billingForm.types";

export interface OrderOfferView {
  id: string;
  name: string;
  price: string;
  period: string;
  term: string;
  summary: string;
  badge?: string;
  blockedReason?: string;
}

export interface OrderFormLabels {
  ChooseOffer: string;
  SummaryTitle: string;
  Account: string;
  Market: string;
  Start: string;
  StartValue: string;
  Total: string;
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
}

interface OrderFormProps {
  offers: OrderOfferView[];
  initialOffer: string;
  email: string;
  market: string;
  vatNote: string;
  labels: OrderFormLabels;
}

/** Duration, summary, the one consent, the order button — everything § 312j BGB wants right above it. */
export default function OrderForm({ offers, initialOffer, email, market, vatNote, labels }: OrderFormProps) {
  const [state, action] = useActionState(placeOrderAction, INITIAL_ORDER_STATE);
  const [selected, setSelected] = useState(state.offer ?? initialOffer);
  const offer = offers.find((item) => item.id === selected) ?? offers[0];
  const formError = state.code === "failed" ? labels.Failed : state.code === "blocked" ? labels.Blocked : undefined;

  return (
    <form action={action} className="grid gap-7" noValidate>
      {formError && <AuthErrorSummary title={labels.ErrorTitle} message={formError} />}
      <fieldset className="grid gap-3">
        <legend className="mb-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
          <span className="text-signal">01</span> {labels.ChooseOffer}
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {offers.map((item) => (
            <OrderOfferOption key={item.id} {...item} isSelected={item.id === offer.id} onSelect={() => setSelected(item.id)} />
          ))}
        </div>
      </fieldset>

      <section aria-labelledby="order-summary-title">
        <h3 id="order-summary-title" className="font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
          <span className="text-signal">02</span> {labels.SummaryTitle}
        </h3>
        <dl className="mt-3 border-t border-rule" aria-live="polite">
          <OrderSummaryRow label={offer.name} value={offer.summary} />
          <OrderSummaryRow label={labels.Account} value={email} />
          <OrderSummaryRow label={labels.Market} value={market} />
          <OrderSummaryRow label={labels.Start} value={labels.StartValue} />
          <OrderSummaryRow label={offer.period} value={offer.term} />
          <OrderSummaryRow label={labels.Total} value={offer.price} note={vatNote} isTotal />
        </dl>
      </section>

      <div className="grid gap-4">
        <AuthCheckbox id="order-consent" name="consent" required error={state.code === "consent_required" ? labels.ConsentRequired : undefined}>
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
