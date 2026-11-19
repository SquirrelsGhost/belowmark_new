import { Locale } from "../Translations";
import { ACCOUNT_CS } from "./cs/cs";
import { ACCOUNT_DE } from "./de/de";
import { ACCOUNT_EN } from "./en/en";
import { ACCOUNT_ES } from "./es/es";
import { ACCOUNT_FR } from "./fr/fr";
import { IAccountTranslation } from "./IAccountTranslation";
import { ACCOUNT_IT } from "./it/it";
import { ACCOUNT_NL } from "./nl/nl";
import { ACCOUNT_PL } from "./pl/pl";
import { ACCOUNT_SV } from "./sv/sv";
import { ACCOUNT_TR } from "./tr/tr";

export const AccountTranslations: Record<Locale, IAccountTranslation> = {
  [Locale.DE]: ACCOUNT_DE,
  [Locale.TR]: ACCOUNT_TR,
  [Locale.EN]: ACCOUNT_EN,
  [Locale.IT]: ACCOUNT_IT,
  [Locale.ES]: ACCOUNT_ES,
  [Locale.FR]: ACCOUNT_FR,
  [Locale.PL]: ACCOUNT_PL,
  [Locale.CS]: ACCOUNT_CS,
  [Locale.NL]: ACCOUNT_NL,
  [Locale.SV]: ACCOUNT_SV,
};
