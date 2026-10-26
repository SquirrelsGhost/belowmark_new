import { BILLING_ROUTES, OFFER_PARAM } from "@/lib/billing/billingConfig";
import { fill, formatContractDate } from "@/lib/billing/billingFormat";
import { LocaleOption } from "@/lib/constants";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";
import { BillingAccess } from "@/types/billing.types";

export interface AccountPlanView {
  plan: string;
  isActive: boolean;
  /** "Verlängert sich am …" / "Vollzugang bis …" */
  term?: string;
  book?: { href: string; label: string };
  cancel?: { href: string; label: string };
  portalUnavailable?: string;
}

/**
 * What the plan panel on /konto says: the booked plan and its end or
 * renewal date, plus the one next step that makes sense — book, extend the
 * three-month term, or cancel the monthly renewal.
 */
export function buildAccountPlanView(access: BillingAccess, t: IBillingTranslation, lang: LocaleOption, inTrial: boolean): AccountPlanView {
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
  const term = access.isActive && access.endsAt ? fill(access.renews ? Account.RenewsOn : Account.EndsOn, { date: formatContractDate(access.endsAt, lang) }) : undefined;

  const book = access.renews
    ? undefined
    : access.isActive && (access.offer === "investor-quartal" || access.offer === "pro-quartal")
      ? { href: `${BILLING_ROUTES.order}?${OFFER_PARAM}=${access.offer}`, label: Account.Extend }
      : access.isActive
        ? undefined
        : { href: BILLING_ROUTES.order, label: Account.Book };

  return {
    plan: offerName,
    isActive: access.isActive,
    term,
    book,
    cancel: access.renews ? { href: BILLING_ROUTES.cancel, label: Account.Cancel } : undefined,
    portalUnavailable: access.hasStripeCustomer ? undefined : Account.PortalUnavailable,
  };
}
