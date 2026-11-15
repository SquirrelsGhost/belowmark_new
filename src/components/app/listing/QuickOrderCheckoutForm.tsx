// Needs useState + useActionState for 1-click toggle between 7d trial and 14d one-time pass
"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import AuthSubmit from "@/components/auth/AuthSubmit";
import { placeOrderAction } from "@/lib/billing/actions/placeOrderAction";
import { BillingOfferId, OFFERS } from "@/lib/billing/billingConfig";
import { INITIAL_ORDER_STATE } from "@/lib/billing/billingForm.types";
import { formatPrice } from "@/lib/billing/billingFormat";
import { QUICK_CHECKOUT_COPY } from "@/lib/billing/quickCheckoutCopy";
import { LocaleOption, PricingCountryCode, ROUTES } from "@/lib/constants";

interface QuickOrderCheckoutFormProps {
  country: PricingCountryCode;
  locale: LocaleOption;
  stripeTrialEligible: boolean;
  submitLabel: string;
  noteLabel: string;
}

const TAB_BASE = "flex-1 cursor-pointer px-2.5 py-1.5 text-center font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors";
const TAB_ACTIVE = `${TAB_BASE} bg-ink text-paper-bright`;
const TAB_IDLE = `${TAB_BASE} bg-paper text-ink-soft hover:text-ink`;

export default function QuickOrderCheckoutForm({
  country,
  locale,
  stripeTrialEligible,
  submitLabel,
  noteLabel,
}: QuickOrderCheckoutFormProps) {
  const [state, action] = useActionState(placeOrderAction, INITIAL_ORDER_STATE);
  // Default to the 14-day one-time pass in TR (where debit cards often reject 0.00 recurring mandates) or when trial was already used
  const [selectedOffer, setSelectedOffer] = useState<BillingOfferId>(
    country === "TR" || !stripeTrialEligible ? "investor-pass" : "investor-monat",
  );

  const L = QUICK_CHECKOUT_COPY[locale] ?? QUICK_CHECKOUT_COPY.de;
  const monthPrice = formatPrice(OFFERS["investor-monat"].prices[country], locale);
  const passPrice = formatPrice(OFFERS["investor-pass"].prices[country], locale);
  const quarterPrice = formatPrice(OFFERS["investor-quartal"].prices[country], locale);
  const quarterHref = `/buchen?markt=${encodeURIComponent(country)}&tarif=investor-quartal`;
  const isPass = selectedOffer === "investor-pass";

  return (
    <form action={action} className="grid w-full max-w-md gap-2.5 border-2 border-ink bg-paper-bright p-4">
      <input type="hidden" name="offer" value={selectedOffer} />
      <input type="hidden" name="market" value={country} />
      <input type="hidden" name="source" value="listing-inline" />

      <div role="tablist" className="flex border border-ink">
        <button
          type="button"
          role="tab"
          aria-selected={isPass}
          onClick={() => setSelectedOffer("investor-pass")}
          className={isPass ? TAB_ACTIVE : TAB_IDLE}
        >
          {L.tabPass(passPrice)}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isPass}
          onClick={() => setSelectedOffer("investor-monat")}
          className={!isPass ? TAB_ACTIVE : TAB_IDLE}
        >
          {stripeTrialEligible ? L.tabSubscription : `${monthPrice}/m`}
        </button>
      </div>

      <p className="font-mono text-[11px] font-medium leading-relaxed text-ink">
        {isPass ? L.passSummary(passPrice) : stripeTrialEligible ? L.trialSummary(monthPrice) : L.stdSummary(monthPrice)}
      </p>

      <label className="flex items-start gap-2 font-mono text-[11px] leading-snug text-ink-soft">
        <input type="checkbox" name="consent" defaultChecked className="mt-0.5 size-4 shrink-0 accent-signal" />
        <span>
          {L.consentPrefix}{" "}
          <Link href={ROUTES.terms} className="underline hover:text-ink">{L.terms}</Link>,{" "}
          <Link href={ROUTES.withdrawal} className="underline hover:text-ink">{L.withdrawal}</Link> &{" "}
          <Link href={ROUTES.privacy} className="underline hover:text-ink">{L.privacy}</Link>.
        </span>
      </label>

      {state.status === "error" && (
        <p role="alert" className="font-mono text-[11px] font-semibold text-signal-deep">
          {state.code === "consent_required" ? L.consentError : L.genericError}
        </p>
      )}

      <AuthSubmit label={isPass ? L.passSubmit(passPrice) : submitLabel} pendingLabel={L.pending} variant="signal" />
      <p className="font-mono text-[10px] text-ink-muted">{isPass ? L.passNote : noteLabel}</p>

      <Link
        href={quarterHref}
        className="border-t border-rule pt-2 font-mono text-[11px] font-semibold text-ink underline underline-offset-4 hover:text-signal"
      >
        {L.oneTimeLink(quarterPrice)}
      </Link>
    </form>
  );
}
