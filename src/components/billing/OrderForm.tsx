// Needs state for the chosen market & duration, and useActionState for the order action
"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthIcon from "@/components/auth/AuthIcon";
import AuthSubmit from "@/components/auth/AuthSubmit";
import BillingNotice from "@/components/billing/BillingNotice";
import OrderOfferList from "@/components/billing/OrderOfferList";
import OrderSummaryRow from "@/components/billing/OrderSummaryRow";
import OrderTermsNote from "@/components/billing/OrderTermsNote";
import MarketDropdown from "@/components/ui/MarketDropdown";
import { placeOrderAction } from "@/lib/billing/actions/placeOrderAction";
import { INITIAL_ORDER_STATE, OrderFormLabels, OrderMarketView, OrderOfferView } from "@/lib/billing/billingForm.types";
import { PRICING_COUNTRIES, PricingCountryCode } from "@/lib/constants";
import { setMarketAction } from "@/lib/regionActions";

export type { OrderFormLabels, OrderMarketView, OrderOfferView };

interface OrderFormProps {
  offersByMarket: Record<PricingCountryCode, OrderOfferView[]>;
  markets: Record<PricingCountryCode, OrderMarketView>;
  initialMarket: PricingCountryCode;
  initialOffer: string;
  email: string;
  /** VAT line per country — Europe with USt, Türkiye without German VAT */
  vatNotes: Record<PricingCountryCode, string>;
  /** Shown under the offers while Investor runs: link to the prorated upgrade */
  upgrade?: { href: string; label: string };
  labels: OrderFormLabels;
}

const STEP_LEGEND_CLASSES = "mb-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase";

/** Country switch, duration, summary, the one consent, the order button — everything § 312j BGB wants right above it. */
export default function OrderForm({ offersByMarket, markets, initialMarket, initialOffer, email, vatNotes, upgrade, labels }: OrderFormProps) {
  const router = useRouter();
  const [state, action] = useActionState(placeOrderAction, INITIAL_ORDER_STATE);
  const [selectedMarket, setSelectedMarket] = useState<PricingCountryCode>(state.market ?? initialMarket);
  const [selected, setSelected] = useState(state.offer ?? initialOffer);
  const [, startTransition] = useTransition();

  const offers = offersByMarket[selectedMarket];
  const offer = offers.find((item) => item.id === selected) ?? offers[0];
  const currentMarket = markets[selectedMarket];
  const formError = state.code === "failed" ? labels.Failed : state.code === "blocked" ? labels.Blocked : undefined;

  const chooseMarket = (next: PricingCountryCode) => {
    setSelectedMarket(next);
    startTransition(async () => {
      try {
        await setMarketAction(next);
        router.refresh();
      } catch {}
    });
  };

  return (
    <form action={action} className="grid gap-7" noValidate>
      {formError && <AuthErrorSummary title={labels.ErrorTitle} message={formError} />}
      <div className="grid gap-2">
        <label htmlFor="order-market-select" className={STEP_LEGEND_CLASSES}>
          <span className="text-signal">01</span> {labels.Market}
        </label>
        <MarketDropdown
          id="order-market-select"
          name="market"
          value={selectedMarket}
          onChange={chooseMarket}
          options={PRICING_COUNTRIES.map((code) => ({
            code,
            label: markets[code].label,
            hint: markets[code].hint,
          }))}
        />
        <p className="text-xs leading-relaxed text-muted">{labels.MarketNote}</p>
      </div>

      {currentMarket.blocker ? (
        <BillingNotice message={currentMarket.blocker} />
      ) : (
        <>
          <OrderOfferList
            legend={labels.ChooseOffer}
            legendClassName={STEP_LEGEND_CLASSES}
            offers={offers}
            selectedId={offer.id}
            onSelect={setSelected}
            upgrade={upgrade}
          />

          <section aria-labelledby="order-summary-title">
            <h3 id="order-summary-title" className={STEP_LEGEND_CLASSES}>
              <span className="text-signal">03</span> {labels.SummaryTitle}
            </h3>
            <dl className="mt-3 border-t border-rule" aria-live="polite">
              <OrderSummaryRow label={offer.name} value={offer.summary} />
              <OrderSummaryRow label={labels.Account} value={email} />
              <OrderSummaryRow label={labels.Market} value={`${currentMarket.label} · ${selectedMarket}`} />
              <OrderSummaryRow label={labels.Start} value={labels.StartValue} />
              <OrderSummaryRow label={offer.period} value={offer.term} />
              <OrderSummaryRow label={labels.Total} value={offer.totalPrice} note={vatNotes[selectedMarket]} isTotal />
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
        </>
      )}
    </form>
  );
}
