import { BILLING_ROUTES } from "@/lib/billing/billingConfig";
import { fill, formatContractDate } from "@/lib/billing/billingFormat";
import { LocaleOption } from "@/lib/constants";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";
import { BillingAccess } from "@/types/billing.types";

export interface AccountPlanView {
  plan: string;
  isActive: boolean;
  /** "Verlängert sich am …" / "Vollzugang bis …" / "14 Tage unverbindlich …" */
  term?: string;
  /** Reassuring banner shown when no paid subscription is running */
  noSubscriptionNotice?: string;
  cancel?: { href: string; label: string };
  portalUnavailable?: string;
}

/**
 * What the plan panel on /konto says: the booked plan and its end or
 * renewal date (or the automatic end of the commitment-free 14-day window),
 * plus cancelling the monthly renewal. Booking, extending and upgrading live in accountOfferView.ts.
 */
export function buildAccountPlanView(
  access: BillingAccess,
  t: IBillingTranslation,
  lang: LocaleOption,
  inTrial: boolean,
  trialEndsAt?: Date | null,
  hasTrialEnded = false,
): AccountPlanView {
  const { Account } = t;
  const offerName = access.isActive
    ? access.offer
      ? t.Order.Offers[access.offer].Name
      : access.plan === "pro"
        ? t.Order.Offers["pro-monat"].Name
        : t.Order.Offers["investor-monat"].Name
    : inTrial
      ? Account.TrialRunning
      : Account.NoPlan;
  const term =
    access.isActive && access.endsAt
      ? fill(access.renews ? Account.RenewsOn : Account.EndsOn, { date: formatContractDate(access.endsAt, lang) })
      : !access.isActive && trialEndsAt && !hasTrialEnded
        ? fill(Account.TrialEndsAuto, { date: formatContractDate(trialEndsAt, lang) })
        : !access.isActive
          ? Account.FreeNoAutoRenew
          : undefined;

  return {
    plan: offerName,
    isActive: access.isActive,
    term,
    noSubscriptionNotice: access.isActive ? undefined : Account.NoSubscriptionNotice,
    cancel: access.renews ? { href: BILLING_ROUTES.cancel, label: Account.Cancel } : undefined,
    portalUnavailable: access.hasStripeCustomer ? undefined : Account.PortalUnavailable,
  };
}
