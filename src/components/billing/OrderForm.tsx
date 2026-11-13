// Needs state for the chosen market & duration, and useActionState for the order action
"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import AuthCheckbox from "@/components/auth/AuthCheckbox";
import AuthErrorSummary from "@/components/auth/AuthErrorSummary";
import AuthIcon from "@/components/auth/AuthIcon";
import AuthSubmit from "@/components/auth/AuthSubmit";
import BillingNotice from "@/components/billing/BillingNotice";
import OrderGuestEmailField from "@/components/billing/OrderGuestEmailField";
import OrderOfferList from "@/components/billing/OrderOfferList";
import OrderSummarySection from "@/components/billing/OrderSummarySection";
import OrderTermsNote from "@/components/billing/OrderTermsNote";
import MarketDropdown from "@/components/ui/MarketDropdown";
import { placeOrderAction } from "@/lib/billing/actions/placeOrderAction";
import { INITIAL_ORDER_STATE, OrderFormLabels, OrderMarketView, OrderOfferView } from "@/lib/billing/billingForm.types";
import { LocaleOption, PRICING_COUNTRIES, PricingCountryCode } from "@/lib/constants";
import { setMarketAction } from "@/lib/regionActions";

export type { OrderFormLabels, OrderMarketView, OrderOfferView };

interface OrderFormProps {
  offersByMarket: Record<PricingCountryCode, OrderOfferView[]>;
  markets: Record<PricingCountryCode, OrderMarketView>;
  initialMarket: PricingCountryCode;
  initialOffer: string;
  email: string | null;
  initialGuestEmail?: string;
  locale: LocaleOption;
  /** VAT line per country — Europe with USt, Türkiye without German VAT */
  vatNotes: Record<PricingCountryCode, string>;
  /** Shown under the offers while Investor runs: link to the prorated upgrade */
  upgrade?: { href: string; label: string };
  labels: OrderFormLabels;
}

const STEP_LEGEND_CLASSES = "mb-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase";

/** Country switch, duration, summary, the one consent, the order button — everything § 312j BGB wants right above it. */
export default function OrderForm({
  offersByMarket,
  markets,
  initialMarket,
  initialOffer,
  email,
  initialGuestEmail = "",
  locale,
  vatNotes,
  upgrade,
  labels,
}: OrderFormProps) {
  const router = useRouter();
  const [state, action] = useActionState(placeOrderAction, INITIAL_ORDER_STATE);
  const [selectedMarket, setSelectedMarket] = useState<PricingCountryCode>(state.market ?? initialMarket);
  const [selected, setSelected] = useState(state.offer ?? initialOffer);
  const [guestEmail, setGuestEmail] = useState(state.guestEmail ?? initialGuestEmail);
  const [, startTransition] = useTransition();

  const offers = offersByMarket[selectedMarket];
  const offer = offers.find((item) => item.id === selected) ?? offers[0];
  const currentMarket = markets[selectedMarket];
  const formError = state.code === "failed" ? labels.Failed : state.code === "blocked" ? labels.Blocked : undefined;
  const summaryEmail = email ?? (guestEmail.trim() || "—");

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
    <form action={action} className="grid min-w-0 gap-7" noValidate>
      {formError && <AuthErrorSummary title={labels.ErrorTitle} message={formError} />}
      {email === null && (
        <OrderGuestEmailField
          locale={locale}
          value={guestEmail}
          onChange={setGuestEmail}
          hasError={state.code === "email_invalid"}
          refreshKey={state}
        />
      )}
      <div className="grid min-w-0 gap-2">
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

          <OrderSummarySection
            legendClassName={STEP_LEGEND_CLASSES}
            offer={offer}
            summaryEmail={summaryEmail}
            currentMarket={currentMarket}
            selectedMarket={selectedMarket}
            vatNote={vatNotes[selectedMarket]}
            labels={labels}
          />

          <AuthCheckbox id="order-consent" name="consent" required error={state.code === "consent_required" ? labels.ConsentRequired : undefined}>
            <OrderTermsNote template={labels.ConsentLabel} labels={{ terms: labels.TermsLink, withdrawal: labels.WithdrawalLink, privacy: labels.PrivacyLink }} />
          </AuthCheckbox>

          <div className="grid gap-3">
            <AuthSubmit
              label={offer.isTrial && offer.trialSubmitLabel ? offer.trialSubmitLabel : labels.Submit}
              pendingLabel={labels.Pending}
              variant="signal"
            />
            <p className="flex items-start gap-2 font-mono text-[11px] leading-relaxed text-muted">
              <AuthIcon name="lock" className="mt-0.5 size-3.5 shrink-0 text-ink" />
              {offer.isTrial && offer.trialPaymentNote ? offer.trialPaymentNote : labels.PaymentNote}
            </p>
          </div>
        </>
      )}
    </form>
  );
}
