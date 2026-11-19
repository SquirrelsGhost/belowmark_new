import { Locale } from "../Translations";
import { BILLING_CS } from "./cs/cs";
import { BILLING_DE } from "./de/de";
import { BILLING_EN } from "./en/en";
import { BILLING_ES } from "./es/es";
import { BILLING_FR } from "./fr/fr";
import { IBillingTranslation } from "./IBillingTranslation";
import { BILLING_IT } from "./it/it";
import { BILLING_NL } from "./nl/nl";
import { BILLING_PL } from "./pl/pl";
import { BILLING_SV } from "./sv/sv";
import { BILLING_TR } from "./tr/tr";

export const BillingTranslations: Record<Locale, IBillingTranslation> = {
  [Locale.DE]: BILLING_DE,
  [Locale.TR]: BILLING_TR,
  [Locale.EN]: BILLING_EN,
  [Locale.IT]: BILLING_IT,
  [Locale.ES]: BILLING_ES,
  [Locale.FR]: BILLING_FR,
  [Locale.PL]: BILLING_PL,
  [Locale.CS]: BILLING_CS,
  [Locale.NL]: BILLING_NL,
  [Locale.SV]: BILLING_SV,
};
