import { Locale } from "../Translations";
import { BILLING_DE } from "./de/de";
import { IBillingTranslation } from "./IBillingTranslation";
import { BILLING_TR } from "./tr/tr";

export const BillingTranslations: Record<Locale, IBillingTranslation> = {
  [Locale.DE]: BILLING_DE,
  [Locale.TR]: BILLING_TR,
};
